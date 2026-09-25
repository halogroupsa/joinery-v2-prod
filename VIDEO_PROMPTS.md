# Joinery.ae — Video & Extra Asset Prompts

All clips: **photorealistic, cinematic, no people unless noted, warm refined tones,
slow steady camera, shallow depth of field, 4k**. Target a calm Apple-product-page
mood — motion is slow and deliberate so it can be scroll-scrubbed.

Generated with Higgsfield (`kling3_0_turbo`, 16:9, 1080p, 5s). Drop renders into
`public/videos/` using the filenames below; the site references those paths with an
image poster fallback, so missing files degrade gracefully.

---

## Generated this session (Higgsfield job ids)

| File | Job id | Used in |
|------|--------|---------|
| `public/videos/door-opening.mp4` | `33fba8a4-63b8-499a-95ef-fe2da9dd971a` | Door scroll experience / Doors showcase |
| `public/videos/hero-ambient.mp4` | `2b128a92-d15d-4c03-b810-91441f17e762` | Home hero background |
| `public/videos/craft-closeup.mp4` | `4dea762f-c6e8-4dc5-b63e-fe57c433f5d4` | "Our Craft" section |

### 1. Door opening (centerpiece — scroll-scrubbed)
> Cinematic slow push-in shot: a tall bespoke walnut pivot door with vertical fluted
> timber panels and a slim vertical brass handle slowly swings open, revealing a warm
> sunlit luxury living room with light marble floors, linen sofa and soft morning
> daylight. Golden directional light, dust motes drifting, shallow depth of field,
> photorealistic architectural interior film, smooth steady camera, no people, 4k,
> warm refined tones.

### 2. Hero ambient (home hero background)
> Cinematic slow dolly gliding through a luxury Dubai penthouse interior showcasing
> bespoke joinery: floor-to-ceiling walnut wardrobes with integrated lighting, a
> handcrafted kitchen with fluted cabinetry and slim brass details, a backlit feature
> wall. Warm directional sunlight across polished surfaces, calm elegant forward
> motion, photorealistic architectural film, shallow depth of field, no people, 4k.

### 3. Craftsmanship close-up ("Our Craft")
> Extreme close-up cinematic shot: a craftsman's hands slowly running over freshly
> sanded walnut veneer on a workbench in a high-end joinery workshop, rich wood grain
> detail, fine sawdust drifting through a shaft of warm directional light, a CNC
> machine softly out of focus in the background. Photorealistic documentary style,
> shallow depth of field, slow steady motion, 4k, warm tones.

---

## Suggested additional clips (generate when you want more depth)

### 4. Sliding wardrobe reveal — `public/videos/wardrobe-slide.mp4`
> Cinematic shot: a tall mirrored-and-walnut sliding wardrobe door glides open
> smoothly to reveal a backlit interior with neatly organised shelves, drawers and a
> jewellery tray under warm LED strip lighting. Luxury walk-in closet, soft reflections,
> photorealistic, slow steady motion, no people, 4k.

### 5. Kitchen drawer / soft-close detail — `public/videos/kitchen-detail.mp4`
> Macro cinematic shot: a handle-less fluted kitchen drawer with a slim brass reveal
> slides shut on a soft-close runner, warm under-cabinet light catching the matte
> lacquer and stone worktop. Photorealistic product film, shallow depth of field, 4k.

### 6. Wood ceiling pan — `public/videos/ceiling-pan.mp4`
> Slow upward tilt across a slatted walnut wood ceiling with integrated linear
> lighting in a luxury lobby, warm glow between the battens, soft architectural
> daylight. Photorealistic, smooth steady motion, no people, 4k.

### 7. Workshop wide / factory — `public/videos/workshop-wide.mp4`
> Cinematic wide shot of a clean, modern 15,000 sq ft joinery workshop in Dubai: CNC
> machines, stacked veneer sheets, finished cabinetry under warm industrial lighting,
> slight haze of fine dust in light beams. Photorealistic documentary, slow lateral
> dolly, 4k.

---

## Extra still images (if you want to extend the galleries)

Generate at 1600px wide, WebP, warm tones, then drop into the matching
`public/images/joinery_<category>_r2/` folder and re-run `npm run assets:images`.

- **Hero / interior backdrop** — "Luxury Dubai villa living room at golden hour with
  full-height bespoke walnut joinery wall, fluted panels, integrated lighting,
  marble floor, no people, architectural photography, warm tones."
- **Reception desk hero** — "Curved backlit reception desk in stone and walnut veneer
  in a premium corporate lobby, soft cove lighting, architectural photography."
- **Feature wall** — "Floor-to-ceiling backlit fluted timber feature wall behind a
  staircase in a luxury home, warm LED wash, architectural photography."
