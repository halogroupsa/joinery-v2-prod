"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import { SITE } from "@/lib/site";

export function CtaBand() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section ref={ref} className="c-cta-band relative overflow-hidden panel-dark">
      {/* Parallax backdrop */}
      <motion.div style={{ y }} className="absolute inset-[-12%] -z-0">
        <SmartImage
          folder="wall_panels"
          base="geometric-designs-wood-panels"
          alt=""
          className="h-full w-full"
          // The parallax wrapper is inset-[-12%], so the box is ~124vw — not 100vw.
          sizes="124vw"
        />
      </motion.div>
      <div className="absolute inset-0 bg-carbon-deep/78" />
      {/* Centre-weighted scrim so the headline and lede clear the panel pattern */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 78% 70% at 50% 50%, rgba(8,6,4,0.72) 0%, rgba(8,6,4,0.42) 55%, rgba(8,6,4,0.1) 100%)",
        }}
      />

      <div className="container-wide relative z-10 py-[clamp(4.5rem,4rem+6vw,9rem)] text-center">
        <p className="eyebrow reveal text-accent-soft">Start your project</p>
        <h2 className="reveal mx-auto mt-5 max-w-[20ch] text-fluid-4xl text-paper" data-delay="1">
          Let&apos;s build something worth keeping.
        </h2>
        <p className="section-lede reveal mx-auto mt-6 max-w-2xl text-paper/75" data-delay="2">
          Book a free consultation and let our craftsmen assess your requirements. You&apos;ll
          get detailed designs and transparent pricing for your bespoke joinery — made in
          Dubai, installed by us.
        </p>
        <div className="reveal mt-9 flex flex-wrap items-center justify-center gap-3" data-delay="3">
          <a
            href={SITE.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xs bg-accent px-7 py-4 text-xs font-semibold uppercase tracking-[0.08em] text-paper transition-colors hover:bg-accent-soft hover:text-ink"
          >
            WhatsApp Now <ChevronRight size={16} />
          </a>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 rounded-xs border border-paper/55 px-7 py-4 text-xs font-semibold uppercase tracking-[0.08em] text-paper transition-colors hover:border-accent-soft hover:bg-paper hover:text-ink"
          >
            See the Portfolio
          </Link>
        </div>
        <p className="reveal mt-8 text-sm text-paper/55" data-delay="3">
          Or call{" "}
          <a href={`tel:${SITE.phoneE164}`} className="text-paper underline-offset-4 hover:underline">
            {SITE.phone}
          </a>
        </p>
      </div>
    </section>
  );
}
