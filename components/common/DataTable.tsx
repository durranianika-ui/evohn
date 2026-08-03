import { cn } from "@/lib/utils";

/**
 * Reference table.
 *
 * Wide tables scroll inside their own container rather than forcing the page
 * body to scroll horizontally — the constraint that most often breaks an
 * otherwise sound layout on a narrow screen.
 */
export function DataTable({
  caption,
  head,
  rows,
  tone = "light",
  className,
}: {
  caption?: string;
  head: string[];
  rows: string[][];
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";

  return (
    <div className={cn("w-full", className)}>
      <div className="-mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
        <table className="w-full min-w-[38rem] border-collapse text-left">
          {caption ? (
            <caption
              className={cn(
                "type-label pb-6 text-left",
                dark ? "text-soft/55" : "text-carbon/62",
              )}
            >
              {caption}
            </caption>
          ) : null}

          <thead>
            <tr
              className={cn(
                "border-b",
                dark ? "border-soft/20" : "border-carbon/20",
              )}
            >
              {head.map((cell) => (
                <th
                  key={cell}
                  scope="col"
                  className={cn(
                    "type-label py-4 pr-6 align-bottom last:pr-0",
                    dark ? "text-soft/55" : "text-carbon/62",
                  )}
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={cn(
                  "border-b",
                  dark ? "border-soft/10" : "border-carbon/10",
                )}
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={cn(
                      "type-body-s py-5 pr-6 align-top last:pr-0",
                      j === 0
                        ? dark
                          ? "text-soft"
                          : "text-carbon"
                        : dark
                          ? "text-soft/55"
                          : "text-carbon/62",
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Key/value list. The two-column form used for specifications, where the
 * label is short and the value is the point.
 */
export function SpecList({
  items,
  tone = "light",
  columns = 1,
  className,
}: {
  items: { label: string; value: string; note?: string }[];
  tone?: "light" | "dark";
  columns?: 1 | 2;
  className?: string;
}) {
  const dark = tone === "dark";

  return (
    <dl
      className={cn(
        "w-full border-t",
        dark ? "border-soft/15" : "border-carbon/15",
        columns === 2 && "sm:grid sm:grid-cols-2 sm:gap-x-12",
        className,
      )}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            "flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b py-5",
            dark ? "border-soft/10" : "border-carbon/10",
          )}
        >
          <dt
            className={cn(
              "type-label",
              dark ? "text-soft/55" : "text-carbon/62",
            )}
          >
            {item.label}
          </dt>
          <dd className="flex flex-col items-end text-right">
            <span
              className={cn(
                "type-body-s tabular-nums",
                dark ? "text-soft" : "text-carbon",
              )}
            >
              {item.value}
            </span>
            {item.note ? (
              <span
                className={cn(
                  "type-body-s mt-1 max-w-[38ch]",
                  dark ? "text-soft/45" : "text-carbon/45",
                )}
              >
                {item.note}
              </span>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
