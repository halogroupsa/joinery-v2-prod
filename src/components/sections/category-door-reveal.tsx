"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SmartImage, imageMeta } from "@/components/ui/smart-image";
import { imageAlt } from "@/data/image-alts";

// Extracted from door_openning_to_a_greenscreen.mp4 at 12 fps. The video has
// a long generated hold after the doors finish moving, so only the clean
// 11-second opening window is used.
const FRAME_COUNT = 132;
// Bump when the door frames are re-exported so browsers fetch the new pixels
// instead of serving the cached file at the same path (the frames are re-keyed
// green-screen exports, so a stale cache shows the old, over-keyed handles).
const FRAME_VERSION = 4;
const FRAME_PATH = (index: number) =>
  `/img/video-door-seq/door-${String(index).padStart(4, "0")}.webp?v=${FRAME_VERSION}`;
const OPEN_PROGRESS = 0.7;

type Project = {
  base: string;
  label: string;
};

type CategoryDoorRevealProps = {
  slug: "doors" | "wardrobe";
  backdrop: string;
  backdropAlt: string;
  eyebrow: string;
  heading: ReactNode;
  description: string;
  href: string;
  linkLabel: string;
  folder: "doors" | "kitchens" | "wardrobes";
  projects: Project[];
};

const DOOR_PROJECTS: Project[] = [
  { base: "door-01", label: "Pivot Entrance" },
  { base: "door-02", label: "Grooved Pivot" },
  { base: "door-03", label: "Carved Walnut" },
  { base: "door-04", label: "Panelled Double" },
  { base: "door-05", label: "Brass & Timber" },
  { base: "door-06", label: "Grand Entrance" },
  { base: "door-07", label: "Concealed Flush" },
  { base: "door-08", label: "Feature Pivot" },
];

const WARDROBE_PROJECTS: Project[] = [
  { base: "services-joinery-wardrobes-walkin-wardrobes", label: "Walk-in Wardrobe" },
  { base: "services-joinery-wardrobes-builtin-wardrobes", label: "Built-in Wardrobe" },
  { base: "services-joinery-wardrobes-sliding-wardrobes", label: "Glass-Fronted Wardrobes" },
  { base: "services-joinery-wardrobes-hindged-wardrobes", label: "Hinged Wardrobe" },
  { base: "services-joinery-wardrobes-internal-fittings", label: "Internal Fittings" },
  { base: "services-joinery-wardrobes-premium-finishes", label: "Premium Finishes" },
  { base: "wardrobes-10", label: "Smoked Oak Suite" },
  { base: "wardrobes-13", label: "Dressing Room" },
];

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function CategoryDoorReveal({
  slug,
  backdrop,
  backdropAlt,
  eyebrow,
  heading,
  description,
  href,
  linkLabel,
  folder,
  projects,
}: CategoryDoorRevealProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);
  // The backdrop is set only once the section nears the viewport, so the
  // large image doesn't compete with the hero on first load.
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let disposed = false;
    let initialized = false;
    let firstFrameReady = false;
    let animationFrame = 0;
    const frames: HTMLImageElement[] = [];
    const loaded = new Array<boolean>(FRAME_COUNT).fill(false);

    const sizeCanvas = (image: HTMLImageElement) => {
      if (canvas.width !== image.naturalWidth || canvas.height !== image.naturalHeight) {
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
      }
    };

    const resolveFrame = (index: number) => {
      for (let i = index; i >= 0; i -= 1) if (loaded[i]) return frames[i];
      for (let i = index + 1; i < FRAME_COUNT; i += 1) if (loaded[i]) return frames[i];
      return null;
    };

    let drawnIndex = -1;
    const draw = (index: number) => {
      const image = resolveFrame(index);
      if (!image) return;
      sizeCanvas(image);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      drawnIndex = index;
    };

    const progress = () => {
      const rect = section.getBoundingClientRect();
      const range = section.offsetHeight - window.innerHeight;
      return range > 0 ? clamp(-rect.top / range) : 0;
    };

    const applyReveal = (value: number) => {
      const reveal = clamp((value - 0.22) / 0.32);
      if (contentRef.current) contentRef.current.style.opacity = String(reveal);
      if (scrimRef.current) scrimRef.current.style.opacity = String(reveal);
      if (hintRef.current) hintRef.current.style.opacity = String(clamp(0.72 - value / 0.11));
    };

    const initialize = () => {
      if (initialized || disposed) return;
      initialized = true;
      setNearViewport(true);

      for (let index = 0; index < FRAME_COUNT; index += 1) {
        const image = new Image();
        image.decoding = "async";
        image.src = FRAME_PATH(index + 1);
        image.onload = () => {
          if (disposed) return;
          loaded[index] = true;
          if (!firstFrameReady) {
            firstFrameReady = true;
            setReady(true);
            draw(Math.round(clamp(progress() / OPEN_PROGRESS) * (FRAME_COUNT - 1)));
          }
        };
        frames[index] = image;
      }

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) {
        const lastFrame = frames[FRAME_COUNT - 1];
        const drawOpenFrame = () => draw(FRAME_COUNT - 1);
        if (lastFrame.complete && lastFrame.naturalWidth) drawOpenFrame();
        else lastFrame.addEventListener("load", drawOpenFrame, { once: true });
        if (contentRef.current) contentRef.current.style.opacity = "1";
        if (scrimRef.current) scrimRef.current.style.opacity = "1";
        if (hintRef.current) hintRef.current.style.opacity = "0";
        return;
      }

      let easedIndex = clamp(progress() / OPEN_PROGRESS) * (FRAME_COUNT - 1);
      const loop = () => {
        const value = progress();
        const targetIndex = clamp(value / OPEN_PROGRESS) * (FRAME_COUNT - 1);
        easedIndex += (targetIndex - easedIndex) * 0.18;
        if (Math.abs(targetIndex - easedIndex) < 0.05) easedIndex = targetIndex;
        const index = Math.round(easedIndex);
        if (index !== drawnIndex) draw(index);
        applyReveal(value);
        animationFrame = requestAnimationFrame(loop);
      };
      animationFrame = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          initialize();
        }
      },
      { rootMargin: "150% 0px" },
    );
    observer.observe(section);

    return () => {
      disposed = true;
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
      frames.forEach((image) => {
        image.onload = null;
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby={`${slug}-door-reveal-title`}
      className={`c-door-reveal c-${slug}-door-reveal relative h-[240vh] bg-carbon-deep text-paper`}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          role="img"
          aria-label={backdropAlt}
          className="absolute inset-0 bg-cover bg-center"
          style={nearViewport ? { backgroundImage: `url(${backdrop})` } : undefined}
        />

        <div
          ref={scrimRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[5] will-change-[opacity]"
          style={{
            opacity: 0,
            background:
              "radial-gradient(ellipse 74% 66% at 50% 58%, rgba(8,6,4,0.92) 0%, rgba(8,6,4,0.76) 42%, rgba(8,6,4,0.34) 74%, transparent 100%)",
          }}
        />

        <div
          ref={contentRef}
          style={{ opacity: 0 }}
          className="absolute inset-0 z-10 flex will-change-[opacity] flex-col items-center justify-center gap-7 px-5 text-center sm:gap-9 sm:px-6"
        >
          <div className="marquee w-full" aria-label={`${eyebrow} project highlights`}>
            <div className="marquee-track items-center">
              {[...projects, ...projects].map((project, index) => {
                // Derive the tile shape from the image's real dimensions
                // (from the manifest) instead of forcing every image portrait.
                // Landscape images get a 4:3 frame, portrait/square stay 3:4.
                const meta = imageMeta(folder, project.base);
                const isLandscape = meta ? meta.width > meta.height : false;
                const aspectRatio = isLandscape ? "4 / 3" : "3 / 4";
                const sizes = isLandscape
                  ? "(min-width: 640px) 256px, 199px"
                  : "(min-width: 640px) 144px, 112px";
                return (
                <figure
                  key={`${project.base}-${index}`}
                  aria-hidden={index >= projects.length || undefined}
                  style={{ aspectRatio }}
                  className="relative h-36 shrink-0 overflow-hidden sm:h-48"
                >
                  <SmartImage
                    folder={folder}
                    base={project.base}
                    alt={index < projects.length ? imageAlt(folder, project.base, project.label) : ""}
                    className="h-full w-full"
                    sizes={sizes}
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-carbon/80 px-2 py-1 text-3xs font-semibold uppercase tracking-[0.13em] text-paper">
                    {project.label}
                  </figcaption>
                </figure>
                );
              })}
            </div>
          </div>

          <div className="max-w-2xl px-2">
            <p className="eyebrow text-accent-soft">{eyebrow}</p>
            {/* Caption rhythm is mt-4 rather than the site's mt-5, and is
                shared with door-reveal.tsx: both are pinned overlays on a
                fixed-height panel, so the block is on a tighter budget. */}
            <h2 id={`${slug}-door-reveal-title`} className="mt-4 text-fluid-3xl text-paper">
              {heading}
            </h2>
            <p className="section-lede mx-auto mt-4 max-w-xl text-paper/75">
              {description}
            </p>
            <Link
              href={href}
              className="mt-5 inline-flex items-center gap-2 border border-paper/55 px-5 py-2.5 text-2xs font-semibold uppercase tracking-[0.1em] text-paper transition-colors hover:border-accent hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper sm:mt-6 sm:px-6 sm:py-3 sm:text-xs"
            >
              {linkLabel} <ChevronRight size={15} />
            </Link>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          aria-hidden
          className={`pointer-events-none absolute inset-0 z-20 h-full w-full object-cover transition-opacity duration-slower ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        />

        <span
          ref={hintRef}
          style={{ opacity: 0.72 }}
          className="pointer-events-none absolute bottom-6 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap text-3xs uppercase tracking-[0.32em] text-paper/65"
        >
          Scroll to open
        </span>
      </div>
    </section>
  );
}

export function DoorsDoorReveal() {
  return (
    <CategoryDoorReveal
      slug="doors"
      backdrop="/img/door-reveal-backgrounds/villa-living.webp"
      backdropAlt="A contemporary villa living space opening toward a pool courtyard"
      eyebrow="Custom Doors"
      heading={
        <>
          Every room begins with the way{" "}
          {/* Kept on one run so the line breaks before "you" rather than
              stranding "it." on a line of its own. */}
          <span className="whitespace-nowrap">you enter it.</span>
        </>
      }
      description="Pivot, sliding, flush and entrance doors — balanced to move quietly, detailed to feel substantial and made to belong to the architecture around them."
      href="/services/doors"
      linkLabel="Explore our doors"
      folder="doors"
      projects={DOOR_PROJECTS}
    />
  );
}

export function WardrobeDoorReveal() {
  return (
    <CategoryDoorReveal
      slug="wardrobe"
      backdrop="/img/door-reveal-backgrounds/walk-in-wardrobe.webp"
      backdropAlt="A symmetrical walk-in wardrobe with walnut cabinetry, smoked glass and warm integrated lighting"
      eyebrow="Custom Wardrobes"
      heading="Private spaces, precisely fitted."
      description="Walk-in, sliding and built-in wardrobes planned around what you own, with considered lighting and interiors that make every morning feel composed."
      href="/services/wardrobes"
      linkLabel="Explore our wardrobes"
      folder="wardrobes"
      projects={WARDROBE_PROJECTS}
    />
  );
}
