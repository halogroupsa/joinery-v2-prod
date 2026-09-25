import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MAINTENANCE_HREF } from "@/data/maintenance";

/**
 * A short, image-led pause rather than a full scroll scene.
 *
 * Its job here is the contextual internal link — the homepage carries the most
 * authority on the site, and a link from body copy is weighted far above the
 * same link in the sitewide footer. The copy stays short on purpose: repeating
 * the repair page's headings and keyword targets here would put the two pages
 * in competition for the same queries, and the homepage is the wrong one to
 * win them. Depth lives on /services/maintenance-repair.
 *
 * Sits after Process, which ends at "Finish & install" — this is the next beat
 * in that story, and the dark band breaks up the paper → paper-warm run.
 */
export function Aftercare() {
  return (
    <section
      className="c-aftercare panel-dark relative isolate overflow-hidden"
      aria-labelledby="aftercare-title"
    >
      <div className="c-aftercare__image" aria-hidden="true" />
      <div className="c-aftercare__scrim" aria-hidden="true" />
      <div className="container-wide relative z-10 flex min-h-[28rem] items-center py-[clamp(5rem,3.5rem+5vw,8rem)]">
        <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="max-w-2xl">
            <p className="eyebrow reveal">After handover</p>
            <h2
              id="aftercare-title"
              className="reveal mt-4 text-fluid-2xl text-paper text-balance"
              data-delay="1"
            >
              And when something needs putting right, we come back.
            </h2>
            <p className="section-lede reveal mt-4 text-paper/70" data-delay="2">
              Our carpenters repair and maintain joinery across Dubai — ours, and plenty that
              other companies installed. Send a photo, we inspect and quote, then fix it on a
              day that suits you.
            </p>
          </div>
          <Link
            href={MAINTENANCE_HREF}
            className="btn-ghost reveal shrink-0"
            data-delay="3"
          >
            Furniture repair &amp; carpentry <ArrowUpRight size={16} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
