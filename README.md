# Clubline 1.30.0 — Supporter layering and dismissible alerts

Upload the ZIP contents to your GitHub Pages repository. Nothing has been deployed.

## Changes

- Cached stadium surfaces now include roof/wall visibility masks for animated supporters. Roofs, end walls and near-stand exterior walls hide supporters underneath; exposed seating retains its fans. Both far and near supporters are retained. The existing goal celebration behaviour is unchanged.
- Important notifications have separate Review and Dismiss buttons. Dismiss clears that notification group persistently without opening a panel, rejecting an offer or removing its underlying messages/reports. A later changed offer can produce a new notification. The stack stays above the ticker, with wrapping actions and reserved space beneath open career panels.
- Some pre-match visitors gather around stall locations and pause longer before moving on. Nearby groups share meeting areas while following varied curved routes. Entrances still attract arrivals. The existing quiet-day, pre-match, live and post-match crowd levels and eight matchday stalls are retained.
- Pitch players retain pedestrian proportions and now have a subtle shirt outline. When teams have similar light colours, the away strip switches to a dark alternative. The ball has a warm light fill and dark outline for contrast; passing, player movement and celebrations remain intact.

## Verification

Chromium browser checks cover opaque roof/wall occlusion across uncovered, full, cantilever, truss and continuous roofs, visible supporters and retained supporter nodes. Notification checks cover Review/Dismiss, grouped offers, preserved underlying offers, no panel opening on dismissal, changed offers creating new alerts and placement at 360×640, 844×390 and 390×844.

Existing home/away match checks pass for continuous SVG identity through goals, pause/resume, controls, substitutions and decisions, ball movement/passing, reports and reduced motion. Career panel caching, persistent stadium timelines, designer selection and anchored navigation checks pass. Logic checks cover construction, development, transfers, match statistics, route clearance, six day/evening maps, geometry and figure proportions. Syntax, version references, assets and ZIP integrity were checked.

Android Back has been reported working by the user. The animation and rendering changes still need a physical-phone check; desktop browser tests cannot establish identical Android painting behaviour. Match movement remains illustrative. This release retains map scale, artwork, branding and stand families.
