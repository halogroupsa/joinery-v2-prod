"use client";

import { useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SmartImage, folderImages } from "@/components/ui/smart-image";

/** Caption and alt text for each workshop portrait, keyed by image base so
 *  every caption describes the photo it sits on. */
const PORTRAITS: Record<string, { caption: string; alt: string }> = {
  j1: { caption: "Surface sanding", alt: "Joiner sanding a lacquered panel with an orbital sander in the Joinery.ae workshop" },
  j2: { caption: "Shaping curves", alt: "Craftsman shaping a curved timber component by hand" },
  j3: { caption: "Edge banding", alt: "Joiner applying timber edge banding to a curved panel" },
  j4: { caption: "Curved panel build", alt: "Joiner fitting strips to a curved panel former in the workshop" },
  j5: { caption: "Measuring up", alt: "Two joiners measuring and marking a panel with a tape measure" },
  j6: { caption: "Veneer bending", alt: "Joinery team bending a curved veneer piece at the workbench" },
  j8: { caption: "Routing", alt: "Craftsman routing a timber edge with a handheld router" },
  j10: { caption: "Reviewing drawings", alt: "Two joiners reviewing technical shop drawings on the bench" },
  j11: { caption: "Site install", alt: "Installers making final adjustments to a bespoke kitchen on site" },
  j12: { caption: "Carcass assembly", alt: "Joiners assembling cabinet carcasses in the Al Quoz workshop" },
  j13: { caption: "Marking out", alt: "Craftsman marking out a timber batten at the workbench" },
  j14: { caption: "Curved formwork", alt: "Joiner building a curved drum form with hand tools laid out" },
  j15: { caption: "Quality check", alt: "Joiners inspecting a patterned veneer surface before finishing" },
  joi19: { caption: "Hand finishing", alt: "Craftsman hand finishing a curved white lacquered piece" },
};

const portraitInfo = (base: string) =>
  PORTRAITS[base] ?? { caption: "Workshop craft", alt: "Joinery.ae craftsman at work in the Al Quoz workshop" };

/** Copies of the strip laid end to end so there is always content either side
 *  of the viewport to wrap into — the middle copy is the one on screen. */
const COPIES = 3;
/** Constant drift, in pixels per second. Roughly one card every 7s. */
const DRIFT_SPEED = 38;
/** How long an arrow nudge takes to settle before the drift resumes. */
const NUDGE_MS = 520;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function JoineryPortraits() {
  const railRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const dragRef = useRef({
    active: false,
    moved: false,
    pointerId: -1,
    startScrollLeft: 0,
    startX: 0,
  });
  const portraits = folderImages("portraits");
  const count = portraits.length;

  // Width of a single copy of the strip — the distance the rail travels before
  // it repeats, and the amount we shift by when wrapping.
  const loopWidthRef = useRef(0);
  const cardStepRef = useRef(0);
  // Arrow nudges are tweened by hand rather than with native smooth scrolling,
  // which cannot survive the instant scrollLeft shifts a seamless wrap needs.
  const tweenRef = useRef<{ from: number; delta: number; start: number } | null>(null);
  const hoverRef = useRef(false);
  const inViewRef = useRef(true);
  const reduceMotionRef = useRef(false);
  // Holds the drift off for a beat after the user drags, scrolls or nudges.
  const pauseUntil = useRef(0);

  const measure = useCallback(() => {
    const rail = railRef.current;
    if (!rail || count === 0) return;
    const cards = rail.querySelectorAll<HTMLElement>(".portrait-card");
    if (cards.length < count + 1) return;
    loopWidthRef.current = cards[count].offsetLeft - cards[0].offsetLeft;
    cardStepRef.current =
      cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 0;
  }, [count]);

  // Keeps the rail parked inside the middle copy. Returns how far it was
  // shifted so in-flight drags and tweens can follow the jump.
  const normalize = useCallback(() => {
    const rail = railRef.current;
    const loop = loopWidthRef.current;
    if (!rail || loop <= 0) return 0;
    const wrapped = (((rail.scrollLeft - loop) % loop) + loop) % loop;
    const shift = wrapped + loop - rail.scrollLeft;
    if (Math.abs(shift) < 0.5) return 0;
    rail.scrollLeft += shift;
    return shift;
  }, []);

  const nudgePause = useCallback(() => {
    pauseUntil.current = Date.now() + 2_000;
  }, []);

  // Arrow controls: glide exactly one card, then hand back to the drift.
  const nudgeByCards = useCallback(
    (dir: 1 | -1) => {
      const rail = railRef.current;
      if (!rail) return;
      if (cardStepRef.current === 0) measure();
      const step = cardStepRef.current;
      if (step === 0) return;
      tweenRef.current = {
        from: rail.scrollLeft,
        delta: dir * step,
        start: performance.now(),
      };
    },
    [measure],
  );

  const stopDrag = useCallback((pointerId?: number) => {
    const rail = railRef.current;
    const drag = dragRef.current;
    if (!drag.active) return;

    drag.active = false;
    rail?.classList.remove("is-dragging");

    if (rail && pointerId !== undefined && rail.hasPointerCapture(pointerId)) {
      rail.releasePointerCapture(pointerId);
    }
  }, []);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      nudgePause();
      tweenRef.current = null;

      if (event.pointerType !== "mouse" || event.button !== 0) return;

      const rail = railRef.current;
      if (!rail) return;

      dragRef.current = {
        active: true,
        moved: false,
        pointerId: event.pointerId,
        startScrollLeft: rail.scrollLeft,
        startX: event.clientX,
      };
      rail.classList.add("is-dragging");
      rail.setPointerCapture(event.pointerId);
    },
    [nudgePause],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const rail = railRef.current;
      const drag = dragRef.current;
      if (!rail || !drag.active || drag.pointerId !== event.pointerId) return;

      const deltaX = event.clientX - drag.startX;
      if (Math.abs(deltaX) > 3) drag.moved = true;
      rail.scrollLeft = drag.startScrollLeft - deltaX;
      // A wrap mid-drag moves the rail under the pointer; move the drag origin
      // with it so the card stays glued to the cursor.
      drag.startScrollLeft += normalize();
      event.preventDefault();
    },
    [normalize],
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      nudgePause();
      stopDrag(event.pointerId);
    },
    [nudgePause, stopDrag],
  );

  const handleClickCapture = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!dragRef.current.moved) return;
    dragRef.current.moved = false;
    event.preventDefault();
    event.stopPropagation();
  }, []);

  // Measure the strip, park on the middle copy, and re-measure on resize.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || count === 0) return;

    const sync = () => {
      measure();
      normalize();
    };

    measure();
    rail.scrollLeft = loopWidthRef.current;

    const observer = new ResizeObserver(sync);
    observer.observe(rail);
    window.addEventListener("resize", sync);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, [count, measure, normalize]);

  // Skip the drift while the section is off screen.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
      },
      { rootMargin: "128px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // The wheel itself: a constant-velocity drift that never reaches an end,
  // plus the arrow tween when one is in flight.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || count === 0) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceMotionRef.current = reduce.matches;
    const onReduceChange = (event: MediaQueryListEvent) => {
      reduceMotionRef.current = event.matches;
    };
    reduce.addEventListener("change", onReduceChange);

    let frame = 0;
    let last = 0;

    const tick = (now: number) => {
      frame = window.requestAnimationFrame(tick);
      const elapsed = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;

      const tween = tweenRef.current;
      if (tween) {
        const progress = Math.min(1, (now - tween.start) / NUDGE_MS);
        rail.scrollLeft = tween.from + tween.delta * easeOutCubic(progress);
        tween.from += normalize();
        if (progress >= 1) tweenRef.current = null;
        return;
      }

      if (
        elapsed === 0 ||
        dragRef.current.active ||
        hoverRef.current ||
        !inViewRef.current ||
        reduceMotionRef.current ||
        Date.now() < pauseUntil.current
      ) {
        return;
      }

      rail.scrollLeft += DRIFT_SPEED * elapsed;
      normalize();
    };

    frame = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frame);
      reduce.removeEventListener("change", onReduceChange);
    };
  }, [count, normalize]);

  // Three copies end to end, so the strip reads as one endless loop.
  const track = Array.from({ length: COPIES }, (_, copy) =>
    portraits.map((portrait, i) => ({ portrait, i, copy, key: `${copy}-${portrait.base}` })),
  ).flat();

  return (
    <section
      ref={sectionRef}
      id="portraits"
      className="c-joinery-portraits section bg-paper-warm"
    >
      <div className="container-wide">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow reveal">Our Craftsmanship</p>
            <h2 className="reveal mt-5 text-fluid-3xl" data-delay="1">
              The team behind every joint.
            </h2>
            <p className="section-lede reveal mt-5 text-ink-soft" data-delay="2">
              Premium materials become bespoke, precision-crafted pieces in the hands of our
              joiners — one detail at a time, from first cut to final polish.
            </p>
          </div>
          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              onClick={() => {
                nudgePause();
                nudgeByCards(-1);
              }}
              aria-label="Scroll left"
              className="grid h-11 w-11 place-items-center rounded-full border border-rule-strong text-ink transition-colors hover:bg-accent hover:text-paper hover:border-accent"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => {
                nudgePause();
                nudgeByCards(1);
              }}
              aria-label="Scroll right"
              className="grid h-11 w-11 place-items-center rounded-full border border-rule-strong text-ink transition-colors hover:bg-accent hover:text-paper hover:border-accent"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Draggable, endlessly looping filmstrip — runs edge to edge. */}
      <div
        ref={railRef}
        data-lenis-prevent-touch
        onClickCapture={handleClickCapture}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onMouseEnter={() => {
          hoverRef.current = true;
        }}
        onMouseLeave={() => {
          hoverRef.current = false;
        }}
        onWheel={nudgePause}
        onScroll={() => {
          // Touch flings and trackpad scrolls move the rail without us; keep
          // them inside the loop too.
          if (!dragRef.current.active && !tweenRef.current) normalize();
        }}
        className="portrait-rail no-scrollbar mt-10 flex gap-4 overflow-x-auto pb-2 md:mt-12 md:gap-5"
        style={{ scrollbarWidth: "none" }}
      >
        {track.map(({ portrait, i, copy, key }) => (
          <figure
            key={key}
            className="portrait-card group relative aspect-[3/4] shrink-0 overflow-hidden rounded-lg"
          >
            <SmartImage
              folder="portraits"
              base={portrait.base}
              alt={copy === 1 ? portraitInfo(portrait.base).alt : ""}
              className="h-full w-full"
              sizes="(min-width: 1280px) 18vw, (min-width: 768px) 26vw, (min-width: 640px) 44vw, 72vw"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon/75 via-transparent to-transparent opacity-80 transition-opacity duration-base group-hover:opacity-100" />
            <figcaption className="absolute bottom-0 left-0 right-0 flex items-center gap-2.5 p-4 text-paper">
              <span className="font-mono text-2xs text-accent-soft">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-medium tracking-wide">
                {portraitInfo(portrait.base).caption}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="container-wide mt-6 md:hidden">
        <p className="text-xs uppercase tracking-[0.2em] text-ink-mute">
          Swipe to explore →
        </p>
      </div>
    </section>
  );
}
