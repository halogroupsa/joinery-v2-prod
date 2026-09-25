import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/sections/page-hero";
import { PortfolioGallery } from "@/components/interactive/portfolio-gallery";
import { GALLERY_ITEMS } from "@/data/gallery";
import { SITE } from "@/lib/site";
import { socialMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Joinery Projects Dubai | Wardrobes, Kitchens & Doors",
  description:
    "Browse our portfolio of bespoke wardrobes, kitchens, doors, wall panels, ceilings and furniture — designed, built and installed in-house across Dubai and the UAE.",
  alternates: { canonical: `${SITE.url}/portfolio` },
  ...socialMeta({
    key: "portfolio",
    path: "/portfolio",
    title: "Portfolio — Bespoke Joinery Projects in Dubai | Joinery.ae",
    description:
      "Wardrobes, kitchens, doors, wall panels, ceilings and furniture — designed, built and installed in-house across Dubai.",
  }),
};

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        crumb="Portfolio"
        eyebrow="Joinery projects in Dubai"
        title={<>A working archive of bespoke joinery.</>}
        intro={`${GALLERY_ITEMS.length}+ pieces across eleven disciplines — every one designed, fabricated and installed by our own team in Dubai. Filter by category, tap any piece to view it full-screen.`}
        image={{ folder: "kitchens", base: "kitchen-10", alt: "Bespoke handcrafted kitchen joinery in Dubai" }}
      />

      <section className="section bg-paper">
        <div className="container-wide">
          <Suspense fallback={<div className="py-20 text-center text-ink-mute">Loading portfolio…</div>}>
            <PortfolioGallery />
          </Suspense>
        </div>
      </section>
    </>
  );
}
