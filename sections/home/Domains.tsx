import { DomainsIndex } from "@/components/home/DomainsIndex";
import { categories } from "@/data/categories";

/**
 * The eight research domains as the reference presents them: a continuous
 * dark passage where the oversized names stack through the page and the one
 * in focus unfolds inside the corner frame. All interaction lives in
 * DomainsIndex; this stays a server shell so the category data is the only
 * thing crossing the boundary.
 *
 * Shares its ground with the Research introduction above — no seam between
 * the two — and hands off to the collection below on the same near-black.
 */
export function Domains() {
  return (
    <section className="relative -mt-px bg-onyx text-soft">
      <DomainsIndex categories={categories} />
    </section>
  );
}
