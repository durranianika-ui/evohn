import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Curtain } from "@/components/motion/Curtain";
import { PageTransition } from "@/components/motion/PageTransition";
import { site } from "@/data/site";
import "./globals.css";

/**
 * PRIMARY — Brand Identity Kit §03 specifies Canela Regular.
 * Canela is a licensed face from Commercial Type and cannot be self-hosted
 * from a public font CDN. Cormorant Garamond stands in: a high-contrast
 * display serif with comparable proportions at the light weights used here.
 * To switch to the licensed face, drop the woff2 files into `app/fonts`,
 * swap this for `next/font/local`, and nothing else needs to change.
 */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

/**
 * SECONDARY — Brand Identity Kit §03 specifies Helvetica Neue.
 * The token stack prefers the visitor's own Helvetica Neue where the OS
 * provides it, and falls back to Inter, the closest widely-available
 * neo-grotesque, everywhere else.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-GB"
      className={`${cormorant.variable} ${inter.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-soft text-carbon">
        <SmoothScroll />
        <Curtain />
        <Header />
        <main id="main" className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
