"use client";

import { useId, useMemo, useState } from "react";
import {
  Errors,
  NumberField,
  Segmented,
  Step,
  SyringeBarrel,
  Warnings,
  Working,
} from "./CalculatorPrimitives";
import {
  SYRINGES,
  SYRINGE_KEYS,
  VIAL_VOLUMES_ML,
  blend,
  formatNumber,
  formatVolume,
  mix,
  parseField,
  reconstitute,
  type BlendComponent,
  type MassUnit,
  type MixComponent,
  type SyringeKey,
} from "@/lib/calculator";
import { cn } from "@/lib/utils";

/**
 * The calculator.
 *
 * Three modes over one arithmetic core (`lib/calculator.ts`). This file owns
 * strings, focus and layout only — every number on screen comes back from a
 * pure function that is unit-tested independently of React.
 *
 * ## Reconstitute
 * A lyophilised vial and a volume of diluent. Answers: what concentration
 * results, what volume contains a given quantity, where that lands on the
 * barrel, and how many whole withdrawals the vial holds.
 *
 * ## Mix
 * Several vials already in solution, drawn into one container. Answers: the
 * combined volume, and what each component's concentration becomes once
 * everything has diluted everything else.
 *
 * ## Blend
 * One vial holding several compounds in a fixed ratio. Answers: each
 * component's mass and concentration, and — solving for one of them — the
 * volume to draw and what quantity of every other component comes with it.
 *
 * None of the three proposes a quantity, a schedule or a compound.
 */

type Mode = "reconstitute" | "mix" | "blend";

const MODES: { value: Mode; label: string; blurb: string }[] = [
  {
    value: "reconstitute",
    label: "Reconstitute",
    blurb:
      "For lyophilised material. Works out the concentration a given volume of diluent produces, the volume that contains a given quantity, and where that lands on the barrel.",
  },
  {
    value: "mix",
    label: "Mix",
    blurb:
      "For material already in solution. Combines the volumes drawn from several vials and reports what each component's concentration becomes in the finished mixture.",
  },
  {
    value: "blend",
    label: "Blend",
    blurb:
      "For a single vial holding several compounds in a fixed ratio. Reports each component's mass and concentration, then solves the draw volume for whichever one you name.",
  },
];

const UNIT_OPTIONS: { value: MassUnit; label: string }[] = [
  { value: "mg", label: "mg" },
  { value: "mcg", label: "mcg" },
];

/** Withdrawals per week. `0` means "do not compute a duration". */
const FREQUENCIES = [
  { value: "7", label: "Daily", note: "7×/wk" },
  { value: "3.5", label: "Alternate", note: "3.5×/wk" },
  { value: "2", label: "Twice wkly", note: "2×/wk" },
  { value: "1", label: "Weekly", note: "1×/wk" },
  { value: "0", label: "Not stated", note: "no duration" },
] as const;

const DEFAULT_MIX: MixComponent[] = [
  { name: "Vial A", concentration: 5, concentrationUnit: "mg", contributionMl: 1 },
  { name: "Vial B", concentration: 2, concentrationUnit: "mg", contributionMl: 1 },
];

const DEFAULT_BLEND: BlendComponent[] = [
  { name: "Component A", parts: 2 },
  { name: "Component B", parts: 1 },
];

/** Rows are kept as strings so a half-typed value is not coerced to 0. */
interface MixRow {
  name: string;
  concentration: string;
  concentrationUnit: MassUnit;
  contributionMl: string;
}

interface BlendRow {
  name: string;
  parts: string;
}

export function PeptideCalculator() {
  const uid = useId();
  const [mode, setMode] = useState<Mode>("reconstitute");

  /* --- Reconstitute ----------------------------------------------------- */
  const [vialAmount, setVialAmount] = useState("10");
  const [vialUnit, setVialUnit] = useState<MassUnit>("mg");
  const [vialVolume, setVialVolume] = useState<number>(3);
  const [diluent, setDiluent] = useState("2");
  const [target, setTarget] = useState("0.25");
  const [targetUnit, setTargetUnit] = useState<MassUnit>("mg");
  const [frequency, setFrequency] = useState<string>("7");
  const [syringe, setSyringe] = useState<SyringeKey>("100u");

  /* --- Mix -------------------------------------------------------------- */
  const [mixRows, setMixRows] = useState<MixRow[]>(
    DEFAULT_MIX.map((c) => ({
      name: c.name,
      concentration: String(c.concentration),
      concentrationUnit: c.concentrationUnit,
      contributionMl: String(c.contributionMl),
    })),
  );

  /* --- Blend ------------------------------------------------------------ */
  const [blendTotal, setBlendTotal] = useState("30");
  const [blendTotalUnit, setBlendTotalUnit] = useState<MassUnit>("mg");
  const [blendDiluent, setBlendDiluent] = useState("3");
  const [blendRows, setBlendRows] = useState<BlendRow[]>(
    DEFAULT_BLEND.map((c) => ({ name: c.name, parts: String(c.parts) })),
  );
  const [blendTargetIndex, setBlendTargetIndex] = useState(0);
  const [blendTargetAmount, setBlendTargetAmount] = useState("200");
  const [blendTargetUnit, setBlendTargetUnit] = useState<MassUnit>("mcg");
  const [blendSyringe, setBlendSyringe] = useState<SyringeKey>("100u");

  /* --- Results ---------------------------------------------------------- */

  const reconResult = useMemo(() => {
    const perWeek = parseField(frequency);
    return reconstitute({
      vialAmount: parseField(vialAmount),
      vialUnit,
      vialVolumeMl: vialVolume,
      diluentMl: parseField(diluent),
      targetAmount: parseField(target),
      targetUnit,
      syringe,
      perWeek: perWeek > 0 ? perWeek : null,
    });
  }, [
    vialAmount,
    vialUnit,
    vialVolume,
    diluent,
    target,
    targetUnit,
    syringe,
    frequency,
  ]);

  const mixResult = useMemo(
    () =>
      mix(
        mixRows.map((row) => ({
          name: row.name,
          concentration: parseField(row.concentration),
          concentrationUnit: row.concentrationUnit,
          contributionMl: parseField(row.contributionMl),
        })),
      ),
    [mixRows],
  );

  const blendResult = useMemo(
    () =>
      blend({
        totalAmount: parseField(blendTotal),
        totalUnit: blendTotalUnit,
        diluentMl: parseField(blendDiluent),
        components: blendRows.map((row) => ({
          name: row.name,
          parts: parseField(row.parts),
        })),
        targetIndex: blendTargetIndex,
        targetAmount: parseField(blendTargetAmount),
        targetUnit: blendTargetUnit,
        syringe: blendSyringe,
      }),
    [
      blendTotal,
      blendTotalUnit,
      blendDiluent,
      blendRows,
      blendTargetIndex,
      blendTargetAmount,
      blendTargetUnit,
      blendSyringe,
    ],
  );

  /* --- Reset ------------------------------------------------------------ */

  const reset = () => {
    if (mode === "reconstitute") {
      setVialAmount("10");
      setVialUnit("mg");
      setVialVolume(3);
      setDiluent("2");
      setTarget("0.25");
      setTargetUnit("mg");
      setFrequency("7");
      setSyringe("100u");
      return;
    }
    if (mode === "mix") {
      setMixRows(
        DEFAULT_MIX.map((c) => ({
          name: c.name,
          concentration: String(c.concentration),
          concentrationUnit: c.concentrationUnit,
          contributionMl: String(c.contributionMl),
        })),
      );
      return;
    }
    setBlendTotal("30");
    setBlendTotalUnit("mg");
    setBlendDiluent("3");
    setBlendRows(
      DEFAULT_BLEND.map((c) => ({ name: c.name, parts: String(c.parts) })),
    );
    setBlendTargetIndex(0);
    setBlendTargetAmount("200");
    setBlendTargetUnit("mcg");
    setBlendSyringe("100u");
  };

  const activeMode = MODES.find((m) => m.value === mode)!;
  const syringeOptions = SYRINGE_KEYS.map((key) => ({
    value: key,
    label: SYRINGES[key].label,
  }));

  return (
    <div>
      <div role="tablist" aria-label="Calculator mode" className="flex flex-wrap gap-2">
        {MODES.map((option) => (
          <button
            key={option.value}
            role="tab"
            type="button"
            id={`${uid}-tab-${option.value}`}
            aria-selected={mode === option.value}
            aria-controls={`${uid}-panel-${option.value}`}
            tabIndex={mode === option.value ? 0 : -1}
            onClick={() => setMode(option.value)}
            onKeyDown={(e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              e.preventDefault();
              const i = MODES.findIndex((m) => m.value === mode);
              const next =
                e.key === "ArrowRight"
                  ? (i + 1) % MODES.length
                  : (i - 1 + MODES.length) % MODES.length;
              setMode(MODES[next].value);
            }}
            className={cn(
              "type-label min-h-11 border px-6 py-3 transition-colors duration-400 ease-brand",
              mode === option.value
                ? "border-carbon bg-carbon text-soft"
                : "border-carbon/15 text-carbon/62 hover:border-carbon/40 hover:text-carbon",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <p className="type-body-s mt-5 max-w-[58ch] text-carbon/55">
        {activeMode.blurb}
      </p>

      <div
        role="tabpanel"
        id={`${uid}-panel-${mode}`}
        aria-labelledby={`${uid}-tab-${mode}`}
        className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-16"
      >
        {/* ============================== INPUTS ============================ */}
        <form
          className="flex flex-col gap-10 lg:col-span-6"
          onSubmit={(e) => e.preventDefault()}
        >
          {mode === "reconstitute" ? (
            <>
              <Step
                index={1}
                title="What is in the vial?"
                hint="Use the assayed content from the certificate of analysis where it differs from the label strength."
              >
                <NumberField
                  id={`${uid}-vial`}
                  label="Compound quantity"
                  value={vialAmount}
                  onChange={setVialAmount}
                  step="0.1"
                />
                <Segmented
                  className="mt-5"
                  label="Vial quantity unit"
                  value={vialUnit}
                  onChange={setVialUnit}
                  options={UNIT_OPTIONS}
                />

                <p className="type-label mt-8 mb-3 text-carbon/62">
                  Vial capacity
                </p>
                <Segmented
                  label="Vial capacity"
                  value={String(vialVolume)}
                  onChange={(v) => setVialVolume(Number(v))}
                  options={VIAL_VOLUMES_ML.map((v) => ({
                    value: String(v),
                    label: `${v} mL`,
                  }))}
                />
              </Step>

              <Step
                index={2}
                title="How much diluent?"
                hint="This is what sets the concentration. The quantity in the vial never changes."
              >
                <NumberField
                  id={`${uid}-diluent`}
                  label="Bacteriostatic water to add"
                  value={diluent}
                  onChange={setDiluent}
                  suffix="mL"
                  step="0.1"
                />
              </Step>

              <Step
                index={3}
                title="What quantity per withdrawal?"
                hint="A quantity you have already decided on. This tool does not propose one."
              >
                <NumberField
                  id={`${uid}-target`}
                  label="Quantity to draw"
                  value={target}
                  onChange={setTarget}
                  step="0.01"
                />
                <Segmented
                  className="mt-5"
                  label="Target quantity unit"
                  value={targetUnit}
                  onChange={setTargetUnit}
                  options={UNIT_OPTIONS}
                />
              </Step>

              <Step
                index={4}
                title="How often is it drawn?"
                hint="Used for one thing only: dividing whole withdrawals into days. Leave it unstated and no duration is reported."
              >
                <Segmented
                  label="Withdrawal frequency"
                  value={frequency}
                  onChange={setFrequency}
                  options={FREQUENCIES.map((f) => ({
                    value: f.value,
                    label: f.label,
                    note: f.note,
                  }))}
                />
              </Step>
            </>
          ) : null}

          {mode === "mix" ? (
            <Step
              index={1}
              title="Which solutions are being combined?"
              hint="Each row is one vial that has already been reconstituted. Give its concentration and the volume you intend to draw from it."
            >
              <ul className="space-y-8">
                {mixRows.map((row, i) => (
                  <li key={i} className="border-t border-carbon/10 pt-6">
                    <div className="flex items-center justify-between gap-4">
                      <label
                        htmlFor={`${uid}-mix-name-${i}`}
                        className="type-label text-carbon/62"
                      >
                        Vial {i + 1}
                      </label>
                      {mixRows.length > 2 ? (
                        <button
                          type="button"
                          onClick={() =>
                            setMixRows((rows) => rows.filter((_, j) => j !== i))
                          }
                          className="type-label min-h-11 text-carbon/45 transition-colors duration-400 ease-brand hover:text-carbon"
                        >
                          <span className="sr-only">Remove vial {i + 1}</span>
                          Remove
                        </button>
                      ) : null}
                    </div>

                    <input
                      id={`${uid}-mix-name-${i}`}
                      type="text"
                      value={row.name}
                      maxLength={48}
                      placeholder={`Vial ${i + 1}`}
                      onChange={(e) =>
                        setMixRows((rows) =>
                          rows.map((r, j) =>
                            j === i ? { ...r, name: e.target.value } : r,
                          ),
                        )
                      }
                      className="type-body mt-3 w-full border-b border-carbon/20 bg-transparent py-2 text-carbon transition-colors duration-400 ease-brand focus:border-carbon focus:outline-none"
                    />

                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                      <NumberField
                        id={`${uid}-mix-conc-${i}`}
                        label={`${row.name.trim() || `Vial ${i + 1}`} concentration`}
                        value={row.concentration}
                        onChange={(v) =>
                          setMixRows((rows) =>
                            rows.map((r, j) =>
                              j === i ? { ...r, concentration: v } : r,
                            ),
                          )
                        }
                        suffix={`${row.concentrationUnit}/mL`}
                        step="0.01"
                      />
                      <NumberField
                        id={`${uid}-mix-vol-${i}`}
                        label={`${row.name.trim() || `Vial ${i + 1}`} volume drawn`}
                        value={row.contributionMl}
                        onChange={(v) =>
                          setMixRows((rows) =>
                            rows.map((r, j) =>
                              j === i ? { ...r, contributionMl: v } : r,
                            ),
                          )
                        }
                        suffix="mL"
                        step="0.1"
                      />
                    </div>

                    <Segmented
                      className="mt-5"
                      label={`${row.name.trim() || `Vial ${i + 1}`} unit`}
                      value={row.concentrationUnit}
                      onChange={(v) =>
                        setMixRows((rows) =>
                          rows.map((r, j) =>
                            j === i ? { ...r, concentrationUnit: v } : r,
                          ),
                        )
                      }
                      options={UNIT_OPTIONS.map((o) => ({
                        ...o,
                        label: `${o.label}/mL`,
                      }))}
                    />
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() =>
                  setMixRows((rows) => [
                    ...rows,
                    {
                      name: `Vial ${rows.length + 1}`,
                      concentration: "1",
                      concentrationUnit: "mg",
                      contributionMl: "1",
                    },
                  ])
                }
                className="type-label mt-9 min-h-11 border border-carbon/20 px-7 py-3.5 text-carbon transition-colors duration-400 ease-brand hover:border-carbon"
              >
                Add another vial
              </button>
            </Step>
          ) : null}

          {mode === "blend" ? (
            <>
              <Step
                index={1}
                title="What is in the vial?"
                hint="The total across every compound in the blend, as stated on the certificate."
              >
                <NumberField
                  id={`${uid}-blend-total`}
                  label="Total compound quantity"
                  value={blendTotal}
                  onChange={setBlendTotal}
                  step="0.1"
                />
                <Segmented
                  className="mt-5"
                  label="Total quantity unit"
                  value={blendTotalUnit}
                  onChange={setBlendTotalUnit}
                  options={UNIT_OPTIONS}
                />
              </Step>

              <Step index={2} title="How much diluent?">
                <NumberField
                  id={`${uid}-blend-diluent`}
                  label="Bacteriostatic water to add"
                  value={blendDiluent}
                  onChange={setBlendDiluent}
                  suffix="mL"
                  step="0.1"
                />
              </Step>

              <Step
                index={3}
                title="What is the ratio?"
                hint="Any scale works — 2 : 1, 20 : 10 and 0.2 : 0.1 all describe the same blend."
              >
                <ul className="space-y-6">
                  {blendRows.map((row, i) => (
                    <li key={i} className="border-t border-carbon/10 pt-6">
                      <div className="flex items-center justify-between gap-4">
                        <label
                          htmlFor={`${uid}-blend-name-${i}`}
                          className="type-label text-carbon/62"
                        >
                          Component {i + 1}
                        </label>
                        {blendRows.length > 2 ? (
                          <button
                            type="button"
                            onClick={() => {
                              setBlendRows((rows) =>
                                rows.filter((_, j) => j !== i),
                              );
                              // Keep the selected target pointing at a row
                              // that still exists.
                              setBlendTargetIndex((t) =>
                                t >= i && t > 0 ? t - 1 : t,
                              );
                            }}
                            className="type-label min-h-11 text-carbon/45 transition-colors duration-400 ease-brand hover:text-carbon"
                          >
                            <span className="sr-only">
                              Remove component {i + 1}
                            </span>
                            Remove
                          </button>
                        ) : null}
                      </div>

                      <div className="mt-3 grid gap-6 sm:grid-cols-2">
                        <input
                          id={`${uid}-blend-name-${i}`}
                          type="text"
                          value={row.name}
                          maxLength={48}
                          placeholder={`Component ${i + 1}`}
                          onChange={(e) =>
                            setBlendRows((rows) =>
                              rows.map((r, j) =>
                                j === i ? { ...r, name: e.target.value } : r,
                              ),
                            )
                          }
                          className="type-body w-full border-b border-carbon/20 bg-transparent py-2 text-carbon transition-colors duration-400 ease-brand focus:border-carbon focus:outline-none"
                        />
                        <NumberField
                          id={`${uid}-blend-parts-${i}`}
                          label={`${row.name.trim() || `Component ${i + 1}`} ratio`}
                          value={row.parts}
                          onChange={(v) =>
                            setBlendRows((rows) =>
                              rows.map((r, j) =>
                                j === i ? { ...r, parts: v } : r,
                              ),
                            )
                          }
                          suffix="parts"
                          step="0.1"
                        />
                      </div>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() =>
                    setBlendRows((rows) => [
                      ...rows,
                      { name: `Component ${rows.length + 1}`, parts: "1" },
                    ])
                  }
                  className="type-label mt-9 min-h-11 border border-carbon/20 px-7 py-3.5 text-carbon transition-colors duration-400 ease-brand hover:border-carbon"
                >
                  Add another component
                </button>
              </Step>

              <Step
                index={4}
                title="Solve the draw for which component?"
                hint="The components share one vial, so fixing the quantity of one fixes the quantity of every other."
              >
                <Segmented
                  label="Target component"
                  value={String(blendTargetIndex)}
                  onChange={(v) => setBlendTargetIndex(Number(v))}
                  options={blendRows.map((row, i) => ({
                    value: String(i),
                    label: row.name.trim() || `Component ${i + 1}`,
                  }))}
                />

                <div className="mt-8">
                  <NumberField
                    id={`${uid}-blend-target`}
                    label="Quantity of that component per withdrawal"
                    value={blendTargetAmount}
                    onChange={setBlendTargetAmount}
                    step="0.01"
                  />
                  <Segmented
                    className="mt-5"
                    label="Target quantity unit"
                    value={blendTargetUnit}
                    onChange={setBlendTargetUnit}
                    options={UNIT_OPTIONS}
                  />
                </div>
              </Step>
            </>
          ) : null}
        </form>

        {/* ============================= RESULTS ============================ */}
        <div className="lg:col-span-5 lg:col-start-8">
          <div className="lg:sticky lg:top-32">
            <div className="border border-carbon/12 bg-mist/45 p-7 md:p-9">
              <p className="type-label text-carbon/45">Result</p>

              <div aria-live="polite">
                {/* ---------------------------------------- Reconstitute -- */}
                {mode === "reconstitute" ? (
                  reconResult.ok ? (
                    <>
                      <dl className="mt-7 border-t border-carbon/12">
                        <div className="flex items-baseline justify-between gap-4 border-b border-carbon/12 py-5">
                          <dt className="type-label text-carbon/45">
                            Concentration
                          </dt>
                          <dd className="type-title tabular-nums text-carbon">
                            {formatNumber(
                              reconResult.value.concentrationMgPerMl,
                              3,
                            )}{" "}
                            mg/mL
                          </dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-4 border-b border-carbon/12 py-5">
                          <dt className="type-label text-carbon/45">
                            Volume to draw
                          </dt>
                          <dd className="type-display-s tabular-nums text-carbon">
                            {formatVolume(reconResult.value.drawMl)} mL
                          </dd>
                        </div>
                      </dl>

                      <SyringeBarrel
                        units={reconResult.value.drawUnits}
                        max={SYRINGES[syringe].maxUnits}
                        volumeMl={reconResult.value.drawMl}
                        capacityMl={SYRINGES[syringe].capacityMl}
                      />

                      <p className="type-label mt-8 mb-3 text-carbon/62">
                        Syringe
                      </p>
                      <Segmented
                        label="Syringe format"
                        value={syringe}
                        onChange={setSyringe}
                        options={syringeOptions}
                      />

                      <dl className="mt-9 grid grid-cols-2 gap-6 border-t border-carbon/12 pt-7">
                        <div>
                          <dt className="type-label text-carbon/45">
                            Whole withdrawals
                          </dt>
                          <dd className="type-title mt-2 tabular-nums text-carbon">
                            {reconResult.value.portions}
                          </dd>
                        </div>
                        <div>
                          <dt className="type-label text-carbon/45">
                            Covers
                          </dt>
                          <dd className="type-title mt-2 tabular-nums text-carbon">
                            {reconResult.value.durationDays === null
                              ? "—"
                              : `${reconResult.value.durationDays} d`}
                          </dd>
                        </div>
                      </dl>

                      <Warnings warnings={reconResult.value.warnings} />
                      <Working steps={reconResult.value.formula} />
                    </>
                  ) : (
                    <Errors errors={reconResult.errors} />
                  )
                ) : null}

                {/* ------------------------------------------------- Mix -- */}
                {mode === "mix" ? (
                  mixResult.ok ? (
                    <>
                      <dl className="mt-7 border-t border-carbon/12">
                        <div className="flex items-baseline justify-between gap-4 border-b border-carbon/12 py-5">
                          <dt className="type-label text-carbon/45">
                            Combined volume
                          </dt>
                          <dd className="type-title tabular-nums text-carbon">
                            {formatVolume(mixResult.value.totalVolumeMl)} mL
                          </dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-4 border-b border-carbon/12 py-5">
                          <dt className="type-label text-carbon/45">
                            Combined mass
                          </dt>
                          <dd className="type-title tabular-nums text-carbon">
                            {formatNumber(mixResult.value.totalMassMg, 3)} mg
                          </dd>
                        </div>
                      </dl>

                      <p className="type-label mt-9 mb-4 text-carbon/62">
                        In the finished mixture
                      </p>
                      <ul className="border-t border-carbon/12">
                        {mixResult.value.components.map((component) => (
                          <li
                            key={component.name}
                            className="border-b border-carbon/12 py-5"
                          >
                            <div className="flex items-baseline justify-between gap-4">
                              <span className="type-title-s text-carbon">
                                {component.name}
                              </span>
                              <span className="type-title tabular-nums text-carbon">
                                {formatNumber(
                                  component.finalConcentrationMgPerMl,
                                  3,
                                )}{" "}
                                mg/mL
                              </span>
                            </div>
                            <p className="type-body-s mt-2 tabular-nums text-carbon/55">
                              {formatNumber(component.massMg, 3)} mg from{" "}
                              {formatVolume(component.contributionMl)} mL ·{" "}
                              {formatNumber(component.massFraction * 100, 1)}% of
                              the mass
                            </p>
                          </li>
                        ))}
                      </ul>

                      <Warnings warnings={mixResult.value.warnings} />
                      <Working steps={mixResult.value.formula} />
                    </>
                  ) : (
                    <Errors errors={mixResult.errors} />
                  )
                ) : null}

                {/* ----------------------------------------------- Blend -- */}
                {mode === "blend" ? (
                  blendResult.ok ? (
                    <>
                      <dl className="mt-7 border-t border-carbon/12">
                        <div className="flex items-baseline justify-between gap-4 border-b border-carbon/12 py-5">
                          <dt className="type-label text-carbon/45">
                            Total concentration
                          </dt>
                          <dd className="type-title tabular-nums text-carbon">
                            {formatNumber(
                              blendResult.value.concentrationTotalMgPerMl,
                              3,
                            )}{" "}
                            mg/mL
                          </dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-4 border-b border-carbon/12 py-5">
                          <dt className="type-label text-carbon/45">
                            Volume to draw
                          </dt>
                          <dd className="type-display-s tabular-nums text-carbon">
                            {formatVolume(blendResult.value.drawMl)} mL
                          </dd>
                        </div>
                      </dl>

                      <SyringeBarrel
                        units={blendResult.value.drawUnits}
                        max={SYRINGES[blendSyringe].maxUnits}
                        volumeMl={blendResult.value.drawMl}
                        capacityMl={SYRINGES[blendSyringe].capacityMl}
                      />

                      <p className="type-label mt-8 mb-3 text-carbon/62">
                        Syringe
                      </p>
                      <Segmented
                        label="Syringe format"
                        value={blendSyringe}
                        onChange={setBlendSyringe}
                        options={syringeOptions}
                      />

                      <p className="type-label mt-9 mb-4 text-carbon/62">
                        What that volume contains
                      </p>
                      <ul className="border-t border-carbon/12">
                        {blendResult.value.components.map((component) => (
                          <li
                            key={component.name}
                            className="border-b border-carbon/12 py-5"
                          >
                            <div className="flex items-baseline justify-between gap-4">
                              <span className="type-title-s text-carbon">
                                {component.name}
                              </span>
                              <span className="type-title tabular-nums text-carbon">
                                {formatNumber(component.massInDrawMg * 1000, 1)}{" "}
                                mcg
                              </span>
                            </div>
                            <p className="type-body-s mt-2 tabular-nums text-carbon/55">
                              {formatNumber(component.fraction * 100, 1)}% of the
                              vial ·{" "}
                              {formatNumber(component.concentrationMgPerMl, 3)}{" "}
                              mg/mL · {formatNumber(component.massMg, 3)} mg in
                              the vial
                            </p>
                          </li>
                        ))}
                      </ul>

                      <Warnings warnings={blendResult.value.warnings} />
                      <Working steps={blendResult.value.formula} />
                    </>
                  ) : (
                    <Errors errors={blendResult.errors} />
                  )
                ) : null}

                <button
                  type="button"
                  onClick={reset}
                  className="type-label mt-9 min-h-11 border border-carbon/20 px-7 py-3.5 text-carbon transition-colors duration-400 ease-brand hover:border-carbon"
                >
                  Reset {activeMode.label.toLowerCase()}
                </button>
              </div>
            </div>

            <p className="type-body-s mt-7 text-carbon/50">
              The figures you enter stay in this browser. Nothing is
              transmitted, logged or retained.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
