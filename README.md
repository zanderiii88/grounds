# Clubline 1.23.0 — City nights

Upload the release ZIP contents to the root of your existing GitHub Pages repository. Nothing has been deployed.

## Changes

- Six city settings now have day and night artwork: Aberdeen / Granite Harbour, Liverpool, Manchester, Cardiff, Dublin and Birmingham.
- Granite Harbour replaces its previous artwork; five city locations join the existing six other settings. All twelve are selectable in career setup.
- A shared proportional stadium projection registers the six city grounds inside their clear plots. Engine stand geometry, capacity and axis directions are preserved. The pitch remains fixed in each setting as the stadium grows.
- Original artwork proportions are retained. Night home matches use the matching evening map.
- All 48 mobile/desktop startup scene assets are regenerated, covering twelve locations in day and evening.
- Existing stadium structures, independent corners, persistent match rendering, transfers, statistics and management gameplay are retained.

## Verification

Construction, development, match-statistics, transfer-search and scene-geometry checks passed. Six city day/night assets, equal projection scale, unchanged axis directions and containment of the largest ground envelope with margin were checked.

Browser checks passed for persistent SVG/background through match events and controls, moving players, pauses, substitutions, saved reports, and anchored navigation at portrait and landscape phone sizes. Six city setup choices, career selection and twelve city day/night live renders were checked without page errors. Asset paths, startup scene dimensions, production syntax and ZIP integrity were checked.

## Remaining visual limits

Some generated road and plot edges still drift from the engine's exact axes. Maximum ground clearance is checked for the six new city maps; exact alignment of every street/building is not certified. The six retained older maps have their previous largest-layout clearance limitations. Physical-phone behaviour and the uploaded site have not been independently verified.

See CITY-MAP-NOTES.md for projection details. Local checks: node tests/city-maps.mjs and the existing tests. Browser checks require Playwright and CLUBLINE_CHROME pointing to Chromium when needed.
