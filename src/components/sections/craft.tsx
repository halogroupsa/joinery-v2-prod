"use client";

import { useEffect, useRef, useState } from "react";

const CRAFT_VIDEO = "/videos/joinery-wip-web.mp4";
// First frame of the clip, so the poster and the video's opening frame match and
// there is no visible swap when playback starts.
const CRAFT_POSTER = "/img/joinery-wip-poster.webp";

const POINTS = [
  {
    n: "01",
    title: "Manufactured in-house",
    body: "No outsourcing. Every element is produced in our own Al Quoz facility, with complete control over quality and schedule.",
  },
  {
    n: "02",
    title: "European machinery",
    body: "CNC cutting, edge-banding and finishing lines deliver precision and consistency on every panel and joint.",
  },
  {
    n: "03",
    title: "Skilled craftsmen",
    body: "A 200-strong team of joiners and finishers with decades of combined experience on luxury Gulf projects.",
  },
  {
    n: "04",
    title: "True to the drawing",
    body: "Each piece matches your 3D visuals and technical drawings to the millimetre — installed to integrate seamlessly.",
  },
];

export function Craft() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasVideo, setHasVideo] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    // Nothing is fetched until the section is on screen; the poster stays up
    // until the first frame decodes (or for good if the video fails).
    const onLoaded = () => setHasVideo(true);
    el.addEventListener("loadeddata", onLoaded);

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!el.src) {
            el.src = CRAFT_VIDEO;
            el.load();
          }
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(el);

    return () => {
      obs.disconnect();
      el.removeEventListener("loadeddata", onLoaded);
    };
  }, []);

  return (
    <section id="craft" className="c-craft section panel-dark relative overflow-hidden">
      <div className="container-wide">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:items-stretch lg:gap-16">
          {/* Media */}
          <div className="reveal lg:h-full" data-reveal="left">
            {/* Stacked, the box keeps its own 4:3. From lg it drops the ratio and
                fills the grid row so it matches the copy column's height. */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg lg:aspect-auto lg:h-full">
              {/* The 4:3 floor at lg, as percentage padding rather than a ratio:
                  padding-% resolves against the box's own width, so the box can
                  never derive its width back from its height. The spacer sets the
                  row's minimum; h-full then grows the box whenever the copy is
                  taller. */}
              <div aria-hidden className="hidden pt-[75%] lg:block" />
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${CRAFT_POSTER})` }}
                aria-hidden
              />
              <video
                ref={videoRef}
                muted
                loop
                playsInline
                preload="none"
                poster={CRAFT_POSTER}
                aria-hidden
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-slower ${
                  hasVideo ? "opacity-100" : "opacity-0"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-carbon-deep/60 to-transparent" />
              <div className="absolute bottom-5 left-5 bg-carbon/80 px-4 py-2.5 text-xs uppercase tracking-[0.2em] text-paper">
                Behind the Craft
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="lg:flex lg:flex-col lg:justify-center">
            <p className="eyebrow reveal">Our Craft</p>
            <h2 className="reveal mt-5 text-fluid-3xl text-paper" data-delay="1">
              The difference is the factory floor.
            </h2>
            <p className="section-lede reveal mt-5 max-w-xl text-paper/70" data-delay="2">
              Owning the means of production is the whole point. It is how we hold the
              tolerances, hit the dates and stand behind the work — long after handover.
            </p>

            <div className="mt-9 grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {POINTS.map((p, i) => (
                <div key={p.n} className="reveal" data-delay={String((i % 2) + 1)}>
                  <span className="font-mono text-sm text-accent-soft">{p.n}</span>
                  <h3 className="mt-2 font-display text-xl text-paper">{p.title}</h3>
                  <p className="section-lede mt-2 text-paper/65">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
