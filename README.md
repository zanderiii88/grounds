# Clubline 1.29.0 — Navigation and stable stadium surfaces

Upload the ZIP contents to your GitHub Pages repository. Nothing has been deployed.

## Changes

- Important notifications stack above the ticker. Transfer offers, injuries, player conversations, loan/transfer requests, youth/development reports and stadium updates have review links. Similar items combine; two groups show initially with a more button. Reviewed groups clear persistently. Notifications wait during matchday screens. Open career panels reserve space beneath their controls for the stack.
- Android/browser Back follows the UI hierarchy: close details, return from subtabs/designer, minimize career sections, then return to the menu. During live matches Back pauses and offers Return to match or Main menu. Menu exit saves the paused match. The main menu allows normal browser departure.
- Lineup confirmation preserves the mounted pre-match stadium preview rather than reconstructing it. Normal live events and controls continue to preserve the live SVG.
- The immutable stand mesh is cached into two transparent images, made directly from the existing engine geometry. Far-stand supporters, exterior people, stalls, field and football remain separate SVG layers. This avoids repeatedly painting thousands of individual seat/wall faces during animation. The original geometry remains if caching fails; editable designer geometry is retained. This is a rendering optimization, not replacement stadium artwork.
- Removed an obsolete rule animating every circle in stadium SVGs and removed blur behind match overlays.
- Pitch players use the standard pedestrian proportions with home/away colours and alternate goalkeeper shirts. They are spread more widely across the field. The ball remains visible at ground/foot level with existing carry/pass/receive motion.

## Verification and remaining checks

Browser checks cover notification placement, grouping and review, panel button accessibility, Back hierarchy, designer return, live-match Back/return/menu/save, continued paused matches, lineup preview identity and both cached stand layers. Existing home/away match tests cover movement, passing, goals, cards/injuries, pause/resume, speed, substitutions, assistant, simulation, reports/history and persistent SVGs. Career panel preservation and designer checks pass. Phone-sized layouts were checked at 390×844, 360×640 and 844×390; career controls also at 1400×900.

Logic checks cover construction, development, transfers, match statistics, activity phases, route clearance, six day/evening settings, geometry, figure proportions, maximum footprints and cameras. Production syntax, imports, assets, release version and ZIP integrity were checked.

Android hardware Back behavior and the reported disappearing/repainting must be tested on your physical phone. Desktop Chromium checks do not establish that the Android issue is fully resolved. Scale, map artwork, branding and stand families are retained. Match movement remains illustrative rather than a precise replay of simulated events.
