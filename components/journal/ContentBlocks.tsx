import type { JournalBlock } from "@/data/journal";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

/**
 * Block renderer.
 *
 * The Journal and the Science section share one content model, so they share
 * one renderer. Adding a block type is a change here and a change to the union
 * in `data/journal.ts` — never a change to a page.
 *
 * Blocks reveal on scroll individually, which gives long-form reading the same
 * measured rhythm as the rest of the site without animating each paragraph
 * into unreadability.
 */
export function ContentBlocks({
  blocks,
  className,
}: {
  blocks: JournalBlock[];
  className?: string;
}) {
  return (
    <div className={cn("max-w-prose", className)}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <Reveal key={i} distance={16}>
                <h2 className="type-display-s mt-20 first:mt-0">{block.text}</h2>
              </Reveal>
            );

          case "paragraph":
            return (
              <Reveal key={i} distance={16}>
                <p className="type-body mt-7 text-carbon/72">{block.text}</p>
              </Reveal>
            );

          case "list":
            return (
              <Reveal key={i} distance={16}>
                <ul className="mt-9 space-y-4 border-l border-carbon/12 pl-7">
                  {block.items.map((item) => (
                    <li key={item} className="type-body text-carbon/72">
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );

          case "callout":
            return (
              <Reveal key={i} distance={16}>
                <aside className="mt-12 border border-carbon/12 bg-mist/50 p-8 md:p-10">
                  <p className="type-label text-carbon/62">{block.title}</p>
                  <p className="type-body mt-5 text-carbon">{block.text}</p>
                </aside>
              </Reveal>
            );

          case "quote":
            return (
              <Reveal key={i} distance={16}>
                <blockquote className="mt-14 border-l-2 border-carbon/25 pl-8">
                  <p className="type-editorial text-carbon">{block.text}</p>
                  {block.attribution ? (
                    <footer className="type-label mt-6 text-carbon/55">
                      {block.attribution}
                    </footer>
                  ) : null}
                </blockquote>
              </Reveal>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
