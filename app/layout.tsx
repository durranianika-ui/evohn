import type { Metadata, Viewport } from "next";
import { Archivo, Azeret_Mono, Cormorant_Garamond } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Curtain } from "@/components/motion/Curtain";
import { PageTransition } from "@/components/motion/PageTransition";
import { AgeGate } from "@/components/common/AgeGate";
import { EnquiryProvider } from "@/lib/enquiry";
import { site } from "@/data/site";
import "./globals.css";

/**
 * TYPOGRAPHY
 *
 * Three faces, in the roles the reference experience uses them:
 *
 *   Archivo      headings and body — a neutral grotesk standing in for the
 *                reference's licensed Roc Grotesk. Set uppercase with tight
 *                negative tracking at display sizes, which is what gives that
 *                design its density.
 *   Azeret Mono  every technical label: navigation, eyebrows, indices, meta.
 *                The reference uses this exact face for that layer, and it is
 *                the single largest reason the two sites read differently.
 *   Cormorant    the EVOHN wordmark only.
 *
 * NOTE — this overrides the Brand Identity Kit §03, which specifies Canela
 * for display. The wordmark keeps its serif so the mark is still EVOHN's;
 * everything else follows the reference. Reverting is one line: point
 * `--font-display` at `--font-cormorant` in globals.css.
 */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const azeret = Azeret_Mono({
  variable: "--font-azeret",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

/** Wordmark only — the one place the kit's serif survives. */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Precision Research Compounds`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "research peptides",
    "peptide catalogue",
    "analytical purity",
    "HPLC verified",
    "batch traceability",
    "research compounds",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} | Precision Research Compounds`,
    description: site.description,
    // og:image is supplied by app/opengraph-image.tsx and inherited by
    // every route that does not define its own.
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | Precision Research Compounds`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#111111",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  // Required for `env(safe-area-inset-*)` to resolve to anything but 0 on
  // a notched device — without it the drawer foot sits under the home bar.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-GB"
      className={`${archivo.variable} ${azeret.variable} ${cormorant.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-soft text-carbon">
        {/* The enquiry list is read by the header count, the drawer, the
            product page and `/enquiry`, so its provider wraps everything. */}
        <EnquiryProvider>
          <SmoothScroll />
          <Curtain />
          <Header />
          <main id="main" className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <AgeGate />
        </EnquiryProvider>
      </body>
    </html>
  );
}
