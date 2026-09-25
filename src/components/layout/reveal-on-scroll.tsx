"use client";

import { useEffect } from "react";

/**
 * Adds `.is-visible` to any `.reveal` element when it scrolls into view.
 * Honours reduced-motion (everything shown immediately) and re-scans the DOM on
 * client navigation, since the App Router keeps the layout mounted across routes.
 */
export function RevealOnScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const select = () => Array.from(document.querySelectorAll<HTMLElement>(".reveal"));

    if (reduced) {
      select().forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("is-visible");
            obs.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    select().forEach((el) => obs.observe(el));

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          const el = n as Element;
          if (el.matches?.(".reveal")) obs.observe(el);
          el.querySelectorAll?.(".reveal").forEach((x) => obs.observe(x));
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      obs.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
