import imageManifest from "@/data/images.json";

export type ManifestEntry = {
  base: string;
  sizes: number[];
  largest: number;
  width: number;
  height: number;
};
type Manifest = Record<string, ManifestEntry[]>;

const MANIFEST = imageManifest as unknown as Manifest;

export const FALLBACK_SIZES = [480, 768, 1200, 1600, 2000];

/** Lookup a single optimized image entry by folder + base name. */
export function imageMeta(folder: string, base: string) {
  return MANIFEST[folder]?.find((e) => e.base === base);
}

/** All optimized image entries for a folder (in manifest order). */
export function folderImages(folder: string) {
  return MANIFEST[folder] ?? [];
}

/** Build a responsive srcset + fallback src for an image. */
export function srcsetFor(folder: string, base: string) {
  const entry = imageMeta(folder, base);
  const available = entry?.sizes ?? FALLBACK_SIZES;
  const parts = [...available]
    .sort((a, b) => a - b)
    .map((s) => `/img/${folder}/${base}-${s}.webp ${s}w`);
  const fallback = `/img/${folder}/${base}-${entry?.largest ?? 1200}.webp`;
  return { srcset: parts.join(", "), fallback };
}
