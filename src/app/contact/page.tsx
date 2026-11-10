import type { Metadata } from "next";
import { MessageCircle, Phone, Mail, MapPin, Clock } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { ContactForm } from "@/components/interactive/contact-form";
import { SITE, QUOTATION_TERMS } from "@/lib/site";
import { socialMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us | Request a Joinery Quote in Dubai",
  description:
    "Request a free joinery consultation and quote in Dubai. Share your brief by phone, WhatsApp or email for a site visit, scope review and itemised proposal.",
  alternates: { canonical: `${SITE.url}/contact` },
  ...socialMeta({
    key: "contact",
    path: "/contact",
    title: "Contact Joinery.ae — Bespoke Joinery Enquiries, Dubai",
    description:
      "Discuss your bespoke joinery project by phone, WhatsApp or email. Share room photos, dimensions, drawings and your preferred timing.",
  }),
};

const CHANNELS = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: SITE.phone,
    href: SITE.whatsappUrl,
    note: "Review your message, attach drawings or photos, then send",
    external: true,
  },
  {
    icon: Phone,
    label: "Call us",
    value: SITE.phone,
    href: `tel:${SITE.phoneE164}`,
    note: "Discuss your brief and arrange a project consultation",
  },
  {
    icon: Mail,
    label: "Email",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
    note: "For drawings, tenders & detailed briefs",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumb="Contact"
        eyebrow="Request a joinery quote in Dubai"
        title={<>Let&apos;s build something worth keeping.</>}
        intro="Tell us about your space, share your drawings or ask a question. Start with a free consultation, a no-obligation site visit and a review of your joinery scope."
        image={{ folder: "kitchens", base: "kitchen-17", alt: "Brushed metal kitchen tap on a veined countertop" }}
      />

      {/* Channels */}
      <section className="bg-paper pt-[var(--space-section)]">
        <div className="container-wide grid gap-px overflow-hidden rounded-lg border border-rule bg-rule md:grid-cols-3">
          {CHANNELS.map((c) => {
            const Icon = c.icon;
            return (
              <a
                key={c.label}
                href={c.href}
                {...(c.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="reveal group flex flex-col gap-3 bg-paper p-8 transition-colors hover:bg-paper-warm"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-paper">
                  <Icon size={20} aria-hidden />
                </span>
                <p className="eyebrow mt-1">{c.label}</p>
                <p className="font-display text-xl text-ink">{c.value}</p>
                <p className="section-lede text-ink-mute">{c.note}</p>
              </a>
            );
          })}
        </div>
      </section>

      {/* Form + details */}
      <section className="section bg-paper">
        <div className="container-wide grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* Form */}
          <div className="reveal" data-reveal="left">
            <p className="eyebrow">Project enquiry</p>
            <h2 className="mt-5 text-fluid-3xl">Tell us what you have in mind.</h2>
            <p className="section-lede mt-5 max-w-xl text-ink-soft">
              Share the location, approximate room sizes, storage needs, preferred finishes and timing. Photos and designer drawings help with an initial estimate; final pricing depends on the measured layout and agreed specification.
            </p>
            <div className="mt-9">
              <ContactForm />
            </div>
          </div>

          {/* Details sidebar */}
          <aside className="reveal space-y-8 lg:pl-4" data-reveal="right">
            <div className="rounded-lg border border-rule bg-paper-warm p-7">
              <p className="flex items-center gap-2 eyebrow">
                <MapPin size={15} aria-hidden /> Free initial consultation
              </p>
              <p className="section-lede mt-4 text-ink-soft">Contact the team to confirm the meeting or site-survey location, current visiting hours and appointment availability before travelling.</p>
              <p className="section-lede mt-4 text-ink-soft">{QUOTATION_TERMS.consultation}</p>
              <p className="section-lede mt-4 text-ink-soft">{QUOTATION_TERMS.additionalServices}</p>
            </div>

            <div className="rounded-lg border border-rule bg-paper-warm p-7">
              <p className="flex items-center gap-2 eyebrow">
                <Clock size={15} aria-hidden /> Before placing an order
              </p>
              <p className="section-lede mt-4 text-ink-soft">Request a written scope, material and fitting specification, approval drawings, payment stages and programme. Confirm changes, exclusions, workmanship and component warranty terms, and care requirements in writing.</p>
              <p className="section-lede mt-4 text-ink-soft">{QUOTATION_TERMS.pricing}</p>
            </div>

            <a
              href={SITE.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full justify-center"
            >
              Chat on WhatsApp <MessageCircle size={16} />
            </a>
          </aside>
        </div>
      </section>

    </>
  );
}
