# Clubline 1.26.0 — Larger grounds and continuous paving

Upload the release ZIP contents to your GitHub Pages repository. Nothing has been deployed.

## Changes

- Stadiums are 45% larger relative to the city artwork, matching the approved engine preview. This changes the stadium/city relationship rather than magnifying both together. People, supporters, players and ball retain their proportion to the stadium.
- The grey boxed boundary and contrasting inner rectangle have been removed. The ground sits on continuous paving. Maximum upgrade bounds remain invisible, with a clear apron drawn on the stadium's exact axes.
- The stadium designer shows more surrounding location, with a responsive panel matching its camera shape. Stand selection and whole-side shortcuts continue to work.
- Roof end caps now close where adjoining stands use different rear-building depths, even when their stand and roof options otherwise match.
- All 24 desktop/mobile startup scenes are regenerated. Portrait title framing stays within the artwork so larger grounds do not introduce blank strips.
- Six approved city settings remain, each by day and evening. Match persistence, construction, transfers and other existing gameplay are retained.

## Verification

Reviewed all twelve club presets, all six maximum triple-tier/hospitality layouts by day and night, and exposed tier/concourse joins. Automated checks cover exact ground-axis alignment, maximum plot clearance, figure proportions, geometry and roof joins. Browser checks cover persistent match SVG/background, players/ball movement, pause/resume, goals, controls, substitutions, reports/history, designer taps and multi-selection, and anchored navigation at 390×844, 360×640 and 844×390.

Checked all 72 club/location portrait title camera bounds, twelve day/night asset renders, production syntax/references, asset counts and ZIP integrity. Physical-phone testing remains with the user. Some distant roads/buildings retain local generated-art angle irregularities; this release does not claim to resolve every visual defect in the engine.
