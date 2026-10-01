# Clubline 1.27.0 — Stadium view

Upload the release ZIP contents to your GitHub Pages repository. Nothing has been deployed.

## Changes

- Removed the large opaque engine paving overlay from every location. A narrow pitch surround and ground beneath the actual stand modules remain. Empty corners and unused upgrade space no longer receive a whole-plot polygon. Construction uses the affected module footprint.
- New careers and Continue open onto the stadium and setting. Home, Squad, Facilities, Finances and Organiser open as panels; pressing the active button again minimizes it. Switching panels remembers their subtab, scroll position and existing controls. Stadium designer drafts and selected stands survive minimizing or switching panels.
- The career background remains mounted when panels open, close or ordinary game data changes. Existing persistent live match updates are retained. A changed stadium layout or matchday scene can legitimately require a new scene.
- The stadium view is framed between the top bar and bottom ticker/navigation. Navigation and Advance remain visible on desktop as well as mobile. Quiet days show the next fixture in the ticker.
- Stand selection is lighter on mobile and desktop, keeping the seating visible beneath its outline.
- All 24 mobile/desktop day/evening startup composites have been regenerated from the actual engine without the oversized paving layer.

## Verification

Browser checks cover stadium-first new/continued careers, all five panel toggles, retained transfer filters/scroll/designer selections, uninterrupted SVG time and scene identity during panel changes and Advance. Top/bottom controls and ticker placement were checked at 390×844, 360×640, 844×390 and 1400×900.

Live-match checks cover persistent SVG/background through goals, cards, injuries, pause/resume, speed, assistant controls, formation, substitutions and simulation; player movement, reports, table-to-Home return and historical statistics also pass. Designer taps and whole-side selection were checked at three phone-sized viewports.

Logic checks cover construction, development, transfer search, match statistics, six day/night assets, engine axes, maximum footprint bounds, figure proportions, stand geometry, roof returns, sparse-ground surfaces and title camera bounds. Reviewed actual engine composites for twelve club presets and maximum layouts in all six locations by day/evening.

Physical-phone scrolling, performance and animation behavior still need your test. Existing clear plots in the raster artwork remain visible; removing the engine overlay does not repaint the city. Local map angle/scale irregularities and remaining corner/stand details may need further refinement.
