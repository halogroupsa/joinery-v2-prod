import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { SmartImage } from "@/components/ui/smart-image";
import { GALLERY_ITEMS } from "@/data/gallery";
import { JOINERY_PAGES, getJoineryPage } from "@/data/joinery-pages";
import { imageMeta } from "@/lib/images";
import { SITE, productHref } from "@/lib/site";
import { BUSINESS_SCHEMA, socialMeta } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return JOINERY_PAGES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getJoineryPage((await params).slug);
  if (!page) return {};

  return {
    title: page.seoTitle,
    description: page.description,
    alternates: { canonical: `${SITE.url}${productHref(page.slug)}` },
    ...socialMeta({
      key: page.slug,
      path: productHref(page.slug),
      title: `${page.name} in Dubai | Joinery.ae`,
      description: page.description,
    }),
  };
}

export default async function JoineryDetailPage({ params }: Props) {
  const page = getJoineryPage((await params).slug);
  if (!page) notFound();

  const related = JOINERY_PAGES.filter((item) => item.slug !== page.slug).slice(0, 3);
  const portfolioItems = GALLERY_ITEMS.filter((item) => item.categorySlug === page.slug).slice(0, 6);
  const portfolioHref = `/portfolio?cat=${page.slug}`;
  const portfolioImages = portfolioItems.map((item) => {
    const meta = imageMeta(item.folder, item.base);
    return {
      "@type": "ImageObject",
      contentUrl: `${SITE.url}/img/${item.folder}/${item.base}-${meta?.largest ?? 1200}.webp`,
      caption: item.alt,
      width: item.width,
      height: item.height,
    };
  });
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: `${page.name} in Dubai`,
        description: page.description,
        url: `${SITE.url}${productHref(page.slug)}`,
        areaServed: { "@type": "City", name: "Dubai" },
        provider: BUSINESS_SCHEMA,
        image: portfolioImages,
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faq.map((item) => ({
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
          { "@type": "ListItem", position: 3, name: page.name, item: `${SITE.url}${productHref(page.slug)}` },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />
      <PageHero
        crumb={page.name}
        parentCrumb={{ label: "Services", href: "/services" }}
        eyebrow={page.eyebrow}
        title={page.title}
        intro={page.intro}
        image={page.image}
      />

      <section className="section bg-paper" aria-labelledby="service-approach-title">
        <div className="container-wide grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-20">
          <div>
            <p className="eyebrow">How we approach it</p>
            <h2 id="service-approach-title" className="mt-5 max-w-[18ch] text-fluid-3xl text-balance">
              {page.approachTitle}
            </h2>
            <div className="section-lede mt-6 max-w-[62ch] space-y-4 text-ink-soft">
              <p>{page.body[0]}</p>
              <p>{page.body[1]}</p>
            </div>
            <Link href="/contact" className="btn-primary mt-8">
              Discuss your project <ArrowUpRight size={16} />
            </Link>
          </div>
          <aside aria-labelledby="service-scope-title">
            <p className="eyebrow">The scope</p>
            <h3 id="service-scope-title" className="mt-5 font-display text-2xl text-ink">
              What we can make.
            </h3>
            <ul className="mt-6 divide-y divide-rule border-y border-rule">
              {page.details.map((detail, index) => (
                <li key={detail} className="grid grid-cols-[2.25rem_1fr] items-start gap-4 py-4">
                  <span className="pt-1 font-mono text-xs text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-lg leading-snug text-ink-soft">{detail}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {portfolioItems.length > 0 && (
        <section className="section border-t border-rule bg-paper-warm" aria-labelledby="service-portfolio-title">
          <div className="container-wide">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <p className="eyebrow">Selected work</p>
                <h2 id="service-portfolio-title" className="mt-5 text-fluid-3xl">
                  {page.name}, seen in finished spaces.
                </h2>
                <p className="section-lede mt-5 text-ink-soft">{page.portfolioLead}</p>
              </div>
              <Link href={portfolioHref} className="btn-ghost shrink-0">
                View all projects <ArrowUpRight size={16} aria-hidden />
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {portfolioItems.map((item) => (
                <Link
                  key={item.id}
                  href={portfolioHref}
                  aria-label={`View more ${page.name.toLowerCase()} projects in the portfolio`}
                  className="group relative block overflow-hidden rounded-sm bg-paper"
                >
                  <figure className="relative">
                    <SmartImage
                      folder={item.folder}
                      base={item.base}
                      alt={item.alt}
                      ratio="4 / 3"
                      sizes="(min-width: 1024px) 29vw, (min-width: 640px) 46vw, 92vw"
                      className="h-full w-full !rounded-none"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon/70 via-transparent to-transparent opacity-0 transition-opacity duration-base group-hover:opacity-100 group-focus-visible:opacity-100" />
                    <figcaption className="pointer-events-none absolute bottom-4 left-4 right-4 translate-y-2 text-left text-paper opacity-0 transition-all duration-base group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                      <span className="block text-3xs uppercase tracking-[0.2em] text-accent-soft">
                        {item.categoryTitle}
                      </span>
                      <span className="mt-1 block font-display text-lg leading-tight">
                        {item.heading}
                      </span>
                    </figcaption>
                  </figure>
                </Link>
              ))}
            </div>

            <div className="mt-10 border-y border-rule py-4" aria-label={`${page.name} categories`}>
              <div className="marquee">
                <ul className="marquee-track items-center">
                  {[...page.subcategories, ...page.subcategories].map((subcategory, index) => (
                    <li
                      key={`${subcategory}-${index}`}
                      className="strip-label flex items-center gap-4 whitespace-nowrap text-ink-soft"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                      {subcategory}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section border-t border-rule bg-paper-warm">
        <div className="container-wide grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="eyebrow">Questions, answered plainly</p>
            <h2 className="mt-5 text-fluid-3xl">Before the drawings begin.</h2>
          </div>
          <dl className="divide-y divide-rule border-y border-rule">
            {page.faq.map((item) => (
              <div key={item.question} className="py-6">
                <dt className="font-display text-xl text-ink">{item.question}</dt>
                <dd className="mt-3 leading-relaxed text-ink-soft">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section border-t border-rule bg-paper">
        <div className="container-wide">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Explore the workshop</p>
              <h2 className="mt-5 text-fluid-3xl">More bespoke joinery.</h2>
            </div>
            <Link href="/portfolio" className="btn-ghost">View the portfolio <ArrowUpRight size={16} /></Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {related.map((item) => (
              <Link key={item.slug} href={productHref(item.slug)} className="group overflow-hidden rounded-lg border border-rule bg-paper-warm">
                <SmartImage folder={item.image.folder} base={item.image.base} alt={item.image.alt} ratio="4 / 3" sizes="(min-width: 768px) 30vw, 90vw" />
                <div className="flex items-center justify-between gap-4 p-5">
                  <h3 className="font-display text-xl">{item.name}</h3>
                  <ArrowUpRight size={17} className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
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
