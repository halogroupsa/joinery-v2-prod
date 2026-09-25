"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SITE } from "@/lib/site";

/** Poster is frame 1 of the clip, so the handoff to video is seamless. */
const POSTER = "/img/hero-projects-poster.webp";
const VIDEO_SRC_1080 = "/videos/hero-projects-1080.mp4";
const VIDEO_SRC_720 = "/videos/hero-projects-720.mp4";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Slow, cinematic parallax — the media drifts and dims as you scroll past.
  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Reduced motion: stay on the poster frame, download nothing.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Data-saver and slow connections keep the poster (it is frame 1 anyway).
    const conn = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    if (conn?.saveData || /(^|-)2g$|^3g$/.test(conn?.effectiveType ?? "")) return;

    let cancelled = false;
    let idleId = 0;
    let timeoutId = 0;

    const start = () => {
      if (cancelled) return;
      // Source is picked client-side so phones pull the 720p cut (~3.5 MB)
      // instead of the 1080p master (~8.7 MB).
      v.src = window.matchMedia("(max-width: 820px)").matches
        ? VIDEO_SRC_720
        : VIDEO_SRC_1080;
      v.load();

      // Kick off playback as soon as we can (autoplay can be deferred on some
      // browsers until JS nudges it).
      if (v.readyState >= 2) setReady(true);
      v.play().catch(() => {});
    };

    // The video is decoration: hold it until the page has loaded and gone idle
    // so its megabytes don't compete with the fonts/CSS the headline needs.
    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(start, { timeout: 2500 });
      } else {
        timeoutId = setTimeout(start, 1200) as unknown as number;
      }
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      if (idleId) window.cancelIdleCallback(idleId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section
      ref={ref}
      className="c-hero relative h-[100svh] min-h-[34rem] w-full overflow-hidden bg-carbon-deep text-paper"
    >
      {/* Media layer */}
      <motion.div style={{ y: mediaY, scale: mediaScale }} className="absolute inset-0 will-change-transform">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${POSTER})` }}
          aria-hidden
        />
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={POSTER}
          aria-hidden
          onLoadedData={() => setReady(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-slower ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* Cinematic grade: warm vignette + bottom-weighted gradient for text legibility */}
        <div className="hero-vignette absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon-deep/85 via-carbon-deep/20 to-carbon-deep/35" />
        {/* Text scrim — confined to the lower-left headline block so the rest of
            the frame stays clear. Falls off to fully transparent by mid-frame. */}
        <div className="hero-text-scrim pointer-events-none absolute inset-0" />
      </motion.div>

      {/* Top scrim — keeps the (light) header legible over bright video frames */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-40 bg-gradient-to-b from-carbon-deep/70 to-transparent" />

      {/* Top meta row — hidden for now */}
      {/* <div className="container-wide relative z-10 flex items-center justify-between pt-[calc(var(--header-h)+1.1rem)] text-3xs uppercase tracking-[0.3em] text-paper/55">
        <span>Bespoke Joinery</span>
        <span className="hidden sm:inline">Al Quoz · Dubai · UAE</span>
        <span>Est. Atelier</span>
      </div> */}

      {/* Vertical edge label (editorial accent) — hidden for now */}
      {/* <div className="pointer-events-none absolute right-[max(1.1rem,calc((100vw-var(--container-wide))/2+1.1rem))] top-1/2 z-10 hidden -translate-y-1/2 rotate-90 origin-right items-center gap-3 text-3xs uppercase tracking-[0.42em] text-paper/45 xl:flex">
        <span className="h-px w-12 bg-paper/40" />
        Made in Dubai — In-House
      </div> */}

      {/* Headline — anchored lower-left, restrained scale */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container-wide absolute inset-x-0 bottom-[clamp(5.5rem,14vh,9rem)] z-10 will-change-transform"
      >
        <p className="reveal is-visible mb-6 flex items-center gap-3 text-2xs font-medium uppercase tracking-[0.34em] text-accent-soft">
          <span className="h-px w-9 bg-accent-soft" />
          Designed, made &amp; installed in-house
        </p>

        <h1 className="display-title max-w-[20ch] text-fluid-hero font-normal text-paper">
          Bespoke joinery in Dubai, built around your room.
        </h1>

        <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-paper/75 md:text-lg">
          Custom wardrobes, kitchens, doors and cabinetry — designed, fabricated and
          installed by our own team from Al Quoz, Dubai.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
          <a
            href={SITE.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 rounded-xs bg-paper px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.1em] text-ink transition-colors hover:bg-accent hover:text-paper"
          >
            Request a Quote
            <ArrowUpRight size={16} aria-hidden className="transition-transform duration-base group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-2 border-b border-paper/40 pb-1 text-xs font-semibold uppercase tracking-[0.1em] text-paper/90 transition-colors hover:border-accent-soft hover:text-accent-soft"
          >
            View the Portfolio
            <ArrowUpRight size={16} aria-hidden className="transition-transform duration-base group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </motion.div>

      {/* Bottom hairline credentials */}
      <div className="absolute inset-x-0 bottom-0 z-10 border-t border-paper/12">
        <div className="container-wide flex items-center justify-between py-3.5 text-2xs text-paper/60 sm:text-xs">
          <span className="tabular-nums">
            <span className="text-paper">{SITE.stats.years}+</span> Years
            <span className="mx-2 text-paper/25">/</span>
            <span className="text-paper">{SITE.stats.projects}+</span> Projects
            <span className="mx-2 hidden text-paper/25 sm:inline">/</span>
            <span className="hidden text-paper sm:inline">{SITE.stats.team}+</span>
            <span className="hidden sm:inline"> Team</span>
          </span>
          <span className="hidden items-center gap-2 uppercase tracking-[0.28em] md:flex">
            Scroll
            <span className="relative block h-7 w-px overflow-hidden bg-paper/20">
              <span className="absolute inset-x-0 top-0 h-2.5 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-accent-soft" />
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
