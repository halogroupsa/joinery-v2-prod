import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { FAQ } from "@/components/sections/faq";
import { CtaBand } from "@/components/sections/cta-band";
import { SmartImage } from "@/components/ui/smart-image";
import { JOINERY_PAGES } from "@/data/joinery-pages";
import {
  MAINTENANCE_AREAS,
  MAINTENANCE_FAQ,
  MAINTENANCE_HREF,
  MAINTENANCE_PROOF,
  REPAIR_SCOPE,
  REPAIR_STEPS,
} from "@/data/maintenance";
import { SITE, productHref } from "@/lib/site";
import { BUSINESS_SCHEMA, socialMeta } from "@/lib/seo";

/* A static route, so it wins over the sibling [slug] segment. See the note in
   src/data/maintenance.ts for why this is not a JOINERY_PAGES entry. */

/* Keyword targets come from the Google Ads Keyword Planner pull in
   keywords_planner/, not from assumption. The finding that shaped this page:
   "wardrobe repair dubai", "kitchen cabinet repair dubai" and "joinery
   maintenance dubai" — the phrases the incumbent repair sites optimise for —
   all return ZERO measurable UAE volume. The demand is in carpentry wording:
   carpenter dubai (2,900/mo), carpentry services dubai (480, LOW comp),
   carpentry work in dubai (390, LOW), the transactional furniture repair trio
   at 260/mo each, and an Al Quoz cluster at 110/mo and LOW competition that we
   should own outright given the workshop is in Al Quoz. The zero-volume
   phrases stay in the body for semantic coverage; they just lose the title. */
export const metadata: Metadata = {
  title: "Carpenter Dubai | Furniture Repair & Carpentry Services",
  description:
    "Carpenter in Dubai for furniture repair and carpentry services from our Al Quoz workshop. Wardrobe, cabinet and door repairs, including joinery others installed.",
  alternates: { canonical: `${SITE.url}${MAINTENANCE_HREF}` },
  ...socialMeta({
    key: "maintenance-repair",
    path: MAINTENANCE_HREF,
    title: "Furniture Repair & Carpentry Services in Dubai | Joinery.ae",
    description:
      "Wardrobe, cabinet, door and furniture repair across Dubai, by carpenters with a 15,000 sq.ft. Al Quoz workshop behind them. Send photos, we inspect and quote, then repair on a scheduled day.",
  }),
};

/* HowTo no longer produces a rich result in Google, but it remains valid
   structured data and is what AI answer engines read to summarise a process —
   which is most of the value for a "how do I get my wardrobe fixed" query. */
const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${SITE.url}${MAINTENANCE_HREF}#service`,
      name: "Joinery Maintenance & Furniture Repair in Dubai",
      serviceType: "Carpentry services, furniture repair, restoration and joinery maintenance",
      description:
        "Repair, restoration and scheduled maintenance of wardrobes, kitchen cabinets, doors, panelling and bespoke furniture across Dubai and the UAE — including joinery originally installed by other companies.",
      url: `${SITE.url}${MAINTENANCE_HREF}`,
      areaServed: [
        { "@type": "City", name: "Dubai" },
        { "@type": "Country", name: "United Arab Emirates" },
      ],
      provider: BUSINESS_SCHEMA,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Joinery repair and maintenance services",
        itemListElement: REPAIR_SCOPE.map((item) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: item.title, description: item.body },
        })),
      },
    },
    {
      "@type": "HowTo",
      name: "How to book a joinery repair in Dubai",
      description:
        "Report the damage with photos, we inspect and issue a written quotation, then repair on a scheduled date.",
      step: REPAIR_STEPS.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.title,
        text: step.body,
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: MAINTENANCE_FAQ.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
        { "@type": "ListItem", position: 2, name: "Services", item: `${SITE.url}/services` },
        {
          "@type": "ListItem",
          position: 3,
          name: "Maintenance & repair",
          item: `${SITE.url}${MAINTENANCE_HREF}`,
        },
      ],
    },
  ],
};

const RELATED = ["wardrobes", "kitchens", "doors"];

export default function MaintenancePage() {
  const related = JOINERY_PAGES.filter((page) => RELATED.includes(page.slug));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />

      <PageHero
        crumb="Maintenance & repair"
        parentCrumb={{ label: "Services", href: "/services" }}
        eyebrow="Carpenter & furniture repair services in Dubai"
        title="When joinery stops working, it can usually be put right."
        intro="Doors that catch, hinges that have given up, water damage under a sink, a scratched worktop or a wardrobe that no longer closes. Our carpenters repair, restore and maintain furniture and joinery across Dubai — including pieces we did not build."
        image={{
          folder: "common",
          base: "in-house-facility",
          alt: "Joiners repairing and finishing woodwork in the Joinery.ae workshop in Al Quoz, Dubai",
        }}
      />

      {/* Proof strip — the four things a repair enquiry actually wants to know */}
      <section className="border-b border-rule bg-paper-warm">
        <div className="container-wide grid gap-px bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {MAINTENANCE_PROOF.map((item) => (
            <div key={item.k} className="bg-paper-warm px-6 py-7">
              <p className="font-display text-lg text-ink">{item.k}</p>
              <p className="mt-1.5 text-sm text-ink-mute">{item.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Intake flow */}
      <section className="section bg-paper" aria-labelledby="repair-process-title">
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="eyebrow reveal">How a repair works</p>
            <h2 id="repair-process-title" className="reveal mt-5 text-fluid-3xl text-balance" data-delay="1">
              Send a photo. We look, we quote, we fix.
            </h2>
            <p className="section-lede reveal mt-5 max-w-xl text-ink-soft" data-delay="2">
              Most repairs start with a WhatsApp message and a couple of pictures. Nothing is
              charged, and no work is booked, until you have a written quotation in front of you.
            </p>
          </div>

          <ol className="mt-14 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
            {REPAIR_STEPS.map((step, i) => (
              <li
                key={step.n}
                className="reveal flex flex-col bg-paper p-7 transition-colors duration-base hover:bg-paper-warm"
                data-delay={String((i % 4) + 1)}
              >
                <span className="font-mono text-sm text-accent">{step.n}</span>
                <h3 className="mt-3 font-display text-xl">{step.title}</h3>
                <div className="my-4 h-px w-10 bg-accent" aria-hidden />
                <p className="section-lede text-ink-soft">{step.body}</p>
              </li>
            ))}
          </ol>

          <div className="reveal mt-10 flex flex-wrap items-center gap-3" data-delay="2">
            <a
              href={SITE.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <MessageCircle size={16} aria-hidden /> Send photos on WhatsApp
            </a>
            <a href={`tel:${SITE.phoneE164}`} className="btn-ghost">
              <Phone size={15} aria-hidden /> {SITE.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Scope of repairs */}
      <section className="section border-t border-rule bg-paper-warm" aria-labelledby="repair-scope-title">
        <div className="container-wide">
          <div className="max-w-2xl">
            <p className="eyebrow reveal">What we repair</p>
            <h2 id="repair-scope-title" className="reveal mt-5 text-fluid-3xl" data-delay="1">
              The faults we are called out to most.
            </h2>
            <p className="section-lede reveal mt-5 text-ink-soft" data-delay="2">
              Most of our carpentry work in Dubai falls into six kinds of job. If it is made of
              wood, board, veneer or laminate and it has stopped doing its job, it is worth
              asking about.
            </p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
            {REPAIR_SCOPE.map((item, i) => (
              <div
                key={item.n}
                className="reveal flex flex-col gap-3 bg-paper p-8"
                data-delay={String((i % 3) + 1)}
              >
                <span className="font-mono text-sm text-accent">{item.n}</span>
                <h3 className="font-display text-2xl">{item.title}</h3>
                <p className="section-lede text-ink-soft">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The differentiator: we can remake the part */}
      <section className="section panel-dark" aria-labelledby="repair-workshop-title">
        <div className="container-wide grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="reveal" data-reveal="left">
            <SmartImage
              folder="wardrobes"
              base="services-joinery-wardrobes-premium-finishes"
              alt="Colour-matched lacquer finish on bespoke wardrobe joinery"
              ratio="4 / 3"
              className="rounded-lg"
              sizes="(min-width: 1024px) 46vw, 92vw"
            />
          </div>
          <div>
            <p className="eyebrow reveal">Whoever built it</p>
            <h2 id="repair-workshop-title" className="reveal mt-5 text-fluid-3xl text-paper" data-delay="1">
              Carpentry services with a factory behind them.
            </h2>
            <div className="section-lede reveal mt-6 space-y-4 text-paper/70" data-delay="2">
              <p>
                Most of what we repair was built by somebody else — a developer&apos;s contractor,
                an imported system, an earlier fit-out. That is not a problem. We survey what is
                there, work out why it failed, and put it right.
              </p>
              <p>
                The difference is what happens when a part is beyond repair. A handyman has to
                find the nearest replacement. Our carpenters take the dimensions back to the{" "}
                {SITE.facility.toLowerCase()}, remake the component on the same machinery that
                produces our bespoke work, colour-match the finish on our own spray line, and
                install it so the repair disappears into the piece.
              </p>
              <p>
                For properties with a lot of joinery, the same team also runs annual maintenance
                contracts — scheduled visits that catch hinges, runners, alignment and finish
                before they become replacements.
              </p>
            </div>
            <div className="reveal mt-8" data-delay="3">
              <Link href="/contact" className="btn-ghost">
                Arrange an inspection <ArrowUpRight size={16} aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sectors served */}
      <section className="bg-paper py-14">
        <div className="container-wide">
          <p className="eyebrow text-center">Where we work</p>
          <p className="mx-auto mt-4 max-w-2xl text-center text-ink-soft">
            Our carpentry and repair team works out of {SITE.address.line1}, Al Quoz, and
            attends properties across Dubai and the wider UAE.
          </p>
          <div className="mt-8 border-y border-rule py-4" aria-label="Property types we maintain">
            <div className="marquee">
              <ul className="marquee-track items-center">
                {[...MAINTENANCE_AREAS, ...MAINTENANCE_AREAS].map((area, index) => (
                  <li
                    key={`${area}-${index}`}
                    className="strip-label flex items-center gap-4 whitespace-nowrap text-ink-soft"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Same accordion the homepage uses. The FAQ data here is question/answer
          shaped because the JSON-LD above consumes it; the component takes the
          site's q/a shape, so it is mapped rather than duplicated. */}
      <FAQ
        items={MAINTENANCE_FAQ.map((item) => ({ q: item.question, a: item.answer }))}
        eyebrow="Questions, answered plainly"
        title="Before you book a repair."
        lede="Not sure whether something is worth repairing? Send a photo on WhatsApp and we will tell you either way."
        cta={null}
        className="border-t border-rule"
      />

      {/* Related new-build services */}
      <section className="section border-t border-rule bg-paper">
        <div className="container-wide">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Beyond repair</p>
              <h2 className="mt-5 text-fluid-3xl">Or start again, properly.</h2>
            </div>
            <Link href="/services" className="btn-ghost">
              All joinery services <ArrowUpRight size={16} aria-hidden />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={productHref(item.slug)}
                className="group overflow-hidden rounded-lg border border-rule bg-paper-warm"
              >
                <SmartImage
                  folder={item.image.folder}
                  base={item.image.base}
                  alt={item.image.alt}
                  ratio="4 / 3"
                  sizes="(min-width: 768px) 30vw, 90vw"
                />
                <div className="flex items-center justify-between gap-4 p-5">
                  <h3 className="font-display text-xl">{item.name}</h3>
                  <ArrowUpRight
                    size={17}
                    className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
