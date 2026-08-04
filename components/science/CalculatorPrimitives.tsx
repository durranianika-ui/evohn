"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { FormulaStep } from "@/lib/calculator";

/**
 * Shared controls for the three calculator modes.
 *
 * Extracted so Reconstitute, Mix and Blend cannot drift into three different
 * field treatments, and so the component tests can mount a single control in
 * isolation rather than the whole tool.
 */

export const fieldClass =
  "type-title w-full border-b border-carbon/20 bg-transparent py-2.5 text-carbon " +
  "transition-colors duration-400 ease-brand focus:border-carbon focus:outline-none " +
  "aria-[invalid=true]:border-carbon aria-[invalid=true]:bg-mist/60 " +
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none " +
  "[&::-webkit-outer-spin-button]:appearance-none";

export function Step({
  index,
  title,
  hint,
  children,
}: {
  index: number;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-carbon/12 pt-8">
      <div className="flex items-baseline gap-5">
        <span className="type-label tabular-nums text-carbon/35">
          {String(index).padStart(2, "0")}
        </span>
        <h3 className="type-title-s text-carbon">{title}</h3>
      </div>
      {hint ? (
        <p className="type-body-s mt-3 max-w-[54ch] text-carbon/50 sm:pl-10">
          {hint}
        </p>
      ) : null}
      <div className="mt-7 sm:pl-10">{children}</div>
    </section>
  );
}

/** A labelled numeric field with its unit rendered beside it. */
export function NumberField({
  id,
  label,
  value,
  onChange,
  suffix,
  step = "0.01",
  hint,
  invalid = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
  step?: string;
  hint?: string;
  invalid?: boolean;
}) {
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div>
      <label htmlFor={id} className="type-label block text-carbon/62">
        {label}
      </label>
      <div className="mt-2 flex items-baseline gap-3">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min="0"
          step={step}
          value={value}
          aria-invalid={invalid || undefined}
          aria-describedby={hintId}
          onChange={(e) => onChange(e.target.value)}
          className={fieldClass}
        />
        {suffix ? (
          <span className="type-label shrink-0 text-carbon/45">{suffix}</span>
        ) : null}
      </div>
      {hint ? (
        <p id={hintId} className="type-body-s mt-3 text-carbon/45">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Segmented control. Radio semantics, so arrow keys move between options. */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string;
  options: { value: T; label: string; note?: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("flex flex-wrap gap-2", className)}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            // Only the selected option is in the tab order; the arrow keys
            // move within the group, which is how a radio group behaves.
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              e.preventDefault();
              const i = options.findIndex((o) => o.value === value);
              const next =
                e.key === "ArrowRight"
                  ? (i + 1) % options.length
                  : (i - 1 + options.length) % options.length;
              onChange(options[next].value);
            }}
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
export function SyringeBarrel({
  units,
  max,
  volumeMl,
  capacityMl,
}: {
  units: number | null;
  /** Graduated marks, or `null` for a volumetric barrel read in millilitres. */
  max: number | null;
  volumeMl: number | null;
  capacityMl: number;
}) {
  const graduated = max !== null;
  const filled = graduated
    ? units === null
      ? 0
      : Math.min(100, (units / max) * 100)
    : volumeMl === null
      ? 0
      : Math.min(100, (volumeMl / capacityMl) * 100);

  const scaleMax = graduated ? max : capacityMl;
  const ticks = Array.from({ length: 11 }, (_, i) => (scaleMax / 10) * i);

  return (
    <div className="mt-8">
      <div className="flex items-baseline justify-between">
        <span className="type-label text-carbon/45">
          {graduated ? "Units" : "Millilitres"}
        </span>
        <span className="type-title tabular-nums text-carbon">
          {graduated
            ? units === null
              ? "—"
              : units.toFixed(1)
            : volumeMl === null
              ? "—"
              : volumeMl.toFixed(2)}
        </span>
      </div>

      <div
        className="relative mt-4 h-8 w-full border border-carbon/25 bg-soft"
        role="img"
        aria-label={
          graduated
            ? `Barrel graduated to ${max} units, filled to ${units?.toFixed(1) ?? "zero"}`
            : `Barrel of ${capacityMl} millilitres, filled to ${volumeMl?.toFixed(2) ?? "zero"}`
        }
      >
        <span
          className="absolute inset-y-0 left-0 bg-carbon/85 transition-[width] duration-500 ease-brand motion-reduce:transition-none"
          style={{ width: `${filled}%` }}
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
            <span key={t}>{graduated ? Math.round(t) : t.toFixed(1)}</span>
          ))}
      </div>
    </div>
  );
}

/** The shown working. Collapsed by default — it is reference, not result. */
export function Working({ steps }: { steps: FormulaStep[] }) {
  if (!steps.length) return null;

  return (
    <details className="mt-9 border-t border-carbon/12 pt-6">
      <summary className="type-label cursor-pointer list-none text-carbon/55 transition-colors duration-400 hover:text-carbon">
        Show the working
      </summary>
      <ol className="mt-6 space-y-5">
        {steps.map((step, i) => (
          <li key={step.expression} className="flex gap-5">
            <span className="type-label shrink-0 tabular-nums text-carbon/30">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0">
              <span className="type-body-s block text-carbon/62">
                {step.expression}
              </span>
              <span className="type-body-s mt-1.5 block break-words tabular-nums text-carbon">
                {step.substituted}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </details>
  );
}

/** Validation failures. Announced, so a keyboard user hears them appear. */
export function Errors({ errors }: { errors: string[] }) {
  if (!errors.length) return null;

  return (
    <div
      role="alert"
      className="mt-7 border border-carbon/25 bg-mist/70 p-6 text-carbon"
    >
      <p className="type-label">
        {errors.length === 1 ? "One value needs attention" : `${errors.length} values need attention`}
      </p>
      <ul className="mt-4 space-y-2">
        {errors.map((error) => (
          <li key={error} className="type-body-s text-carbon/72">
            {error}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Conditions worth flagging on a result that is nonetheless correct. */
export function Warnings({ warnings }: { warnings: string[] }) {
  if (!warnings.length) return null;

  return (
    <ul className="mt-7 space-y-3">
      {warnings.map((warning) => (
        <li
          key={warning}
          className="type-body-s border-l border-carbon/25 pl-5 text-carbon/62"
        >
          {warning}
        </li>
      ))}
    </ul>
  );
}
