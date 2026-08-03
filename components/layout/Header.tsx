"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Wordmark } from "@/components/ui/Wordmark";
import { WhatsAppCTA } from "@/components/common/WhatsAppCTA";
import { NavPanel } from "./NavPanel";
import { MobileNav } from "./MobileNav";
import { nav, site } from "@/data/site";
import { cn } from "@/lib/utils";

/** Distance scrolled before the bar commits to its solid state. */
const SOLID_AT = 72;
/** Grace period before a hovered panel closes, so a diagonal cursor survives. */
const CLOSE_DELAY = 140;

/**
 * Primary navigation.
 *
 * Transparent over the hero and light-on-dark; solid, translucent and
 * dark-on-light once the page has moved. Opening a dropdown also commits the
 * bar to its solid state, so a light panel never hangs off a transparent bar.
 *
 * Panels open on hover and on keyboard focus. Pointer intent is forgiving — a
 * short close delay lets the cursor cut the corner between trigger and panel
 * without the panel collapsing underneath it.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SOLID_AT);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close everything when the route changes. Adjusting state during render
  // rather than in an effect avoids a frame showing the old menu over the
  // new page.
  const [routeAtOpen, setRouteAtOpen] = useState(pathname);
  if (pathname !== routeAtOpen) {
    setRouteAtOpen(pathname);
    if (menuOpen) setMenuOpen(false);
    if (openKey) setOpenKey(null);
  }

  // Lock the page behind the mobile drawer.
  useEffect(() => {
    if (!menuOpen) return;
    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = overflow;
    };
  }, [menuOpen]);

  // Escape closes whichever surface is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenuOpen(false);
      setOpenKey(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const cancelClose = () => window.clearTimeout(closeTimer.current);
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenKey(null), CLOSE_DELAY);
  };

  const openItem = openKey ? nav.find((i) => i.href === openKey) : undefined;
  const solid = scrolled || openKey !== null;
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
            ? "border-b border-carbon/10 bg-soft/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
        onMouseLeave={scheduleClose}
      >
        <div className="container-content flex h-18 items-center justify-between gap-6">
          <Link
            href="/"
            aria-label={`${site.name} — home`}
            onFocus={() => setOpenKey(null)}
            className={cn(
              "transition-colors duration-500 ease-brand",
              onDark ? "text-soft" : "text-carbon",
            )}
          >
            <Wordmark className="text-[1.05rem]" />
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center xl:flex xl:gap-7 2xl:gap-10"
          >
            {nav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const hasPanel = Boolean(item.menu || item.mega);
              const isOpen = openKey === item.href;

              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => {
                    cancelClose();
                    setOpenKey(hasPanel ? item.href : null);
                  }}
                >
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    aria-expanded={hasPanel ? isOpen : undefined}
                    onFocus={() => setOpenKey(hasPanel ? item.href : null)}
                    className={cn(
                      "type-label group/nav relative flex items-center gap-1.5 py-6",
                      "transition-colors duration-500 ease-brand",
                      onDark
                        ? "text-soft/65 hover:text-soft"
                        : "text-carbon/62 hover:text-carbon",
                      (active || isOpen) &&
                        (onDark ? "text-soft" : "text-carbon"),
                    )}
                  >
                    {item.label}
                    {hasPanel ? (
                      <span
                        aria-hidden
                        className={cn(
                          "block size-[3px] rounded-full bg-current",
                          "transition-opacity duration-400 ease-brand",
                          isOpen ? "opacity-100" : "opacity-0",
                        )}
                      />
                    ) : null}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute bottom-4 left-0 h-px bg-current",
                        "transition-[width] duration-500 ease-brand",
                        active || isOpen
                          ? "w-full"
                          : "w-0 group-hover/nav:w-full",
                        "motion-reduce:transition-none",
                      )}
                    />
                  </Link>

                  <AnimatePresence>
                    {isOpen && hasPanel ? (
                      <div onMouseEnter={cancelClose}>
                        <NavPanel
                          item={item}
                          onNavigate={() => setOpenKey(null)}
                        />
                      </div>
                    ) : null}
                  </AnimatePresence>
                </div>
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
                "relative z-[70] -mr-2 flex size-12 items-center justify-center xl:hidden",
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

      {/* Scrim behind an open mega panel — dims the page without blocking it. */}
      {openItem?.mega ? (
        <div
          aria-hidden
          className="fixed inset-0 z-40 bg-carbon/25 backdrop-blur-[2px]"
          onMouseEnter={scheduleClose}
        />
      ) : null}

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
