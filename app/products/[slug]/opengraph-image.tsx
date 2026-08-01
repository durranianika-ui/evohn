import { ImageResponse } from "next/og";
import { getCategory } from "@/data/categories";
import { products, productBySlug } from "@/data/products";
import { site } from "@/data/site";

export const alt = "EVOHN research compound";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Rendered once per compound at build time — required under `output: "export"`. */
export const dynamic = "force-static";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

/**
 * Per-compound social card.
 *
 * A route that exports its own `openGraph` metadata does not inherit the
 * root card, so each product supplies one — which is the better outcome
 * anyway: a shared link names the compound rather than the brand.
 */
export default async function ProductOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = productBySlug.get(slug);

  if (!product) {
    return new ImageResponse(<div style={{ display: "flex" }} />, size);
  }

  const category = getCategory(product.category);

  // The category swatch, resolved to a literal — Satori has no CSS variables.
  const swatch: Record<string, string> = {
    "weight-loss": "#111111",
    recovery: "#473227",
    longevity: "#E5E2DE",
    growth: "#D6C8B4",
    neuro: "#6B6D70",
    performance: "#5F605F",
    metabolism: "#4E4E4D",
    regeneration: "#6F564B",
  };

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
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -160,
            width: 780,
            height: 780,
            borderRadius: 780,
            background:
              "radial-gradient(circle, rgba(214,210,204,0.18) 0%, rgba(214,210,204,0.04) 46%, rgba(11,11,11,0) 70%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              color: "#F6F5F2",
              fontSize: 28,
              letterSpacing: 11,
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            {site.name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 13,
                height: 13,
                borderRadius: 13,
                backgroundColor: swatch[category.slug] ?? "#D6D2CC",
                display: "flex",
              }}
            />
            <div
              style={{
                color: "rgba(246,245,242,0.5)",
                fontSize: 17,
                letterSpacing: 3.2,
                textTransform: "uppercase",
                display: "flex",
              }}
            >
              {category.name}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#F6F5F2",
              fontSize: product.name.length > 16 ? 66 : 92,
              lineHeight: 1.04,
              letterSpacing: -1,
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            {product.name}
          </div>
          <div
            style={{
              color: "rgba(246,245,242,0.52)",
              fontSize: 24,
              marginTop: 24,
              maxWidth: 900,
              lineHeight: 1.45,
              display: "flex",
            }}
          >
            {product.summary}
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(246,245,242,0.16)",
            paddingTop: 26,
            display: "flex",
            gap: 48,
          }}
        >
          {[
            ["Presentation", product.dosage],
            ["Purity", product.specs.purity],
            ["Form", product.specs.form],
          ].map(([label, value]) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span
                style={{
                  color: "rgba(246,245,242,0.35)",
                  fontSize: 14,
                  letterSpacing: 2.6,
                  textTransform: "uppercase",
                  display: "flex",
                }}
              >
                {label}
              </span>
              <span style={{ color: "rgba(246,245,242,0.8)", fontSize: 20, display: "flex" }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
