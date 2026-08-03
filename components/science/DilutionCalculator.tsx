"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Reconstitution and dilution calculator.
 *
 * Arithmetic only. It converts between quantity, volume and concentration —
 * the three figures a preparation record needs — and shows the working so the
 * result can be checked rather than trusted.
 *
 * It deliberately does not suggest a quantity, a schedule or a target. Those
 * are properties of a study design, not of a calculator.
 */

const NUMERIC =
  "type-title w-full border-b border-carbon/20 bg-transparent py-3 text-carbon " +
  "transition-colors duration-400 ease-brand focus:border-carbon focus:outline-none " +
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none " +
  "[&::-webkit-outer-spin-button]:appearance-none";

function Field({
  id,
  label,
  hint,
  suffix,
  value,
  onChange,
  step = "0.1",
}: {
  id: string;
  label: string;
  hint: string;
  suffix: string;
  value: string;
  onChange: (v: string) => void;
  step?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="type-label block text-carbon/62">
        {label}
      </label>
      <div className="mt-3 flex items-baseline gap-3">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min="0"
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={NUMERIC}
        />
        <span className="type-label shrink-0 text-carbon/45">{suffix}</span>
      </div>
      <p className="type-body-s mt-3 text-carbon/45">{hint}</p>
    </div>
  );
}

function Result({
  label,
  value,
  note,
  emphasis = false,
}: {
  label: string;
  value: string;
  note: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        "border-b border-carbon/12 py-6",
        emphasis && "border-carbon/25",
      )}
    >
      <p className="type-label text-carbon/45">{label}</p>
      <p
        className={cn(
          "mt-3 tabular-nums text-carbon",
          emphasis ? "type-display-s" : "type-title",
        )}
      >
        {value}
      </p>
      <p className="type-body-s mt-3 text-carbon/55">{note}</p>
    </div>
  );
}

export function DilutionCalculator() {
  const uid = useId();
  const [quantity, setQuantity] = useState("5");
  const [volume, setVolume] = useState("2");
  const [target, setTarget] = useState("0.25");

  const result = useMemo(() => {
    const q = Number.parseFloat(quantity);
    const v = Number.parseFloat(volume);
    const t = Number.parseFloat(target);

    const valid =
      Number.isFinite(q) && Number.isFinite(v) && q > 0 && v > 0;
    if (!valid) return null;

    const concentration = q / v;
    const drawMl = Number.isFinite(t) && t > 0 ? t / concentration : null;

    return {
      concentration,
      drawMl,
      // A U-100 syringe is graduated in hundredths of a millilitre; the "unit"
      // reading is simply that graduation, which is why it is shown here.
      units: drawMl === null ? null : drawMl * 100,
      overdraw: drawMl !== null && drawMl > v,
    };
  }, [quantity, volume, target]);

  const fmt = (n: number, dp = 2) =>
    n.toLocaleString("en-GB", {
      minimumFractionDigits: dp,
      maximumFractionDigits: dp,
    });

  return (
    <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
      {/* Inputs */}
      <form
        className="flex flex-col gap-10 lg:col-span-5"
        onSubmit={(e) => e.preventDefault()}
      >
        <Field
          id={`${uid}-q`}
          label="Quantity in the vial"
          hint="Use the assayed content from the certificate rather than the label strength where the two differ."
          suffix="mg"
          value={quantity}
          onChange={setQuantity}
        />
        <Field
          id={`${uid}-v`}
          label="Diluent added"
          hint="The total volume of bacteriostatic or sterile water introduced. Record this — concentration is meaningless without it."
          suffix="mL"
          value={volume}
          onChange={setVolume}
        />
        <Field
          id={`${uid}-t`}
          label="Quantity to draw"
          hint="Optional. The amount of compound a single withdrawal is intended to contain."
          suffix="mg"
          value={target}
          onChange={setTarget}
          step="0.01"
        />

        <button
          type="button"
          onClick={() => {
            setQuantity("5");
            setVolume("2");
            setTarget("0.25");
          }}
          className="type-label self-start border border-carbon/20 px-7 py-4 text-carbon transition-colors duration-400 ease-brand hover:border-carbon"
        >
          Reset
        </button>
      </form>

      {/* Results */}
      <div className="lg:col-span-6 lg:col-start-7">
        <div aria-live="polite" className="border-t border-carbon/25">
          {result ? (
            <>
              <Result
                emphasis
                label="Concentration"
                value={`${fmt(result.concentration)} mg/mL`}
                note={`${quantity} mg ÷ ${volume} mL. This is the figure every subsequent calculation depends on.`}
              />
              {result.drawMl !== null ? (
                <>
                  <Result
                    label="Volume to withdraw"
                    value={`${fmt(result.drawMl, 3)} mL`}
                    note={`${target} mg ÷ ${fmt(result.concentration)} mg/mL.`}
                  />
                  <Result
                    label="On a U-100 graduation"
                    value={`${fmt(result.units!, 1)} units`}
                    note="A U-100 syringe is graduated in hundredths of a millilitre; this is that reading, not a dose."
                  />
                </>
              ) : null}
              {result.overdraw ? (
                <p className="type-body-s mt-6 border border-carbon/20 bg-mist/60 p-5 text-carbon">
                  The requested quantity exceeds what the vial contains at this
                  dilution. Either the target is too high or the diluent volume
                  is too low.
                </p>
              ) : null}
            </>
          ) : (
            <p className="type-body py-8 text-carbon/55">
              Enter a quantity and a diluent volume above, both greater than
              zero, and the concentration will resolve here.
            </p>
          )}
        </div>

        <div className="mt-10 border border-carbon/12 bg-mist/45 p-8">
          <p className="type-label text-carbon/45">The working</p>
          <ul className="type-body-s mt-5 space-y-2.5 text-carbon/68">
            <li>Concentration (mg/mL) = quantity (mg) ÷ diluent volume (mL)</li>
            <li>Volume to draw (mL) = target quantity (mg) ÷ concentration</li>
            <li>U-100 graduation = volume (mL) × 100</li>
          </ul>
          <p className="type-body-s mt-6 text-carbon/45">
            Doubling the diluent halves the concentration. The quantity in the
            vial has not changed — which is where most preparation errors begin.
          </p>
        </div>
      </div>
    </div>
  );
}
