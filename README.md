# Clubline 1.25.0 — Stadium scale and aligned plots

Upload the ZIP contents to your existing GitHub Pages repository. Nothing has been deployed.

## Changes

- All six city settings now use revised day and evening artwork: Aberdeen / Granite Harbour, Liverpool, Manchester, Cardiff, Dublin and Birmingham. Their surrounding buildings have been redrawn around the stadium space; this changes the stadium/city relationship rather than just magnifying both together.
- The clear stadium plot and paved apron are SVG ground surfaces drawn with the stadium engine's exact east and south axes. They replace the irregular painted plot boundaries, use matching day/night geometry and remain clear for upgrades and animated supporters.
- All sites use one shared proportional stadium scale. The complete maximum triple-tier/hospitality envelope fits within every plot. Stand dimensions and each career's pitch position remain fixed through upgrades.
- Players, ball, exterior walkers and seated supporters scale with the stadium projection, retaining their established proportions to the stands.
- All 24 desktop/mobile startup scenes are regenerated from actual engine stadiums and the revised artwork. Mobile framing avoids starting above the artwork's upper edge.
- The previous release's match rendering, corner improvements, transfers, possession statistics, construction and development features are retained.

## Checks

Automated checks cover exact plot/apron axis alignment, maximum stadium clearance, six day/night pairs, figure proportions, finite stadium geometry, construction, development, transfer search and match statistics. Browser checks cover city selection, twelve live day/night renders, persistent match SVG/background, controls, substitutions, reports/history, motion/pause and navigation at three phone viewport sizes. Actual maximum-layout composites were visually reviewed across all twelve maps. Production syntax, references, asset counts and ZIP integrity are checked during packaging.

Physical-phone behaviour needs user testing. The plot and apron edges are exact; individual roads and buildings in the generated city artwork can still have local angle irregularities beyond the apron.
