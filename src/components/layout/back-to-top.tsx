"use client";

import { useEffect, useState } from "react";
import { getLenis } from "@/lib/lenis-instance";

/** Appears after the first viewport; scrolls smoothly back up via Lenis. */
export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: 1.1 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      className={`c-back-to-top fixed bottom-[calc(env(safe-area-inset-bottom,0px)+76px)] right-6 z-40 inline-flex h-11 w-11 items-center justify-center rounded-[50%] bg-[rgba(35,32,31,0.92)] text-paper shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all duration-base ease-out-soft hover:bg-[rgba(35,32,31,1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <svg viewBox="0 0 24 24" fill="none" width="20" height="20" aria-hidden>
        <path d="M7 9 L12 4 L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="1" />
        <path d="M7 13 L12 8 L17 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
        <path d="M7 17 L12 12 L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.25" />
      </svg>
    </button>
  );
}
