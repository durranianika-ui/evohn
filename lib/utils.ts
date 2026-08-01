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
