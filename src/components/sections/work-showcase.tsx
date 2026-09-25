"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import { imageAlt } from "@/data/image-alts";
import { folderImages } from "@/components/ui/smart-image";
import { PRODUCTS, productHref } from "@/lib/site";

/** First available image base for a category folder. */
function heroBase(folder: string) {
  return folderImages(folder)[0]?.base ?? "";
}

const PANELS = PRODUCTS.map((p, i) => ({
  ...p,
  index: i,
  base: heroBase(p.folder),
  alt: imageAlt(p.folder, heroBase(p.folder), `${p.title} by Joinery.ae`),
}));

export function WorkShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, (p) => -distance * p);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      // Distance the track must travel so its right edge lines up with the
      // viewport's right edge at progress = 1.
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Tall scroll runway gives the horizontal track room to travel.
  const runway = `${Math.max(160, PANELS.length * 38)}vh`;

  return (
    <section id="work" className="c-work-showcase bg-carbon pb-[var(--space-section)] text-paper">
      {/* ---------- Desktop / tablet: horizontal pinned scroll ---------- */}
      <div ref={sectionRef} className="relative hidden md:block" style={{ height: runway }}>
        <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
          <div className="container-wide shrink-0 pt-[calc(var(--header-h)+2.5rem)] pb-8">
            <p className="eyebrow">What We Make</p>
            <h2 className="mt-5 text-fluid-3xl text-paper">
              Eleven disciplines, one workshop.
            </h2>
            <p className="section-lede mt-5 max-w-xl text-paper/60">
              Scroll to move through the range. Every category is designed, built and
              installed in-house.
            </p>
          </div>

          {/* Panels stretch to the height the header and rail leave behind
              rather than taking a fixed slice of the viewport. The heading
              block is three stacked lines now, so a fixed 62vh overran the
              h-screen column — and clipped the panels — on any laptop under
              roughly 850px tall. */}
          <div className="flex flex-1 items-stretch overflow-hidden">
            <motion.div
              ref={trackRef}
              style={{ x }}
              className="flex gap-5 px-[var(--space-gutter)] will-change-transform"
            >
              {PANELS.map((panel) => (
                <Link
                  key={panel.slug}
                  href={productHref(panel.slug)}
                  className="group relative block h-full w-[clamp(20rem,42vw,34rem)] shrink-0 overflow-hidden rounded-lg"
                >
                  <SmartImage
                    folder={panel.folder}
                    base={panel.base}
                    alt={panel.alt}
                    className="h-full w-full"
                    sizes="42vw"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon-deep/85 via-carbon-deep/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 lg:p-7">
                    <span className="font-mono text-xs tracking-[0.2em] text-accent-soft">
                      {String(panel.index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 font-display text-3xl text-paper">{panel.title}</h3>
                    <p className="section-lede mt-2 max-w-[28ch] text-paper/70">{panel.short}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-paper opacity-0 transition-opacity duration-base group-hover:opacity-100">
                      View work <ArrowUpRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </motion.div>
          </div>

          {/* progress rail */}
          <div className="container-wide shrink-0 pb-6 pt-2">
            <div className="relative h-px w-full bg-paper/15">
              <motion.div
                style={{ scaleX: scrollYProgress }}
                className="absolute inset-y-0 left-0 w-full origin-left bg-accent-soft"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Mobile: simple vertical reveal grid ---------- */}
      <div className="md:hidden">
        <div className="container-wide pt-[clamp(3.5rem,12vw,5rem)]">
          <p className="eyebrow">What We Make</p>
          <h2 className="mt-5 text-fluid-3xl text-paper">Eleven disciplines, one workshop.</h2>
          {/* The desktop lede opens with a scroll instruction that means
              nothing against this grid, so mobile keeps only the claim. */}
          <p className="section-lede mt-5 max-w-md text-paper/60">
            Every category is designed, built and installed in-house.
          </p>
        </div>
        <div className="container-wide mt-8 grid grid-cols-2 gap-4">
          {PANELS.map((panel) => (
            <Link
              key={panel.slug}
              href={productHref(panel.slug)}
              className="reveal group relative block aspect-[4/5] overflow-hidden rounded-md"
            >
              <SmartImage
                folder={panel.folder}
                base={panel.base}
                alt={panel.alt}
                className="h-full w-full"
                sizes="50vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon-deep/85 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="font-display text-xl text-paper">{panel.title}</h3>
                <p className="section-lede mt-1 text-paper/65">{panel.short}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
