"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/data/site";

/**
 * Route error boundary.
 *
 * Every page on this site is prerendered HTML with no data fetch behind it, so
 * reaching this screen means a client-side failure — a hydration mismatch, a
 * chunk that did not load, a browser API that behaved unexpectedly. It says
 * that plainly rather than blaming the visitor, offers the retry Next gives us,
 * and leaves a route out of the dead end.
 *
 * The digest is shown because it is the only handle a visitor can quote in a
 * report, and it identifies nothing about them.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // There is no error-reporting service wired to this site, and adding one
    // silently would be a privacy decision nobody made. The console is the
    // honest destination.
    console.error("Route error:", error);
  }, [error]);

  return (
    <section className="flex min-h-dvh items-center bg-ink text-soft">
      <div className="container-content py-32">
        <Wordmark className="text-[1.1rem] text-soft/55" />

        <p className="type-label mt-16 text-soft/55">Something failed</p>

        <h1 className="type-display mt-8 max-w-[16ch] text-soft">
          This page did not finish loading
        </h1>

        <p className="type-body mt-9 max-w-[52ch] text-soft/55">
          The fault is at our end, not yours. Every page here is pre-rendered,
          so this is almost always a transient failure — retrying usually
          resolves it.
        </p>

        {error.digest ? (
          <p className="type-label mt-8 text-soft/40">
            Reference {error.digest}
          </p>
        ) : null}

        <div className="mt-12 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={reset}
            className="type-label inline-flex min-h-12 items-center bg-soft px-9 py-4 text-carbon transition-opacity duration-400 ease-brand hover:opacity-88"
          >
            Try again
          </button>
          <ButtonLink href="/" variant="outline" tone="dark">
            Back to the home page
          </ButtonLink>
        </div>

        <p className="type-body-s mt-12 text-soft/45">
          If it keeps happening, tell us at{" "}
          <Link
            href={`mailto:${site.email}`}
            className="underline underline-offset-4 transition-colors duration-400 hover:text-soft/70"
          >
            {site.email}
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
