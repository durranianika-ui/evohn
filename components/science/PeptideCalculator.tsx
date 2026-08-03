"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Peptide calculator.
 *
 * Follows the reference's flow exactly: four numbered questions down the
 * left, a live "Your recipe" panel down the right, and a syringe barrel that
 * shows where the answer lands. The Mix tab combines reconstituted vials.
 *
 * It converts between quantity, volume and concentration and nothing else.
 * It does not suggest a quantity, a schedule or a target — those belong to a
 * study design, not to a calculator.
 */

type Tab = "reconstitute" | "mix";
type Unit = "mg" | "mcg";
type Frequency = "daily" | "twice" | "weekly";
type Syringe = "30u" | "50u" | "100u" | "1ml";

const VIAL_SIZES = [2, 3, 5, 10] as const;

const SYRINGES: Record<Syringe, { label: string; units: number; ml: number }> = {
  "30u": { label: "30u", units: 30, ml: 0.3 },
  "50u": { label: "50u", units: 50, ml: 0.5 },
  "100u": { label: "100u", units: 100, ml: 1 },
  "1ml": { label: "1 mL", units: 100, ml: 1 },
};

const FREQUENCIES: Record<Frequency, { label: string; note: string; perDay: number }> =
  {
    daily: { label: "Daily", note: "1×/day", perDay: 1 },
    twice: { label: "Twice", note: "2×/day", perDay: 2 },
    weekly: { label: "Weekly", note: "1×/wk", perDay: 1 / 7 },
  };

const field =
  "type-title w-full border-b border-carbon/20 bg-transparent py-2.5 text-carbon " +
  "transition-colors duration-400 ease-brand focus:border-carbon focus:outline-none " +
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none " +
  "[&::-webkit-outer-spin-button]:appearance-none";

function Step({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-carbon/12 pt-8">
      <div className="flex items-baseline gap-5">
        <span className="type-label tabular-nums text-carbon/35">
          {index}
        </span>
        <h3 className="type-title-s text-carbon">{title}</h3>
      </div>
      <div className="mt-7 pl-0 sm:pl-10">{children}</div>
    </section>
  );
}

/** Segmented control — the reference's own choice for every fixed option. */
function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string; note?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "type-label inline-flex min-h-11 flex-col items-center justify-center border px-5 py-2.5",
              "transition-colors duration-400 ease-brand",
              selected
                ? "border-carbon bg-carbon text-soft"
                : "border-carbon/15 text-carbon/62 hover:border-carbon/40 hover:text-carbon",
            )}
          >
            {option.label}
            {option.note ? (
              <span
                className={cn(
                  "mt-0.5 text-[0.625rem] tracking-[0.12em] normal-case",
                  selected ? "text-soft/60" : "text-carbon/40",
                )}
              >
                {option.note}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

/** U-100 barrel with the working volume filled and the mark labelled. */
function SyringeBarrel({
  units,
  max,
}: {
  units: number | null;
  max: number;
}) {
  const pct = units === null ? 0 : Math.min(100, (units / max) * 100);
  const ticks = Array.from({ length: 11 }, (_, i) => (max / 10) * i);

  return (
    <div className="mt-8">
      <div className="flex items-baseline justify-between">
        <span className="type-label text-carbon/45">Units</span>
        <span className="type-title tabular-nums text-carbon">
          {units === null ? "—" : units.toFixed(1)}
        </span>
      </div>

      <div className="relative mt-4 h-8 w-full border border-carbon/25 bg-soft">
        <span
          className="absolute inset-y-0 left-0 bg-carbon/85 transition-[width] duration-500 ease-brand motion-reduce:transition-none"
          style={{ width: `${pct}%` }}
        />
        {ticks.map((t, i) => (
          <span
            key={t}
            aria-hidden
            className={cn(
              "absolute top-0 w-px bg-carbon/25",
              i % 5 === 0 ? "h-full" : "h-1/2",
            )}
            style={{ left: `${(i / 10) * 100}%` }}
          />
        ))}
      </div>

      <div className="type-label mt-2.5 flex justify-between tabular-nums text-carbon/40">
        {ticks
          .filter((_, i) => i % 2 === 0)
          .map((t) => (
            <span key={t}>{Math.round(t)}</span>
          ))}
      </div>
    </div>
  );
}

export function PeptideCalculator() {
  const uid = useId();
  const [tab, setTab] = useState<Tab>("reconstitute");

  // Reconstitute
  const [amount, setAmount] = useState("10");
  const [vial, setVial] = useState<(typeof VIAL_SIZES)[number]>(2);
  const [diluent, setDiluent] = useState("2");
  const [dose, setDose] = useState("0.25");
  const [unit, setUnit] = useState<Unit>("mg");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [syringe, setSyringe] = useState<Syringe>("100u");

  // Mix
  const [mixA, setMixA] = useState("5");
  const [mixB, setMixB] = useState("5");
  const [mixVolume, setMixVolume] = useState("3");

  const recon = useMemo(() => {
    const mg = Number.parseFloat(amount);
    const ml = Number.parseFloat(diluent);
    if (!(mg > 0) || !(ml > 0)) return null;

    const concentration = mg / ml;
    const doseValue = Number.parseFloat(dose);
    const doseMg = unit === "mcg" ? doseValue / 1000 : doseValue;

    const drawMl = doseValue > 0 ? doseMg / concentration : null;
    const units = drawMl === null ? null : drawMl * 100;
    const doses = doseMg > 0 ? Math.floor(mg / doseMg) : null;
    const perDay = FREQUENCIES[frequency].perDay;
    const days = doses !== null ? Math.floor(doses / perDay) : null;

    return {
      concentration,
      drawMl,
      units,
      doses,
      days,
      overVial: ml > vial,
      overDraw: drawMl !== null && drawMl > SYRINGES[syringe].ml,
    };
  }, [amount, diluent, dose, unit, frequency, vial, syringe]);

  const mix = useMemo(() => {
    const a = Number.parseFloat(mixA);
    const b = Number.parseFloat(mixB);
    const v = Number.parseFloat(mixVolume);
    if (!(a > 0) || !(b > 0) || !(v > 0)) return null;
    return { total: a + b, concentration: (a + b) / v, a, b, v };
  }, [mixA, mixB, mixVolume]);

  const fmt = (n: number, dp = 2) =>
    n.toLocaleString("en-GB", {
      minimumFractionDigits: dp,
      maximumFractionDigits: dp,
    });

  const reset = () => {
    setAmount("10");
    setVial(2);
    setDiluent("2");
    setDose("0.25");
    setUnit("mg");
    setFrequency("daily");
    setSyringe("100u");
  };

  return (
    <div>
      {/* Mode */}
      <div
        role="tablist"
        aria-label="Calculator mode"
        className="flex flex-wrap gap-2"
      >
        {(
          [
            ["reconstitute", "Reconstitute", "For powder compounds. Calculates diluent and draw volume."],
            ["mix", "Mix", "Combine two reconstituted vials into one solution."],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            role="tab"
            type="button"
            aria-selected={tab === value}
            onClick={() => setTab(value)}
            className={cn(
              "type-label min-h-11 border px-6 py-3",
              "transition-colors duration-400 ease-brand",
              tab === value
                ? "border-carbon bg-carbon text-soft"
                : "border-carbon/15 text-carbon/62 hover:border-carbon/40 hover:text-carbon",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="type-body-s mt-5 max-w-[52ch] text-carbon/55">
        {tab === "reconstitute"
          ? "For lyophilised compounds. Works out the concentration, the volume that contains a given quantity, and where that lands on the barrel."
          : "For material already in solution. Combines two reconstituted vials and reports the resulting concentration."}
      </p>

      <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-16">
        {/* Questions */}
        <form
          className="flex flex-col gap-10 lg:col-span-6"
          onSubmit={(e) => e.preventDefault()}
        >
          {tab === "reconstitute" ? (
            <>
              <Step index={1} title="What is in the vial?">
                <label
                  htmlFor={`${uid}-amount`}
                  className="type-label block text-carbon/62"
                >
                  Compound quantity
                </label>
                <div className="mt-2 flex items-baseline gap-3">
                  <input
                    id={`${uid}-amount`}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={field}
                  />
                  <span className="type-label shrink-0 text-carbon/45">mg</span>
                </div>
                <p className="type-body-s mt-3 text-carbon/45">
                  Use the assayed content from the certificate where it differs
                  from the label strength.
                </p>

                <p className="type-label mt-8 mb-3 text-carbon/62">Vial size</p>
                <Segmented
                  label="Vial size"
                  value={String(vial)}
                  onChange={(v) =>
                    setVial(Number(v) as (typeof VIAL_SIZES)[number])
                  }
                  options={VIAL_SIZES.map((v) => ({
                    value: String(v),
                    label: `${v} mL`,
                  }))}
                />
              </Step>

              <Step index={2} title="How much diluent?">
                <label
                  htmlFor={`${uid}-diluent`}
                  className="type-label block text-carbon/62"
                >
                  Bacteriostatic water to add
                </label>
                <div className="mt-2 flex items-baseline gap-3">
                  <input
                    id={`${uid}-diluent`}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.1"
                    value={diluent}
                    onChange={(e) => setDiluent(e.target.value)}
                    className={field}
                  />
                  <span className="type-label shrink-0 text-carbon/45">mL</span>
                </div>
                <p className="type-body-s mt-3 text-carbon/45">
                  This is what sets the concentration. The quantity in the vial
                  never changes.
                </p>
                {recon?.overVial ? (
                  <p className="type-body-s mt-4 border border-carbon/20 bg-mist/60 p-4 text-carbon">
                    That is more diluent than a {vial} mL vial will hold.
                  </p>
                ) : null}
              </Step>

              <Step index={3} title="What quantity per withdrawal?">
                <label
                  htmlFor={`${uid}-dose`}
                  className="type-label block text-carbon/62"
                >
                  Quantity to draw
                </label>
                <div className="mt-2 flex items-baseline gap-3">
                  <input
                    id={`${uid}-dose`}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={dose}
                    onChange={(e) => setDose(e.target.value)}
                    className={field}
                  />
                </div>
                <div className="mt-5">
                  <Segmented
                    label="Quantity unit"
                    value={unit}
                    onChange={setUnit}
                    options={[
                      { value: "mg", label: "mg" },
                      { value: "mcg", label: "mcg" },
                    ]}
                  />
                </div>
              </Step>

              <Step index={4} title="How often is it drawn?">
                <Segmented
                  label="Frequency"
                  value={frequency}
                  onChange={setFrequency}
                  options={(
                    Object.keys(FREQUENCIES) as Frequency[]
                  ).map((f) => ({
                    value: f,
                    label: FREQUENCIES[f].label,
                    note: FREQUENCIES[f].note,
                  }))}
                />
                <p className="type-body-s mt-4 text-carbon/45">
                  Used only to work out how long a vial lasts at that rate.
                </p>
              </Step>
            </>
          ) : (
            <>
              <Step index={1} title="First vial">
                <label
                  htmlFor={`${uid}-mixa`}
                  className="type-label block text-carbon/62"
                >
                  Compound quantity
                </label>
                <div className="mt-2 flex items-baseline gap-3">
                  <input
                    id={`${uid}-mixa`}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.1"
                    value={mixA}
                    onChange={(e) => setMixA(e.target.value)}
                    className={field}
                  />
                  <span className="type-label shrink-0 text-carbon/45">mg</span>
                </div>
              </Step>

              <Step index={2} title="Second vial">
                <label
                  htmlFor={`${uid}-mixb`}
                  className="type-label block text-carbon/62"
                >
                  Compound quantity
                </label>
                <div className="mt-2 flex items-baseline gap-3">
                  <input
                    id={`${uid}-mixb`}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.1"
                    value={mixB}
                    onChange={(e) => setMixB(e.target.value)}
                    className={field}
                  />
                  <span className="type-label shrink-0 text-carbon/45">mg</span>
                </div>
              </Step>

              <Step index={3} title="Combined volume">
                <label
                  htmlFor={`${uid}-mixv`}
                  className="type-label block text-carbon/62"
                >
                  Total diluent across both
                </label>
                <div className="mt-2 flex items-baseline gap-3">
                  <input
                    id={`${uid}-mixv`}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.1"
                    value={mixVolume}
                    onChange={(e) => setMixVolume(e.target.value)}
                    className={field}
                  />
                  <span className="type-label shrink-0 text-carbon/45">mL</span>
                </div>
                <p className="type-body-s mt-3 text-carbon/45">
                  Combining changes the concentration of both compounds and
                  binds them to the shorter of the two stability windows.
                </p>
              </Step>
            </>
          )}
        </form>

        {/* Recipe */}
        <div className="lg:col-span-5 lg:col-start-8">
          <div className="lg:sticky lg:top-32">
            <div className="border border-carbon/12 bg-mist/45 p-7 md:p-9">
              <p className="type-label text-carbon/45">Your recipe</p>

              <div aria-live="polite">
                {tab === "reconstitute" && recon ? (
                  <>
                    <ol className="mt-7 border-t border-carbon/12">
                      <li className="flex gap-5 border-b border-carbon/12 py-5">
                        <span className="type-label tabular-nums text-carbon/35">
                          1
                        </span>
                        <span>
                          <span className="type-title-s block text-carbon">
                            Add {fmt(Number.parseFloat(diluent), 2)} mL diluent
                          </span>
                          <span className="type-body-s mt-1 block text-carbon/55">
                            Gives {fmt(recon.concentration)} mg/mL
                          </span>
                        </span>
                      </li>
                      <li className="flex gap-5 border-b border-carbon/12 py-5">
                        <span className="type-label tabular-nums text-carbon/35">
                          2
                        </span>
                        <span>
                          <span className="type-title-s block text-carbon">
                            Draw{" "}
                            {recon.drawMl === null
                              ? "—"
                              : `${fmt(recon.drawMl, 3)} mL`}
                          </span>
                          <span className="type-body-s mt-1 block text-carbon/55">
                            Contains {dose} {unit}
                          </span>
                        </span>
                      </li>
                    </ol>

                    <SyringeBarrel
                      units={recon.units}
                      max={SYRINGES[syringe].units}
                    />

                    <p className="type-body-s mt-4 text-carbon/55">
                      Volume:{" "}
                      {recon.drawMl === null ? "—" : `${fmt(recon.drawMl, 3)} mL`}
                    </p>

                    <p className="type-label mt-8 mb-3 text-carbon/62">
                      Syringe
                    </p>
                    <Segmented
                      label="Syringe type"
                      value={syringe}
                      onChange={setSyringe}
                      options={(Object.keys(SYRINGES) as Syringe[]).map((s) => ({
                        value: s,
                        label: SYRINGES[s].label,
                      }))}
                    />

                    {recon.overDraw ? (
                      <p className="type-body-s mt-5 border border-carbon/20 bg-soft p-4 text-carbon">
                        That volume exceeds the barrel you have selected.
                      </p>
                    ) : null}

                    <dl className="mt-9 grid grid-cols-2 gap-6 border-t border-carbon/12 pt-7">
                      <div>
                        <dt className="type-label text-carbon/45">
                          Withdrawals
                        </dt>
                        <dd className="type-title mt-2 tabular-nums text-carbon">
                          {recon.doses ?? "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="type-label text-carbon/45">
                          At {FREQUENCIES[frequency].note}
                        </dt>
                        <dd className="type-title mt-2 tabular-nums text-carbon">
                          {recon.days === null ? "—" : `${recon.days} d`}
                        </dd>
                      </div>
                    </dl>

                    <button
                      type="button"
                      onClick={reset}
                      className="type-label mt-9 min-h-11 border border-carbon/20 px-7 py-3.5 text-carbon transition-colors duration-400 ease-brand hover:border-carbon"
                    >
                      Start over
                    </button>
                  </>
                ) : null}

                {tab === "mix" && mix ? (
                  <dl className="mt-7 border-t border-carbon/12">
                    <div className="flex items-baseline justify-between border-b border-carbon/12 py-5">
                      <dt className="type-label text-carbon/45">
                        Combined quantity
                      </dt>
                      <dd className="type-title tabular-nums text-carbon">
                        {fmt(mix.total)} mg
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between border-b border-carbon/12 py-5">
                      <dt className="type-label text-carbon/45">
                        Total volume
                      </dt>
                      <dd className="type-title tabular-nums text-carbon">
                        {fmt(mix.v)} mL
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between border-b border-carbon/12 py-5">
                      <dt className="type-label text-carbon/45">
                        Concentration
                      </dt>
                      <dd className="type-display-s tabular-nums text-carbon">
                        {fmt(mix.concentration)} mg/mL
                      </dd>
                    </div>
                  </dl>
                ) : null}

                {(tab === "reconstitute" && !recon) ||
                (tab === "mix" && !mix) ? (
                  <p className="type-body mt-7 text-carbon/55">
                    Enter a quantity and a volume, both greater than zero, and
                    the recipe resolves here.
                  </p>
                ) : null}
              </div>
            </div>

            <p className="type-label mt-6 text-carbon/40">
              For laboratory and research use only. Not a dosing protocol.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
