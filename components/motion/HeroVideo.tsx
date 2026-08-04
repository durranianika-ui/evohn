"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Full-bleed hero background film.
 *
 * The reference opens on an autoplaying, muted, inline loop behind the
 * statement. Same idea, EVOHN's own footage.
 *
 * ## What it will not do
 *
 * It does not play for a visitor who has asked for reduced motion — an
 * autoplaying film is precisely the thing that setting exists to stop — and it
 * does not play on a metered connection or in Data Saver. In either case the
 * poster frame stands in, so the composition is identical and only the motion
 * is missing.
 *
 * It is `aria-hidden` and carries no audio track: it is set dressing behind
 * the headline, not content, and nothing is lost by not perceiving it.
 *
 * The element is only mounted once we have decided it should play. Rendering
 * a `<video>` and then pausing it still costs the download.
 *
 * `src` and `poster` arrive already resolved against the deployment base
 * path. This component must not import `lib/media` to do that itself — that
 * module reads the filesystem for `hasAsset`, and pulling it into a client
 * bundle drags `node:fs` into the browser.
 */
export function HeroVideo({
  src,
  poster,
  className,
}: {
  src: string;
  /**
   * Shown before the first frame, and instead of the film when it is
   * suppressed. Base-path resolved by the caller.
   */
  poster?: string;
  className?: string;
}) {
  const [play, setPlay] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");

    // `connection` is not in the DOM lib and is absent on Safari and Firefox,
    // where the optional chain simply yields undefined and we play.
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;

    const cheap =
      connection?.saveData === true ||
      (connection?.effectiveType !== undefined &&
        /^(slow-)?2g$/.test(connection.effectiveType));

    const evaluate = () => setPlay(!calm.matches && !cheap);
    evaluate();

    calm.addEventListener("change", evaluate);
    return () => calm.removeEventListener("change", evaluate);
  }, []);

  useEffect(() => {
    if (!play) return;
    // Autoplay can still be refused by policy even when muted; there is no
    // control to fall back to, so a rejection just leaves the poster.
    //
    // `play()` is typed as returning a promise but older engines return
    // undefined, so the result is optional-chained rather than assumed.
    const started = ref.current?.play();
    void started?.catch(() => {});
  }, [play]);

  if (!play) {
    return poster ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={poster} alt="" aria-hidden className={className} />
    ) : null;
  }

  return (
    <video
      ref={ref}
      aria-hidden
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      className={className}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
