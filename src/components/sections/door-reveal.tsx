"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import { imageAlt } from "@/data/image-alts";

const ROOM_POSTER = "/img/kitchens/kitchen-16-2000.webp";

// Pre-rendered frame sequence of the doors opening (Apple-style canvas scrub).
// A frame sequence loads as plain images and works on any static host, unlike a
// scroll-scrubbed <video> which relies on byte-range seeking that many CDNs and
// static exports don't serve reliably. The original videos are kept untouched.
const FRAME_COUNT = 83;
const FRAME_PATH = (i: number) =>
  `/img/door-seq/door-${String(i).padStart(4, "0")}.jpg`;

// Scroll fraction at which the doors finish opening. Past this, the section
// stays pinned on the open doorway (the dwell).
const OPEN_P = 0.7;

// Door projects shown in the marquee that lives "inside the room".
const DOOR_PROJECTS = [
  { base: "door-01", label: "Pivot Entrance" },
  { base: "door-02", label: "Grooved Pivot" },
  { base: "door-03", label: "Carved Walnut" },
  { base: "door-04", label: "Panelled Double" },
  { base: "door-05", label: "Brass & Timber" },
  { base: "door-06", label: "Grand Entrance" },
  { base: "door-07", label: "Concealed Flush" },
  { base: "door-08", label: "Feature Pivot" },
];

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

// Centred vertical band whose width is driven by the --half custom property.
// clip-path is cheap to update every frame, which keeps the scrub smooth.
const PORTAL_CLIP = "inset(0 calc(50% - var(--half)) 0 calc(50% - var(--half)))";

/**
 * Scroll-scrubbed door reveal (Apple product-page style). The doors-opening clip
 * is played as a canvas image sequence driven by scroll. Once the doors are
 * fully open, a marquee of door projects + the caption — clipped to the doorway
 * opening — are revealed inside the room; scroll back up and the doors close,
 * hiding them. The marquee animates continuously throughout.
 */
export function DoorReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);

  // Preload the frame sequence + drive everything from scroll position.
  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frames: HTMLImageElement[] = [];
    const loaded: boolean[] = new Array(FRAME_COUNT).fill(false);
    let firstReady = false;

    const sizeCanvasTo = (img: HTMLImageElement) => {
      if (canvas.width !== img.naturalWidth) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
      }
    };

    // Nearest loaded frame at or below idx (fallback to nearest above).
    const resolveFrame = (idx: number): HTMLImageElement | null => {
      for (let i = idx; i >= 0; i--) if (loaded[i]) return frames[i];
      for (let i = idx + 1; i < FRAME_COUNT; i++) if (loaded[i]) return frames[i];
      return null;
    };

    let drawnIdx = -1;
    const draw = (idx: number) => {
      const img = resolveFrame(idx);
      if (!img) return;
      sizeCanvasTo(img);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      drawnIdx = idx;
    };

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = FRAME_PATH(i + 1);
      img.onload = () => {
        loaded[i] = true;
        if (!firstReady) {
          firstReady = true;
          setReady(true);
          draw(0);
        }
      };
      frames[i] = img;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const progress = () => {
      const rect = section.getBoundingClientRect();
      const range = section.offsetHeight - window.innerHeight;
      return range > 0 ? clamp(-rect.top / range) : 0;
    };

    const applyReveal = (p: number) => {
      const x = clamp(p / OPEN_P);
      // Width of the doorway opening — stay a touch inside the gap so the band
      // never cuts the doors. Eased to roughly match the swing.
      const videoW = Math.max(window.innerWidth, (window.innerHeight * 16) / 9);
      const half = Math.pow(x, 1.6) * 0.3 * videoW;
      if (portalRef.current) portalRef.current.style.setProperty("--half", `${half}px`);
      const reveal = clamp((p - 0.3) / 0.3);
      if (contentRef.current) contentRef.current.style.opacity = String(reveal);
      if (scrimRef.current) scrimRef.current.style.opacity = String(reveal);
      if (hintRef.current) hintRef.current.style.opacity = String(clamp(0.7 - p / 0.1));
    };

    if (reduced) {
      const onLast = () => draw(FRAME_COUNT - 1);
      // Draw the open frame as soon as it lands.
      frames[FRAME_COUNT - 1].complete && frames[FRAME_COUNT - 1].naturalWidth
        ? onLast()
        : frames[FRAME_COUNT - 1].addEventListener("load", onLast, { once: true });
      if (portalRef.current) portalRef.current.style.setProperty("--half", "60vw");
      if (contentRef.current) contentRef.current.style.opacity = "1";
      if (scrimRef.current) scrimRef.current.style.opacity = "1";
      if (hintRef.current) hintRef.current.style.opacity = "0";
      return;
    }

    let raf = 0;
    let easedIdx = 0;
    const loop = () => {
      const p = progress();
      const targetIdx = clamp(p / OPEN_P) * (FRAME_COUNT - 1);
      easedIdx += (targetIdx - easedIdx) * 0.18;
      if (Math.abs(targetIdx - easedIdx) < 0.05) easedIdx = targetIdx;
      const idx = Math.round(easedIdx);
      if (idx !== drawnIdx) draw(idx);
      applyReveal(p);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={sectionRef} className="c-door-reveal relative h-[240vh] bg-carbon-deep text-paper">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Door clip as a canvas image sequence (poster shows until ready) */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${ROOM_POSTER})` }}
            aria-hidden
          />
          <canvas
            ref={canvasRef}
            aria-hidden
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-slower ${
              ready ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* Centre-dark gradient behind the text. Full-bleed and feathered to
            transparent at the edges, so there is no box — it sits over the room
            but under the text, and fades in only as the content appears. */}
        <div
          ref={scrimRef}
          aria-hidden
          style={{
            opacity: 0,
            background:
              "radial-gradient(ellipse 58% 46% at 50% 52%, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 38%, transparent 72%)",
          }}
          className="pointer-events-none absolute inset-0 z-[5]"
        />

        {/* Portal — behind the doors. Clipped to the doorway opening so it is
            only seen through the widening gap; hidden when the doors close. */}
        <div
          ref={portalRef}
          style={
            {
              "--half": "0px",
              clipPath: PORTAL_CLIP,
              WebkitClipPath: PORTAL_CLIP,
            } as React.CSSProperties
          }
          className="absolute inset-0 z-10"
        >
          {/* Content floats inside the open doorway over the real room; the
              centre-dark scrim behind it (above) keeps it legible. */}
          <div
            ref={contentRef}
            style={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-9 px-6 text-center"
          >
            {/* Marquee of door projects */}
            <div className="marquee w-full">
              <div className="marquee-track items-center">
                {[...DOOR_PROJECTS, ...DOOR_PROJECTS].map((d, i) => (
                  <figure
                    key={i}
                    aria-hidden={i >= DOOR_PROJECTS.length || undefined}
                    className="relative aspect-[3/4] w-36 shrink-0 overflow-hidden"
                  >
                    <SmartImage
                      folder="doors"
                      base={d.base}
                      alt={i < DOOR_PROJECTS.length ? imageAlt("doors", d.base, d.label) : ""}
                      className="h-full w-full"
                      sizes="144px"
                    />
                    <figcaption className="absolute inset-x-0 bottom-0 bg-carbon/75 px-2 py-1 text-3xs font-semibold uppercase tracking-[0.14em] text-paper">
                      {d.label}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>

            {/* Caption */}
            <div className="max-w-2xl">
              <p className="eyebrow text-accent-soft">Custom Doors</p>
              {/* Caption rhythm shared with category-door-reveal.tsx — see the
                  note there on why these overlays run tighter than mt-5. */}
              <h2 className="mt-4 text-fluid-3xl text-paper">
                Every room begins with the way you enter it.
              </h2>
              <p className="section-lede mx-auto mt-4 max-w-xl text-paper/75">
                Pivot, sliding, flush and entrance doors — balanced to swing silently and
                built to feel substantial in the hand.
              </p>
              <Link
                href="/portfolio?cat=doors"
                className="mt-5 inline-flex items-center gap-2 border border-paper/55 px-5 py-2.5 text-2xs font-semibold uppercase tracking-[0.1em] text-paper transition-colors hover:border-accent hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper sm:mt-6 sm:px-6 sm:py-3 sm:text-xs"
              >
                Explore our doors <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <span
          ref={hintRef}
          style={{ opacity: 0.72 }}
          className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap text-3xs uppercase tracking-[0.32em] text-paper/65"
        >
          Scroll to open
        </span>
      </div>
    </section>
  );
}
