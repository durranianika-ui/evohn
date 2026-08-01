"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Wordmark } from "@/components/ui/Wordmark";
import { WhatsAppCTA } from "@/components/common/WhatsAppCTA";
import { EASE_BRAND } from "@/constants/motion";
import { nav, site } from "@/data/site";
import { cn } from "@/lib/utils";

/** Distance scrolled before the bar commits to its solid state. */
const SOLID_AT = 72;

/**
 * Floating navigation.
 *
 * Transparent over the hero, then settling into a translucent light bar once
 * the page has moved. Every route on this site opens on a dark hero, so the
 * top state is always light-on-dark.
 */
export function Header() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > SOLID_AT);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the overlay whenever the route changes. Adjusting state during
  // render (rather than in an effect) avoids a second render pass showing
  // the menu still open over the new page.
  const [routeAtOpen, setRouteAtOpen] = useState(pathname);
  if (pathname !== routeAtOpen) {
    setRouteAtOpen(pathname);
    if (menuOpen) setMenuOpen(false);
  }

  // Lock the page behind the overlay, and restore on close.
  useEffect(() => {
    if (!menuOpen) return;
    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = overflow;
    };
  }, [menuOpen]);

  // Escape closes the overlay.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const onDark = !solid || menuOpen;

  return (
    <>
      <a
        href="#main"
        className={cn(
          "type-label sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4",
          "focus:z-[80] focus:bg-carbon focus:px-5 focus:py-3 focus:text-soft",
        )}
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50",
          "transition-[background-color,border-color,backdrop-filter] duration-700 ease-brand",
          solid && !menuOpen
            ? "border-b border-carbon/10 bg-soft/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="container-content flex h-18 items-center justify-between gap-8">
          <Link
            href="/"
            aria-label={`${site.name} — home`}
            className={cn(
              "transition-colors duration-500 ease-brand",
              onDark ? "text-soft" : "text-carbon",
            )}
          >
            <Wordmark className="text-[1.05rem]" />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-10 lg:flex">
            {nav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "type-label group/nav relative transition-colors duration-500 ease-brand",
                    onDark
                      ? "text-soft/65 hover:text-soft"
                      : "text-carbon/62 hover:text-carbon",
                    active && (onDark ? "text-soft" : "text-carbon"),
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute -bottom-1.5 left-0 h-px bg-current transition-[width] duration-500 ease-brand",
                      active ? "w-full" : "w-0 group-hover/nav:w-full",
                      "motion-reduce:transition-none",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <WhatsAppCTA
              intent="specialist"
              variant="outline"
              tone={onDark ? "dark" : "light"}
              className="hidden px-6 py-3 md:inline-flex"
            />

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="primary-menu"
              className={cn(
                "relative z-[70] -mr-2 flex size-11 items-center justify-center lg:hidden",
                "transition-colors duration-500 ease-brand",
                onDark ? "text-soft" : "text-carbon",
              )}
            >
              <span className="sr-only">
                {menuOpen ? "Close menu" : "Open menu"}
              </span>
              <span aria-hidden className="relative block h-3 w-6">
                <span
                  className={cn(
                    "absolute left-0 h-px w-full bg-current transition-all duration-500 ease-brand",
                    menuOpen ? "top-1/2 rotate-45" : "top-0 rotate-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 h-px w-full bg-current transition-all duration-500 ease-brand",
                    menuOpen ? "top-1/2 -rotate-45" : "top-full rotate-0",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="primary-menu"
            className="fixed inset-0 z-[60] bg-ink lg:hidden"
            initial={{ opacity: 0, y: reduced ? 0 : -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -16 }}
            transition={{ duration: reduced ? 0.15 : 0.55, ease: EASE_BRAND }}
          >
            <div className="container-content flex h-full flex-col justify-between pt-28 pb-12">
              <nav aria-label="Primary" className="flex flex-col">
                {nav.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: reduced ? 0 : 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: reduced ? 0.15 : 0.6,
                      delay: reduced ? 0 : 0.1 + i * 0.06,
                      ease: EASE_BRAND,
                    }}
                    className="border-b border-soft/12"
                  >
                    <Link
                      href={item.href}
                      className="type-display-s block py-6 text-soft"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="flex flex-col gap-6">
                <WhatsAppCTA
                  intent="specialist"
                  tone="dark"
                  className="w-full"
                />
                <p className="type-label text-soft/55">{site.name} — Precision Compounds</p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
