import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ServiceGuide as Guide } from "@/data/service-guides";
import type { ProcessStep } from "@/data/service-process";
import { ProcessCards } from "@/components/sections/process-cards";

export function ServiceSpecification({ guide }: { guide: Guide }) {
  return (
    <section className="section border-t border-rule bg-paper-warm" aria-labelledby="service-specification-title">
      <div className="container-wide">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow">Materials and fittings</p>
            <h2 id="service-specification-title" className="mt-5 max-w-[24ch] text-fluid-3xl text-balance">{guide.specificationTitle}</h2>
          </div>
          <p className="section-lede max-w-2xl self-end text-ink-soft">{guide.specificationIntro}</p>
        </div>
        <div className="mt-10 grid gap-px border border-rule bg-rule md:grid-cols-3">
          {guide.specifications.map((item, index) => (
            <article key={item.title} className="bg-paper p-7 lg:p-9">
              <p className="font-mono text-xs text-accent-deep">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-5 font-display text-2xl">{item.title}</h3>
              <p className="section-lede mt-4 text-ink-soft">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServiceProcess({ steps }: { steps: ProcessStep[] }) {
  return (
    <section className="section panel-dark border-y border-paper/10" aria-labelledby="service-process-title">
      <div className="container-wide">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">From measure to installation</p>
            <h2 id="service-process-title" className="mt-5 max-w-[26ch] text-fluid-3xl text-paper text-balance">Agree the details before the first cut.</h2>
          </div>
          <Link href="/#craft" className="btn-link shrink-0 text-paper">Explore the workshop <ArrowUpRight size={16} aria-hidden /></Link>
        </div>
        <ProcessCards steps={steps} dark />
        <p className="mt-6 text-sm text-paper/60">Images illustrate the stages. Discuss the survey, approvals and fitting arrangements for your own project.</p>
      </div>
    </section>
  );
}

export function ServiceScope({ guide }: { guide: Guide }) {
  return (
    <section className="section border-t border-rule bg-paper-warm" aria-labelledby="service-quotation-scope-title">
      <div className="container-wide grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
          <p className="eyebrow">Price and scope</p>
          <h2 id="service-quotation-scope-title" className="mt-5 text-fluid-3xl text-balance">Know what the quotation covers.</h2>
          <p className="section-lede mt-6 max-w-xl text-ink-soft">Compare the same dimensions, specification and installation scope. Any change after approval can affect the price, material order and delivery date.</p>
          <div className="mt-8 max-w-xl border-t border-rule pt-7">
            <h3 className="font-display text-xl">Joinery or a full renovation?</h3>
            <p className="section-lede mt-3 text-ink-soft">Joinery&apos;s specialist package focuses on measured cabinetry, technical drawings, manufacture and fitting. Related building work needs to be listed separately in the agreed scope.</p>
            <p className="section-lede mt-4 text-ink-soft">Halo&apos;s full renovation service coordinates the wider project, including design, approvals, construction, building services and finishes. If your brief includes moving walls or services, or renovating several rooms, discuss that wider scope with Halo.</p>
            <a href="https://halo.ae/services/villa-renovation-dubai" className="btn-link mt-5">Explore Halo renovations <ArrowUpRight size={16} aria-hidden /></a>
          </div>
        </div>
        <dl className="divide-y divide-rule border-y border-rule">
          {guide.scope.map((item) => (
            <div key={item.title} className="py-6">
              <dt className="font-display text-xl">{item.title}</dt>
              <dd className="section-lede mt-3 text-ink-soft">{item.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
