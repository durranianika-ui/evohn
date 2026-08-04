"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { site } from "@/data/site";

/**
 * The enquiry list.
 *
 * EVOHN has no cart, because EVOHN has no checkout: this is a presentation
 * catalogue, prices are not published, and supply is agreed separately in
 * writing. Shipping a fake basket with a fake "buy" button would be a lie
 * rendered in HTML.
 *
 * What the visitor actually needs is the thing a cart is *for* — carrying a
 * selection from page to page and turning it into one message instead of six.
 * That is what this is: a persisted list of compounds, a live count in the
 * header, and a single composed enquiry at the end of it.
 *
 * Everything lives in the visitor's own browser. Nothing is transmitted, and
 * nothing is readable by us. See `/privacy`.
 */

export interface EnquiryItem {
  slug: string;
  name: string;
  /** Label line, e.g. "Weight Loss / GLP-1". Shown in the drawer. */
  subtitle: string;
  /** Presentation strength printed on the vial. Never a quantity to use. */
  dosage: string;
}

interface EnquiryContextValue {
  items: EnquiryItem[];
  count: number;
  /** False until the persisted list has been read, so SSR and first paint agree. */
  ready: boolean;
  has: (slug: string) => boolean;
  add: (item: EnquiryItem) => void;
  remove: (slug: string) => void;
  toggle: (item: EnquiryItem) => void;
  clear: () => void;
  /** WhatsApp deep link carrying the whole list. */
  href: string;
  /** The message body, exposed so the enquiry page can show it verbatim. */
  message: string;
}

const STORAGE_KEY = "evohn.enquiry.v1";
/** A list longer than this is a scraper or a stuck key, not a research enquiry. */
const MAX_ITEMS = 40;

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

/** Reject anything that is not the shape we wrote — storage is user-writable. */
function parseStored(raw: string | null): EnquiryItem[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (v): v is EnquiryItem =>
          typeof v === "object" &&
          v !== null &&
          typeof (v as EnquiryItem).slug === "string" &&
          typeof (v as EnquiryItem).name === "string",
      )
      .slice(0, MAX_ITEMS)
      .map((v) => ({
        slug: v.slug,
        name: v.name,
        subtitle: typeof v.subtitle === "string" ? v.subtitle : "",
        dosage: typeof v.dosage === "string" ? v.dosage : "",
      }));
  } catch {
    return [];
  }
}

export function buildEnquiryMessage(items: EnquiryItem[]) {
  if (!items.length) {
    return "Hello, I would like more information about the EVOHN catalogue.";
  }
  const lines = items.map((item, i) => `${i + 1}. ${item.name}`);
  return [
    `Hello, I would like more information about the following ${
      items.length === 1 ? "compound" : `${items.length} compounds`
    }:`,
    ...lines,
  ].join("\n");
}

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<EnquiryItem[]>([]);
  const [ready, setReady] = useState(false);

  // Read after mount, never during render: the statically exported HTML has no
  // access to localStorage, and reading it in render would hydrate-mismatch.
  useEffect(() => {
    setItems(parseStored(window.localStorage.getItem(STORAGE_KEY)));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Private mode, or the quota is full. The list still works for this
      // session; it simply will not survive a reload.
    }
  }, [items, ready]);

  // Another tab is the same visitor. Keep the count honest across both.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(parseStored(e.newValue));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const has = useCallback(
    (slug: string) => items.some((i) => i.slug === slug),
    [items],
  );

  const add = useCallback((item: EnquiryItem) => {
    setItems((prev) =>
      prev.some((i) => i.slug === item.slug) || prev.length >= MAX_ITEMS
        ? prev
        : [...prev, item],
    );
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const toggle = useCallback((item: EnquiryItem) => {
    setItems((prev) =>
      prev.some((i) => i.slug === item.slug)
        ? prev.filter((i) => i.slug !== item.slug)
        : prev.length >= MAX_ITEMS
          ? prev
          : [...prev, item],
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const message = useMemo(() => buildEnquiryMessage(items), [items]);

  const href = useMemo(() => {
    const number = site.whatsapp.replace(/\D/g, "");
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }, [message]);

  const value = useMemo<EnquiryContextValue>(
    () => ({
      items,
      count: items.length,
      ready,
      has,
      add,
      remove,
      toggle,
      clear,
      href,
      message,
    }),
    [items, ready, has, add, remove, toggle, clear, href, message],
  );

  return (
    <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) {
    throw new Error("useEnquiry must be used inside <EnquiryProvider>");
  }
  return ctx;
}

export const ENQUIRY_STORAGE_KEY = STORAGE_KEY;
export const ENQUIRY_MAX_ITEMS = MAX_ITEMS;
