import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function JoineryBrief() {
  return (
    <section className="section border-t border-rule bg-paper" aria-labelledby="joinery-brief-title">
      <div className="container-wide grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
          <p className="eyebrow">Your project, your starting point</p>
          <h2 id="joinery-brief-title" className="mt-5 text-fluid-3xl text-balance">A clear route from brief to fitted joinery.</h2>
          <p className="section-lede mt-6 max-w-xl text-ink-soft">Start with <Link href="/services/wardrobes" className="underline underline-offset-4 hover:text-accent-deep">custom wardrobes</Link>, <Link href="/services/kitchens" className="underline underline-offset-4 hover:text-accent-deep">kitchen cabinets</Link> or a wider bespoke joinery package. The first step is to agree what needs designing, making and installing.</p>
        </div>
        <div className="divide-y divide-rule border-y border-rule">
          <article className="py-7">
            <h3 className="font-display text-2xl">Already working with a designer?</h3>
            <p className="section-lede mt-4 text-ink-soft">Share the design intent, drawings, material references and hardware schedule. We coordinate site measurements and shop drawings for manufacture, with design decisions and approvals kept clear between you, your designer and the workshop.</p>
          </article>
          <article className="py-7">
            <h3 className="font-display text-2xl">Need help developing the joinery?</h3>
            <p className="section-lede mt-4 text-ink-soft">Start with room photos, dimensions and the way you want to use the space. Discuss the layout, finishes and fittings with the team, then agree the design scope, drawings, quotation and installation responsibilities.</p>
          </article>
          <p className="section-lede py-6 text-ink-soft">For either route, confirm drawing and sample approvals before manufacture, and agree the effect of later changes on price and timing.</p>
          <Link href="#project-quote" className="btn-link py-5">Prepare your project brief <ArrowUpRight size={16} aria-hidden /></Link>
        </div>
      </div>
    </section>
  );
}
