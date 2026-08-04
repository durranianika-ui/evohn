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

/**
 * Distance scrolled before a downward move is allowed to hide the bar, in
 * viewports. The reference still shows its bar at 1200px and has hidden it by
 * 3000, so the threshold sits between; a viewport and a half puts it in the
 * same place at every screen size.
 */
const HIDE_AFTER_VIEWPORTS = 1.5;
/** Grace period before a hovered panel closes, so a diagonal cursor survives. */
const CLOSE_DELAY = 140;
/** Where the ground under the bar is sampled, in px from the top. */
const SAMPLE_Y = 84;

/** sRGB relative luminance, for deciding which way to set the bar's text. */
function luminance(rgb: string) {
  const m = rgb.match(/[\d.]+/g);
  if (!m || m.length < 3) return 0;
  const [r, g, b] = m.slice(0, 3).map(Number);
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** Alpha of a computed colour; 0 for `transparent` and for unparseable input. */
function alpha(rgb: string) {
  const m = rgb.match(/[\d.]+/g);
  if (!m) return 0;
  return m.length > 3 ? Number(m[3]) : 1;
}

/**
 * Primary navigation.
 *
 * Seven destinations in the centre, three utility controls at the right,
 * wordmark at the left.
 *
 * ## Behaviour, measured off the reference
 *
 * The bar is **always transparent** — no background, no border, no backdrop
 * blur at any scroll position — and it **hides on the way down and returns on
 * the way up**, travelling its own height over 400ms. Ours previously faded in
 * a light 85% ground with a 24px blur at 72px of scroll, which put a bright
 * bar across every dark section of the page and read nothing like the
 * reference.
 *
 * With no ground of its own, the bar has to take its contrast from whatever is
 * underneath it. Rather than tag every section on every route, it hit-tests
 * the point just below itself, walks up to the first element with an opaque
 * background and sets itself light or dark from that colour's luminance. One
 * hit-test per animation frame, and only while the page is moving.
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
  const [hidden, setHidden] = useState(false);
  const [lightGround, setLightGround] = useState(false);
  const barRef = useRef<HTMLElement>(null);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const pathname = usePathname();
  const { count, ready } = useEnquiry();

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const y = window.scrollY;
      /* Any upward movement brings it back, however small; only a downward
         move past the fold takes it away. The comparison is against the last
         *sampled* position, so a scroll that reverses inside one frame does
         not flicker the bar. */
      const down = y > lastY + 2;
      const up = y < lastY - 2;
      const threshold = window.innerHeight * HIDE_AFTER_VIEWPORTS;
      if (down && y > threshold) setHidden(true);
      else if (up || y <= threshold) setHidden(false);
      if (down || up) lastY = y;

      /* The ground under the bar. elementsFromPoint gives the whole stack at
         that point, so the bar and its own children are skipped and the first
         thing behind it that actually paints a colour wins. */
      /* jsdom has no hit-testing, so the tests that render this bar would
         throw on the first scroll frame. Without a reading the bar simply
         keeps the light-on-dark state every route opens in. */
      if (typeof document.elementsFromPoint !== "function") return;
      const stack = document.elementsFromPoint(24, SAMPLE_Y);
      for (const node of stack) {
        if (barRef.current?.contains(node)) continue;
        for (let el: Element | null = node; el; el = el.parentElement) {
          const bg = getComputedStyle(el).backgroundColor;
          if (alpha(bg) < 0.5) continue;
          setLightGround(luminance(bg) > 0.4);
          return;
        }
        break;
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
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

  const anyOverlay = mobileOpen || menuOpen;
  /* An open panel or drawer pins the bar in place: it is the thing the user
     is interacting with, and sliding it away under the cursor would be an
     accident, not an effect. */
  const away = hidden && !anyOverlay && openKey === null && !searchOpen && !enquiryOpen;
  const onDark = anyOverlay || !lightGround;

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
        ref={barRef}
        className={cn(
          "fixed inset-x-0 top-0 z-50 bg-transparent",
          /* 400ms, the reference's own figure for this travel. */
          "transition-transform duration-400 ease-brand motion-reduce:transition-none",
          away ? "-translate-y-full" : "translate-y-0",
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
                "type-label-lg group/nav relative flex h-10 items-center gap-2",
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
