"use client";

import Link from "next/link";
import { useEnquiry } from "@/lib/enquiry";
import { whatsappConfigured } from "@/lib/whatsapp";
import { site } from "@/data/site";

/**
 * `/enquiry`.
 *
 * The full-page view of the list the drawer summarises. It shows the message
 * that will actually be sent, verbatim, before it is sent — a visitor should
 * never have to guess what a button is about to put in their name.
 */
export function EnquiryList() {
  const { items, remove, clear, href, message, ready } = useEnquiry();

  if (!ready) {
    // The static export cannot know the list, so the first paint is a held
    // frame rather than an empty state that would flash and then contradict
    // itself a moment later.
    return (
      <div className="container-content py-24">
        <p className="type-body-s text-carbon/40">Reading your list…</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="container-content py-24 md:py-32">
        <h2 className="type-display-s max-w-[16ch] text-carbon">
          Your list is empty
        </h2>
        <p className="type-body mt-8 max-w-[54ch] text-carbon/58">
          Add compounds from the catalogue and they collect here. The list is a
          way to raise one enquiry covering several compounds rather than six
          separate messages — it is not a basket, and nothing is ordered from
          it.
        </p>
        <Link
          href="/catalogue"
          className="type-label mt-12 inline-flex min-h-12 items-center bg-carbon px-9 py-4 text-soft transition-opacity duration-400 ease-brand hover:opacity-88"
        >
          Browse the catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="container-content py-20 md:py-28">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <div className="flex items-baseline justify-between">
            <h2 className="type-label text-carbon/45">
              {items.length} selected
            </h2>
            <button
              type="button"
              onClick={clear}
              className="type-label min-h-11 text-carbon/45 transition-colors duration-400 ease-brand hover:text-carbon"
            >
              Clear list
            </button>
          </div>

          <ol className="mt-8 border-t border-carbon/12">
            {items.map((item, i) => (
              <li
                key={item.slug}
                className="flex items-start justify-between gap-6 border-b border-carbon/12 py-7"
              >
                <div className="flex min-w-0 gap-5">
                  <span
                    aria-hidden
                    className="type-label shrink-0 tabular-nums text-carbon/30"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <Link
                      href={`/products/${item.slug}`}
                      className="type-title-s block text-carbon transition-opacity duration-300 hover:opacity-65"
                    >
                      {item.name}
                    </Link>
                    <p className="type-label mt-2 text-carbon/40">
                      {item.subtitle}
                    </p>
                    {item.dosage ? (
                      <p className="type-body-s mt-1.5 text-carbon/50">
                        {item.dosage}
                      </p>
                    ) : null}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => remove(item.slug)}
                  className="type-label min-h-11 shrink-0 text-carbon/40 transition-colors duration-400 ease-brand hover:text-carbon"
                >
                  <span className="sr-only">Remove {item.name} from list</span>
                  Remove
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-4 lg:col-start-9">
          <div className="lg:sticky lg:top-32">
            <div className="border border-carbon/12 bg-mist/50 p-7 md:p-8">
              <h2 className="type-label text-carbon/45">
                What will be sent
              </h2>
              <pre className="type-body-s mt-6 font-sans break-words whitespace-pre-wrap text-carbon/72">
                {message}
              </pre>

              {whatsappConfigured ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-label mt-9 inline-flex min-h-12 w-full items-center justify-center bg-carbon px-8 py-4 text-soft transition-opacity duration-400 ease-brand hover:opacity-88"
                >
                  Send on WhatsApp
                </a>
              ) : (
                <a
                  href={`mailto:${site.email}?subject=${encodeURIComponent(
                    "Catalogue enquiry",
                  )}&body=${encodeURIComponent(message)}`}
                  className="type-label mt-9 inline-flex min-h-12 w-full items-center justify-center bg-carbon px-8 py-4 text-soft transition-opacity duration-400 ease-brand hover:opacity-88"
                >
                  Send by email
                </a>
              )}

              <Link
                href="/contact"
                className="type-label mt-3 inline-flex min-h-12 w-full items-center justify-center border border-carbon/20 px-8 py-4 text-carbon transition-colors duration-400 ease-brand hover:border-carbon"
              >
                Use the contact form instead
              </Link>
            </div>

            <p className="type-body-s mt-7 text-carbon/50">
              No price is shown and nothing is ordered here. This list lives in
              your browser only — see{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-carbon"
              >
                privacy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
