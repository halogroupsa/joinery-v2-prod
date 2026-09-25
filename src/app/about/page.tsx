import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { StatStrip } from "@/components/ui/stat-strip";
import { SmartImage } from "@/components/ui/smart-image";
import { PromisesMarquee } from "@/components/sections/promises-marquee";
import { DeveloperLogos } from "@/components/sections/developer-logos";
import { CtaBand } from "@/components/sections/cta-band";
import { SITE, PRODUCTS, MATERIAL_PROMISES } from "@/lib/site";
import { socialMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Us | Joinery Factory in Al Quoz, Dubai",
  description:
    "Joinery factory in Al Quoz, Dubai: 15,000 sq.ft. where Joinery.ae designs, manufactures and installs bespoke joinery in-house. Meet the team behind the work.",
  alternates: { canonical: `${SITE.url}/about` },
  ...socialMeta({
    key: "about",
    path: "/about",
    title: "About Joinery.ae — Dubai's In-House Bespoke Joinery Atelier",
    description:
      "Bespoke joinery designed, fabricated and installed entirely in-house from a 15,000 sq.ft. facility in Al Quoz, Dubai.",
  }),
};

const VALUES = [
  {
    n: "01",
    title: "Nothing is outsourced",
    body: "Drawing, fabrication, finishing and installation all happen under one roof. We own every step, so we answer for every detail.",
  },
  {
    n: "02",
    title: "Engineered, then crafted",
    body: "European CNC lines hold the tolerances; our joiners bring the hand-finish. Precision and craft, not one at the expense of the other.",
  },
  {
    n: "03",
    title: "Materials that last",
    body: "Waterproof, fire- and termite-resistant substrates that won't swell, warp or decay in the Gulf climate — backed by a lifetime guarantee.",
  },
  {
    n: "04",
    title: "On the drawing, on the date",
    body: "Every piece matches your 3D visuals to the millimetre and arrives on the schedule we commit to at quotation.",
  },
];

const TIMELINE = [
  { k: "Design & survey", v: "We translate your brief, mood boards or designer drawings into accurate technical drawings and 3D visuals." },
  { k: "Quotation & schedule", v: "A detailed, itemised quote with a production schedule — no hidden outsourcing margins." },
  { k: "In-house fabrication", v: "Cutting, edge-banding, veneering and finishing on our own machinery in Al Quoz." },
  { k: "Quality & finish", v: "Each element is inspected, finished and dry-assembled before it leaves the workshop." },
  { k: "Install & handover", v: "Our own site team installs to integrate seamlessly — then we stand behind the work." },
  { k: "Aftercare & repair", v: "Adjustments, refinishing and maintenance long after handover — for our joinery and for pieces other companies installed." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumb="About"
        eyebrow="Joinery factory in Al Quoz, Dubai"
        title={<>Owning every step — from drawing to handover.</>}
        intro="We are a bespoke joinery atelier in Dubai. For more than two decades we have designed, manufactured and installed custom woodwork entirely in-house — never outsourced, never compromised."
        image={{ folder: "office_furniture", base: "executive-workspace", alt: "Bespoke executive desk facing a floor-to-ceiling window, made by Joinery.ae in Dubai" }}
      />

      {/* Story */}
      <section className="section bg-paper">
        <div className="container-wide grid items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:items-stretch lg:gap-16">
          <div className="reveal lg:h-full" data-reveal="left">
            {/* The ratio lives on this box, not on SmartImage — its `ratio` prop
                is an inline style, which would give the image an intrinsic height
                the grid row could not override.

                Stacked, the box follows the source's own 3:4 so phones crop
                nothing; from sm the column is wide enough that a portrait would
                run past a screen height, so it turns landscape. */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg sm:aspect-[4/3] lg:aspect-auto lg:h-full">
              {/* The 4:3 floor at lg, as percentage padding rather than a ratio:
                  padding-% resolves against the box's own width, so the box can
                  never derive its width back from its height. aspect-ratio +
                  min-height does exactly that and overflows the column. The
                  spacer sets the row's minimum; h-full then grows the box to
                  match the copy column whenever the copy is taller. */}
              <div aria-hidden className="hidden pt-[75%] lg:block" />
              <SmartImage
                folder="common"
                base="in-house-facility-v2"
                alt="Joiners at work inside the Joinery.ae facility in Al Quoz, Dubai"
                className="absolute inset-0 h-full w-full"
                // Columns are ~447px at lg and cap at ~784px once the 1720px
                // container stops growing, so vw units overstate it on wide screens.
                sizes="(min-width: 1800px) 784px, (min-width: 1024px) 44vw, 92vw"
              />
            </div>
          </div>
          <div className="lg:flex lg:flex-col lg:justify-center">
            <p className="eyebrow reveal">Who we are</p>
            <h2 className="reveal mt-5 text-fluid-3xl" data-delay="1">
              A factory floor, run like a workshop.
            </h2>
            {/* Uncapped, the 784px column runs past 100 characters a line on
                wide screens; the cap only bites above lg. */}
            <div className="section-lede reveal mt-6 space-y-5 text-ink-soft xl:max-w-[70ch]" data-delay="2">
              <p>
                Joinery.ae is the in-house joinery arm behind some of the UAE&apos;s most
                demanding residential, commercial and hospitality fit-outs. Everything we make
                begins on a drawing board and ends on site — with the same team accountable
                from first sketch to final adjustment.
              </p>
              <p>
                Our {SITE.facility.toLowerCase()} houses European machinery, a spray and
                finishing line, and a {SITE.stats.team}-strong team of joiners, finishers and
                installers. That vertical integration is the whole point: it is how we hold
                tolerances, hit dates and keep quality entirely in our own hands.
              </p>
            </div>
            <div className="reveal mt-8 flex flex-wrap gap-3" data-delay="3">
              <Link href="/portfolio" className="btn-primary">
                See the work <ArrowUpRight size={16} />
              </Link>
              <Link href="/contact" className="btn-ghost">
                Visit the facility
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-paper pb-[var(--space-section)]">
        <div className="container-wide">
          <StatStrip
            stats={[
              { value: SITE.stats.years, suffix: "+", label: "Years of craft" },
              { value: SITE.stats.projects, suffix: "+", label: "Projects delivered" },
              { value: SITE.stats.team, suffix: "+", label: "Skilled team" },
              { value: 15000, label: "Sq.ft. facility" },
            ]}
          />
        </div>
      </section>

      <PromisesMarquee />

      {/* Values */}
      <section className="section bg-paper-warm">
        <div className="container-wide">
          <div className="max-w-2xl">
            <p className="eyebrow reveal">Why it holds up</p>
            <h2 className="reveal mt-5 text-fluid-3xl" data-delay="1">
              What sets the work apart.
            </h2>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-2">
            {VALUES.map((v, i) => (
              <div
                key={v.n}
                className="reveal flex flex-col gap-3 bg-paper p-8 sm:p-10"
                data-delay={String((i % 2) + 1)}
              >
                <span className="font-mono text-sm text-accent">{v.n}</span>
                <h3 className="font-display text-2xl">{v.title}</h3>
                <p className="section-lede text-ink-soft">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process timeline */}
      <section className="section bg-paper">
        <div className="container-wide grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
            <p className="eyebrow reveal">From brief to handover</p>
            <h2 className="reveal mt-5 text-fluid-3xl" data-delay="1">
              How a project moves through the workshop.
            </h2>
            <p className="section-lede reveal mt-5 text-ink-soft" data-delay="2">
              One team, five stages, no hand-offs to third parties. You always know who is
              accountable for the work in front of you.
            </p>
            <div className="reveal mt-8" data-delay="3">
              <SmartImage
                folder="feature_walls"
                base="geometric-sculpted-wood-wall"
                alt="Geometric timber feature wall craftsmanship"
                ratio="16 / 10"
                className="rounded-lg"
                sizes="(min-width: 1024px) 38vw, 90vw"
              />
            </div>
          </div>

          <ol className="relative">
            {TIMELINE.map((t, i) => (
              <li
                key={t.k}
                className="reveal relative grid grid-cols-[auto_1fr] gap-5 pb-10 last:pb-0"
                data-delay={String(((i % 3) + 1))}
              >
                <div className="flex flex-col items-center">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-paper font-display text-lg text-accent">
                    {i + 1}
                  </span>
                  {i < TIMELINE.length - 1 && (
                    <span className="mt-2 w-px flex-1 bg-rule-strong" aria-hidden />
                  )}
                </div>
                <div className="pb-2">
                  <h3 className="font-display text-xl">{t.k}</h3>
                  <p className="section-lede mt-2 text-ink-soft">{t.v}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Material promises checklist */}
      <section className="section panel-dark">
        <div className="container-wide grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <p className="eyebrow reveal">The material promise</p>
            <h2 className="reveal mt-5 text-fluid-3xl text-paper" data-delay="1">
              Built for the Gulf climate — and guaranteed.
            </h2>
            <p className="section-lede reveal mt-5 max-w-md text-paper/70" data-delay="2">
              Every substrate and finish we use is specified to survive heat, humidity and
              time. It is why we can put a lifetime guarantee behind the work.
            </p>
          </div>
          <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {MATERIAL_PROMISES.map((m, i) => (
              <li
                key={m}
                className="reveal flex items-center gap-3 border-b border-paper/12 pb-4 text-paper/85"
                data-delay={String((i % 3) + 1)}
              >
                <Check size={18} className="shrink-0 text-accent-soft" aria-hidden />
                {m}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Capabilities */}
      <section className="section bg-paper">
        <div className="container-wide">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="eyebrow reveal">What we make</p>
              <h2 className="reveal mt-5 text-fluid-3xl" data-delay="1">
                Eleven disciplines, one workshop.
              </h2>
            </div>
            <Link href="/portfolio" className="btn-link reveal" data-delay="2">
              Browse the portfolio <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p, i) => (
              <Link
                key={p.slug}
                href={`/portfolio?cat=${p.slug}`}
                className="reveal group flex flex-col gap-2 bg-paper p-7 transition-colors hover:bg-paper-warm"
                data-delay={String((i % 3) + 1)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl">{p.title}</h3>
                  <ArrowUpRight
                    size={17}
                    className="text-ink-mute transition-all duration-base group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    aria-hidden
                  />
                </div>
                <p className="section-lede text-ink-mute">{p.short}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <DeveloperLogos />
      <CtaBand />
    </>
  );
}
