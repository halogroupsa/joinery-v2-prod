/* eslint-disable @next/next/no-img-element */
import { DEVELOPER_LOGOS } from "@/lib/site";

export function DeveloperLogos() {
  const items = [...DEVELOPER_LOGOS, ...DEVELOPER_LOGOS];
  return (
    <section className="c-developer-logos section bg-paper-deep">
      <div className="container-wide">
        <p className="strip-label reveal text-center text-ink-mute">
          Trusted on projects for the UAE&apos;s leading developers &amp; hospitality groups
        </p>
      </div>
      <div className="marquee mt-8">
        <ul className="marquee-track items-center">
          {items.map((logo, i) => (
            <li
              key={i}
              aria-hidden={i >= DEVELOPER_LOGOS.length || undefined}
              className="flex h-14 shrink-0 items-center"
            >
              <img
                src={logo.src}
                alt={i < DEVELOPER_LOGOS.length ? `${logo.name} logo` : ""}
                width={logo.width}
                height={logo.height}
                className={`${logo.heightClass} w-auto max-w-none object-contain transition-transform duration-300 hover:scale-105`}
                loading="lazy"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
