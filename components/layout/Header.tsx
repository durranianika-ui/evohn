"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Wordmark } from "@/components/ui/Wordmark";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { EnquiryDrawer } from "@/components/enquiry/EnquiryDrawer";
import { NavPanel } from "./NavPanel";
import { MobileNav } from "./MobileNav";
import { MenuPanel } from "./MenuPanel";
import { SearchIcon, EnquiryIcon, MenuIcon } from "./UtilityIcons";
import { NavMark, NavDot } from "./NavMark";
import { useEnquiry } from "@/lib/enquiry";
import { nav, site } from "@/data/site";
import { cn } from "@/lib/utils";

/** Distance scrolled before the bar commits to its solid state. */
const SOLID_AT = 72;
/** Grace period before a hovered panel closes, so a diagonal cursor survives. */
const CLOSE_DELAY = 140;

/**
 * Primary navigation.
 *
 * Seven destinations in the centre, three utility controls at the right,
 * wordmark at the left. Transparent and light-on-dark over the hero — every
 * route on this site opens dark, which is what makes a single top state
 * possible — then solid, translucent and dark-on-light once the page moves.
 *
 * ## Pointer intent
 *
 * Panels open on hover and on keyboard focus, and close after a short grace
 * period. The grace is what lets a cursor cut the corner from the trigger to
 * the panel without it collapsing underneath; the panel's own wrapper carries
 * the vertical offset as padding, so there is no dead gap to cross either.
 *
 * ## Layout stability
 *
 * Every overlay this bar opens is `position: fixed`, and the scroll lock sets
 * `overflow: hidden` on the root without touching `position`. Nothing here
 * reflows the document when a menu opens.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const pathname = usePathname();
  const { count, ready } = useEnquiry();

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
    if (mobileOpen) setMobileOpen(false);
    if (menuOpen) setMenuOpen(false);
    if (searchOpen) setSearchOpen(false);
    if (enquiryOpen) setEnquiryOpen(false);
    if (openKey) setOpenKey(null);
  }

  // Lock the page behind the mobile drawer. The other surfaces manage their
  // own lock, because each also traps focus and must undo both together.
  useEffect(() => {
    if (!mobileOpen) return;
    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = overflow;
    };
  }, [mobileOpen]);

  // Escape closes the two surfaces that do not trap focus themselves.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMobileOpen(false);
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

  const solid = scrolled || openKey !== null;
  const anyOverlay = mobileOpen || menuOpen;
  const onDark = !solid || anyOverlay;

  const utility = cn(
    "relative flex size-11 items-center justify-center transition-colors duration-500 ease-brand",
    onDark ? "text-soft/75 hover:text-soft" : "text-carbon/65 hover:text-carbon",
  );

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
          solid && !anyOverlay
            ? "border-b border-carbon/10 bg-soft/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
        onMouseLeave={scheduleClose}
      >
        <div className="container-content flex h-18 items-center justify-between gap-4">
          <Link
            href="/"
            aria-label={`${site.name} — home`}
            onFocus={() => setOpenKey(null)}
            className={cn(
              "shrink-0 transition-colors duration-500 ease-brand",
              onDark ? "text-soft" : "text-carbon",
            )}
          >
            <Wordmark className="text-[1.05rem]" />
          </Link>

          <nav
            aria-label="Primary"
            className="hidden flex-1 items-center justify-center xl:flex xl:gap-6 2xl:gap-8"
          >
            {nav.map((item) => {
              const key = item.href ?? item.label;
              const panelId = `nav-panel-${item.label.toLowerCase()}`;
              const active = item.href
                ? pathname === item.href || pathname.startsWith(`${item.href}/`)
                : (item.menu?.links.some((l) => pathname === l.href) ?? false);
              const isOpen = openKey === key;

              const lit = active || isOpen;

              const face = cn(
                "type-label group/nav relative flex h-10 items-center gap-2",
                "transition-colors duration-500 ease-brand",
                onDark
                  ? "text-soft/65 hover:text-soft"
                  : "text-carbon/62 hover:text-carbon",
                lit && (onDark ? "text-soft" : "text-carbon"),
              );

              // The registration mark replaces the underline rule: a frame
              // around the item and a dot before the label, both of which
              // pin on for the current route.
              const rule = (
                <NavMark active={lit} tone={onDark ? "dark" : "light"} />
              );

              return (
                <div
                  key={key}
                  className="relative"
                  // Guarded to a real mouse. A touch tap synthesises
                  // pointerenter *before* click, so an unguarded hover-open
                  // would open the panel and the click would immediately
                  // toggle it shut — leaving the menu unreachable by tap.
                  onPointerEnter={(e) => {
                    if (e.pointerType !== "mouse") return;
                    cancelClose();
                    setOpenKey(item.menu ? key : null);
                  }}
                >
                  {item.menu ? (
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      aria-controls={isOpen ? panelId : undefined}
                      onFocus={() => setOpenKey(key)}
                      onClick={() => setOpenKey(isOpen ? null : key)}
                      className={face}
                    >
                      <NavDot active={lit} />
                      {item.label}
                      <span
                        aria-hidden
                        className={cn(
                          "block transition-transform duration-400 ease-brand",
                          isOpen && "rotate-180",
                        )}
                      >
                        <svg
                          width="9"
                          height="6"
                          viewBox="0 0 9 6"
                          fill="none"
                          className="block"
                        >
                          <path
                            d="M1 1l3.5 3.5L8 1"
                            stroke="currentColor"
                            strokeWidth="1.2"
                          />
                        </svg>
                      </span>
                      {rule}
                    </button>
                  ) : (
                    <Link
                      href={item.href!}
                      aria-current={active ? "page" : undefined}
                      onFocus={() => setOpenKey(null)}
                      className={face}
                    >
                      <NavDot active={lit} />
                      {item.label}
                      {rule}
                    </Link>
                  )}

                  <AnimatePresence>
                    {isOpen && item.menu ? (
                      <div
                        onPointerEnter={(e) => {
                          if (e.pointerType === "mouse") cancelClose();
                        }}
                      >
                        <NavPanel
                          item={item}
                          id={panelId}
                          onNavigate={() => setOpenKey(null)}
                        />
                      </div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Utility controls */}
          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
            <button
              type="button"
              onClick={() => {
                setOpenKey(null);
                setSearchOpen(true);
              }}
              aria-expanded={searchOpen}
              aria-haspopup="dialog"
              className={utility}
            >
              <span className="sr-only">Search</span>
              <SearchIcon className="size-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                setOpenKey(null);
                setEnquiryOpen(true);
              }}
              aria-expanded={enquiryOpen}
              aria-haspopup="dialog"
              className={utility}
            >
              {/* The count is announced, not just drawn, so a screen-reader
                  user hears the list grow as they add to it. */}
              <span className="sr-only">
                Enquiry list, {ready ? count : 0}{" "}
                {count === 1 ? "compound" : "compounds"}
              </span>
              <EnquiryIcon className="size-5" />
              {ready && count > 0 ? (
                <span
                  aria-hidden
                  className={cn(
                    "type-label absolute top-1 right-0.5 flex min-w-4 items-center justify-center rounded-pill px-1",
                    "text-[0.5625rem] leading-4 tracking-normal tabular-nums",
                    onDark ? "bg-soft text-carbon" : "bg-carbon text-soft",
                  )}
                >
                  {count}
                </span>
              ) : null}
            </button>

            {/* Desktop: the full site index. */}
            <button
              type="button"
              onClick={() => {
                setOpenKey(null);
                setMenuOpen((v) => !v);
              }}
              aria-expanded={menuOpen}
              aria-haspopup="dialog"
              aria-controls="utility-index"
              className={cn(utility, "z-[80] hidden xl:flex")}
            >
              <span className="sr-only">
                {menuOpen ? "Close site index" : "Open site index"}
              </span>
              <MenuIcon className="size-5" open={menuOpen} />
            </button>

            {/* Below xl: the full-screen drawer. */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="primary-menu"
              className={cn(utility, "z-[80] xl:hidden")}
            >
              <span className="sr-only">
                {mobileOpen ? "Close menu" : "Open menu"}
              </span>
              <MenuIcon className="size-5" open={mobileOpen} />
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <MenuPanel open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <EnquiryDrawer open={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </>
  );
}
