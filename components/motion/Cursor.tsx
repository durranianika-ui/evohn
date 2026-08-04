"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The pointer.
 *
 * A dot that follows the mouse and grows into a labelled disc over anything
 * worth clicking. It is deliberately unglamorous: no trailing particles, no
 * spring overshoot, no rotation. The brand is mechanical, and so is this.
 *
 * ## What it will not do
 *
 * It does not mount at all for a coarse pointer, a touch device, or a visitor
 * who has asked for reduced motion — those are the three cases where a
 * replaced cursor is a straight loss. The native arrow is only suppressed
 * (via `html[data-cursor="on"]` in `globals.css`) once this component has
 * decided to mount, so nothing can strand a visitor with no pointer at all.
 *
 * Text fields, selects and disabled controls keep their native cursor
 * unconditionally — replacing a caret costs precision and buys nothing.
 *
 * ## How an element declares a state
 *
 * Any element may carry `data-cursor="view" | "drag" | "text"` and an optional
 * `data-cursor-label`. Ordinary links and buttons need no attribute; they are
 * detected structurally. Resolution is one `closest()` per pointer move, which
 * is cheap and, unlike a global listener registry, cannot leak.
 *
 * ## Why there is no React state in the hot path
 *
 * Position is written straight to the DOM node inside a single
 * requestAnimationFrame loop. A `setState` per mouse move would re-render the
 * tree sixty times a second to move one absolutely-positioned dot.
 */

type CursorState = "default" | "link" | "view" | "drag" | "hidden";

/** Fraction of the remaining distance closed each frame. 1 would be instant. */
const FOLLOW = 0.22;
/** Below this, stop animating: the dot has arrived. */
const EPSILON = 0.1;

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>("default");
  const [label, setLabel] = useState<string | null>(null);
  const [down, setDown] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });
  const frame = useRef<number | null>(null);

  /* --- Should this exist at all? ---------------------------------------- */
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");

    const evaluate = () => setEnabled(fine.matches && !calm.matches);
    evaluate();

    // A visitor can dock a laptop, pair a mouse, or change the OS motion
    // setting mid-session. Re-evaluate rather than deciding once at mount.
    fine.addEventListener("change", evaluate);
    calm.addEventListener("change", evaluate);
    return () => {
      fine.removeEventListener("change", evaluate);
      calm.removeEventListener("change", evaluate);
    };
  }, []);

  /* --- Suppress the native arrow only while we are actually mounted ------ */
  useEffect(() => {
    if (!enabled) return;
    document.documentElement.dataset.cursor = "on";
    return () => {
      delete document.documentElement.dataset.cursor;
    };
  }, [enabled]);

  /* --- Follow ------------------------------------------------------------ */
  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      const dx = target.current.x - current.current.x;
      const dy = target.current.y - current.current.y;

      if (Math.abs(dx) < EPSILON && Math.abs(dy) < EPSILON) {
        // Settled. Stop the loop; the next move restarts it.
        frame.current = null;
        return;
      }

      current.current.x += dx * FOLLOW;
      current.current.y += dy * FOLLOW;

      const node = dotRef.current;
      if (node) {
        node.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%)`;
      }

      frame.current = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame.current === null) frame.current = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      // A pen or a touch contact reaching this listener means the media query
      // was optimistic. Fall back rather than fighting it.
      if (e.pointerType !== "mouse") {
        setEnabled(false);
        return;
      }

      target.current.x = e.clientX;
      target.current.y = e.clientY;

      const el = e.target instanceof Element ? e.target : null;

      // Native controls win outright — they keep their own cursor.
      if (el?.closest("input, textarea, select, [contenteditable], :disabled")) {
        setState("hidden");
        setLabel(null);
        start();
        return;
      }

      const declared = el?.closest<HTMLElement>("[data-cursor]");
      const declaredState = declared?.dataset.cursor;

      if (declaredState === "view" || declaredState === "drag") {
        setState(declaredState);
        setLabel(
          declared?.dataset.cursorLabel ??
            (declaredState === "view" ? "View" : "Drag"),
        );
      } else if (el?.closest('a[href], button, [role="button"], [role="tab"], label')) {
        setState("link");
        setLabel(declared?.dataset.cursorLabel ?? null);
      } else {
        setState("default");
        setLabel(null);
      }

      start();
    };

    const onLeave = () => setState("hidden");
    const onEnter = () => setState("default");
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
    };
  }, [enabled]);

  if (!enabled) return null;

  const sized =
    state === "view" || state === "drag"
      ? "size-24"
      : state === "link"
        ? "size-10"
        : "size-2";

  return (
    <div
      ref={dotRef}
      aria-hidden
      // `mix-blend-difference` inverts whatever is beneath, so the dot stays
      // legible over the site's black and soft-white sections alike without
      // needing to know which one it is over.
      className={[
        "pointer-events-none fixed top-0 left-0 z-[100] flex items-center justify-center rounded-full",
        "bg-soft mix-blend-difference",
        "transition-[width,height,opacity] duration-300 ease-brand",
        sized,
        state === "hidden" ? "opacity-0" : "opacity-100",
        down ? "scale-90" : "scale-100",
      ].join(" ")}
      style={{ willChange: "transform" }}
    >
      {label ? (
        <span className="type-label text-[0.5625rem] tracking-[0.18em] text-carbon mix-blend-difference">
          {label}
        </span>
      ) : null}
    </div>
  );
}
