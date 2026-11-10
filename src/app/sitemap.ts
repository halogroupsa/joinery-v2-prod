import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { JOINERY_PAGES } from "@/data/joinery-pages";
import { MAINTENANCE_HREF } from "@/data/maintenance";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // These dates record content revisions, not every rebuild. Other URLs omit
  // lastModified until a reliable page-specific revision is available.
  const reviewedOn = "2026-11-03";
  return [
    { url: SITE.url, lastModified: reviewedOn, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE.url}/portfolio`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE.url}/about`, lastModified: reviewedOn, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/contact`, lastModified: "2026-11-04", changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/services`, changeFrequency: "monthly", priority: 0.9 },
    {
      url: `${SITE.url}${MAINTENANCE_HREF}`,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    ...JOINERY_PAGES.map((page) => ({
      url: `${SITE.url}/services/${page.slug}`,
      ...(page.slug === "wardrobes" || page.slug === "kitchens" ? { lastModified: "2026-11-04" } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
  ];
}
