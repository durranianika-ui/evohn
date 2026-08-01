import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Rendered once at build time — required under `output: "export"`. */
export const dynamic = "force-static";

/**
 * Social card.
 *
 * Applies to every route that does not define its own. Satori renders with
 * the fonts it is given, so this is composed from the brand's layout and
 * colour rather than its display face — the wide-tracked uppercase wordmark
 * carries the identity on its own.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0B0B0B",
          padding: "72px 80px",
        }}
      >
        {/* Warm pool of light, matching the site's hero treatment */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -140,
            width: 760,
            height: 760,
            borderRadius: 760,
            background:
              "radial-gradient(circle, rgba(214,210,204,0.20) 0%, rgba(214,210,204,0.05) 45%, rgba(11,11,11,0) 70%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              color: "#F6F5F2",
              fontSize: 30,
              letterSpacing: 12,
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              color: "rgba(246,245,242,0.45)",
              fontSize: 17,
              letterSpacing: 3.4,
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            Research Compounds
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#F6F5F2",
              fontSize: 88,
              lineHeight: 1.04,
              letterSpacing: -1,
              textTransform: "uppercase",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Scientific</span>
            <span>Precision.</span>
          </div>
          <div
            style={{
              color: "rgba(246,245,242,0.55)",
              fontSize: 25,
              marginTop: 26,
              display: "flex",
            }}
          >
            Luxury performance. Research excellence.
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(246,245,242,0.16)",
            paddingTop: 26,
            display: "flex",
            gap: 44,
          }}
        >
          {[
            "≥ 99% HPLC Verified",
            "Batch Traceable",
            "Third-Party Tested",
          ].map((mark) => (
            <span
              key={mark}
              style={{
                color: "rgba(246,245,242,0.5)",
                fontSize: 16,
                letterSpacing: 2.8,
                textTransform: "uppercase",
                display: "flex",
              }}
            >
              {mark}
            </span>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
