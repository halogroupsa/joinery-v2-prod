import { MATERIAL_PROMISES } from "@/lib/site";

/** Infinite ticker of the material guarantees. Duplicated once for a seamless loop. */
export function PromisesMarquee() {
  const items = [...MATERIAL_PROMISES, ...MATERIAL_PROMISES];
  return (
    <section className="c-promises-marquee border-y border-rule bg-paper-warm py-4" aria-label="Material guarantees">
      <div className="marquee">
        <ul className="marquee-track items-center">
          {items.map((p, i) => (
            <li
              key={i}
              className="strip-label flex items-center gap-4 whitespace-nowrap text-ink-soft"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
