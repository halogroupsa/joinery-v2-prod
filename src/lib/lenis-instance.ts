import type Lenis from "lenis";

// Shared registry for the single global Lenis instance created in <SmoothScroll>.
// Scroll-synced canvas/parallax work subscribes here so it can read the eased
// scroll value on Lenis's own tick — collapsing the chain (Lenis → native scroll
// → ref → rAF) into one synchronized loop, which is what keeps scroll-scrubbed
// playback buttery and jump-free.
//
// We use subscribe (not a bare getter) because React runs child effects before
// parent effects: a consumer mounted below <SmoothScroll> would read `null` if it
// grabbed the instance synchronously. Subscribers fire immediately with the
// current value and again whenever it changes.

let instance: Lenis | null = null;
const subscribers = new Set<(lenis: Lenis | null) => void>();

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
  subscribers.forEach((cb) => cb(lenis));
}

export function subscribeLenis(cb: (lenis: Lenis | null) => void) {
  subscribers.add(cb);
  cb(instance);
  return () => {
    subscribers.delete(cb);
  };
}

export function getLenis() {
  return instance;
}
