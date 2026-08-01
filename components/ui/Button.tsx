import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "ghost";
type Tone = "dark" | "light";

const base =
  "group/btn relative inline-flex items-center justify-center overflow-hidden " +
  "type-label px-8 py-4 transition-colors duration-[var(--dur,0.4s)] " +
  "[--dur:0.4s] focus-visible:outline-1 focus-visible:outline-offset-4";

/**
 * `tone` describes the surface the button sits ON, not the button itself.
 * A solid button on a dark surface is therefore light, and vice versa.
 */
const variants: Record<Variant, Record<Tone, string>> = {
  solid: {
    dark: "bg-soft text-carbon",
    light: "bg-carbon text-soft",
  },
  outline: {
    dark: "border border-soft/30 text-soft hover:border-soft",
    light: "border border-carbon/25 text-carbon hover:border-carbon",
  },
  ghost: {
    dark: "text-soft/70 hover:text-soft",
    light: "text-carbon/62 hover:text-carbon",
  },
};

interface LabelProps {
  children: ReactNode;
}

/**
 * The doubled label. On hover the visible copy slides up and out while an
 * identical copy rises to replace it, so the type appears to roll over.
 * The second copy is hidden from assistive technology.
 */
function RollingLabel({ children }: LabelProps) {
  return (
    <span className="relative block overflow-hidden">
      <span
        className={cn(
          "block transition-transform duration-500 ease-brand",
          "group-hover/btn:-translate-y-full motion-reduce:transition-none",
        )}
      >
        {children}
      </span>
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 block translate-y-full transition-transform duration-500",
          "ease-brand group-hover/btn:translate-y-0",
          "motion-reduce:hidden",
        )}
      >
        {children}
      </span>
    </span>
  );
}

interface ButtonBaseProps {
  children: ReactNode;
  variant?: Variant;
  tone?: Tone;
  className?: string;
}

/** Internal link CTA. */
export function ButtonLink({
  children,
  variant = "solid",
  tone = "light",
  className,
  ...props
}: ButtonBaseProps & ComponentProps<typeof Link>) {
  return (
    <Link className={cn(base, variants[variant][tone], className)} {...props}>
      <RollingLabel>{children}</RollingLabel>
    </Link>
  );
}

/** External CTA — used by the WhatsApp actions. */
export function ButtonExternal({
  children,
  variant = "solid",
  tone = "light",
  className,
  ...props
}: ButtonBaseProps & ComponentProps<"a">) {
  return (
    <a
      className={cn(base, variants[variant][tone], className)}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      <RollingLabel>{children}</RollingLabel>
    </a>
  );
}

/**
 * Text link with a rule that draws in from the left on hover.
 * The brand's quiet tertiary action.
 */
export function ArrowLink({
  children,
  className,
  ...props
}: { children: ReactNode; className?: string } & ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "group/arrow type-label inline-flex items-center gap-3 pb-1",
        className,
      )}
      {...props}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden
          className={cn(
            "absolute -bottom-1 left-0 h-px w-0 bg-current",
            "transition-[width] duration-500 ease-brand",
            "group-hover/arrow:w-full motion-reduce:transition-none",
          )}
        />
      </span>
      <span
        aria-hidden
        className={cn(
          "inline-block transition-transform duration-500 ease-brand",
          "group-hover/arrow:translate-x-1 motion-reduce:transition-none",
        )}
      >
        &#8594;
      </span>
    </Link>
  );
}
