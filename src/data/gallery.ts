import { PRODUCTS, type ProductCategory } from "@/lib/site";
import { folderImages } from "@/lib/images";
import { imageAlt } from "@/data/image-alts";

export type GalleryItem = {
  id: string;
  folder: string;
  base: string;
  width: number;
  height: number;
  ratio: number;
  categorySlug: string;
  categoryTitle: string;
  heading: string;
  alt: string;
};

const STOPWORDS = new Set(["services", "joinery", "halo", "r2"]);

/** Source filenames are legacy production labels and are not always a literal
 * description of what the photograph shows. Keep public captions accurate. */
const HEADING_OVERRIDES: Record<string, string> = {
  "services-joinery-wardrobes-sliding-wardrobes": "Glass-Fronted Wardrobes",
  "services-joinery-wardrobes-builtin-wardrobes": "Built-in Wardrobes",
  "services-joinery-wardrobes-hindged-wardrobes": "Hinged Wardrobes",
  "services-joinery-wardrobes-walkin-wardrobes": "Walk-in Wardrobes",
  "services-joinery-tv-units-vaneer-cladding": "Veneer Cladding",
  "accoustic-wood-ceilings": "Acoustic Ceiling",
  "filling-cabinets": "Filing Cabinets",
  "pu-painted-wall-panels": "PU Painted",
  "bed-headboards-1": "Bedroom TV Wall",
  "bar-counters": "Home Bar",
};

/** Turn a kebab base name into a readable label, in the context of a category. */
function humanize(base: string, category: ProductCategory): string {
  if (HEADING_OVERRIDES[base]) return HEADING_OVERRIDES[base];

  const words = base
    .split("-")
    .filter((w) => w && !STOPWORDS.has(w.toLowerCase()))
    // drop the folder slug tokens (e.g. "wardrobes" inside wardrobe bases)
    .filter((w) => !category.folder.split("_").includes(w.toLowerCase()));

  // Pure-number tails like "04" → "No. 04"
  const cleaned = words
    .map((w) => (/^\d+$/.test(w) ? `No. ${w.padStart(2, "0")}` : w))
    .join(" ")
    .trim();

  if (!cleaned || /^no\. \d+$/i.test(cleaned)) {
    const num = cleaned.replace(/no\.\s*/i, "");
    return num ? `${category.title} · ${num}` : category.title;
  }
  // Title-case
  return cleaned
    .split(" ")
    .map((w) => (w === "No." ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

function buildGallery(): GalleryItem[] {
  const items: GalleryItem[] = [];
  for (const category of PRODUCTS) {
    const imgs = folderImages(category.folder);
    for (const img of imgs) {
      const ratio = img.width > 0 && img.height > 0 ? img.width / img.height : 1;
      const heading = humanize(img.base, category);
      items.push({
        id: `${category.folder}--${img.base}`,
        folder: category.folder,
        base: img.base,
        width: img.width,
        height: img.height,
        ratio,
        categorySlug: category.slug,
        categoryTitle: category.title,
        heading,
        alt: imageAlt(
          category.folder,
          img.base,
          `${heading} — bespoke ${category.title.toLowerCase()} by Joinery.ae, Dubai`,
        ),
      });
    }
  }
  return items;
}

export const GALLERY_ITEMS = buildGallery();

/** A curated, interleaved order so the portfolio grid mixes categories rather
 *  than showing 12 wardrobes in a row. Round-robin across categories. */
export function interleavedGallery(): GalleryItem[] {
  const byCat = new Map<string, GalleryItem[]>();
  for (const it of GALLERY_ITEMS) {
    if (!byCat.has(it.categorySlug)) byCat.set(it.categorySlug, []);
    byCat.get(it.categorySlug)!.push(it);
  }
  const queues = [...byCat.values()];
  const out: GalleryItem[] = [];
  let added = true;
  while (added) {
    added = false;
    for (const q of queues) {
      const next = q.shift();
      if (next) {
        out.push(next);
        added = true;
      }
    }
  }
  return out;
}

export const PORTFOLIO_FILTERS = [
  { value: "all", label: "All Work" },
  ...PRODUCTS.map((p) => ({ value: p.slug, label: p.title })),
];
