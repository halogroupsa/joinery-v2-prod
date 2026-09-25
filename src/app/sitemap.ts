import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { JOINERY_PAGES } from "@/data/joinery-pages";
import { MAINTENANCE_HREF } from "@/data/maintenance";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE.url}/portfolio`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    {
      url: `${SITE.url}${MAINTENANCE_HREF}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    ...JOINERY_PAGES.map((page) => ({
      url: `${SITE.url}/services/${page.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
  ];
}
