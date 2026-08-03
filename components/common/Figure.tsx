import Image from "next/image";
import { asset, hasAsset } from "@/lib/media";
import { cn } from "@/lib/utils";

/**
 * Photography slot.
 *
 * Photography is delivered separately from code. Rather than shipping broken
 * image requests while a shoot is outstanding, this asks the filesystem at
 * build time and falls back to a branded plate when the file is absent.
 *
 * Drop the real file into `public/` at the path given and it is picked up on
 * the next build with no code change. See `README.md` for the manifest of
 * every path the site expects.
 */
export function Figure({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  /** Small caption drawn on the fallback plate so empty slots stay legible. */
  placeholderLabel,
  /** Light plate on the warm ground, or dark plate for use over the ink. */
  tone = "light",
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  placeholderLabel?: string;
  tone?: "light" | "dark";
}) {
  const present = hasAsset(src);

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden",
        tone === "light"
          ? "bg-[radial-gradient(120%_90%_at_50%_18%,var(--color-mist)_0%,var(--color-warm)_58%,#b3aca4_100%)]"
          : "bg-[radial-gradient(120%_90%_at_50%_18%,var(--color-graphite)_0%,var(--color-onyx)_58%,var(--color-ink)_100%)]",
        className,
      )}
    >
      {present ? (
        <Image
          src={asset(src)}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center",
            tone === "light" ? "text-carbon/35" : "text-soft/30",
          )}
        >
          {/* Registration mark — the brand's stand-in for an absent frame. */}
          <span
            aria-hidden
            className="relative block size-10 border border-current/40"
          >
            <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current/40" />
            <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current/40" />
          </span>
          {placeholderLabel ? (
            <span className="type-label">{placeholderLabel}</span>
          ) : null}
        </div>
      )}
    </div>
  );
}
