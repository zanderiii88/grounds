# Clubline 1.24.0 — Stadium framing

Upload the release ZIP contents to your existing GitHub Pages repository. Nothing has been deployed.

## Changes

- Only the six approved new city maps remain: Aberdeen / Granite Harbour, Liverpool, Manchester, Cardiff, Dublin and Birmingham. All have day and evening artwork. Older map assets and menu scenes are removed from this ZIP.
- Setup, Facilities, the stadium designer and home match views frame the actual stadium layout rather than showing the whole maximum plot. Larger stadiums automatically get a wider frame. Close views retain the complete stand outline instead of cropping it to the phone aspect ratio.
- Startup scenes use closer framing with the stadium in the lower part of the mobile composition. All 24 mobile/desktop day/evening startup images are regenerated.
- Zoom applies equally to the map, stadium, walkers and players. Their existing proportion to the stadium is retained; seating geometry and pitch anchors are unchanged.
- The city backgrounds receive a vertical-preserving ground-plane correction to bring their average plot-edge slopes into line with the engine axes. Local irregularities in generated roads/buildings may still need refinement.
- Cwmderyn's default corners use standard single-tier sections instead of double-tier corners. Untouched legacy default corners are corrected when loading a career; custom corner choices remain. Removed-map saves fall back to Granite Harbour.

## Checks

Six city day/night assets, maximum plot clearance, unchanged engine axis directions, adaptive camera framing, upright background verticals and Cwmderyn corner defaults were checked. Browser checks cover city setup and live renders, career fallback, custom corner preservation, persistent match SVG/background through events and controls, movement and pause, substitutions, reports/history and fixed navigation at portrait/landscape phone sizes. Production syntax, references, asset counts and ZIP integrity were checked.

Physical-phone behaviour and the uploaded site still need user feedback. Some local artwork edges may remain imperfect even after average plot alignment correction.
