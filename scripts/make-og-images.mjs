#!/usr/bin/env node
/**
 * Generate the Open Graph / Twitter share card for every page.
 *
 * Writes to   public/og/<key>.webp  (1200×630, the size WhatsApp, LinkedIn, X and
 *             Facebook all crop to without letterboxing)
 *
 * Each card sets the logo, an eyebrow, the headline and the domain in the site's
 * real typefaces on a carbon panel, beside a photograph chosen for that page.
 * Pages reference cards by key through `socialMeta()` in src/lib/seo.ts, and
 * scripts/verify-prod-build.mjs fails the deploy if a page's card is missing.
 *
 * Rendering goes through Satori (vendored in Next as @vercel/og) rather than
 * sharp's text input: sharp's Pango build on macOS ignores `fontfile` and falls
 * back to Helvetica, whereas Satori embeds the font bytes directly.
 *
 * Satori reads TTF/OTF/WOFF but not WOFF2 — hence the .woff Manrope cuts — and
 * PNG/JPEG but not WebP, so every photo is transcoded by sharp first.
 *
 * Re-run after changing a page's headline or hero image:  npm run assets:og
 */
import { ImageResponse } from "next/dist/compiled/@vercel/og/index.node.js";
import sharp from "sharp";
import React from "react";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JOINERY_PAGES } from "../src/data/joinery-pages.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const OUT_DIR = path.join(PUBLIC, "og");
const MANIFEST = JSON.parse(await fs.readFile(path.join(ROOT, "src/data/images.json"), "utf8"));

const WIDTH = 1200;
const HEIGHT = 630;
const QUALITY = 84;

// Mirrors src/styles/tokens.css.
const CARBON = "#16100B";
const PAPER = "#F4EFE7";
const ACCENT_SOFT = "#D4B487";

/**
 * One card per page. `image` names a photo by manifest folder + base; the photo is
 * chosen for the card rather than inherited from the page hero, so each preview
 * shows its subject clearly in the right-hand panel. The optional `position` is a
 * sharp gravity for the crop when the subject is off-centre.
 */
const STATIC_PAGES = [
  {
    key: "home",
    image: { folder: "feature_walls", base: "bookmatched-walnut-veneer-wall" },
    eyebrow: "Bespoke joinery · Dubai",
    title: "Designed, made and installed in-house.",
  },
  {
    key: "about",
    image: { folder: "common", base: "in-house-facility-v2" },
    eyebrow: "About Joinery.ae",
    title: "Dubai’s in-house bespoke joinery atelier.",
  },
  {
    key: "portfolio",
    image: { folder: "kitchens", base: "kitchen-12" },
    eyebrow: "Portfolio",
    title: "Bespoke joinery projects across Dubai.",
  },
  {
    key: "services",
    image: { folder: "feature_walls", base: "backlit-stone-feature-wall" },
    eyebrow: "Services",
    title: "Joinery for every room, made in our own workshop.",
  },
  {
    key: "maintenance-repair",
    image: { folder: "common", base: "in-house-facility" },
    eyebrow: "Repair & maintenance",
    title: "Furniture repair and carpentry across Dubai.",
  },
  {
    key: "contact",
    image: { folder: "doors", base: "door-02" },
    eyebrow: "Contact",
    title: "Start your bespoke joinery project.",
  },
];

/** Card photo per service slug — the clearest single shot of each discipline. */
const SERVICE_IMAGES = {
  wardrobes: { folder: "wardrobes", base: "services-joinery-wardrobes-walkin-wardrobes" },
  kitchens: { folder: "kitchens", base: "kitchen-08" },
  doors: { folder: "doors", base: "door-06" },
  "wall-panels": { folder: "wall_panels", base: "geometric-designs-wood-panels" },
  "wood-ceilings": { folder: "wood_ceilings", base: "coffered-ceiling", position: "top" },
  "tv-units": { folder: "tv_units", base: "tv-unit-led-backlight" },
  "feature-walls": { folder: "feature_walls", base: "geometric-sculpted-wood-wall", position: "right" },
  "reception-desks": { folder: "reception_desks", base: "reception-desk-4" },
  "bar-counters-vanities": { folder: "bar_counters_vanities", base: "residential-vanities-waterproof-finishes" },
  "office-furniture": { folder: "office_furniture", base: "conference-tables" },
  "residential-furniture": { folder: "residential_furniture", base: "consoles", position: "right" },
};

const SERVICE_PAGES = JOINERY_PAGES.map((page) => {
  const image = SERVICE_IMAGES[page.slug];
  if (!image) throw new Error(`No OG photo chosen for service "${page.slug}" — add it to SERVICE_IMAGES`);
  return { key: page.slug, image, eyebrow: `${page.name} · Dubai`, title: page.title };
});

const CARDS = [...STATIC_PAGES, ...SERVICE_PAGES];

// Card geometry: text sits on a solid carbon panel at left, the photo fills the
// right and fades into the panel, so no part of the subject sits under the type.
const PHOTO_LEFT = 500;
const PHOTO_WIDTH = WIDTH - PHOTO_LEFT;
const FADE_WIDTH = 200;

// Mirrors FOLDER_MAP in optimize-images.mjs (source folder → manifest folder).
const SOURCE_FOLDERS = {
  wardrobes: "joinery_wardrobes_r2",
  kitchens: "joinery_kitchens_r2",
  doors: "joinery_doors_r2",
  wall_panels: "joinery_wall_panels_r2",
  wood_ceilings: "joinery_wood_ceilings_r2",
  tv_units: "joinery_tv_units_r2",
  feature_walls: "joinery_feature_walls_r2",
  reception_desks: "joinery_reception_desks_r2",
  bar_counters_vanities: "joinery_bar_counters_vanities_r2",
  office_furniture: "joinery_office_furniture_r2",
  residential_furniture: "joinery_residential_furniture_r2",
  common: "common",
};

/**
 * Prefer the original in _source-images/ (often larger than the biggest webp
 * variant, since the optimizer never emits a size above the source width), and
 * fall back to the largest optimized variant on a checkout without originals.
 */
async function imagePath({ folder, base }) {
  const entry = MANIFEST[folder]?.find((e) => e.base === base);
  if (!entry) throw new Error(`No manifest entry for ${folder}/${base}`);
  const sourceDir = path.join(ROOT, "_source-images", SOURCE_FOLDERS[folder] ?? folder);
  try {
    const match = (await fs.readdir(sourceDir)).find((f) => path.parse(f).name === base);
    if (match) return path.join(sourceDir, match);
  } catch {
    // No originals on this checkout.
  }
  return path.join(PUBLIC, "img", folder, `${base}-${entry.largest}.webp`);
}

const toDataUri = (buf, mime) => `data:${mime};base64,${buf.toString("base64")}`;

async function photoDataUri(image) {
  const file = await imagePath(image);
  // .rotate() applies EXIF orientation — the phone-shot workshop photos need it.
  const pipeline = sharp(file).rotate();
  const { width, height, orientation } = await sharp(file).metadata();
  const uprightWidth = orientation >= 5 ? height : width;
  if (uprightWidth < PHOTO_WIDTH) {
    console.warn(`  ! ${path.relative(ROOT, file)} is ${uprightWidth}px wide — upscaled to ${PHOTO_WIDTH}px`);
  }
  const jpeg = await pipeline
    .resize(PHOTO_WIDTH, HEIGHT, { fit: "cover", position: image.position ?? "centre" })
    .jpeg({ quality: 90 })
    .toBuffer();
  return toDataUri(jpeg, "image/jpeg");
}

/** The header logo is dark ink on transparent; recolour it to paper via its alpha. */
async function logoDataUri() {
  const LOGO_WIDTH = 300;
  const alpha = await sharp(path.join(PUBLIC, "joinery-logo.webp"))
    .resize({ width: LOGO_WIDTH })
    .ensureAlpha()
    .extractChannel("alpha")
    .raw()
    .toBuffer({ resolveWithObject: true });
  const png = await sharp({
    create: {
      width: alpha.info.width,
      height: alpha.info.height,
      channels: 3,
      background: PAPER,
    },
  })
    .joinChannel(alpha.data, { raw: { width: alpha.info.width, height: alpha.info.height, channels: 1 } })
    .png()
    .toBuffer();
  return { uri: toDataUri(png, "image/png"), width: alpha.info.width, height: alpha.info.height };
}

async function loadFonts() {
  const read = (p) => fs.readFile(path.join(PUBLIC, "fonts", p));
  return [
    { name: "Land Rover Web", data: await read("landroverweb_bold.ttf"), weight: 700, style: "normal" },
    { name: "Manrope", data: await read("manrope_web/manrope-medium.woff"), weight: 500, style: "normal" },
    { name: "Manrope", data: await read("manrope_web/manrope-semibold.woff"), weight: 600, style: "normal" },
  ];
}

const h = React.createElement;

// Satori has no `inset` shorthand, so every absolutely positioned layer below
// spells out its bounds.

function Card({ photo, logo, eyebrow, title }) {
  const titleSize = title.length > 40 ? 44 : 48;
  return h(
    "div",
    { style: { display: "flex", position: "relative", width: "100%", height: "100%", background: CARBON } },
    h("img", {
      src: photo,
      width: PHOTO_WIDTH,
      height: HEIGHT,
      style: { position: "absolute", top: 0, left: PHOTO_LEFT, width: PHOTO_WIDTH, height: HEIGHT },
    }),
    // Blends the photo's left edge into the text panel instead of a hard seam.
    h("div", {
      style: {
        position: "absolute",
        top: 0,
        left: PHOTO_LEFT,
        width: FADE_WIDTH,
        height: HEIGHT,
        backgroundImage: "linear-gradient(90deg, rgba(22,16,11,1) 0%, rgba(22,16,11,0.6) 45%, rgba(22,16,11,0) 100%)",
      },
    }),
    h(
      "div",
      {
        style: {
          position: "absolute",
          top: 56,
          bottom: 56,
          left: 64,
          width: 400,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      },
      h("img", { src: logo.uri, width: 170, height: Math.round((170 * logo.height) / logo.width) }),
      h(
        "div",
        { style: { display: "flex", flexDirection: "column" } },
        h(
          "div",
          {
            style: {
              fontFamily: "Manrope",
              fontWeight: 600,
              fontSize: 17,
              letterSpacing: 2.5,
              textTransform: "uppercase",
              color: ACCENT_SOFT,
            },
          },
          eyebrow,
        ),
        h("div", { style: { width: 48, height: 3, background: ACCENT_SOFT, marginTop: 20, marginBottom: 24 } }),
        h(
          "div",
          {
            style: {
              fontFamily: "Land Rover Web",
              fontWeight: 700,
              fontSize: titleSize,
              lineHeight: 1.12,
              color: PAPER,
            },
          },
          // Non-breaking hyphen (U+2011, present in Land Rover Web) keeps
          // "in-house" and "well-made" from splitting across lines.
          title.replaceAll("-", "\u2011"),
        ),
      ),
      h(
        "div",
        {
          style: {
            display: "flex",
            fontFamily: "Manrope",
            fontWeight: 500,
            fontSize: 18,
            color: "rgba(244,239,231,0.72)",
          },
        },
        "joinery.ae  ·  Made in Al Quoz, Dubai",
      ),
    ),
  );
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const [fonts, logo] = await Promise.all([loadFonts(), logoDataUri()]);

  for (const card of CARDS) {
    const photo = await photoDataUri(card.image);
    const response = new ImageResponse(h(Card, { photo, logo, eyebrow: card.eyebrow, title: card.title }), {
      width: WIDTH,
      height: HEIGHT,
      fonts,
    });
    const png = Buffer.from(await response.arrayBuffer());
    const out = path.join(OUT_DIR, `${card.key}.webp`);
    const { size } = await sharp(png).webp({ quality: QUALITY, effort: 6 }).toFile(out);
    console.log(`  ✓ og/${card.key}.webp  ${(size / 1024).toFixed(0)} KB`);
  }

  // Drop cards for pages that no longer exist.
  const keep = new Set(CARDS.map((c) => `${c.key}.webp`));
  for (const file of await fs.readdir(OUT_DIR)) {
    if (!keep.has(file)) {
      await fs.unlink(path.join(OUT_DIR, file));
      console.log(`  − removed orphan og/${file}`);
    }
  }
  console.log(`\n${CARDS.length} share cards written to public/og/`);
}

await main();
