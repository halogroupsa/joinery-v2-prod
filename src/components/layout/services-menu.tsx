"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import { cn } from "@/lib/cn";

export type ServiceNavigationItem = {
  slug: string;
  label: string;
  description: string;
  image: { folder: string; base: string; alt: string };
};

const GROUPS = [
  { label: "For the home", slugs: ["kitchens", "wardrobes", "doors", "tv-units", "bar-counters-vanities", "residential-furniture"] },
  { label: "Architecture & workplace", slugs: ["wall-panels", "wood-ceilings", "feature-walls", "reception-desks", "office-furniture", "maintenance-repair"] },
];

export function ServicesMenu({ services, open, onOpenChange }: {
  services: ServiceNavigationItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusFirst = useRef(false);
  const [activeSlug, setActiveSlug] = useState("kitchens");
  const [visited, setVisited] = useState(false);
  const active = services.find((item) => item.slug === activeSlug) ?? services[0];

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  const show = () => {
    cancelClose();
    if (!open) {
      setActiveSlug(services.find((item) => pathname === `/services/${item.slug}`)?.slug ?? "kitchens");
    }
    setVisited(true);
    onOpenChange(true);
  };

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    if (!open) return;
    if (focusFirst.current) {
      // Let the disclosure's visibility and inert attributes settle before focus.
      const timer = setTimeout(() => {
        focusFirst.current = false;
        panel.current?.querySelector<HTMLAnchorElement>("a[data-service-link]")?.focus();
      }, 50);
      return () => {
        clearTimeout(timer);
        focusFirst.current = false;
      };
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  return (
    <div
      onPointerEnter={cancelClose}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") return;
        cancelClose();
        closeTimer.current = setTimeout(() => onOpenChange(false), 170);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onOpenChange(false);
      }}
    >
      <button
        ref={trigger}
        id="services-menu-trigger"
        type="button"
        aria-expanded={open}
        aria-controls="services-mega-menu"
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") show();
        }}
        onClick={(event) => {
          if ((event.nativeEvent as PointerEvent).pointerType === "mouse") show();
          else if (open) onOpenChange(false);
          else show();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            focusFirst.current = true;
            show();
            if (open) {
              focusFirst.current = false;
              panel.current?.querySelector<HTMLAnchorElement>("a[data-service-link]")?.focus();
            }
          }
        }}
        className={cn(
          "flex items-center gap-1.5 whitespace-nowrap py-3 font-display text-sm font-normal uppercase tracking-normal transition-colors hover:text-accent",
          (open || pathname.startsWith("/services")) && "text-accent",
        )}
      >
        Services
        <ChevronDown size={14} aria-hidden className={cn("transition-transform duration-base motion-reduce:transition-none", open && "rotate-180")} />
      </button>

      <div
        ref={panel}
        id="services-mega-menu"
        role="group"
        aria-labelledby="services-menu-trigger"
        aria-hidden={!open}
        inert={!open ? true : undefined}
        data-lenis-prevent
        className={cn(
          "absolute right-[var(--space-gutter)] top-full w-[min(70rem,calc(100vw-2*var(--space-gutter)))] pt-2 text-ink transition-[opacity,visibility] duration-fast motion-reduce:transition-none",
          open ? "visible opacity-100" : "pointer-events-none invisible opacity-0",
        )}
      >
        <div className="max-h-[calc(100dvh-var(--header-h)-1rem)] overflow-y-auto border border-rule border-t-2 border-t-accent bg-paper shadow-[0_24px_60px_-20px_rgba(22,16,11,0.4)]">
          <div className="flex items-center justify-between border-b border-rule bg-paper-warm px-5 py-3 font-mono text-2xs uppercase tracking-[0.18em]">
            <span className="text-ink-mute">Bespoke joinery</span>
            <span className="text-accent-deep">Made in Al Quoz, Dubai</span>
          </div>

          <div className="grid grid-cols-[1fr_17rem] xl:grid-cols-[1fr_19rem]">
            <div className="grid grid-cols-2 gap-x-3 p-4">
              {GROUPS.map((group, column) => (
                <div key={group.label} className="min-w-0">
                  <p className="px-3 pb-3 pt-2 font-mono text-2xs uppercase tracking-[0.14em] text-accent-deep">{group.label}</p>
                  <ul>
                    {group.slugs.map((slug, index) => {
                      const item = services.find((service) => service.slug === slug);
                      if (!item) return null;
                      const current = pathname === `/services/${slug}`;
                      return (
                        <li key={slug}>
                          <Link
                            href={`/services/${slug}`}
                            data-service-link
                            aria-current={current ? "page" : undefined}
                            onPointerEnter={() => setActiveSlug(slug)}
                            onFocus={() => setActiveSlug(slug)}
                            onClick={() => onOpenChange(false)}
                            className={cn(
                              "group relative flex gap-3 px-3 py-2.5 transition-colors duration-fast",
                              activeSlug === slug ? "bg-paper-warm" : "hover:bg-paper-warm/60",
                              current && "before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:bg-accent",
                            )}
                          >
                            <span className="pt-0.5 font-mono text-2xs text-ink-mute">{String(column * 6 + index + 1).padStart(2, "0")}</span>
                            <span className="min-w-0">
                              <span className={cn("flex items-center gap-1.5 font-display text-base leading-snug", activeSlug === slug && "text-accent-deep")}>
                                {item.label}
                                <ArrowRight size={13} aria-hidden className={cn("shrink-0 transition-opacity", activeSlug === slug ? "opacity-100" : "opacity-0")} />
                              </span>
                              <span className="mt-0.5 block text-xs leading-snug text-ink-mute">{item.description}</span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <Link href={`/services/${active.slug}`} onClick={() => onOpenChange(false)} className="group border-l border-rule bg-paper-warm/40 p-4" aria-label={`Explore ${active.label.toLowerCase()}`}>
              <div className="relative aspect-[4/3] overflow-hidden border border-rule bg-paper-warm">
                {visited && <SmartImage key={active.slug} {...active.image} loading="eager" ratio="4 / 3" sizes="320px" className="h-full w-full !rounded-none [&_img]:!opacity-100" />}
                <span className="absolute left-0 top-0 bg-carbon/85 px-2 py-1 font-mono text-2xs uppercase tracking-[0.14em] text-accent-soft">Preview</span>
              </div>
              <p className="mt-4 font-display text-xl leading-tight">{active.label}</p>
              <p className="mt-2 text-sm text-ink-mute">{active.description}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-accent-deep group-hover:text-accent">Explore <ArrowUpRight size={14} aria-hidden /></span>
            </Link>
          </div>

          <div className="flex items-center justify-between gap-6 border-t border-rule px-5 py-4">
            <Link href="/services" onClick={() => onOpenChange(false)} className="inline-flex items-center gap-2 font-display text-sm hover:text-accent-deep">View all services <ArrowRight size={15} aria-hidden /></Link>
            <Link href="/contact" onClick={() => onOpenChange(false)} className="inline-flex items-center gap-2 font-mono text-2xs uppercase tracking-[0.12em] text-ink-mute hover:text-accent-deep">Discuss your project <ArrowUpRight size={13} aria-hidden /></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
