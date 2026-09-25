"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SmartImage } from "@/components/ui/smart-image";
import { CountUp } from "@/components/ui/count-up";
import { SITE, MATERIAL_PROMISES } from "@/lib/site";

const STATS = [
  { value: SITE.stats.years, suffix: "+", label: "Years of craft" },
  { value: SITE.stats.projects, suffix: "+", label: "Projects delivered" },
  { value: SITE.stats.team, suffix: "+", label: "Skilled team" },
];

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "8%"]);

  return (
    <section className="c-manifesto section bg-paper">
      <div className="container-wide">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:gap-20">
          <div>
            <p className="eyebrow reveal">The Halo Signature Range</p>
            <h2 className="reveal mt-5 text-fluid-3xl text-balance" data-delay="1">
              Bespoke joinery,
              <br />
              crafted to perfection.
            </h2>
            {/* Measure caps the line length, but only once the column is wide
                enough to need it — below lg the column is already narrower. */}
            <div className="section-lede reveal mt-6 max-w-[58ch] space-y-4 text-ink-soft lg:max-w-[72ch]" data-delay="2">
              <p>
                We operate a fully equipped {SITE.facility}, producing world-class custom
                woodwork for residential, commercial and retail spaces. Every piece is
                designed, fabricated, finished and installed with precision and care.
              </p>
              <p>
                Wardrobes, kitchens, wood ceilings, wall panels, doors or one-off furniture —
                built in materials engineered to last a lifetime in the Gulf climate.
              </p>
            </div>

            {/* Promise chips */}
            <ul className="reveal mt-7 flex flex-wrap gap-2" data-delay="3">
              {MATERIAL_PROMISES.slice(0, 6).map((p) => (
                <li
                  key={p}
                  className="rounded-full border border-rule-strong/60 bg-paper-warm px-3.5 py-1.5 text-xs font-medium tracking-wide text-ink-soft"
                >
                  {p}
                </li>
              ))}
            </ul>

            {/* Stats */}
            <div ref={ref} className="mt-10 grid grid-cols-3 gap-6 border-t border-rule pt-8">
              {STATS.map((s) => (
                <div key={s.label} className="reveal" data-delay="2">
                  <div className="font-display text-fluid-2xl leading-none text-accent-deep">
                    <CountUp value={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-[0.16em] text-ink-mute">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Parallax image — matches the copy column's height from lg up */}
          <div className="reveal lg:h-full" data-reveal="right" data-delay="1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg lg:aspect-auto lg:h-full">
              <motion.div style={{ y: imgY }} className="absolute inset-[-8%]">
                <SmartImage
                  folder="common"
                  base="in-house-facility"
                  alt="Joinery.ae's in-house joinery facility in Al Quoz, Dubai"
                  className="h-full w-full"
                  sizes="(min-width: 1024px) 46vw, 100vw"
                />
              </motion.div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon/35 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 bg-carbon/80 px-4 py-2.5 text-xs uppercase tracking-[0.2em] text-paper">
                Al Quoz · In-house facility
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
