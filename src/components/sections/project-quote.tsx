import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { SITE, QUOTATION_TERMS } from "@/lib/site";
import type { ServiceGuide } from "@/data/service-guides";

type Props = {
  id?: string;
  title?: string;
  subject?: string;
  inputs?: ServiceGuide["quoteInputs"];
  note?: string;
};

const INPUTS = [
  { title: "Space and location", body: "Your Dubai community, room photos, approximate dimensions and any building access restrictions." },
  { title: "Items to make", body: "Wardrobes, kitchen cabinets, doors or a larger joinery package, with the quantities and storage you need." },
  { title: "Drawings and finishes", body: "Designer drawings if available, reference images, preferred finishes and details that need matching." },
  { title: "Scope and timing", body: "What stays, what needs removing, related trades and your preferred installation window." },
];

export function ProjectQuote({
  id = "project-quote",
  title = "Start with a clear joinery brief.",
  subject = "bespoke joinery",
  inputs = INPUTS,
  note = `${QUOTATION_TERMS.consultation} ${QUOTATION_TERMS.pricing} Confirm the programme, payment terms and warranty coverage before ordering.`,
}: Props) {
  return (
    <section id={id} className="section scroll-mt-28 border-t border-rule bg-paper" aria-labelledby={`${id}-title`}>
      <div className="container-wide grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
        <div>
          <p className="eyebrow">Your quotation</p>
          <h2 id={`${id}-title`} className="mt-5 text-fluid-3xl text-balance">{title}</h2>
          <p className="section-lede mt-6 max-w-xl text-ink-soft">{note}</p>
          <p className="section-lede mt-4 max-w-xl text-ink-soft">{QUOTATION_TERMS.additionalServices}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a href={`${SITE.whatsappUrl}?text=${encodeURIComponent(`Hello Joinery.ae, I'd like a quote for ${subject}. I can share my location, photos, dimensions and requirements.`)}`} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Discuss your quote <MessageCircle size={16} aria-hidden />
            </a>
            <Link href="/contact" className="btn-link">Prepare a project brief <ArrowUpRight size={16} aria-hidden /></Link>
          </div>
        </div>
        <ol className="grid gap-x-8 border-t border-rule sm:grid-cols-2">
          {inputs.map((item, index) => (
            <li key={item.title} className="border-b border-rule py-7">
              <span className="font-mono text-xs text-accent-deep">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-display text-xl">{item.title}</h3>
              <p className="section-lede mt-3 text-ink-soft">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
