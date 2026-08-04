import { describe, expect, it } from "vitest";
import {
  MCG_PER_MG,
  SYRINGES,
  UNITS_PER_ML,
  blend,
  formatNumber,
  formatVolume,
  fromMilligrams,
  isPositive,
  mix,
  parseField,
  reconstitute,
  round,
  toMilligrams,
  volumeDecimals,
  type MixComponent,
} from "@/lib/calculator";

/**
 * The arithmetic is the part of this site that can be quietly, confidently
 * wrong, so it is tested by hand-computed expectations rather than by
 * re-implementing the same formula in the assertion.
 */

/** Unwrap a result that must have succeeded, failing loudly if it did not. */
function ok<T>(result: { ok: true; value: T } | { ok: false; errors: string[] }) {
  if (!result.ok) {
    throw new Error(`Expected success, got errors: ${result.errors.join("; ")}`);
  }
  return result.value;
}

describe("unit conversion", () => {
  it("converts milligrams and micrograms in both directions", () => {
    expect(toMilligrams(1, "mg")).toBe(1);
    expect(toMilligrams(500, "mcg")).toBe(0.5);
    expect(fromMilligrams(0.25, "mcg")).toBe(250);
    expect(fromMilligrams(0.25, "mg")).toBe(0.25);
  });

  it("round-trips without drift at the scales the tool works at", () => {
    for (const mcg of [1, 5, 50, 250, 1000, 5000]) {
      expect(fromMilligrams(toMilligrams(mcg, "mcg"), "mcg")).toBeCloseTo(mcg, 9);
    }
  });

  it("uses 1000 micrograms to the milligram", () => {
    expect(MCG_PER_MG).toBe(1000);
    expect(toMilligrams(MCG_PER_MG, "mcg")).toBe(1);
  });
});

describe("rounding", () => {
  it("rounds half away from zero", () => {
    expect(round(2.345, 2)).toBe(2.35);
    expect(round(-2.345, 2)).toBe(-2.35);
  });

  it("survives binary representation error at the half", () => {
    // 1.005 is stored as 1.00499999999999989…; a naive Math.round gives 1.00.
    expect(round(1.005, 2)).toBe(1.01);
    expect(round(8.475, 2)).toBe(8.48);
  });

  it("leaves non-finite values alone rather than inventing a number", () => {
    expect(round(Number.NaN)).toBeNaN();
    expect(round(Number.POSITIVE_INFINITY)).toBe(Number.POSITIVE_INFINITY);
  });

  it("scales displayed precision to the magnitude of a volume", () => {
    expect(volumeDecimals(0.004)).toBe(4);
    expect(volumeDecimals(0.04)).toBe(3);
    expect(volumeDecimals(0.4)).toBe(2);
    expect(volumeDecimals(4)).toBe(2);
  });
});

describe("validation helpers", () => {
  it("rejects zero, negatives and non-finite values", () => {
    expect(isPositive(0)).toBe(false);
    expect(isPositive(-1)).toBe(false);
    expect(isPositive(Number.NaN)).toBe(false);
    expect(isPositive(Number.POSITIVE_INFINITY)).toBe(false);
    expect(isPositive(0.0001)).toBe(true);
  });

  it("parses an empty field to NaN rather than to zero", () => {
    // Zero would silently become a division by zero one step later.
    expect(parseField("")).toBeNaN();
    expect(parseField("   ")).toBeNaN();
    expect(parseField("abc")).toBeNaN();
    expect(parseField("2.5")).toBe(2.5);
    expect(parseField(" 2.5 ")).toBe(2.5);
  });
});

/* ========================================================================== */

describe("reconstitute", () => {
  const base = {
    vialAmount: 10,
    vialUnit: "mg",
    vialVolumeMl: 3,
    diluentMl: 2,
    targetAmount: 0.25,
    targetUnit: "mg",
    syringe: "100u",
    perWeek: 7,
  } as const;

  it("computes 10 mg in 2 mL as 5 mg/mL", () => {
    const r = ok(reconstitute(base));
    expect(r.concentrationMgPerMl).toBe(5);
  });

  it("computes the volume containing the target quantity", () => {
    // 0.25 mg ÷ 5 mg/mL = 0.05 mL
    const r = ok(reconstitute(base));
    expect(r.drawMl).toBeCloseTo(0.05, 10);
  });

  it("expresses that volume as U-100 insulin units", () => {
    // 0.05 mL × 100 = 5 units
    const r = ok(reconstitute(base));
    expect(r.drawUnits).toBeCloseTo(5, 10);
    expect(UNITS_PER_ML).toBe(100);
  });

  it("counts only whole withdrawals", () => {
    // 10 ÷ 0.25 = 40 exactly
    expect(ok(reconstitute(base)).portions).toBe(40);
    // 10 ÷ 0.3 = 33.33…, so 33 whole withdrawals and the remainder is lost
    expect(ok(reconstitute({ ...base, targetAmount: 0.3 })).portions).toBe(33);
  });

  it("divides withdrawals into days at the stated rate", () => {
    // 40 withdrawals at 7 per week = 40 days
    expect(ok(reconstitute(base)).durationDays).toBe(40);
    // the same 40 at 2 per week = 140 days
    expect(ok(reconstitute({ ...base, perWeek: 2 })).durationDays).toBe(140);
  });

  it("omits the duration when no frequency is stated", () => {
    expect(ok(reconstitute({ ...base, perWeek: null })).durationDays).toBeNull();
  });

  it("handles a microgram target against a milligram vial", () => {
    // 250 mcg = 0.25 mg, so this must match the milligram case exactly.
    const mcg = ok(
      reconstitute({ ...base, targetAmount: 250, targetUnit: "mcg" }),
    );
    expect(mcg.drawMl).toBeCloseTo(ok(reconstitute(base)).drawMl, 12);
  });

  it("handles a microgram vial against a microgram target", () => {
    // 5000 mcg in 1 mL = 5 mg/mL; a 500 mcg target draws 0.1 mL.
    const r = ok(
      reconstitute({
        ...base,
        vialAmount: 5000,
        vialUnit: "mcg",
        diluentMl: 1,
        targetAmount: 500,
        targetUnit: "mcg",
      }),
    );
    expect(r.concentrationMgPerMl).toBe(5);
    expect(r.drawMl).toBeCloseTo(0.1, 12);
  });

  describe("errors", () => {
    it("refuses a zero diluent volume rather than dividing by it", () => {
      const r = reconstitute({ ...base, diluentMl: 0 });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.errors.join(" ")).toMatch(/Diluent volume/i);
    });

    it("refuses negative quantities", () => {
      const r = reconstitute({ ...base, vialAmount: -5 });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.errors.join(" ")).toMatch(/greater than zero/i);
    });

    it("refuses NaN, which is what an empty field parses to", () => {
      const r = reconstitute({ ...base, targetAmount: Number.NaN });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.errors.join(" ")).toMatch(/not a number/i);
    });

    it("reports every problem at once rather than one at a time", () => {
      const r = reconstitute({
        ...base,
        vialAmount: 0,
        diluentMl: 0,
        targetAmount: 0,
      });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.errors).toHaveLength(3);
    });

    it("never throws, whatever it is handed", () => {
      expect(() =>
        reconstitute({
          ...base,
          vialAmount: Number.POSITIVE_INFINITY,
          diluentMl: -0,
          targetAmount: Number.NaN,
          perWeek: -1,
        }),
      ).not.toThrow();
    });
  });

  describe("warnings", () => {
    it("flags more diluent than the vial holds", () => {
      const r = ok(reconstitute({ ...base, vialVolumeMl: 2, diluentMl: 5 }));
      expect(r.warnings.join(" ")).toMatch(/more diluent than a 2 mL vial/i);
    });

    it("flags a draw that overruns the chosen barrel", () => {
      // 10 mg in 10 mL = 1 mg/mL; a 5 mg target needs 5 mL, and the largest
      // barrel offered is 3 mL.
      const r = ok(
        reconstitute({
          ...base,
          diluentMl: 10,
          vialVolumeMl: 10,
          targetAmount: 5,
          syringe: "3ml",
        }),
      );
      expect(r.warnings.join(" ")).toMatch(/exceeds the 3 mL barrel/i);
    });

    it("flags a draw too small to read on the graduation", () => {
      // 10 mg in 1 mL = 10 mg/mL; 100 mcg draws 0.01 mL = 1 unit.
      const r = ok(
        reconstitute({
          ...base,
          diluentMl: 1,
          targetAmount: 100,
          targetUnit: "mcg",
        }),
      );
      expect(r.warnings.join(" ")).toMatch(/below the readable graduation/i);
    });

    it("flags a target larger than the whole vial", () => {
      const r = ok(reconstitute({ ...base, targetAmount: 25 }));
      expect(r.warnings.join(" ")).toMatch(/larger than the whole vial/i);
    });

    it("stays silent when nothing is wrong", () => {
      expect(ok(reconstitute(base)).warnings).toHaveLength(0);
    });
  });

  it("shows its working", () => {
    const r = ok(reconstitute(base));
    expect(r.formula.length).toBeGreaterThanOrEqual(4);
    expect(r.formula[0].substituted).toContain("5");
    // Every step carries both the relationship and the substituted numbers.
    for (const step of r.formula) {
      expect(step.expression).not.toBe("");
      expect(step.substituted).not.toBe("");
    }
  });

  it("is deterministic", () => {
    const a = ok(reconstitute(base));
    const b = ok(reconstitute(base));
    expect(a.drawMl).toBe(b.drawMl);
    expect(a.formula).toEqual(b.formula);
  });
});

/* ========================================================================== */

describe("mix", () => {
  const two: MixComponent[] = [
    { name: "A", concentration: 5, concentrationUnit: "mg", contributionMl: 1 },
    { name: "B", concentration: 2, concentrationUnit: "mg", contributionMl: 1 },
  ];

  it("adds the contributed volumes", () => {
    expect(ok(mix(two)).totalVolumeMl).toBe(2);
  });

  it("adds the contributed masses", () => {
    // 5 mg/mL × 1 mL + 2 mg/mL × 1 mL = 7 mg
    expect(ok(mix(two)).totalMassMg).toBe(7);
  });

  it("dilutes every component against the combined volume", () => {
    // A: 5 mg in 2 mL = 2.5 mg/mL. B: 2 mg in 2 mL = 1 mg/mL.
    const r = ok(mix(two));
    expect(r.components[0].finalConcentrationMgPerMl).toBe(2.5);
    expect(r.components[1].finalConcentrationMgPerMl).toBe(1);
  });

  it("reports each component's share of the mass", () => {
    const r = ok(mix(two));
    expect(r.components[0].massFraction).toBeCloseTo(5 / 7, 12);
    expect(r.components[1].massFraction).toBeCloseTo(2 / 7, 12);
    expect(
      r.components.reduce((sum, c) => sum + c.massFraction, 0),
    ).toBeCloseTo(1, 12);
  });

  it("handles more than two vials", () => {
    const three: MixComponent[] = [
      ...two,
      { name: "C", concentration: 1, concentrationUnit: "mg", contributionMl: 2 },
    ];
    const r = ok(mix(three));
    expect(r.totalVolumeMl).toBe(4);
    expect(r.totalMassMg).toBe(9);
    expect(r.components).toHaveLength(3);
  });

  it("mixes microgram and milligram concentrations correctly", () => {
    // 500 mcg/mL is 0.5 mg/mL; with 1 mL of each the total is 5.5 mg in 2 mL.
    const r = ok(
      mix([
        { name: "A", concentration: 5, concentrationUnit: "mg", contributionMl: 1 },
        { name: "B", concentration: 500, concentrationUnit: "mcg", contributionMl: 1 },
      ]),
    );
    expect(r.totalMassMg).toBeCloseTo(5.5, 12);
    expect(r.components[1].finalConcentrationMgPerMl).toBeCloseTo(0.25, 12);
  });

  it("reduces to the input concentration when one solution is 'mixed' with itself", () => {
    const r = ok(
      mix([
        { name: "A", concentration: 4, concentrationUnit: "mg", contributionMl: 1 },
        { name: "B", concentration: 4, concentrationUnit: "mg", contributionMl: 3 },
      ]),
    );
    expect(r.combinedConcentrationMgPerMl).toBe(4);
  });

  it("refuses a single-vial 'mixture'", () => {
    const r = mix([two[0]]);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.join(" ")).toMatch(/at least two vials/i);
  });

  it("refuses a zero contribution rather than dividing by the total", () => {
    const r = mix([two[0], { ...two[1], contributionMl: 0 }]);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.join(" ")).toMatch(/volume drawn/i);
  });

  it("names the offending row in its error", () => {
    const r = mix([two[0], { ...two[1], name: "Ipamorelin", concentration: -1 }]);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.join(" ")).toContain("Ipamorelin");
  });

  it("falls back to a positional label for an unnamed row", () => {
    const r = mix([two[0], { ...two[1], name: "  ", concentration: 0 }]);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.join(" ")).toContain("Vial 2");
  });

  it("warns that combining binds the mixture to the shortest interval", () => {
    expect(ok(mix(two)).warnings.join(" ")).toMatch(/shortest stability/i);
  });

  it("warns about duplicate row names without failing", () => {
    const r = ok(mix([two[0], { ...two[1], name: "A" }]));
    expect(r.warnings.join(" ")).toMatch(/same name/i);
  });
});

/* ========================================================================== */

describe("blend", () => {
  const base = {
    totalAmount: 30,
    totalUnit: "mg",
    diluentMl: 3,
    components: [
      { name: "A", parts: 2 },
      { name: "B", parts: 1 },
    ],
    targetIndex: 0,
    targetAmount: 200,
    targetUnit: "mcg",
    syringe: "100u",
  } as const;

  it("splits the vial by ratio", () => {
    // 2:1 of 30 mg = 20 mg and 10 mg.
    const r = ok(blend(base));
    expect(r.components[0].massMg).toBeCloseTo(20, 12);
    expect(r.components[1].massMg).toBeCloseTo(10, 12);
  });

  it("normalises the ratio, so any scale describes the same blend", () => {
    const scaled = ok(
      blend({
        ...base,
        components: [
          { name: "A", parts: 20 },
          { name: "B", parts: 10 },
        ],
      }),
    );
    const fractional = ok(
      blend({
        ...base,
        components: [
          { name: "A", parts: 0.2 },
          { name: "B", parts: 0.1 },
        ],
      }),
    );
    expect(scaled.components[0].massMg).toBeCloseTo(20, 12);
    expect(fractional.components[0].massMg).toBeCloseTo(20, 12);
    expect(scaled.drawMl).toBeCloseTo(fractional.drawMl, 12);
  });

  it("gives each component its own concentration", () => {
    // 20 mg in 3 mL and 10 mg in 3 mL.
    const r = ok(blend(base));
    expect(r.components[0].concentrationMgPerMl).toBeCloseTo(20 / 3, 12);
    expect(r.components[1].concentrationMgPerMl).toBeCloseTo(10 / 3, 12);
    expect(r.concentrationTotalMgPerMl).toBeCloseTo(10, 12);
  });

  it("solves the draw volume for the selected component", () => {
    // 200 mcg = 0.2 mg of A, at 20/3 mg/mL, is 0.03 mL.
    const r = ok(blend(base));
    expect(r.drawMl).toBeCloseTo(0.2 / (20 / 3), 12);
    expect(r.drawUnits).toBeCloseTo(r.drawMl * 100, 12);
    expect(r.targetName).toBe("A");
  });

  it("reports what every other component comes along in that draw", () => {
    // At a 2:1 ratio, 200 mcg of A necessarily carries 100 mcg of B.
    const r = ok(blend(base));
    expect(r.components[0].massInDrawMg).toBeCloseTo(0.2, 12);
    expect(r.components[1].massInDrawMg).toBeCloseTo(0.1, 12);
  });

  it("changes the answer when a different component is targeted", () => {
    // 200 mcg of B is twice the volume of 200 mcg of A at 2:1.
    const forA = ok(blend(base));
    const forB = ok(blend({ ...base, targetIndex: 1 }));
    expect(forB.drawMl).toBeCloseTo(forA.drawMl * 2, 12);
    expect(forB.targetName).toBe("B");
  });

  it("handles three or more components", () => {
    const r = ok(
      blend({
        ...base,
        components: [
          { name: "A", parts: 3 },
          { name: "B", parts: 2 },
          { name: "C", parts: 1 },
        ],
      }),
    );
    expect(r.components).toHaveLength(3);
    expect(r.components.map((c) => round(c.massMg, 6))).toEqual([15, 10, 5]);
    expect(
      r.components.reduce((sum, c) => sum + c.fraction, 0),
    ).toBeCloseTo(1, 12);
  });

  it("refuses a single-component 'blend'", () => {
    const r = blend({ ...base, components: [{ name: "A", parts: 1 }] });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.join(" ")).toMatch(/at least two components/i);
  });

  it("refuses a zero ratio rather than dividing by the total parts", () => {
    const r = blend({
      ...base,
      components: [
        { name: "A", parts: 0 },
        { name: "B", parts: 0 },
      ],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.join(" ")).toMatch(/ratio/i);
  });

  it("refuses a target index outside the component list", () => {
    expect(blend({ ...base, targetIndex: 5 }).ok).toBe(false);
    expect(blend({ ...base, targetIndex: -1 }).ok).toBe(false);
  });

  it("flags a target larger than the vial holds of that component", () => {
    // The vial holds 20 mg of A; 25 mg is more than all of it.
    const r = ok(
      blend({ ...base, targetAmount: 25, targetUnit: "mg" }),
    );
    expect(r.warnings.join(" ")).toMatch(/less than the target quantity/i);
  });

  it("flags a draw that overruns the barrel", () => {
    const r = ok(
      blend({ ...base, targetAmount: 15, targetUnit: "mg", syringe: "30u" }),
    );
    expect(r.warnings.join(" ")).toMatch(/exceeds the 30 unit barrel/i);
  });

  it("never throws on hostile input", () => {
    expect(() =>
      blend({
        ...base,
        totalAmount: Number.NaN,
        diluentMl: Number.NEGATIVE_INFINITY,
        components: [
          { name: "", parts: Number.NaN },
          { name: "", parts: -3 },
        ],
        targetIndex: 1.5,
      }),
    ).not.toThrow();
  });
});

/* ========================================================================== */

describe("syringes", () => {
  it("offers all five formats the brief specifies", () => {
    expect(Object.keys(SYRINGES).sort()).toEqual(
      ["100u", "1ml", "30u", "3ml", "50u"].sort(),
    );
  });

  it("graduates insulin barrels at 100 units to the millilitre", () => {
    for (const key of ["30u", "50u", "100u"] as const) {
      const s = SYRINGES[key];
      expect(s.maxUnits).toBe(s.capacityMl * UNITS_PER_ML);
    }
  });

  it("leaves the volumetric barrels ungraduated in units", () => {
    expect(SYRINGES["1ml"].maxUnits).toBeNull();
    expect(SYRINGES["3ml"].maxUnits).toBeNull();
  });
});

describe("formatting", () => {
  it("pins the locale so the export and the client agree", () => {
    expect(formatNumber(1234.5, 2)).toBe("1,234.50");
  });

  it("shows a small volume at the precision it deserves", () => {
    expect(formatVolume(0.005)).toBe("0.0050");
    expect(formatVolume(0.05)).toBe("0.050");
    expect(formatVolume(1.5)).toBe("1.50");
  });

  it("renders a non-finite value as an em dash rather than 'NaN'", () => {
    expect(formatNumber(Number.NaN)).toBe("—");
    expect(formatVolume(Number.POSITIVE_INFINITY)).toBe("—");
  });
});
