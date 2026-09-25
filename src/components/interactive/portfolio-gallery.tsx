"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { SmartImage, imageMeta } from "@/components/ui/smart-image";
import { GALLERY_ITEMS, interleavedGallery, PORTFOLIO_FILTERS, type GalleryItem } from "@/data/gallery";
import { cn } from "@/lib/cn";

const DEFAULT_WIDTH = 1280;
const DEFAULT_VH = 900;

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}
function loop(i: number, total: number) {
  return (i + total) % total;
}

function targetRowHeight(width: number, vh: number) {
  if (width < 640) return clamp(vh * 0.5, 280, 460);
  if (width < 768) return clamp(vh * 0.4, 240, 360);
  return clamp(vh * 0.36, 300, 440);
}
function gap(width: number) {
  return width >= 768 ? 14 : 8;
}
function minItems(width: number) {
  if (width < 640) return 1;
  if (width < 768) return 2;
  return 2;
}
function maxItems(width: number) {
  if (width < 640) return 1;
  if (width < 900) return 3;
  return 4;
}

type Tile = { item: GalleryItem; ratio: number };
type Row = { height: number; tiles: Tile[] };

function buildRows(items: GalleryItem[], width: number, vh: number): Row[] {
  const w = Math.max(1, width);
  const g = gap(w);
  const target = w / targetRowHeight(w, vh);
  const mn = minItems(w);
  const mx = maxItems(w);
  const rows: Row[] = [];
  let cur: Tile[] = [];
  let sum = 0;

  const pushRow = (tiles: Tile[]) => {
    const ratioSum = tiles.reduce((s, t) => s + t.ratio, 0);
    const avail = w - g * Math.max(0, tiles.length - 1);
    rows.push({ height: avail / Math.max(ratioSum, 0.0001), tiles });
  };

  items.forEach((item) => {
    const tile = { item, ratio: item.ratio || 1 };
    const next = sum + tile.ratio;
    if (
      cur.length >= mx ||
      (cur.length >= mn &&
        (sum >= target || Math.abs(target - sum) <= Math.abs(target - next)))
    ) {
      pushRow(cur);
      cur = [];
      sum = 0;
    }
    cur.push(tile);
    sum += tile.ratio;
  });
  if (cur.length) pushRow(cur);
  return rows;
}

export function PortfolioGallery() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") ?? "all";
  const [filter, setFilter] = useState(initialCat);
  const [metrics, setMetrics] = useState({ width: DEFAULT_WIDTH, vh: DEFAULT_VH });
  const [visibleRows, setVisibleRows] = useState(6);
  const [lightboxId, setLightboxId] = useState<string | null>(null);
  const [gridEl, setGridEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    setFilter(searchParams.get("cat") ?? "all");
  }, [searchParams]);

  const filtered = useMemo(() => {
    const base = filter === "all" ? interleavedGallery() : GALLERY_ITEMS.filter((i) => i.categorySlug === filter);
    return base;
  }, [filter]);

  const rows = useMemo(
    () => buildRows(filtered, metrics.width, metrics.vh),
    [filtered, metrics],
  );
  const shownRows = rows.slice(0, visibleRows);
  const shownCount = shownRows.reduce((n, r) => n + r.tiles.length, 0);
  const hasMore = shownCount < filtered.length;

  // Flat list of currently-filtered items in display order, for lightbox nav.
  const flat = filtered;
  const lightIndex = lightboxId ? flat.findIndex((i) => i.id === lightboxId) : -1;
  const lightItem = lightIndex >= 0 ? flat[lightIndex] : null;

  useEffect(() => setVisibleRows(6), [filter]);

  // Measure available width.
  useEffect(() => {
    if (!gridEl) return;
    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const style = window.getComputedStyle(gridEl);
        const padX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        const inner = gridEl.clientWidth - (Number.isFinite(padX) ? padX : 0);
        setMetrics({
          width: inner > 0 ? inner : DEFAULT_WIDTH,
          vh: window.innerHeight || DEFAULT_VH,
        });
      });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(gridEl);
    measure();
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [gridEl]);

  const showPrev = useCallback(() => {
    setLightboxId((id) => {
      if (!id) return id;
      const idx = flat.findIndex((i) => i.id === id);
      return flat[loop(idx - 1, flat.length)].id;
    });
  }, [flat]);
  const showNext = useCallback(() => {
    setLightboxId((id) => {
      if (!id) return id;
      const idx = flat.findIndex((i) => i.id === id);
      return flat[loop(idx + 1, flat.length)].id;
    });
  }, [flat]);

  // Lightbox keyboard + scroll lock.
  useEffect(() => {
    if (!lightItem) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxId(null);
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    const scrollY = window.scrollY;
    const body = document.body;
    const html = document.documentElement;
    const prev = { overflow: body.style.overflow, position: body.style.position, top: body.style.top, width: body.style.width };
    window.addEventListener("keydown", onKey);
    html.classList.add("lightbox-open");
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    return () => {
      window.removeEventListener("keydown", onKey);
      html.classList.remove("lightbox-open");
      body.style.overflow = prev.overflow;
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      window.scrollTo(0, scrollY);
    };
  }, [lightItem, showPrev, showNext]);

  return (
    <>
      {/* Filters */}
      <div className="c-portfolio-gallery no-scrollbar -mx-[var(--space-gutter)] flex gap-2 overflow-x-auto px-[var(--space-gutter)] pb-1">
        {PORTFOLIO_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.06em] transition-colors",
              filter === f.value
                ? "border-accent bg-accent text-paper"
                : "border-rule-strong/60 text-ink-soft hover:border-accent hover:text-accent",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Justified grid */}
      <div ref={setGridEl} className="mt-8 space-y-2 md:mt-10 md:space-y-3.5">
        {shownRows.map((row, ri) => (
          <div
            key={ri}
            className="flex items-stretch gap-2 overflow-hidden md:gap-3.5"
            style={{ height: row.height }}
          >
            {row.tiles.map(({ item, ratio }) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLightboxId(item.id)}
                aria-label={`Open ${item.heading}`}
                className="group relative block shrink-0 cursor-pointer overflow-hidden rounded-sm bg-paper-warm"
                style={{ height: row.height, width: row.height * ratio }}
              >
                <SmartImage
                  folder={item.folder}
                  base={item.base}
                  alt={item.alt}
                  className="h-full w-full"
                  sizes="(min-width:1280px) 28vw, (min-width:768px) 40vw, 100vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon/70 via-transparent to-transparent opacity-0 transition-opacity duration-base group-hover:opacity-100" />
                <span className="pointer-events-none absolute bottom-3 left-3 right-3 translate-y-2 text-left text-paper opacity-0 transition-all duration-base group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="block text-3xs uppercase tracking-[0.2em] text-accent-soft">
                    {item.categoryTitle}
                  </span>
                  <span className="mt-0.5 block font-display text-base leading-tight">
                    {item.heading}
                  </span>
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Count + load more */}
      <div className="mt-9 flex flex-col items-center gap-4 text-center md:flex-row md:justify-center md:gap-6">
        <p className="text-sm text-ink-mute" aria-live="polite">
          Showing {Math.min(shownCount, filtered.length)} of {filtered.length} pieces
        </p>
        {hasMore && (
          <button type="button" className="btn-ghost" onClick={() => setVisibleRows((r) => r + 4)}>
            Load more
          </button>
        )}
      </div>

      {/* Lightbox */}
      {lightItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6"
          style={{ backgroundColor: "rgba(12,8,5,0.86)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
          onClick={() => setLightboxId(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lightItem.heading}
        >
          <button
            type="button"
            onClick={() => setLightboxId(null)}
            aria-label="Close"
            className="fixed right-4 top-4 z-[70] grid h-11 w-11 place-items-center rounded-full border border-white/30 text-white transition-colors hover:bg-white hover:text-ink md:right-6 md:top-6"
          >
            <X size={18} />
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); showPrev(); }}
            aria-label="Previous"
            className="absolute left-3 top-1/2 z-[70] grid h-12 w-12 -translate-y-1/2 place-items-center bg-carbon/80 text-paper transition-colors hover:bg-paper hover:text-ink md:left-6"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); showNext(); }}
            aria-label="Next"
            className="absolute right-3 top-1/2 z-[70] grid h-12 w-12 -translate-y-1/2 place-items-center bg-carbon/80 text-paper transition-colors hover:bg-paper hover:text-ink md:right-6"
          >
            <ChevronRight size={22} />
          </button>

          <figure
            className="flex max-h-full max-w-[min(92rem,96vw)] flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <LightboxImage item={lightItem} />
            <figcaption className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-paper">
              <span className="text-xs uppercase tracking-[0.2em] text-accent-soft">
                {lightItem.categoryTitle}
              </span>
              <span className="font-display text-lg md:text-xl">{lightItem.heading}</span>
              <span className="font-mono text-xs text-paper/50">
                {lightIndex + 1} / {flat.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}

function LightboxImage({ item }: { item: GalleryItem }) {
  const meta = imageMeta(item.folder, item.base);
  const sizes = (meta?.sizes ?? [768, 1200, 1600, 2000]).sort((a, b) => a - b);
  const srcset = sizes.map((s) => `/img/${item.folder}/${item.base}-${s}.webp ${s}w`).join(", ");
  const fallback = `/img/${item.folder}/${item.base}-${meta?.largest ?? 1600}.webp`;
  return (
    <img
      key={item.id}
      src={fallback}
      srcSet={srcset}
      sizes="(min-width:1024px) 80vw, 96vw"
      width={meta?.width}
      height={meta?.height}
      alt={item.alt}
      decoding="async"
      className="max-h-[78vh] w-auto max-w-full rounded-sm object-contain shadow-2xl"
    />
  );
}
