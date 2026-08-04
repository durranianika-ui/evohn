/**
 * Reconstitution arithmetic.
 *
 * Every function here is pure and total: same inputs, same output, no clock,
 * no randomness, no I/O, and no throw. The React layer owns strings, focus and
 * layout; this module owns the numbers, which is what makes them testable.
 *
 * ## What this module does not do
 *
 * It converts between quantity, volume and concentration. It does not select
 * a quantity, propose a schedule, judge whether a value is sensible for any
 * purpose, or know anything about biology. A frequency, where one is supplied,
 * is used for exactly one thing: dividing whole withdrawals into days.
 *
 * ## Failure model
 *
 * Nothing throws. A calculation that cannot be performed returns
 * `{ ok: false, errors }` with every problem listed at once, so the interface
 * can show all of them rather than revealing them one at a time. Conditions
 * that are computable but worth flagging — more diluent than the vial holds,
 * a draw that overruns the barrel — come back as `warnings` on a successful
 * result, because the arithmetic is still correct.
 */

/* ==========================================================================
   UNITS
   ========================================================================== */

export type MassUnit = "mg" | "mcg";

export const MCG_PER_MG = 1000;

/** Normalise any supported mass unit to milligrams. */
export function toMilligrams(value: number, unit: MassUnit): number {
  return unit === "mcg" ? value / MCG_PER_MG : value;
}

/** Convert milligrams out to a display unit. */
export function fromMilligrams(mg: number, unit: MassUnit): number {
  return unit === "mcg" ? mg * MCG_PER_MG : mg;
}

/**
 * Insulin syringes are graduated in U-100 units: 100 marks to 1 mL,
 * irrespective of the barrel's capacity. A "30-unit" barrel holds 0.3 mL and
 * carries 30 marks; a 3 mL barrel is not graduated in units at all.
 */
export const UNITS_PER_ML = 100;

export type SyringeKey = "30u" | "50u" | "100u" | "1ml" | "3ml";

export interface Syringe {
  key: SyringeKey;
  label: string;
  /** Usable capacity in millilitres. */
  capacityMl: number;
  /**
   * Marks on the barrel where it is graduated in insulin units. `null` for
   * the volumetric syringes, which are read in millilitres.
   */
  maxUnits: number | null;
}

export const SYRINGES: Record<SyringeKey, Syringe> = {
  "30u": { key: "30u", label: "30 unit", capacityMl: 0.3, maxUnits: 30 },
  "50u": { key: "50u", label: "50 unit", capacityMl: 0.5, maxUnits: 50 },
  "100u": { key: "100u", label: "100 unit", capacityMl: 1, maxUnits: 100 },
  "1ml": { key: "1ml", label: "1 mL", capacityMl: 1, maxUnits: null },
  "3ml": { key: "3ml", label: "3 mL", capacityMl: 3, maxUnits: null },
};

export const SYRINGE_KEYS = Object.keys(SYRINGES) as SyringeKey[];

/** Common lyophilised-vial capacities, offered as presets. */
export const VIAL_VOLUMES_ML = [2, 3, 5, 10] as const;

/* ==========================================================================
   RESULT SHAPE
   ========================================================================== */

export type CalcResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: string[] };

/** One line of shown working. */
export interface FormulaStep {
  /** The relationship, in symbols. */
  expression: string;
  /** The same relationship with this calculation's numbers substituted in. */
  substituted: string;
}

/* ==========================================================================
   VALIDATION
   ========================================================================== */

/**
 * A finite number strictly greater than zero.
 *
 * Strictly, because every quantity this module divides by is a denominator
 * somewhere: a vial with no volume, a concentration of zero and a zero-part
 * component are all division by zero one step later.
 */
export function isPositive(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function requirePositive(
  errors: string[],
  value: number,
  label: string,
): boolean {
  if (Number.isNaN(value)) {
    errors.push(`${label} is not a number.`);
    return false;
  }
  if (!Number.isFinite(value)) {
    errors.push(`${label} must be a finite value.`);
    return false;
  }
  if (value <= 0) {
    errors.push(`${label} must be greater than zero.`);
    return false;
  }
  return true;
}

/* ==========================================================================
   ROUNDING
   ========================================================================== */

/**
 * Round to a fixed number of decimals, half away from zero.
 *
 * `toFixed` is not used for the arithmetic itself because it returns a string
 * and because its behaviour at the half is implementation-defined for some
 * binary fractions. Rounding is applied once, at the end, to values that are
 * about to be displayed — never between steps, where it would compound.
 */
export function round(value: number, decimals = 2): number {
  if (!Number.isFinite(value)) return value;
  const factor = 10 ** decimals;
  const scaled = value * factor;
  // Nudge past the binary representation error before rounding, so 1.005 at
  // two places rounds to 1.01 rather than 1.00.
  const corrected = Math.round(scaled + (scaled >= 0 ? Number.EPSILON * Math.abs(scaled) : -Number.EPSILON * Math.abs(scaled)));
  return corrected / factor;
}

/**
 * Decimal places appropriate to a volume.
 *
 * A 0.04 mL draw shown to two places has lost half its information; a 2.5 mL
 * draw shown to four has gained noise. Precision follows magnitude.
 */
export function volumeDecimals(ml: number): number {
  if (!Number.isFinite(ml) || ml <= 0) return 2;
  if (ml < 0.01) return 4;
  if (ml < 0.1) return 3;
  return 2;
}

/* ==========================================================================
   MODE 1 — RECONSTITUTE
   ========================================================================== */

export interface ReconstituteInput {
  /** Quantity of compound in the vial, in `vialUnit`. */
  vialAmount: number;
  vialUnit: MassUnit;
  /** Nominal capacity of the vial, for the over-fill check. */
  vialVolumeMl: number;
  /** Diluent added. */
  diluentMl: number;
  /** Quantity intended per withdrawal, in `targetUnit`. */
  targetAmount: number;
  targetUnit: MassUnit;
  syringe: SyringeKey;
  /**
   * Withdrawals per week, used only to divide whole withdrawals into days.
   * `null` omits the duration entirely.
   */
  perWeek: number | null;
}

export interface ReconstituteResult {
  /** Resulting concentration, in mg per mL. */
  concentrationMgPerMl: number;
  /** The same concentration expressed in the target's own unit. */
  concentrationInTargetUnit: number;
  /** Volume containing one target quantity. */
  drawMl: number;
  /** That volume on a U-100 barrel. */
  drawUnits: number;
  /** Whole withdrawals of the target quantity the vial contains. */
  portions: number;
  /** Days those withdrawals cover at the stated rate. `null` if none given. */
  durationDays: number | null;
  warnings: string[];
  formula: FormulaStep[];
}

export function reconstitute(
  input: ReconstituteInput,
): CalcResult<ReconstituteResult> {
  const errors: string[] = [];

  const okVial = requirePositive(errors, input.vialAmount, "Vial quantity");
  const okDiluent = requirePositive(errors, input.diluentMl, "Diluent volume");
  const okTarget = requirePositive(errors, input.targetAmount, "Target quantity");

  if (input.perWeek !== null && !isPositive(input.perWeek)) {
    errors.push("Withdrawal frequency must be greater than zero.");
  }

  if (!okVial || !okDiluent || !okTarget || errors.length) {
    return { ok: false, errors };
  }

  const vialMg = toMilligrams(input.vialAmount, input.vialUnit);
  const targetMg = toMilligrams(input.targetAmount, input.targetUnit);

  const concentrationMgPerMl = vialMg / input.diluentMl;
  const drawMl = targetMg / concentrationMgPerMl;
  const drawUnits = drawMl * UNITS_PER_ML;
  const portions = Math.floor(vialMg / targetMg);

  const durationDays =
    input.perWeek !== null && isPositive(input.perWeek)
      ? Math.floor((portions / input.perWeek) * 7)
      : null;

  const warnings: string[] = [];

  if (isPositive(input.vialVolumeMl) && input.diluentMl > input.vialVolumeMl) {
    warnings.push(
      `That is more diluent than a ${input.vialVolumeMl} mL vial will hold.`,
    );
  }

  const syringe = SYRINGES[input.syringe];
  if (drawMl > syringe.capacityMl) {
    warnings.push(
      `A ${round(drawMl, volumeDecimals(drawMl))} mL draw exceeds the ${syringe.label} barrel (${syringe.capacityMl} mL). Use a larger barrel, or add less diluent.`,
    );
  }

  if (targetMg > vialMg) {
    warnings.push(
      "The target quantity is larger than the whole vial, so no single withdrawal can contain it.",
    );
  }

  // Below roughly two units, the graduation itself is the limiting factor.
  if (syringe.maxUnits !== null && drawUnits > 0 && drawUnits < 2) {
    warnings.push(
      `A ${round(drawUnits, 2)}-unit draw sits below the readable graduation on this barrel. More diluent would place it further up the scale.`,
    );
  }

  const vd = volumeDecimals(drawMl);

  const formula: FormulaStep[] = [
    {
      expression: "concentration = compound in vial ÷ diluent volume",
      substituted: `${round(vialMg, 4)} mg ÷ ${input.diluentMl} mL = ${round(concentrationMgPerMl, 4)} mg/mL`,
    },
    {
      expression: "volume to draw = target quantity ÷ concentration",
      substituted: `${round(targetMg, 5)} mg ÷ ${round(concentrationMgPerMl, 4)} mg/mL = ${round(drawMl, vd)} mL`,
    },
    {
      expression: "insulin units = volume × 100",
      substituted: `${round(drawMl, vd)} mL × 100 = ${round(drawUnits, 2)} units`,
    },
    {
      expression: "whole withdrawals = ⌊ compound in vial ÷ target quantity ⌋",
      substituted: `⌊ ${round(vialMg, 4)} mg ÷ ${round(targetMg, 5)} mg ⌋ = ${portions}`,
    },
  ];

  if (durationDays !== null && input.perWeek !== null) {
    formula.push({
      expression: "days covered = ⌊ withdrawals ÷ per week × 7 ⌋",
      substituted: `⌊ ${portions} ÷ ${input.perWeek} × 7 ⌋ = ${durationDays} days`,
    });
  }

  return {
    ok: true,
    value: {
      concentrationMgPerMl,
      concentrationInTargetUnit: fromMilligrams(
        concentrationMgPerMl,
        input.targetUnit,
      ),
      drawMl,
      drawUnits,
      portions,
      durationDays,
      warnings,
      formula,
    },
  };
}

/* ==========================================================================
   MODE 2 — MIX
   --------------------------------------------------------------------------
   Several vials, each already in solution, drawn into one container.
   ========================================================================== */

export interface MixComponent {
  /** Free-text identifier. Not used in the arithmetic. */
  name: string;
  /** Concentration of this vial's solution, in `concentrationUnit` per mL. */
  concentration: number;
  concentrationUnit: MassUnit;
  /** Volume drawn from this vial into the mixture. */
  contributionMl: number;
}

export interface MixComponentResult {
  name: string;
  /** Mass this vial contributes, in mg. */
  massMg: number;
  contributionMl: number;
  /** Concentration of this component in the finished mixture, mg/mL. */
  finalConcentrationMgPerMl: number;
  /** Share of the total mass, 0–1. */
  massFraction: number;
}

export interface MixResult {
  totalVolumeMl: number;
  totalMassMg: number;
  /** Combined mass ÷ combined volume. Not meaningful on its own for a
      multi-compound mixture, but reported because it is what a single-compound
      mix reduces to. */
  combinedConcentrationMgPerMl: number;
  components: MixComponentResult[];
  warnings: string[];
  formula: FormulaStep[];
}

export function mix(
  components: readonly MixComponent[],
): CalcResult<MixResult> {
  const errors: string[] = [];

  if (components.length < 2) {
    errors.push("A mixture needs at least two vials.");
  }

  components.forEach((component, i) => {
    const label = component.name.trim() || `Vial ${i + 1}`;
    requirePositive(errors, component.concentration, `${label} concentration`);
    requirePositive(errors, component.contributionMl, `${label} volume drawn`);
  });

  if (errors.length) return { ok: false, errors };

  const totalVolumeMl = components.reduce((sum, c) => sum + c.contributionMl, 0);

  const resolved: MixComponentResult[] = components.map((component, i) => {
    const perMlMg = toMilligrams(component.concentration, component.concentrationUnit);
    const massMg = perMlMg * component.contributionMl;
    return {
      name: component.name.trim() || `Vial ${i + 1}`,
      massMg,
      contributionMl: component.contributionMl,
      finalConcentrationMgPerMl: massMg / totalVolumeMl,
      massFraction: 0, // filled below, once the total is known
    };
  });

  const totalMassMg = resolved.reduce((sum, c) => sum + c.massMg, 0);
  for (const component of resolved) {
    component.massFraction = totalMassMg > 0 ? component.massMg / totalMassMg : 0;
  }

  const warnings: string[] = [
    "Combining solutions dilutes every component, and binds the mixture to the shortest stability interval among them.",
  ];

  const names = resolved.map((c) => c.name.toLowerCase());
  if (new Set(names).size !== names.length) {
    warnings.push(
      "Two rows carry the same name. The arithmetic is unaffected, but the breakdown will be hard to read.",
    );
  }

  const formula: FormulaStep[] = [
    {
      expression: "total volume = Σ volume drawn",
      substituted: `${components.map((c) => c.contributionMl).join(" + ")} = ${round(totalVolumeMl, 3)} mL`,
    },
    {
      expression: "mass from each vial = its concentration × its volume drawn",
      substituted: resolved
        .map((c) => `${c.name}: ${round(c.massMg, 4)} mg`)
        .join("   ·   "),
    },
    {
      expression: "final concentration of each = its mass ÷ total volume",
      substituted: resolved
        .map(
          (c) =>
            `${c.name}: ${round(c.finalConcentrationMgPerMl, 4)} mg/mL`,
        )
        .join("   ·   "),
    },
  ];

  return {
    ok: true,
    value: {
      totalVolumeMl,
      totalMassMg,
      combinedConcentrationMgPerMl: totalMassMg / totalVolumeMl,
      components: resolved,
      warnings,
      formula,
    },
  };
}

/* ==========================================================================
   MODE 3 — BLEND
   --------------------------------------------------------------------------
   One vial containing several compounds in a fixed ratio, reconstituted once.
   ========================================================================== */

export interface BlendComponent {
  name: string;
  /**
   * Relative share. Any positive scale works — 2/1, 20/10 and 0.2/0.1 all
   * describe the same blend — because shares are normalised against their own
   * sum before anything is computed.
   */
  parts: number;
}

export interface BlendComponentResult {
  name: string;
  parts: number;
  /** Share of the vial, 0–1. */
  fraction: number;
  massMg: number;
  concentrationMgPerMl: number;
  /** Mass of this component delivered in the computed draw volume. */
  massInDrawMg: number;
}

export interface BlendResult {
  concentrationTotalMgPerMl: number;
  components: BlendComponentResult[];
  /** Volume containing the target quantity of the selected component. */
  drawMl: number;
  drawUnits: number;
  /** Which component the draw was solved for. */
  targetName: string;
  warnings: string[];
  formula: FormulaStep[];
}

export interface BlendInput {
  /** Total compound in the vial, across all components. */
  totalAmount: number;
  totalUnit: MassUnit;
  diluentMl: number;
  components: readonly BlendComponent[];
  /** Index into `components` — the one the draw is solved for. */
  targetIndex: number;
  /** Quantity of that component wanted per withdrawal. */
  targetAmount: number;
  targetUnit: MassUnit;
  syringe: SyringeKey;
}

export function blend(input: BlendInput): CalcResult<BlendResult> {
  const errors: string[] = [];

  requirePositive(errors, input.totalAmount, "Total vial quantity");
  requirePositive(errors, input.diluentMl, "Diluent volume");
  requirePositive(errors, input.targetAmount, "Target quantity");

  if (input.components.length < 2) {
    errors.push("A blend needs at least two components.");
  }

  input.components.forEach((component, i) => {
    const label = component.name.trim() || `Component ${i + 1}`;
    requirePositive(errors, component.parts, `${label} ratio`);
  });

  if (
    input.targetIndex < 0 ||
    input.targetIndex >= input.components.length ||
    !Number.isInteger(input.targetIndex)
  ) {
    errors.push("Select which component the draw should be solved for.");
  }

  if (errors.length) return { ok: false, errors };

  const totalParts = input.components.reduce((sum, c) => sum + c.parts, 0);
  const totalMg = toMilligrams(input.totalAmount, input.totalUnit);
  const targetMg = toMilligrams(input.targetAmount, input.targetUnit);

  const resolved: BlendComponentResult[] = input.components.map(
    (component, i) => {
      const fraction = component.parts / totalParts;
      const massMg = totalMg * fraction;
      return {
        name: component.name.trim() || `Component ${i + 1}`,
        parts: component.parts,
        fraction,
        massMg,
        concentrationMgPerMl: massMg / input.diluentMl,
        massInDrawMg: 0, // filled below, once the draw volume is known
      };
    },
  );

  const target = resolved[input.targetIndex];
  const drawMl = targetMg / target.concentrationMgPerMl;
  const drawUnits = drawMl * UNITS_PER_ML;

  for (const component of resolved) {
    component.massInDrawMg = component.concentrationMgPerMl * drawMl;
  }

  const warnings: string[] = [
    "The components share one vial and one draw. Solving for the target quantity of one fixes the quantity of every other — they cannot be varied independently.",
  ];

  const syringe = SYRINGES[input.syringe];
  if (drawMl > syringe.capacityMl) {
    warnings.push(
      `A ${round(drawMl, volumeDecimals(drawMl))} mL draw exceeds the ${syringe.label} barrel (${syringe.capacityMl} mL).`,
    );
  }

  if (targetMg > target.massMg) {
    warnings.push(
      `The vial holds ${round(target.massMg, 4)} mg of ${target.name} in total, which is less than the target quantity.`,
    );
  }

  const vd = volumeDecimals(drawMl);

  const formula: FormulaStep[] = [
    {
      expression: "share of each component = its ratio ÷ Σ ratios",
      substituted: resolved
        .map((c) => `${c.name}: ${c.parts}/${round(totalParts, 4)} = ${round(c.fraction * 100, 2)}%`)
        .join("   ·   "),
    },
    {
      expression: "mass of each = total vial quantity × its share",
      substituted: resolved
        .map((c) => `${c.name}: ${round(c.massMg, 4)} mg`)
        .join("   ·   "),
    },
    {
      expression: "concentration of each = its mass ÷ diluent volume",
      substituted: resolved
        .map((c) => `${c.name}: ${round(c.concentrationMgPerMl, 4)} mg/mL`)
        .join("   ·   "),
    },
    {
      expression: `volume to draw = target ${target.name} ÷ its concentration`,
      substituted: `${round(targetMg, 5)} mg ÷ ${round(target.concentrationMgPerMl, 4)} mg/mL = ${round(drawMl, vd)} mL (${round(drawUnits, 2)} units)`,
    },
  ];

  return {
    ok: true,
    value: {
      concentrationTotalMgPerMl: totalMg / input.diluentMl,
      components: resolved,
      drawMl,
      drawUnits,
      targetName: target.name,
      warnings,
      formula,
    },
  };
}

/* ==========================================================================
   DISPLAY
   ========================================================================== */

/**
 * Format with a fixed locale.
 *
 * The locale is pinned so the statically exported HTML and the hydrated client
 * agree on the decimal separator, whatever the visitor's machine is set to.
 */
export function formatNumber(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return "—";
  return round(value, decimals).toLocaleString("en-GB", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** A volume with precision chosen from its own magnitude. */
export function formatVolume(ml: number): string {
  return formatNumber(ml, volumeDecimals(ml));
}

/** Parse a form field. Empty and malformed both become NaN, never 0. */
export function parseField(raw: string): number {
  const trimmed = raw.trim();
  if (trimmed === "") return Number.NaN;
  return Number(trimmed);
}
