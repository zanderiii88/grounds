# GROUNDS — Prototype 34.9 aligned site pilot

This is a one-site experiment. The existing Market Town and all other locations are unchanged. Choose **Market Town · aligned pilot** from the Sandbox Setting menu to compare it without replacing your Career save. It also appears in Div 2 and Div 1 New Game site choices; starting a new Career replaces the current Career save as before.

## Upload

Replace these seven files at the repository root: `index.html`, `manifest.webmanifest`, `sw.js`, `version.json`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`.

Add these two files, keeping their folder path: `assets/career-sites/mid-market-town-aligned-day.webp` and `assets/career-sites/mid-market-town-aligned-night.webp`. The existing artwork stays in place. The `art-source/` folder documents the precise grid and can be kept locally; it is not required on GitHub Pages.

## What to review

- The playable 50×50 world plot matches the paved diamond and fence exactly. The stadium pitch, stand footprints and placement grid use the same 2:1 isometric registration as the artwork.
- Roads form a connected ring outside the site; vehicles travel on its lanes, and pedestrians use authored pavement lines around the plot. The bus pauses at an authored stop.
- Day and night are rendered from the same geometry, so lighting changes without moving the roads, walls or gates.

The visual style is deliberately simpler than the existing painted site. This pilot is for judging the alignment and whether this art direction is acceptable before rebuilding more sites. No preset stadium cycling is included in this experiment. Existing `grounds-career-v1` and `stadium-workshop-layered-v27` saves remain compatible.
