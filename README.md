# GROUNDS — Prototype 34.4

This release adds the ten new Career site plates in day and night variants: three compact grassy starter plots, four paved middle sites (including the open waterfront), and three large paved top sites. The older Nordic and European Seaside locations remain available in Sandbox and existing Career saves remain readable.

## Upload to GitHub

Upload the seven app files from this folder to the repository root, replacing their previous versions: `index.html`, `manifest.webmanifest`, `sw.js`, `version.json`, `icon-192.png`, `icon-512.png`, and `icon-maskable-512.png`. Upload the 20 `.webp` images in `assets/career-sites/` with that folder path intact. Keep your existing `assets/*.png` artwork in place. GitHub's web upload can accept a dragged folder; confirm the commit lists paths such as `assets/career-sites/mid-open-waterfront-day.webp` before committing. The oversized `START-HERE.html` is not needed.

If uploading files one by one in the GitHub web interface, open or create `assets/career-sites/` in the repository before choosing the `.webp` files. Do not put them at the repository root.

## Changes

- The new site art is registered in the game, with compact grass plots for Div 3, paved middle sites for Div 2 and Div 1, and large paved sites for the Championship. Existing careers retain their selected ground. The new locations are also available in Sandbox.
- The painted Market Town bus, Open Waterfront tram and Outskirts Campus bus were removed from their day and night images. These now move as canvas vehicles and briefly stop at a route stop.
- Each new site has road routes, pavement walking routes, and a junction pause. A vehicle that reaches an occupied junction waits until the first has cleared it. Cars and pedestrians move faster than before; older sites also have shorter junction pauses and faster movement.
- Existing Career and Sandbox save keys remain `grounds-career-v1` and `stadium-workshop-layered-v27`. Upload `version.json` and `sw.js` so the installed app recognizes 34.4. GitHub Pages can take several minutes to refresh.

This update adds the site selection and scene motion. A later release can add offers to relocate between tiers, purchase costs, council support and expanded stand unlocks.
