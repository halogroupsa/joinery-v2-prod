#!/usr/bin/env python3
"""Green-screen key for the homepage door-opening sequence.

Feeds the KitchenDoorReveal / WardrobeDoorReveal sections
(src/components/sections/category-door-reveal.tsx), which draw
public/img/video-door-seq/door-####.webp onto a scroll-driven canvas.

FULL PIPELINE (source video -> keyed frames)
--------------------------------------------
Source: public/videos/door_openning_to_a_greenscreen.mp4  (1280x720, 24fps,
~15s). Only the clean first 11s are usable; the tail has generated-image drift.

1. Extract raw RGB frames at 12fps (gives 132 frames -> FRAME_COUNT):
       ffmpeg -y -i public/videos/door_openning_to_a_greenscreen.mp4 \
              -t 11 -vf "fps=12" /tmp/door-raw/raw-%04d.png

2. Key them:
       python3 scripts/key-door-frames.py /tmp/door-raw public/img/video-door-seq

   Preview a subset over magenta (any transparent hole in the handle shows
   as magenta) before committing to a full run:
       python3 scripts/key-door-frames.py /tmp/door-raw /tmp/prev preview 0085,0091,0114

3. Bump FRAME_VERSION in category-door-reveal.tsx so browsers refetch the
   re-keyed frames instead of serving the cached same-named files.

WHY THIS APPROACH (do not "simplify" back to a chroma-distance key)
-------------------------------------------------------------------
The doors have thin copper handles floating over the green. A naive
chroma-distance key + edge erosion ate the handle edges (they went partly
transparent) and made the greenish walnut semi-transparent. The metric here
is  greenness = G - max(R, B):
  * studio green  -> strongly positive (wall ~76-89, dim floor ~55-60)
  * walnut/copper -> NEGATIVE (never confused for background)
Transparency is only allowed inside the large connected green region (slightly
dilated), and only above a greenness floor well clear of the handle's values,
so the handle stays fully opaque with just true sub-pixel anti-aliased edges.
A GLOBAL despill (cap G at max(R,B)) neutralizes any green fringe/spill --
including the door's leading edge past the handle that the region gate can't
reach -- without touching the brown walnut.

The generated source also develops a separate colour drift late in the shot:
from about frame 0073 onward the walnut's red channel stays stable while green
and blue steadily rise, turning the doors olive by frame 0108.  That cast is
baked into the MP4, not introduced by the key.  A second, door-surface-only
pass restores the stable early-shot R-G and R-B relationships.  Its spatial
mask is measured from eroded large foreground components, then extended into
a narrow edge band.  In that band, only low-red-gap pixels are warmed, which
removes green reflected into the copper trim without shifting clean highlights.

Requires: numpy, pillow, scipy.
"""
import sys, os, glob
import numpy as np
from PIL import Image
from scipy import ndimage

RAW_DIR = sys.argv[1]
OUT_DIR = sys.argv[2]
MODE = sys.argv[3] if len(sys.argv) > 3 else "webp"   # "webp" or "preview"
ONLY = set(sys.argv[4].split(",")) if len(sys.argv) > 4 else None

# --- tunables (tuned against raw-0085/0091/0114, the frames that broke) ----
G_STRONG   = 48.0    # greenness that counts as "definitely studio green" (incl. dim floor)
G_BRIGHT   = 105.0   # min G channel to seed (catches dim shadowed floor; walnut gr<0 so safe)
MIN_AREA   = 400     # min green-component area (walnut is greenness<0, so this is safe)
DILATE_PX  = 3       # grow the background region this many px into fg edges
FADE_LO    = 40.0    # below this greenness -> fully opaque (protects handle: gr<=25)
FADE_HI    = 60.0    # above this greenness -> fully transparent (floor gr~57 keys out)
FEATHER    = 0.6     # gaussian sigma on alpha to de-stairstep (small! larger erodes handle)
QUALITY    = 82      # webp quality (keeps the 132-frame set ~5.8MB total)

# The source's walnut colour is stable through frame 0073.  Afterwards G and B
# drift upward while R remains stable.  These are the robust median channel
# gaps measured over the clean wood before the drift begins.
WOOD_STABILIZE_AFTER = 73
WOOD_TARGET_RG       = 37.0
WOOD_TARGET_RB       = 52.0
WOOD_ERODE_PX        = 6
WOOD_MIN_AREA        = 5000
WOOD_MASK_FEATHER    = 2.0
EDGE_REACH_PX        = 32
EDGE_BAND_PX         = 64
EDGE_TARGET_RG       = 22.0
EDGE_TARGET_RB       = 32.0
# -------------------------------------------------------------------------

def smoothstep(lo, hi, x):
    t = np.clip((x - lo) / (hi - lo), 0.0, 1.0)
    return t * t * (3 - 2 * t)

def stabilize_walnut(R, G, B, alpha, frame_number):
    """Remove late olive drift and green reflection from door/handle edges."""
    # Pull the measurement mask well inside the broad foreground surfaces so
    # the thin hardware and frame-gap details cannot skew the colour estimate.
    solid = alpha > 0.98
    core = ndimage.binary_erosion(solid, iterations=WOOD_ERODE_PX)
    lbl, n = ndimage.label(core)
    if not n:
        return R, G, B

    sizes = ndimage.sum(np.ones_like(core), lbl, index=np.arange(1, n + 1))
    keep = [i + 1 for i, size in enumerate(sizes) if size >= WOOD_MIN_AREA]
    if not keep:
        return R, G, B
    door_core = np.isin(lbl, keep)

    # Use ordinary mid-tone walnut for the per-frame measurement.  Copper is a
    # tiny fraction of this large-area sample and cannot pull the medians.
    sample = door_core & (R > 55.0) & ((R - B) > 15.0)
    if np.count_nonzero(sample) < WOOD_MIN_AREA:
        return R, G, B

    rg_gap = float(np.median((R - G)[sample]))
    rb_gap = float(np.median((R - B)[sample]))
    if frame_number <= WOOD_STABILIZE_AFTER:
        green_drop = 0.0
        blue_drop = 0.0
    else:
        green_drop = max(0.0, WOOD_TARGET_RG - rg_gap)
        blue_drop = max(0.0, WOOD_TARGET_RB - rb_gap)

    # Grow the application mask back through the door silhouette and its nearby
    # trim. Thin handles are included only where they sit close to the door;
    # the colour weights below still protect their already-warm copper pixels.
    surface = ndimage.binary_dilation(door_core, iterations=EDGE_REACH_PX)
    surface &= alpha > 0.02
    door_weight = ndimage.gaussian_filter(
        surface.astype(np.float32), WOOD_MASK_FEATHER
    )
    cast_weight = 1.0 - smoothstep(22.0, 38.0, R - G)
    brightness_weight = smoothstep(35.0, 60.0, R)
    weight = np.clip(door_weight * cast_weight * brightness_weight, 0.0, 1.0)

    G_fixed = G - green_drop * weight
    B_fixed = B - blue_drop * weight

    # The MP4 contains a stronger green reflection in the last few pixels of
    # the leading copper trim. A channel cap alone makes that reflection olive.
    # Reconstruct a warm copper/brown ratio only within the narrow silhouette
    # band. This also covers partially transparent antialiased edge pixels.
    interior = ndimage.binary_erosion(solid, iterations=EDGE_BAND_PX)
    edge_zone = surface & ~interior
    edge_weight = ndimage.gaussian_filter(edge_zone.astype(np.float32), 1.0)
    edge_cast = 1.0 - smoothstep(10.0, 30.0, R - G)
    edge_brightness = smoothstep(8.0, 35.0, R)
    edge_weight = np.clip(
        edge_weight * edge_cast * edge_brightness, 0.0, 1.0
    )

    target_g = np.maximum(0.0, R - EDGE_TARGET_RG)
    target_b = np.maximum(0.0, R - EDGE_TARGET_RB)
    G_fixed = G_fixed * (1.0 - edge_weight) + np.minimum(G_fixed, target_g) * edge_weight
    B_fixed = B_fixed * (1.0 - edge_weight) + np.minimum(B_fixed, target_b) * edge_weight

    return R, G_fixed, B_fixed


def process(path):
    im = np.asarray(Image.open(path).convert("RGB")).astype(np.float32)
    R, G, B = im[..., 0], im[..., 1], im[..., 2]
    mx_rb = np.maximum(R, B)
    greenness = G - mx_rb

    # 1) seed: only bright, strongly-green pixels
    seed = (greenness > G_STRONG) & (G > G_BRIGHT)

    # 2) keep only large connected components -> background core
    lbl, n = ndimage.label(seed)
    bg_core = np.zeros_like(seed)
    if n:
        sizes = ndimage.sum(np.ones_like(seed), lbl, index=np.arange(1, n + 1))
        keep = {i + 1 for i, s in enumerate(sizes) if s >= MIN_AREA}
        bg_core = np.isin(lbl, list(keep)) if keep else bg_core

    # 3) region where transparency is allowed (core grown a few px)
    region = ndimage.binary_dilation(bg_core, iterations=DILATE_PX)

    # 4) soft alpha only inside region; opaque everywhere else
    bg_alpha = smoothstep(FADE_LO, FADE_HI, greenness)   # 1 = background
    bg_alpha = np.where(region, bg_alpha, 0.0)
    alpha = 1.0 - bg_alpha

    if FEATHER > 0:
        alpha = ndimage.gaussian_filter(alpha, FEATHER)

    # 5) undo the generated source's late olive drift on broad door surfaces.
    frame_number = int(os.path.basename(path).split("-")[1].split(".")[0])
    R, G, B = stabilize_walnut(R, G, B, alpha, frame_number)
    mx_rb = np.maximum(R, B)

    # 6) despill: GLOBAL green-cast neutralization (see module docstring).
    G2 = np.minimum(G, mx_rb)
    out_rgb = np.stack([R, G2, B], axis=-1)

    a = np.clip(alpha * 255.0, 0, 255).astype(np.uint8)
    rgb = np.clip(out_rgb, 0, 255).astype(np.uint8)
    rgba = np.dstack([rgb, a])

    if MODE == "preview":
        # composite over magenta to reveal any holes in the foreground
        base = np.zeros_like(rgb, dtype=np.float32)
        base[..., 0] = 190; base[..., 1] = 70; base[..., 2] = 160
        af = a.astype(np.float32)[..., None] / 255.0
        comp = rgb.astype(np.float32) * af + base * (1 - af)
        return Image.fromarray(comp.astype(np.uint8))
    return Image.fromarray(rgba)

os.makedirs(OUT_DIR, exist_ok=True)
files = sorted(glob.glob(os.path.join(RAW_DIR, "raw-*.png")))
for f in files:
    num = os.path.basename(f).split("-")[1].split(".")[0]
    if ONLY and num not in ONLY:
        continue
    img = process(f)
    if MODE == "preview":
        img.save(os.path.join(OUT_DIR, f"prev-{num}.png"))
    else:
        img.save(os.path.join(OUT_DIR, f"door-{num}.webp"), "WEBP", quality=QUALITY, method=6)
print("done", MODE, "frames:", len(files) if not ONLY else len(ONLY))
