import { cn } from "@/lib/utils";

/**
 * Loading placeholders.
 *
 * These reserve the same space the real content will occupy, so nothing
 * shifts when the content arrives. The shimmer stops entirely under
 * `prefers-reduced-motion`.
 *
 * DELIBERATELY NOT USED AS `loading.tsx`. A route-segment `loading.tsx`
 * creates a Suspense boundary, and Next's static prerender postpones that
 * boundary's content to be resumed at request time. Under `output: "export"`
 * there is no server to resume it, so the boundary never fills and the route
 * renders as a permanent skeleton. These are therefore used for the states a
 * static site genuinely has — client-side filtering and search — where the
 * work happens in the browser and there is something real to wait for.
 */

export function Skeleton({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "block animate-shimmer bg-[length:200%_100%] motion-reduce:animate-none",
        tone === "dark"
          ? "bg-[linear-gradient(90deg,rgba(246,245,242,0.06)_0%,rgba(246,245,242,0.13)_50%,rgba(246,245,242,0.06)_100%)]"
          : "bg-[linear-gradient(90deg,rgba(17,17,17,0.05)_0%,rgba(17,17,17,0.10)_50%,rgba(17,17,17,0.05)_100%)]",
        className,
      )}
    />
  );
}

/** The hero every interior route opens with. */
export function HeroSkeleton() {
  return (
    <section className="bg-ink">
      <div className="container-content pt-40 pb-24 md:pt-48 md:pb-32">
        <Skeleton tone="dark" className="h-3 w-40" />
        <Skeleton tone="dark" className="mt-10 h-14 w-full max-w-2xl" />
        <Skeleton tone="dark" className="mt-4 h-14 w-full max-w-xl" />
        <Skeleton tone="dark" className="mt-10 h-4 w-full max-w-3xl" />
        <Skeleton tone="dark" className="mt-3 h-4 w-full max-w-2xl" />
        <div className="mt-16 grid grid-cols-2 gap-6 border-t border-soft/12 pt-8 md:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i}>
              <Skeleton tone="dark" className="h-3 w-24" />
              <Skeleton tone="dark" className="mt-3 h-4 w-32" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** A grid of cards — the catalogue, the journal, the COA library. */
export function CardGridSkeleton({
  count = 6,
  aspect = "aspect-4/5",
}: {
  count?: number;
  aspect?: string;
}) {
  return (
    <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          <Skeleton className={cn("w-full", aspect)} />
          <Skeleton className="mt-7 h-3 w-28" />
          <Skeleton className="mt-4 h-6 w-44" />
          <Skeleton className="mt-4 h-3 w-full" />
          <Skeleton className="mt-2 h-3 w-4/5" />
        </div>
      ))}
    </div>
  );
}

/** Long-form reading — a Journal entry or a Science page. */
export function ProseSkeleton() {
  return (
    <div className="max-w-prose">
      <Skeleton className="h-8 w-2/3" />
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="mt-7">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-2.5 h-4 w-full" />
          <Skeleton className="mt-2.5 h-4 w-11/12" />
          <Skeleton className="mt-2.5 h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}

/** The default interior-route loading state: hero plus a card grid. */
export function PageSkeleton({
  count = 6,
  aspect,
}: {
  count?: number;
  aspect?: string;
}) {
  return (
    <>
      <HeroSkeleton />
      <section className="section-y bg-soft">
        <div className="container-content">
          <span className="sr-only" role="status">
            Loading
          </span>
          <CardGridSkeleton count={count} aspect={aspect} />
        </div>
      </section>
    </>
  );
}
