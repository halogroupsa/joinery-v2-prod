"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin brass progress bar pinned to the very top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="c-scroll-progress fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-gradient-to-r from-accent via-accent-soft to-accent"
    />
  );
}
