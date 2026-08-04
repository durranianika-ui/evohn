"use client";

/**
 * Root error boundary.
 *
 * Replaces the whole document when the root layout itself fails, which means
 * none of the site's own chrome, fonts or CSS can be relied on here — this
 * file renders its own `<html>` and `<body>`, and styles inline for the same
 * reason. Anything imported from the design system would be exactly the sort
 * of thing that has already failed.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-GB">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#0b0b0b",
          color: "#f6f5f2",
          fontFamily:
            '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
        }}
      >
        <main style={{ padding: "4rem 1.5rem", maxWidth: "44rem" }}>
          <p
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              opacity: 0.55,
              margin: 0,
            }}
          >
            EVOHN
          </p>

          <h1
            style={{
              fontSize: "clamp(2rem, 6vw, 3rem)",
              fontWeight: 300,
              lineHeight: 1.1,
              margin: "3rem 0 0",
            }}
          >
            The page could not be displayed
          </h1>

          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.7,
              opacity: 0.6,
              maxWidth: "48ch",
              margin: "2rem 0 0",
            }}
          >
            Something failed before the site could load. Retrying usually
            resolves it.
          </p>

          {error.digest ? (
            <p
              style={{
                fontSize: "0.6875rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                opacity: 0.4,
                margin: "2rem 0 0",
              }}
            >
              Reference {error.digest}
            </p>
          ) : null}

          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "3rem",
              minHeight: "3rem",
              padding: "1rem 2.25rem",
              border: 0,
              cursor: "pointer",
              backgroundColor: "#f6f5f2",
              color: "#111111",
              fontSize: "0.6875rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontFamily: "inherit",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
