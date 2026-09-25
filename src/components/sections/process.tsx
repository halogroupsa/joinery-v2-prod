"use client";

import { SmartImage } from "@/components/ui/smart-image";
import { imageAlt } from "@/data/image-alts";

const STEPS = [
  {
    n: "01",
    title: "Consult & measure",
    body: "We meet at your site, understand the brief and take precise measurements — or work directly from your designer's drawings.",
    folder: "office_furniture",
    base: "executive-workspace",
  },
  {
    n: "02",
    title: "Design & 3D",
    body: "Our team produces technical drawings and photoreal 3D visuals so you see exactly what will be built before a single cut is made.",
    folder: "feature_walls",
    base: "geometric-sculpted-wood-wall",
  },
  {
    n: "03",
    title: "Approve & schedule",
    body: "A transparent quote and a production schedule are issued together. You always know the cost and where your project stands.",
    folder: "wall_panels",
    base: "fluted-wood-panels",
  },
  {
    n: "04",
    title: "Fabricate in-house",
    body: "Your joinery is cut, assembled and finished in our Al Quoz facility on European machinery, under full quality control.",
    folder: "kitchens",
    base: "kitchen-13",
  },
  {
    n: "05",
    title: "Finish & install",
    body: "Our site team delivers and installs to the millimetre, integrating seamlessly with the wider fit-out and handing over clean.",
    folder: "wardrobes",
    base: "services-joinery-wardrobes-premium-finishes",
  },
];

export function Process() {
  return (
    <section id="process" className="c-process section bg-paper">
      <div className="container-wide">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="eyebrow">How We Work</p>
          <h2 className="mt-5 text-fluid-3xl text-balance">
            From first sketch to final fit.
          </h2>
          <p className="section-lede mt-5 max-w-xl text-ink-soft">
            One team owns the whole journey — design, fabrication and site — so nothing
            gets lost in the handover. Five clear stages, start to finish.
          </p>
        </div>

        {/* Stepped grid */}
        <ol className="mt-14 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="reveal group flex flex-col bg-paper transition-colors duration-base hover:bg-paper-warm"
            >
              {/* Image */}
              <div className="relative">
                <SmartImage
                  folder={s.folder}
                  base={s.base}
                  alt={imageAlt(s.folder, s.base, s.title)}
                  className="aspect-[4/3] w-full"
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon/55 to-transparent" />
                <span className="pointer-events-none absolute bottom-3 left-4 font-display text-4xl leading-none text-paper">
                  {s.n}
                </span>
              </div>

              {/* Copy */}
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 h-px w-10 bg-accent" aria-hidden />
                <h3 className="font-display text-xl">{s.title}</h3>
                <p className="section-lede mt-3 text-ink-soft">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
