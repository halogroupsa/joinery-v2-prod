import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { SmartImage } from "@/components/ui/smart-image";
import { JOINERY_PAGES } from "@/data/joinery-pages";
import { MAINTENANCE_HREF } from "@/data/maintenance";
import { SITE, productHref } from "@/lib/site";
import { socialMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Joinery Services in Dubai | Custom Woodwork Made In-House",
  description: "Joinery services in Dubai: wardrobes, kitchens, doors, wall panelling, reception desks and custom furniture made in our Al Quoz workshop, plus joinery repairs.",
  alternates: { canonical: `${SITE.url}/services` },
  ...socialMeta({
    key: "services",
    path: "/services",
    title: "Bespoke Joinery Services in Dubai | Joinery.ae",
    description:
      "Wardrobes, kitchens, doors, wall panelling, reception desks and custom furniture, made in-house at our Al Quoz workshop.",
  }),
};

export default function JoineryIndexPage() {
  return (
    <>
      <PageHero
        crumb="Joinery services"
        eyebrow="Joinery services in Dubai"
        title="Designed for the room. Made in our workshop."
        intro="From one-off furniture to full villa and commercial joinery packages, each piece is designed, fabricated and installed by our own team in Dubai."
        image={{ folder: "common", base: "in-house-facility-v2", alt: "Joinery.ae in-house workshop in Al Quoz, Dubai" }}
      />
      <section className="section bg-paper">
        {/* The four parts of a card — image, eyebrow, title, intro — sit on
            shared row tracks via subgrid, so they line up across a row no
            matter how the copy falls. Without it a two-line eyebrow
            ("Kitchen cabinets & bespoke kitchens in Dubai") or a two-line
            title ("TV units & media walls") pushes everything below it out
            of step with the neighbouring cards.

            Each card resets gap to 0: the 1.25rem gutter belongs between
            cards, not between a card's own rows, and a subgrid inherits its
            parent's gap unless it sets its own. Padding therefore lands on
            the individual rows rather than one wrapper, so the image can
            still run full-bleed to the card edge. */}
        <div className="container-wide grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {JOINERY_PAGES.map((page) => (
            <Link key={page.slug} href={productHref(page.slug)} className="group row-span-4 grid grid-rows-subgrid gap-0 overflow-hidden rounded-lg border border-rule bg-paper-warm">
              <SmartImage folder={page.image.folder} base={page.image.base} alt={page.image.alt} ratio="4 / 3" sizes="(min-width: 1024px) 28vw, (min-width: 768px) 44vw, 90vw" />
              <p className="eyebrow px-6 pt-6">{page.eyebrow}</p>
              <h2 className="mt-3 flex items-start justify-between gap-4 px-6 font-display text-2xl transition-colors group-hover:text-accent-deep">
                {page.name}
                <ArrowUpRight size={18} className="mt-1.5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </h2>
              <p className="section-lede mt-3 px-6 pb-6 text-ink-soft">{page.intro}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Repair sits apart from the eleven "what we make" cards on purpose —
          it is the one service that starts with joinery that already exists,
          often somebody else's. */}
      <section className="section panel-dark" aria-labelledby="services-maintenance-title">
        <div className="container-wide grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div>
            <p className="eyebrow reveal">Already installed</p>
            <h2 id="services-maintenance-title" className="reveal mt-5 text-fluid-3xl text-paper" data-delay="1">
              We also repair and maintain joinery.
            </h2>
            <p className="section-lede reveal mt-6 max-w-[58ch] text-paper/70" data-delay="2">
              Wardrobe doors off their tracks, kitchen cabinets out of alignment, water damage
              under a vanity, a scratched or sun-faded finish. Our carpentry and repair team
              works across Dubai — including on joinery built by another company. Send photos,
              we inspect and quote, then repair on a date that suits you.
            </p>
            <div className="reveal mt-8" data-delay="3">
              <Link href={MAINTENANCE_HREF} className="btn-ghost">
                Furniture repair &amp; carpentry <ArrowUpRight size={16} aria-hidden />
              </Link>
            </div>
          </div>
          <div className="reveal" data-reveal="right" data-delay="1">
            <SmartImage
              folder="common"
              base="in-house-facility-v2"
              alt="Joiners repairing and refinishing woodwork at the Joinery.ae workshop in Al Quoz, Dubai"
              ratio="4 / 3"
              className="rounded-lg"
              sizes="(min-width: 1024px) 44vw, 92vw"
            />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
