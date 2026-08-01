import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { cn } from "@/lib/utils";

/** The small wide-tracked label that opens every section. */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("type-label opacity-60", className)}>{children}</p>
  );
}

/** Zero-padded index, e.g. `01 / 08`. */
export function Index({
  value,
  total,
  className,
}: {
  value: number;
  total?: number;
  className?: string;
}) {
  return (
    <span className={cn("type-label tabular-nums opacity-60", className)}>
      {String(value).padStart(2, "0")}
      {total ? ` / ${String(total).padStart(2, "0")}` : null}
    </span>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  /** Newlines become hard line breaks in the reveal. */
  title: string;
  body?: string;
  /** Rendered under the body — usually a CTA. */
  action?: ReactNode;
  align?: "left" | "center";
  size?: "display" | "display-s";
  as?: "h1" | "h2" | "h3";
  className?: string;
}

/**
 * The standard section opener: eyebrow, masked headline reveal, supporting
 * paragraph, optional action. Used across every page so the vertical rhythm
 * and hierarchy stay identical throughout the site.
 */
export function SectionHeading({
  eyebrow,
  title,
  body,
  action,
  align = "left",
  size = "display-s",
  as = "h2",
  className,
}: SectionHeadingProps) {
  const centred = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col",
        centred && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <Reveal distance={12}>
          <Eyebrow className="mb-8">{eyebrow}</Eyebrow>
        </Reveal>
      ) : null}

      <SplitText
        as={as}
        text={title}
        className={cn(
          size === "display" ? "type-display" : "type-display-s",
          "max-w-[18ch]",
          centred && "max-w-[22ch]",
        )}
      />

      {body ? (
        <Reveal delay={0.12} className={cn("mt-8 max-w-[52ch]", centred && "mx-auto")}>
          <p className="type-body opacity-60">{body}</p>
        </Reveal>
      ) : null}

      {action ? (
        <Reveal delay={0.2} className="mt-12">
          {action}
        </Reveal>
      ) : null}
    </div>
  );
}
