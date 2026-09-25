#!/usr/bin/env node
/**
 * Optimize joinery source images → responsive WebP.
 *
 * Reads from   _source-images/<sourceFolder>/*
 * Writes to    public/img/<category>/<base>-<size>.webp
 * Manifest at  src/data/images.json  (base, sizes[], largest, width, height)
 *
 * The manifest stores each source's natural width/height so the justified
 * gallery can lay out rows by true aspect ratio without measuring in the browser.
 *
 * Sizes: 480, 768, 1200, 1600, 2000 (px wide). Quality 80. Idempotent.
 *
 * Sources are never upscaled, so a low-resolution source silently caps the
 * srcset — a 1024px source yields nothing above 768w, which pixelates in any
 * full-bleed slot. Keep sources >= 2000px wide for anything shown at 100vw+.
 *
 * Variants on disk that the rebuilt manifest no longer references are reported
 * as orphans; pass --prune to delete them.
 */
import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
// Raw originals live OUTSIDE public/ so they are never shipped to the static
// export — only the optimized webp variants under public/img/ are deployed.
const SRC = path.resolve(ROOT, "_source-images");
const OUT = path.resolve(ROOT, "public/img");
const MANIFEST = path.resolve(ROOT, "src/data/images.json");

// sourceFolder (under public/images) → output category (under public/img)
const FOLDER_MAP = {
  joinery_wardrobes_r2: "wardrobes",
  joinery_kitchens_r2: "kitchens",
  joinery_doors_r2: "doors",
  joinery_wall_panels_r2: "wall_panels",
  joinery_wood_ceilings_r2: "wood_ceilings",
  joinery_tv_units_r2: "tv_units",
  joinery_feature_walls_r2: "feature_walls",
  joinery_reception_desks_r2: "reception_desks",
  joinery_bar_counters_vanities_r2: "bar_counters_vanities",
  joinery_office_furniture_r2: "office_furniture",
  joinery_residential_furniture_r2: "residential_furniture",
  "joinery-portraits": "portraits",
  common: "common",
};

const SIZES = [480, 768, 1200, 1600, 2000];
const QUALITY = 80;
const EXTS = [".jpg", ".jpeg", ".png", ".webp"];

async function ensureDir(d) {
  await fs.mkdir(d, { recursive: true });
}

async function needsRebuild(src, dest) {
  try {
    const [s, d] = await Promise.all([fs.stat(src), fs.stat(dest)]);
    return s.mtimeMs > d.mtimeMs;
  } catch {
    return true;
  }
}

function baseNameOf(file) {
  return path
    .basename(file, path.extname(file))
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

// Orphaned variants are reported by default; pass --prune to actually delete.
const PRUNE = process.argv.includes("--prune");

let made = 0;
let skipped = 0;
let failed = 0;
let orphans = 0;
let removed = 0;
const manifest = {};

async function processFolder(sourceFolder, category) {
  const srcDir = path.join(SRC, sourceFolder);
  try {
    await fs.access(srcDir);
  } catch {
    console.warn(`  ! missing source folder: ${sourceFolder}`);
    return;
  }
  const outDir = path.join(OUT, category);
  await ensureDir(outDir);

  const entries = (await fs.readdir(srcDir)).filter((f) =>
    EXTS.includes(path.extname(f).toLowerCase()),
  );
  entries.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const items = [];
  for (const file of entries) {
    const srcPath = path.join(srcDir, file);
    const base = baseNameOf(file);

    let meta;
    try {
      meta = await sharp(srcPath).metadata();
    } catch (e) {
      console.error(`  ✗ meta ${srcPath}: ${e.message}`);
      failed++;
      continue;
    }
    // We .rotate() on output, so EXIF orientations 5–8 (90°/270° turns) mean the
    // written webp is the transpose of the raw metadata. Record the post-rotation
    // dimensions, or the manifest lies to <img width/height> and the gallery.
    const swap = (meta.orientation ?? 1) >= 5;
    const srcW = (swap ? meta.height : meta.width) ?? 0;
    const srcH = (swap ? meta.width : meta.height) ?? 0;
    const produced = [];

    for (const size of SIZES) {
      if (srcW && size > srcW * 1.1) continue; // never upscale
      const out = path.join(outDir, `${base}-${size}.webp`);
      produced.push(size);
      if (!(await needsRebuild(srcPath, out))) {
        skipped++;
        continue;
      }
      try {
        await sharp(srcPath, { failOn: "none" })
          .rotate()
          .resize({ width: size, withoutEnlargement: true })
          .webp({ quality: QUALITY, effort: 5 })
          .toFile(out);
        made++;
      } catch (e) {
        console.error(`  ✗ ${out}: ${e.message}`);
        failed++;
      }
    }

    // Always keep at least the source-width bucket if nothing matched
    if (produced.length === 0 && srcW) {
      const size = SIZES.find((s) => s >= srcW) ?? SIZES[SIZES.length - 1];
      const out = path.join(outDir, `${base}-${size}.webp`);
      try {
        await sharp(srcPath, { failOn: "none" })
          .rotate()
          .resize({ width: size, withoutEnlargement: true })
          .webp({ quality: QUALITY, effort: 5 })
          .toFile(out);
        produced.push(size);
        made++;
      } catch (e) {
        console.error(`  ✗ ${out}: ${e.message}`);
        failed++;
      }
    }

    if (produced.length) {
      items.push({
        base,
        sizes: produced.sort((a, b) => a - b),
        largest: Math.max(...produced),
        width: srcW,
        height: srcH,
      });
    }
  }

  manifest[category] = items;

  // Report variants the manifest no longer references. Shrinking or renaming a
  // source leaves the old webp files on disk; they ship in the static export but
  // nothing ever requests them, since srcsetFor() builds its srcset purely from
  // the manifest. Deleting is opt-in (--prune) because an orphan is sometimes
  // the only surviving high-res copy of an image whose source was downgraded,
  // or an entry that was hand-added to the manifest without a source file.
  const wanted = new Set(
    items.flatMap((it) => it.sizes.map((s) => `${it.base}-${s}.webp`)),
  );
  for (const file of await fs.readdir(outDir)) {
    if (!/-\d+\.webp$/.test(file) || wanted.has(file)) continue;
    if (PRUNE) {
      await fs.rm(path.join(outDir, file));
      removed++;
    }
    console.log(`  ${PRUNE ? "- removed" : "! orphan "} ${category}/${file}`);
    orphans++;
  }

  console.log(`· ${category.padEnd(22)} ${items.length} images`);
}

async function main() {
  console.log("Joinery image optimization → WebP");
  console.log(`  src: ${SRC}`);
  console.log(`  out: ${OUT}\n`);
  await ensureDir(OUT);

  for (const [sourceFolder, category] of Object.entries(FOLDER_MAP)) {
    await processFolder(sourceFolder, category);
  }

  await ensureDir(path.dirname(MANIFEST));
  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\nManifest → ${path.relative(ROOT, MANIFEST)}`);
  console.log(
    `Done. made=${made} skipped=${skipped} orphans=${orphans} removed=${removed} failed=${failed}`,
  );
  if (orphans && !PRUNE) {
    console.log("      re-run with --prune to delete the orphaned variants above");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
