"use client";

import { useState, useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_BRAND } from "@/constants/motion";
import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/lib/reduced-motion";

export interface AccordionEntry {
  question: string;
  answer: string;
}

/**
 * Disclosure list.
 *
 * Built on real buttons with `aria-expanded` and `aria-controls`, so it is
 * operable by keyboard and announced correctly. The rule beneath each row
 * is the only decoration — the brand does not use chrome.
 */
export function Accordion({
  items,
  tone = "light",
  className,
}: {
  items: AccordionEntry[];
  tone?: "light" | "dark";
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const reduced = useReducedMotionSafe();
  const baseId = useId();
  const dark = tone === "dark";

  return (
    <div className={cn("w-full", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;

        return (
          <div
            key={item.question}
            className={cn(
              "border-b",
              dark ? "border-soft/12" : "border-carbon/12",
            )}
          >
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className={cn(
                  "group/row flex w-full items-start justify-between gap-8",
                  "py-7 text-left transition-opacity duration-300",
                  dark ? "text-soft" : "text-carbon",
                  !isOpen && "opacity-70 hover:opacity-100",
                )}
              >
                <span className="type-title-s max-w-[46ch]">{item.question}</span>

                {/* Plus that rotates to a minus. */}
                <span
                  aria-hidden
                  className="relative mt-1.5 block size-3.5 shrink-0"
                >
                  <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
                  <span
                    className={cn(
                      "absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current",
                      "transition-transform duration-500 ease-brand",
                      isOpen ? "scale-y-0" : "scale-y-100",
                      "motion-reduce:transition-none",
                    )}
                  />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: reduced ? 0.01 : 0.55,
                    ease: EASE_BRAND,
                  }}
                  className="overflow-hidden"
                >
                  <p
                    className={cn(
                      "type-body max-w-[62ch] pb-8",
                      dark ? "text-soft/55" : "text-carbon/62",
                    )}
                  >
                    {item.answer}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
