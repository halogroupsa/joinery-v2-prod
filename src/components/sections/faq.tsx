"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { MAINTENANCE_HREF } from "@/data/maintenance";
import { FAQ_HOME, type Faq } from "@/lib/site";
import { cn } from "@/lib/cn";

type FaqCta = { href: string; label: string };

interface FAQProps {
  items?: Faq[];
  eyebrow?: string;
  title?: React.ReactNode;
  lede?: React.ReactNode;
  /** Link under the lede. Pass `null` to omit it — e.g. on the page it points at. */
  cta?: FaqCta | null;
  /** Extra classes on the <section>, for adjacent-background tuning. */
  className?: string;
}

/** Defaults reproduce the homepage section, so `<FAQ />` is unchanged. */
export function FAQ({
  items = FAQ_HOME,
  eyebrow = "Questions",
  title = (
    <>
      Good to know before
      <br className="hidden sm:block" /> you brief us.
    </>
  ),
  lede = "Still unsure about something? Message us on WhatsApp and a member of the team will help.",
  cta = { href: MAINTENANCE_HREF, label: "Repairing existing joinery" },
  className,
}: FAQProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className={cn("c-faq section bg-paper-warm", className)}>
      <div className="container-wide">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:h-fit">
            <p className="eyebrow reveal">{eyebrow}</p>
            <h2 className="reveal mt-5 text-fluid-3xl text-balance" data-delay="1">
              {title}
            </h2>
            <p className="section-lede reveal mt-5 max-w-sm text-ink-soft" data-delay="2">
              {lede}
            </p>
            {cta && (
              <Link href={cta.href} className="btn-link reveal mt-6" data-delay="3">
                {cta.label} <ArrowUpRight size={15} aria-hidden />
              </Link>
            )}
          </div>

          <div className="reveal" data-delay="1">
            <ul className="divide-y divide-rule border-y border-rule">
              {items.map((item, i) => {
                const isOpen = open === i;
                return (
                  <li key={item.q}>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-5 py-5 text-left"
                    >
                      <span
                        className={cn(
                          "font-display text-fluid-lg transition-colors",
                          isOpen ? "text-accent-deep" : "text-ink",
                        )}
                      >
                        {item.q}
                      </span>
                      <Plus
                        size={20}
                        className={cn(
                          "shrink-0 text-ink-mute transition-transform duration-base",
                          isOpen && "rotate-45 text-accent",
                        )}
                        aria-hidden
                      />
                    </button>
                    <div
                      className="grid transition-all duration-slow ease-out-soft"
                      style={{
                        gridTemplateRows: isOpen ? "1fr" : "0fr",
                        opacity: isOpen ? 1 : 0,
                      }}
                    >
                      <div className="overflow-hidden">
                        <p className="section-lede max-w-2xl pb-6 pr-8 text-ink-soft">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
