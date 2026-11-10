"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Match Havenly's departure, arrival and emblem timings.
const EXIT_MS = 240;
const EASING = "cubic-bezier(0.2, 0.65, 0.3, 1)";
const SURFACES = "main, .c-header, .c-footer, .page-floating";

function TransitionEvents() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const route = `${pathname}?${search}`;
  const previousRoute = useRef(route);
  const leaving = useRef(false);
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recoveryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (previousRoute.current === route) return;
    previousRoute.current = route;
    leaving.current = false;
    if (recoveryTimer.current) clearTimeout(recoveryTimer.current);
    document.body.classList.remove("is-page-leaving");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const animations = Array.from(document.querySelectorAll<HTMLElement>(SURFACES)).map((element) =>
      element.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 450, delay: 100, easing: EASING, fill: "backwards" }),
    );
    const mark = document.querySelector<HTMLElement>(".page-mark");
    if (mark) animations.push(mark.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 420, easing: EASING, fill: "backwards" }));
    return () => animations.forEach((animation) => animation.cancel());
  }, [route]);

  useEffect(() => {
    const restore = () => {
      leaving.current = false;
      if (navigationTimer.current) clearTimeout(navigationTimer.current);
      if (recoveryTimer.current) clearTimeout(recoveryTimer.current);
      document.body.classList.remove("is-page-leaving");
    };

    const onClick = (event: MouseEvent) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link || (link.target && link.target !== "_self") || link.hasAttribute("download")) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || !["http:", "https:"].includes(url.protocol)) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      // Capture before Next's Link handler; its normal prefetch and modified-click
      // behaviour remain intact, and its onClick still closes navigation panels.
      event.preventDefault();
      if (leaving.current) return;
      leaving.current = true;
      // A second navigation can start during the arrival fade. Cancel only the
      // page surfaces' animations so they cannot override the next exit opacity.
      document.querySelectorAll<HTMLElement>(`${SURFACES}, .page-mark`).forEach((element) => {
        element.getAnimations().forEach((animation) => animation.cancel());
      });
      document.body.classList.add("is-page-leaving");
      navigationTimer.current = setTimeout(() => {
        router.push(`${url.pathname}${url.search}${url.hash}`);
      }, EXIT_MS);
      // A failed navigation must never leave the current page invisible.
      recoveryTimer.current = setTimeout(restore, 10000);
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("pageshow", restore);
    window.addEventListener("popstate", restore);
    return () => {
      restore();
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("pageshow", restore);
      window.removeEventListener("popstate", restore);
    };
  }, [router]);

  return null;
}

export function PageTransition() {
  return <Suspense fallback={null}><TransitionEvents /></Suspense>;
}
