import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names with Tailwind conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Zero-pad an index for the brand's `01 / 08` counters. */
export function pad(n: number, length = 2) {
  return String(n).padStart(length, "0");
}

/**
 * Stable, URL-safe anchor id from a heading.
 *
 * Lives here rather than beside `<TableOfContents>` because server components
 * generate the ids and client components consume them — a `"use client"`
 * module cannot export a function the server is allowed to call.
 */
export function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
