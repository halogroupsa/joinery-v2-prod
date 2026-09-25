import Link from "next/link";
import { SmartImage } from "@/components/ui/smart-image";

interface PageHeroProps {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  /** optional background image */
  image?: { folder: string; base: string; alt: string };
  /** breadcrumb label (current page) */
  crumb?: string;
  /** optional parent level for nested service pages */
  parentCrumb?: { label: string; href: string };
}

/** Cohesive dark hero for interior pages (About, Contact). */
export function PageHero({ eyebrow, title, intro, image, crumb, parentCrumb }: PageHeroProps) {
  return (
    <header className="c-page-hero relative overflow-hidden bg-carbon text-paper">
      {image && (
        <div className="absolute inset-0">
          <SmartImage
            folder={image.folder}
            base={image.base}
            alt={image.alt}
            priority
            sizes="100vw"
            className="!absolute inset-0 h-full w-full !rounded-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/80 to-carbon/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-carbon/70 to-transparent" />
        </div>
      )}

      <div className="container-wide relative z-10 pb-[clamp(2.75rem,4vw,4.5rem)] pt-[calc(var(--header-h)+clamp(2.75rem,6vw,5.5rem))]">
        {/* breadcrumb */}
        <nav className="mb-7 flex items-center gap-2 text-2xs uppercase tracking-[0.24em] text-paper/55" aria-label="Breadcrumb">
          <Link href="/" className="transition-colors hover:text-accent-soft">
            Home
          </Link>
          {parentCrumb && (
            <>
              <span className="text-paper/30">/</span>
              <Link href={parentCrumb.href} className="transition-colors hover:text-accent-soft">
                {parentCrumb.label}
              </Link>
            </>
          )}
          {crumb && (
            <>
              <span className="text-paper/30">/</span>
              <span className="text-accent-soft">{crumb}</span>
            </>
          )}
        </nav>

        {/* The eyebrow carries each page's target search phrase ("Custom
            wardrobes in Dubai"), so it lives inside the h1 rather than in a
            separate <p>; the display line alone rarely names the service.
            The bare space keeps the two parts from running together as one
            word in the extracted heading text. */}
        <h1 className="text-paper">
          <span className="eyebrow block leading-normal text-accent-soft">{eyebrow}</span>{" "}
          <span className="mt-5 block max-w-[18ch] text-fluid-4xl">{title}</span>
        </h1>
        {intro && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/75">{intro}</p>
        )}
      </div>
    </header>
  );
}
