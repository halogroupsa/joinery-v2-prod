import type { Metadata, Viewport } from "next";
import Image from "next/image";
import { preload } from "react-dom";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { RevealOnScroll } from "@/components/layout/reveal-on-scroll";
import { WhatsappFab } from "@/components/layout/whatsapp-fab";
// import { ScrollProgress } from "@/components/layout/scroll-progress";
import { BackToTop } from "@/components/layout/back-to-top";
import { PageTransition } from "@/components/layout/page-transition";
import { JOINERY_PAGES } from "@/data/joinery-pages";
import { SITE, PRODUCTS } from "@/lib/site";
import { socialMeta } from "@/lib/seo";
import { GoogleTagManagerNoScript, GoogleTags } from "@/components/analytics/google-tags";

/* SITE.description runs past 200 characters, which suits schema but gets cut
   mid-sentence in results; the search snippet gets its own ~155-character line
   that opens on the homepage's target phrase, "joinery company dubai". */
const HOME_DESCRIPTION =
  "Joinery company in Dubai with its own Al Quoz factory. Custom wardrobes, kitchen cabinets, doors and wall panelling, designed, made and installed in-house.";

// Send only the navigation fields to the client, keeping full service copy server-side.
const SERVICE_NAVIGATION = [
  ...JOINERY_PAGES.map((page) => ({
    slug: page.slug,
    label: page.name,
    description: PRODUCTS.find((product) => product.slug === page.slug)?.short ?? page.name,
    image: page.image,
  })),
  {
    slug: "maintenance-repair",
    label: "Repair & maintenance",
    description: "Repairs, refinishing & care",
    image: { folder: "portraits", base: "j11", alt: "Joiners adjusting fitted cabinetry" },
  },
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Joinery Company Dubai | Bespoke Wardrobes, Kitchens & Woodwork",
    template: `%s · ${SITE.name}`,
  },
  description: HOME_DESCRIPTION,
  applicationName: SITE.name,
  ...socialMeta({
    key: "home",
    path: "",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: HOME_DESCRIPTION,
  }),
  icons: {
    icon: "/favicon-woodgrain.png",
    shortcut: "/favicon-woodgrain.ico",
  },
  alternates: { canonical: SITE.url },
};

export const viewport: Viewport = {
  themeColor: "#16100b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // The hero headline (the LCP element) needs these two faces; start them
  // alongside the CSS rather than after it is parsed.
  preload("/fonts/landroverweb_bold.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  preload("/fonts/manrope_web/manrope-regular.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });

  return (
    <html lang="en-AE">
      <body>
        <GoogleTagManagerNoScript />
        <GoogleTags />
        <SmoothScroll />
        <RevealOnScroll />
        <PageTransition />
        {/* <ScrollProgress /> */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <Header services={SERVICE_NAVIGATION} />
        <div className="page-mark" aria-hidden="true">
          <Image src="/favicon-woodgrain.png" alt="" width={76} height={76} className="page-mark-emblem" priority />
        </div>
        <main id="main">{children}</main>
        <Footer />
        <div className="page-floating">
          <WhatsappFab />
          <BackToTop />
        </div>
      </body>
    </html>
  );
}
