"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { leadMethodForHref, trackLead, trackPageView } from "@/lib/analytics";

/**
 * Site-wide event wiring, so individual CTAs don't need their own handlers:
 * - a page view on every client-side navigation (the first load is already
 *   counted by the tags themselves);
 * - a lead for any click on a WhatsApp, phone or email link, via one
 *   delegated listener that also covers links added later.
 */
export function AnalyticsEvents() {
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    trackPageView(pathname);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      const method = leadMethodForHref(href);
      if (method) trackLead(method, { link_url: href, page_path: window.location.pathname });
    };
    // Capture phase: runs even if a component stops propagation.
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
