#!/usr/bin/env node
/**
 * Gate the production deploy on an indexable, correctly-canonicalized export.
 *
 * `next build` loads .env, and .env carries NEXT_PUBLIC_SITE_URL=http://localhost:3000
 * for local work. A deploy run from a developer machine therefore picks up localhost
 * unless the shell overrides it — which silently ships `Disallow: /` and localhost
 * canonicals to joinery.ae and de-indexes the site.
 *
 * Also checks each page ships its own share card (og:image) and og:url.
 *
 * This inspects the built artefact rather than the environment, so it catches the
 * mistake whatever its cause. `pages:deploy` runs it between build and upload.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.resolve(ROOT, "out");
const CANONICAL_URL = "https://joinery.ae";

/** Files that must exist in the export for icons to resolve. */
const REQUIRED_ASSETS = ["favicon-woodgrain.png", "favicon-woodgrain.ico"];

const errors = [];
const fail = (msg) => errors.push(msg);

async function htmlFiles(dir) {
  const found = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith(".html")) found.push(full);
  }
  return found;
}

async function main() {
  try {
    await fs.access(OUT);
  } catch {
    fail("out/ does not exist — run the build first.");
    return;
  }

  // robots.txt must invite crawlers and point at the canonical sitemap.
  const robots = await fs.readFile(path.join(OUT, "robots.txt"), "utf8");
  if (/Disallow:\s*\/\s*$/m.test(robots)) {
    fail(
      "robots.txt blocks all crawlers. The build resolved a non-canonical site URL " +
        `— rebuild with NEXT_PUBLIC_SITE_URL=${CANONICAL_URL}.`,
    );
  }
  if (!robots.includes(`${CANONICAL_URL}/sitemap.xml`)) {
    fail(`robots.txt does not reference ${CANONICAL_URL}/sitemap.xml.`);
  }

  // Every sitemap entry must be a production URL.
  const sitemap = await fs.readFile(path.join(OUT, "sitemap.xml"), "utf8");
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (locs.length === 0) fail("sitemap.xml contains no <loc> entries.");
  for (const loc of locs.filter((l) => !l.startsWith(CANONICAL_URL))) {
    fail(`sitemap.xml has a non-production URL: ${loc}`);
  }

  // Every page must carry a canonical on the production origin. 404.html is
  // exempt: it is deliberately non-canonical and noindex.
  const pages = await htmlFiles(OUT);
  if (pages.length === 0) fail("out/ contains no HTML pages.");
  for (const page of pages) {
    const rel = path.relative(OUT, page);
    const html = await fs.readFile(page, "utf8");
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];

    if (rel === "404.html") {
      if (canonical) fail(`404.html must not declare a canonical (found ${canonical}).`);
      if (!/<meta name="robots" content="[^"]*noindex/.test(html)) {
        fail("404.html is missing a noindex robots meta.");
      }
      continue;
    }

    if (!canonical) fail(`${rel} has no canonical tag.`);
    else if (!canonical.startsWith(CANONICAL_URL)) {
      fail(`${rel} has a non-production canonical: ${canonical}`);
    }

    // Share card: absolute on the production origin, and actually in the export.
    const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
    if (!ogImage) fail(`${rel} has no og:image.`);
    else if (!ogImage.startsWith(`${CANONICAL_URL}/`)) {
      fail(`${rel} has a non-production og:image: ${ogImage}`);
    } else {
      try {
        await fs.access(path.join(OUT, new URL(ogImage).pathname));
      } catch {
        fail(`${rel} og:image points at a missing file: ${ogImage} — run npm run assets:og`);
      }
    }
    const ogUrl = html.match(/<meta property="og:url" content="([^"]+)"/)?.[1];
    if (canonical && ogUrl !== canonical) {
      fail(`${rel} og:url (${ogUrl}) does not match its canonical (${canonical}).`);
    }
  }

  for (const asset of REQUIRED_ASSETS) {
    try {
      await fs.access(path.join(OUT, asset));
    } catch {
      fail(`Missing icon asset in export: ${asset}`);
    }
  }

  // Not fatal — a deploy can go out before the IDs exist — but a production
  // export without its tags silently loses ad attribution, so say so loudly.
  const home = await fs.readFile(path.join(OUT, "index.html"), "utf8");
  if (!home.includes("googletagmanager.com/gtm.js")) {
    console.warn("⚠ Google Tag Manager is not in the export — is NEXT_PUBLIC_GTM_ID set?");
  }
  if (!home.includes("googletagmanager.com/gtag/js?id=AW-")) {
    console.warn("⚠ Google Ads tag is not in the export — is NEXT_PUBLIC_GOOGLE_ADS_ID set?");
  }

  if (errors.length === 0) {
    console.log(
      `✓ Production export verified — ${pages.length} pages canonical on ${CANONICAL_URL}, ` +
        `robots.txt indexable, ${locs.length} sitemap URLs.`,
    );
  }
}

await main();

if (errors.length > 0) {
  console.error("\n✗ Refusing to deploy — the export is not production-ready:\n");
  for (const e of errors) console.error(`  • ${e}`);
  console.error("");
  process.exit(1);
}
