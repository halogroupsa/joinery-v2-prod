# Joinery.ae — Bespoke Joinery, Dubai

A static, fully responsive marketing site for a bespoke in-house joinery atelier.
Built with **Next.js (static export)**, **Tailwind CSS**, **Lenis** smooth scrolling and
**Framer Motion** scroll-driven effects (parallax, sticky pins, a scroll-scrubbed
door-opening reveal, and ambient video).

## Stack

- **Next.js 15** App Router, `output: "export"` → fully static `out/` (no server needed)
- **Tailwind CSS 3.4** with CSS-variable design tokens (fluid `clamp()` type & spacing, `rem`-based)
- **Lenis** smooth wheel scrolling + **Framer Motion** for scroll choreography
- **Sharp** image pipeline → responsive WebP + a JSON manifest
- Fonts: **Land Rover Web** (headings) + **Manrope** (body), self-hosted
- Ambient **MP4** video in the hero, the door-reveal and the craft section (H.264, web-optimized)

## Pages

| Route        | Description                                                        |
| ------------ | ----------------------------------------------------------------- |
| `/`          | Home — cinematic scroll sections (hero video, work, door reveal, craft, portraits, process, FAQ) |
| `/portfolio` | Justified image grid with category filters + accessible lightbox  |
| `/about`     | The atelier — story, animated stats, values, process timeline, capabilities |
| `/contact`   | Contact channels, enquiry form (composes a WhatsApp / email message), hours + map |

## Develop

```bash
npm install
npm run dev          # http://localhost:3000
```

> ⚠️ Don't run `npm run build` while `npm run dev` is live — the production build
> cleans `.next` and will crash the running dev server. Stop dev first.

## Build (static export)

```bash
npm run build        # outputs the static site to ./out
```

The entire deployable site is the `out/` directory (~124 MB, incl. optimized images & video).

## Indexing (robots & sitemap)

Indexing is gated on `NEXT_PUBLIC_SITE_URL` matching `CANONICAL_URL` in
`src/lib/site.ts`.

- `https://joinery.ae` emits an indexable `robots.txt`, the canonical sitemap, and
  `https://joinery.ae/...` canonicals on every page.
- Local, preview, and staging URLs emit `User-agent: *` / `Disallow: /`, so a staging
  deploy can never compete with production in search.

**This repo is the staging checkout.** `.env` pins `NEXT_PUBLIC_SITE_URL` to
`http://localhost:3000` for local work — which means a bare `npm run build` produces a
*noindex* export. Never deploy that to joinery.ae.

Use the production path instead, which overrides the site URL and then checks the
built artefact before anything is uploaded:

```bash
npm run build:prod    # or: make build-prod   — pins https://joinery.ae
npm run verify:prod   # or: make verify-prod  — asserts the export is indexable
```

`scripts/verify-prod-build.mjs` fails the deploy if `robots.txt` blocks crawlers, if any
canonical or sitemap URL is off-origin, if a page is missing its canonical, if `404.html`
is not `noindex`, or if an icon asset is absent. `npm run pages:deploy` chains all three,
so `make deploy` cannot ship a de-indexed build.

## Images

Raw originals live in **`_source-images/`** (outside `public/`, so they are **never shipped**).
Only the optimized variants under `public/img/` are deployed.

```bash
npm run assets:images   # re-generate WebP variants + src/data/images.json
```

Edit `scripts/optimize-images.mjs` (`FOLDER_MAP`, `SIZES`, `QUALITY`) to tune output.

## Videos

Optimized clips live in `public/videos/` (`hero-ambient.mp4`, `door-opening.mp4`,
`craft-closeup.mp4`). They were generated via Higgsfield and compressed with ffmpeg
(H.264, `yuv420p`, CRF 24, `+faststart`, audio stripped). To re-optimize a new raw clip:

```bash
ffmpeg -i raw.mp4 -an -vf "scale='min(1920,iw)':-2" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 24 -preset slow \
  -movflags +faststart public/videos/<name>.mp4
```

Prompts for additional clips/stills are documented in [`VIDEO_PROMPTS.md`](./VIDEO_PROMPTS.md).

## Deploy — Cloudflare Pages

`wrangler.toml` already sets `pages_build_output_dir = "out"`.

**Direct upload (Wrangler) — the supported path:**

```bash
make deploy        # build:prod -> verify:prod -> wrangler pages deploy out
```

**Dashboard (Git):** build command `npm run build:prod && npm run verify:prod`, output
directory `out`. Do not use a bare `npm run build` here — if a `.env` ever reaches the
build environment it will silently ship `Disallow: /`.

## Editing content

Most copy and the product taxonomy live in `src/lib/site.ts` (phone, WhatsApp, stats,
the 11 product categories, FAQs, material promises, developer logos). Design tokens are in
`src/styles/tokens.css`.
