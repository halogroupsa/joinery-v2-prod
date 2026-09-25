"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { getLenis, setLenis } from "@/lib/lenis-instance";

/**
 * Global Lenis smooth-scroll (the Apple-style feel). We use lerp mode rather
 * than duration+easing: duration mode commits to a fixed ~1s animation on every
 * input and its near-flat easing tail leaves a slow creep when you stop mid-
 * scroll (the page-wide "jump on stop"). lerp closes a fixed fraction of the
 * remaining gap each frame — velocity decays continuously, no flat tail, settles
 * almost immediately on stop. Disabled entirely under reduced-motion.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const firstRender = useRef(true);
  const isHistoryNav = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.11,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    setLenis(lenis);

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  // Back/forward should restore the previous position, not jump to the top.
  useEffect(() => {
    const onPopState = () => {
      isHistoryNav.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Start each new page at the top. Lenis keeps its own target scroll, so
  // Next's scroll-to-top on a client navigation gets eased straight back to
  // the old position (e.g. moving between /services/* pages mid-scroll).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (isHistoryNav.current) {
      isHistoryNav.current = false;
      getLenis()?.resize();
      return;
    }
    if (window.location.hash) return;

    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
      // The new page is a different height; let Lenis re-measure its limits.
      lenis.resize();
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname]);

  return null;
}
