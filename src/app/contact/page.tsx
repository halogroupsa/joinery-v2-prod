import type { Metadata } from "next";
import { MessageCircle, Phone, Mail, MapPin, Clock } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { ContactForm } from "@/components/interactive/contact-form";
import { SITE } from "@/lib/site";
import { socialMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us | Request a Joinery Quote in Dubai",
  description:
    "Request a joinery quote in Dubai. Call, WhatsApp or email Joinery.ae with drawings or photos, or visit our 15,000 sq.ft. workshop in Al Quoz.",
  alternates: { canonical: `${SITE.url}/contact` },
  ...socialMeta({
    key: "contact",
    path: "/contact",
    title: "Contact Joinery.ae — Bespoke Joinery Enquiries, Dubai",
    description:
      "Start your bespoke joinery project. Call, WhatsApp or email us, or visit our Al Quoz facility.",
  }),
};

const CHANNELS = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: SITE.phone,
    href: SITE.whatsappUrl,
    note: "Fastest reply — send drawings or photos",
    external: true,
  },
  {
    icon: Phone,
    label: "Call us",
    value: SITE.phone,
    href: `tel:${SITE.phoneE164}`,
    note: "Mon–Sat, 8:00 AM – 6:00 PM",
  },
  {
    icon: Mail,
    label: "Email",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
    note: "For drawings, tenders & detailed briefs",
  },
];

const HOURS = [
  { d: "Monday – Saturday", h: "8:00 AM – 6:00 PM" },
  { d: "Sunday", h: "Closed" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumb="Contact"
        eyebrow="Request a joinery quote in Dubai"
        title={<>Let&apos;s build something worth keeping.</>}
        intro="Tell us about your space, share your drawings or just ask a question. We typically reply the same working day."
        image={{ folder: "kitchens", base: "kitchen-17", alt: "Brushed steel kitchen tap on a marble countertop by Joinery.ae, Dubai" }}
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
              The more detail you share — room sizes, finishes, timeline, any designer
              drawings — the faster we can come back with an accurate quote.
            </p>
            <div className="mt-9">
              <ContactForm />
            </div>
          </div>

          {/* Details sidebar */}
          <aside className="reveal space-y-8 lg:pl-4" data-reveal="right">
            <div className="rounded-lg border border-rule bg-paper-warm p-7">
              <p className="flex items-center gap-2 eyebrow">
                <MapPin size={15} aria-hidden /> The Facility
              </p>
              <p className="mt-4 font-display text-xl">{SITE.address.line1}</p>
              <p className="mt-1 text-sm text-ink-soft">{SITE.address.line2}</p>
              <p className="mt-1 text-sm text-ink-soft">
                {SITE.address.city}, {SITE.address.country}
              </p>
              <p className="mt-3 text-sm text-accent-deep">{SITE.facility}</p>
            </div>

            <div className="rounded-lg border border-rule bg-paper-warm p-7">
              <p className="flex items-center gap-2 eyebrow">
                <Clock size={15} aria-hidden /> Working Hours
              </p>
              <dl className="mt-4 grid gap-2 text-sm">
                {HOURS.map((h) => (
                  <div key={h.d} className="flex items-center justify-between gap-4">
                    <dt className="text-ink-soft">{h.d}</dt>
                    <dd className="font-medium text-ink">{h.h}</dd>
                  </div>
                ))}
              </dl>
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

      {/* Map */}
      <section className="bg-paper pb-[var(--space-section)]">
        <div className="container-wide">
          <div className="overflow-hidden rounded-lg border border-rule">
            <iframe
              title="Joinery.ae facility location — Al Quoz, Dubai"
              src="https://www.google.com/maps?q=Marabea+Street,+Al+Quoz+1,+Dubai,+United+Arab+Emirates&z=15&output=embed"
              className="h-[clamp(18rem,38vh,28rem)] w-full grayscale-[0.2]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
