/**
 * Display formatting.
 *
 * Dates are formatted with a fixed locale rather than the visitor's, so the
 * statically exported HTML matches what the client renders and no hydration
 * mismatch appears on a machine set to another locale.
 */

const DATE = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const DATE_SHORT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** "18 June 2026" */
export function formatDate(iso: string) {
  return DATE.format(new Date(`${iso}T00:00:00Z`));
}

/** "18 Jun 2026" */
export function formatDateShort(iso: string) {
  return DATE_SHORT.format(new Date(`${iso}T00:00:00Z`));
}

/** Strip the percent sign and parse, for meters and comparisons. */
export function purityValue(purity: string) {
  return Number.parseFloat(purity);
}
