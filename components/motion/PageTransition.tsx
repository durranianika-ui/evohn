"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_BRAND } from "@/constants/motion";
import { useReducedMotionSafe } from "@/lib/reduced-motion";

/**
 * Route transition.
 *
 * Keyed on pathname so each route mounts fresh and eases in. Deliberately an
 * enter-only animation: the App Router unmounts the outgoing tree before an
 * exit animation could finish, so an `AnimatePresence` exit here would either
 * be skipped or delay the paint of the incoming page.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotionSafe();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: reduced ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0.15 : 0.7, ease: EASE_BRAND }}
    >
      {children}
    </motion.div>
  );
}
