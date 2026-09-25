"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, ScanSearch } from "lucide-react";

type KitchenScheme = {
  id: string;
  title: string;
  mood: string;
  cabinet: string;
  cabinetNote: string;
  stone: string;
  stoneNote: string;
  cabinetColor: string;
  stoneSwatch: string;
};

const KITCHEN_SCHEMES: KitchenScheme[] = [
  {
    id: "smoked-walnut-arabescato",
    title: "The Collector",
    mood: "Warm · Architectural",
    cabinet: "Smoked walnut",
    cabinetNote: "Book-matched vertical grain",
    stone: "Arabescato",
    stoneNote: "Honed · bold charcoal movement",
    cabinetColor: "#3f2a20",
    stoneSwatch:
      "linear-gradient(118deg, #eee9df 0 34%, #777069 35% 37%, #f4f0e7 38% 62%, #524e4a 63% 65%, #d9d3c9 66%)",
  },
  {
    id: "chalk-ivory-calacatta",
    title: "The Classic",
    mood: "Light · Tailored",
    cabinet: "Chalk ivory",
    cabinetNote: "Slim-frame painted timber",
    stone: "Calacatta Gold",
    stoneNote: "Soft white · warm mineral veins",
    cabinetColor: "#ddd6ca",
    stoneSwatch:
      "linear-gradient(132deg, #f2eee5 0 43%, #ae9876 44% 46%, #e4ded2 47% 73%, #c3b397 74% 76%, #f4f0e8 77%)",
  },
  {
    id: "charred-oak-patagonia",
    title: "After Dark",
    mood: "Dramatic · Sculptural",
    cabinet: "Charred oak",
    cabinetNote: "Fine-fluted black timber",
    stone: "Patagonia",
    stoneNote: "Crystalline · softly backlit",
    cabinetColor: "#171514",
    stoneSwatch:
      "radial-gradient(circle at 68% 34%, #d4b982 0 12%, transparent 13%), linear-gradient(128deg, #e6dfd0 0 24%, #4c4844 25% 42%, #cbbca1 43% 61%, #242322 62% 76%, #eee8dc 77%)",
  },
  {
    id: "rift-oak-taj-mahal",
    title: "Quiet Form",
    mood: "Natural · Serene",
    cabinet: "Rift oak",
    cabinetNote: "Continuous pale vertical grain",
    stone: "Taj Mahal",
    stoneNote: "Cream quartzite · taupe movement",
    cabinetColor: "#aa8c6b",
    stoneSwatch:
      "linear-gradient(124deg, #d8c8ad 0 31%, #a58d71 32% 34%, #e4d8c3 35% 64%, #b6a189 65% 67%, #d7c8b4 68%)",
  },
  {
    id: "sage-carrara",
    title: "Garden Room",
    mood: "Fresh · Collected",
    cabinet: "Mineral sage",
    cabinetNote: "Satin lacquer and reeded glass",
    stone: "Bianco Carrara",
    stoneNote: "Honed · feathery grey veins",
    cabinetColor: "#74766a",
    stoneSwatch:
      "linear-gradient(116deg, #eeeae3 0 38%, #aaa8a4 39% 40%, #f7f4ee 41% 68%, #c2c0ba 69% 71%, #e7e3dc 72%)",
  },
  {
    id: "bronze-rosso-levanto",
    title: "The Salon",
    mood: "Cinematic · Rich",
    cabinet: "Patinated bronze",
    cabinetNote: "Satin metal and smoked veneer",
    stone: "Rosso Levanto",
    stoneNote: "Oxblood marble · fine white veins",
    cabinetColor: "#6f4d38",
    stoneSwatch:
      "linear-gradient(125deg, #3c1616 0 32%, #c4aaa0 33% 35%, #561f22 36% 68%, #e0c7ba 69% 71%, #2d1213 72%)",
  },
  {
    id: "ink-blue-statuario",
    title: "Blue Hour",
    mood: "Graphic · Polished",
    cabinet: "Ink blue",
    cabinetNote: "Super-matte handleless lacquer",
    stone: "Statuario",
    stoneNote: "Bright white · blue-grey movement",
    cabinetColor: "#142238",
    stoneSwatch:
      "linear-gradient(120deg, #f0eee9 0 35%, #7e8790 36% 38%, #faf8f3 39% 65%, #a9afb2 66% 68%, #e7e4de 69%)",
  },
  {
    id: "sand-verde-alpi",
    title: "Desert Garden",
    mood: "Earthy · Expressive",
    cabinet: "Warm sand",
    cabinetNote: "Matte lacquer with walnut insets",
    stone: "Verde Alpi",
    stoneNote: "Forest marble · pale mineral veins",
    cabinetColor: "#9c8974",
    stoneSwatch:
      "linear-gradient(126deg, #142b25 0 33%, #b7b3a0 34% 36%, #203c32 37% 68%, #d3c9af 69% 71%, #10251f 72%)",
  },
];

const ATLAS_IMAGE_WIDTH = 1600;
const ATLAS_IMAGE_HEIGHT = 900;
const LENS_SIZE = 176;
const LENS_ZOOM = 2.8;

function imagePath(id: string, width: 480 | 720 | 1200 | 1600) {
  return `/img/kitchen-atlas/${id}-${width}.webp`;
}

export function KitchenMaterialAtlas() {
  const [activeIndex, setActiveIndex] = useState(0);
  const lensRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const frameRef = useRef<number | null>(null);
  const active = KITCHEN_SCHEMES[activeIndex];

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  /**
   * Lenis decides whether to swallow a wheel event by walking up from the
   * event target looking for `data-lenis-prevent-wheel`. A static attribute
   * meant the palette column kept every wheel tick even after it had hit its
   * last palette, so a cursor left over the column froze the page. This
   * listener runs before Lenis's (window-level, bubbling) one and sets the
   * attribute only while the column can still move in the requested
   * direction — at either end it drops the flag and Lenis scrolls the page.
   */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const onWheel = (event: WheelEvent) => {
      const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      const delta = horizontal ? event.deltaX : event.deltaY;
      const position = horizontal ? list.scrollLeft : list.scrollTop;
      const viewport = horizontal ? list.clientWidth : list.clientHeight;
      const content = horizontal ? list.scrollWidth : list.scrollHeight;

      // Sub-pixel rounding leaves a fractional gap at the far end on some
      // zoom levels, so treat anything under 1px as "no room left".
      const room = delta > 0 ? content - viewport - position : position;
      const consumes = delta !== 0 && content - viewport > 1 && room > 1;

      list.toggleAttribute("data-lenis-prevent-wheel", consumes);
    };

    list.addEventListener("wheel", onWheel, { passive: true });
    return () => list.removeEventListener("wheel", onWheel);
  }, []);

  const selectScheme = (index: number) => {
    setActiveIndex((index + KITCHEN_SCHEMES.length) % KITCHEN_SCHEMES.length);
  };

  const preloadScheme = (index: number) => {
    const image = new Image();
    image.src = imagePath(KITCHEN_SCHEMES[index].id, 1600);
  };

  const handleTabKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    const next = (index + direction + KITCHEN_SCHEMES.length) % KITCHEN_SCHEMES.length;
    selectScheme(next);
    tabRefs.current[next]?.focus();
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const stage = stageRef.current;
    const lens = lensRef.current;
    if (!stage || !lens) return;
    const clientX = event.clientX;
    const clientY = event.clientY;

    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const rect = stage.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

      // The stage uses object-cover, so percentage-based background positions
      // drift when its aspect ratio crops the source image. Mirror that cover
      // calculation here, then position the exact source pixel under the
      // centre of the lens.
      const coverScale = Math.max(
        rect.width / ATLAS_IMAGE_WIDTH,
        rect.height / ATLAS_IMAGE_HEIGHT,
      );
      const renderedWidth = ATLAS_IMAGE_WIDTH * coverScale;
      const renderedHeight = ATLAS_IMAGE_HEIGHT * coverScale;
      const cropX = (rect.width - renderedWidth) / 2;
      const cropY = (rect.height - renderedHeight) / 2;
      const lensX = Math.max(LENS_SIZE / 2, Math.min(rect.width - LENS_SIZE / 2, x));
      const lensY = Math.max(LENS_SIZE / 2, Math.min(rect.height - LENS_SIZE / 2, y));

      lens.style.left = `${lensX}px`;
      lens.style.top = `${lensY}px`;
      lens.style.backgroundSize = `${renderedWidth * LENS_ZOOM}px ${renderedHeight * LENS_ZOOM}px`;
      lens.style.backgroundPosition = `${LENS_SIZE / 2 - (x - cropX) * LENS_ZOOM}px ${LENS_SIZE / 2 - (y - cropY) * LENS_ZOOM}px`;
    });
  };

  return (
    <section
      aria-labelledby="kitchen-atlas-title"
      className="c-kitchen-material-atlas section overflow-hidden bg-[#d8d0c3] text-carbon"
    >
      <div className="container-wide c-kitchen-atlas__inner">
        <div className="c-kitchen-atlas__header">
          <p className="eyebrow">The kitchen material atlas</p>
          <h2 id="kitchen-atlas-title" className="mt-5 text-fluid-3xl text-balance">
            One room. Eight expressions.
          </h2>
          <p className="section-lede mt-5 max-w-xl text-ink-soft">
            Pair cabinetry and stone through a collection shaped by our villa kitchens.
            Select a palette, then move across the room to inspect every grain and vein.
          </p>
        </div>

        <div className="c-kitchen-atlas__main grid gap-7 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-12">
          <div
            ref={listRef}
            role="tablist"
            aria-label="Kitchen finish combinations"
            /* `data-lenis-prevent-wheel` is toggled imperatively above rather
               than set here: it has to be on while the column still has room
               and off at its ends. Wheel only — the mobile rail is horizontal
               and leaves touch to the page. */
            className="c-kitchen-atlas__list -mx-[var(--space-gutter)] flex snap-x gap-2 overflow-x-auto px-[var(--space-gutter)] pb-1 lg:mx-0 lg:grid lg:grid-cols-1 lg:gap-0 lg:px-0 lg:pb-0"
          >
            {KITCHEN_SCHEMES.map((scheme, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={scheme.id}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  role="tab"
                  id={`kitchen-tab-${scheme.id}`}
                  aria-controls="kitchen-atlas-stage"
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => selectScheme(index)}
                  onPointerEnter={() => preloadScheme(index)}
                  onFocus={() => preloadScheme(index)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                  className={`group flex min-w-[15rem] snap-start items-center gap-4 border px-4 py-3.5 text-left transition-colors duration-base lg:min-w-0 lg:border-x-0 lg:border-t-0 lg:px-4 lg:py-4 ${
                    isActive
                      ? "border-carbon bg-carbon text-paper lg:border-carbon/20 lg:bg-paper/45 lg:text-carbon"
                      : "border-carbon/15 bg-paper/20 text-carbon hover:bg-paper/40 lg:border-carbon/15 lg:bg-transparent"
                  }`}
                >
                  <span className="flex shrink-0 items-center" aria-hidden>
                    <span
                      className={`h-8 w-5 border ${isActive ? "border-paper/40" : "border-carbon/20"}`}
                      style={{ backgroundColor: scheme.cabinetColor }}
                    />
                    <span
                      className={`h-8 w-5 border-y border-r ${isActive ? "border-paper/40" : "border-carbon/20"}`}
                      style={{ background: scheme.stoneSwatch }}
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-2xs font-semibold uppercase tracking-[0.22em] opacity-55">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-0.5 block truncate text-sm font-medium tracking-[-0.01em]">
                      {scheme.title}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className={`h-px bg-current transition-all duration-base ${isActive ? "w-8" : "w-0 group-hover:w-4"}`}
                  />
                </button>
              );
            })}
          </div>

          <div className="c-kitchen-atlas__detail">
            <div
              ref={stageRef}
              id="kitchen-atlas-stage"
              role="tabpanel"
              aria-labelledby={`kitchen-tab-${active.id}`}
              onPointerMove={handlePointerMove}
              onPointerEnter={() => lensRef.current?.classList.add("is-visible")}
              onPointerLeave={() => lensRef.current?.classList.remove("is-visible")}
              className="c-kitchen-atlas__stage group/stage relative isolate aspect-[16/10] cursor-crosshair overflow-hidden bg-carbon shadow-[0_1.75rem_4rem_rgba(42,31,23,0.22)] sm:aspect-video"
            >
              {KITCHEN_SCHEMES.map((scheme, index) => (
                <img
                  key={scheme.id}
                  src={imagePath(scheme.id, 1200)}
                  srcSet={`${imagePath(scheme.id, 480)} 480w, ${imagePath(scheme.id, 720)} 720w, ${imagePath(scheme.id, 1200)} 1200w, ${imagePath(scheme.id, 1600)} 1600w`}
                  sizes="(min-width: 1800px) 1400px, (min-width: 1280px) calc(100vw - 24rem), (min-width: 1024px) calc(100vw - 22rem), 100vw"
                  width={1672}
                  height={941}
                  alt={
                    index === activeIndex
                      ? `${scheme.cabinet} cabinetry paired with ${scheme.stone} stone in a contemporary villa kitchen`
                      : ""
                  }
                  aria-hidden={index !== activeIndex}
                  loading="lazy"
                  decoding="async"
                  className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform,filter] duration-slower ease-out-soft ${
                    index === activeIndex
                      ? "scale-100 opacity-100 blur-0"
                      : "pointer-events-none scale-[1.015] opacity-0 blur-[2px]"
                  }`}
                />
              ))}

              {/* Caption scrim. Bright schemes (Arabescato, Statuario) put near-white
                  stone directly behind the title, so a two-stop Tailwind gradient
                  either washed out the text or banded visibly. Multiple stops keep
                  the falloff smooth while holding enough density in the bottom
                  quarter for paper-on-image text to stay legible on every palette. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
                style={{
                  background:
                    "linear-gradient(to top, rgb(var(--color-carbon-rgb) / 0.88) 0%, rgb(var(--color-carbon-rgb) / 0.7) 20%, rgb(var(--color-carbon-rgb) / 0.42) 45%, rgb(var(--color-carbon-rgb) / 0.16) 72%, rgb(var(--color-carbon-rgb) / 0) 100%)",
                }}
              />

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 text-paper sm:p-6">
                <div>
                  <p className="text-2xs font-semibold uppercase tracking-[0.2em] text-paper/65">
                    {active.mood}
                  </p>
                  <p className="mt-1 font-display text-fluid-xl leading-none">{active.title}</p>
                </div>
                <div className="hidden items-center gap-2 text-2xs font-semibold uppercase tracking-[0.2em] text-paper/70 2xl:flex">
                  <ScanSearch size={15} strokeWidth={1.5} /> Move to inspect
                </div>
              </div>

              <div
                ref={lensRef}
                aria-hidden
                className="kitchen-inspection-lens pointer-events-none absolute z-20 hidden h-44 w-44 border border-paper/70 bg-no-repeat shadow-[0_1rem_3rem_rgba(0,0,0,.35)] lg:block"
                style={{
                  backgroundImage: `url(${imagePath(active.id, 1600)})`,
                }}
              />
            </div>

            <div className="grid border-x border-b border-carbon/15 bg-[#e7e0d5] sm:grid-cols-[1fr_1fr_auto]">
              <div className="flex min-w-0 items-center gap-4 border-b border-carbon/15 p-4 sm:border-b-0 sm:border-r sm:p-5">
                <span
                  aria-hidden
                  className="h-11 w-11 shrink-0 border border-carbon/20"
                  style={{ backgroundColor: active.cabinetColor }}
                />
                <span className="min-w-0">
                  <span className="block text-2xs font-semibold uppercase tracking-[0.2em] text-ink-mute">
                    Cabinetry
                  </span>
                  <span className="mt-1 block text-sm font-medium text-carbon">{active.cabinet}</span>
                  <span className="mt-0.5 hidden text-xs text-ink-mute xl:block">{active.cabinetNote}</span>
                </span>
              </div>

              <div className="flex min-w-0 items-center gap-4 border-b border-carbon/15 p-4 sm:border-b-0 sm:border-r sm:p-5">
                <span
                  aria-hidden
                  className="h-11 w-11 shrink-0 border border-carbon/20"
                  style={{ background: active.stoneSwatch }}
                />
                <span className="min-w-0">
                  <span className="block text-2xs font-semibold uppercase tracking-[0.2em] text-ink-mute">
                    Stone
                  </span>
                  <span className="mt-1 block text-sm font-medium text-carbon">{active.stone}</span>
                  <span className="mt-0.5 hidden text-xs text-ink-mute xl:block">{active.stoneNote}</span>
                </span>
              </div>

              <div className="flex items-stretch sm:w-28">
                <button
                  type="button"
                  aria-label="Previous kitchen palette"
                  onClick={() => selectScheme(activeIndex - 1)}
                  className="flex min-h-14 flex-1 items-center justify-center border-r border-carbon/15 text-carbon transition-colors hover:bg-carbon hover:text-paper"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  aria-label="Next kitchen palette"
                  onClick={() => selectScheme(activeIndex + 1)}
                  className="flex min-h-14 flex-1 items-center justify-center text-carbon transition-colors hover:bg-carbon hover:text-paper"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="c-kitchen-atlas__footer mt-10 flex flex-col gap-5 border-t border-carbon/20 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="section-lede max-w-2xl text-ink-soft/75">
            Every palette is a starting point. Grain, sheen, edge detail and slab selection are
            resolved around your architecture.
          </p>
          <Link
            href="/portfolio?cat=kitchens"
            className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-carbon transition-[gap,color] hover:gap-3 hover:text-accent-deep"
          >
            See completed kitchens <ArrowUpRight size={16} />
          </Link>
        </div>

        <p className="sr-only" aria-live="polite">
          Showing {active.title}: {active.cabinet} cabinetry with {active.stone} stone.
        </p>
      </div>
    </section>
  );
}
