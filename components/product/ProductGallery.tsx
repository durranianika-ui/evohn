"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_BRAND } from "@/constants/motion";
import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/lib/reduced-motion";

/**
 * Product gallery.
 *
 * Frames are rendered on the server and handed in, because the media
 * component decides between photography and the vector plate by inspecting
 * the filesystem. This component owns only the selection and the crossfade.
 */
export function ProductGallery({
  frames,
  productName,
}: {
  frames: ReactNode[];
  productName: string;
}) {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotionSafe();

  return (
    <div>
      <div className="relative aspect-4/5 w-full overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: reduced ? 1 : 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.12 : 0.7, ease: EASE_BRAND }}
          >
            {frames[index]}
          </motion.div>
        </AnimatePresence>
      </div>

      {frames.length > 1 ? (
        <div
          role="group"
          aria-label={`${productName} images`}
          className="mt-4 flex gap-3"
        >
          {frames.map((frame, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-pressed={i === index}
              aria-label={`View image ${i + 1} of ${frames.length}`}
              className={cn(
                "relative aspect-square w-20 overflow-hidden transition-opacity duration-400 ease-brand",
                i === index
                  ? "opacity-100 ring-1 ring-carbon/35"
                  : "opacity-45 hover:opacity-80",
              )}
            >
              <span aria-hidden className="pointer-events-none block h-full w-full">
                {frame}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
