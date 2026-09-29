# Clubline 1.16.0 — Approved maps and mobile framing

Upload the contents of this folder to your existing GitHub Pages repository, replacing the previous game files. Keep index.html at the repository root. On the phone, use Check for updates, then Load update if offered.

## Included
- Only the four approved locations: Town Quarter, Riverside City, Beach Resort and Woodland Station.
- Fixed pitch-centred stadium placement, shared projection and scale; no movement or rotation controls.
- Eight prerendered showcase scenes: each location by day and evening, with gentle pan and crossfade. Incoming images decode before replacing the previous scene.
- Compact centred start controls, leaving the stadium visible below on portrait screens.
- Persistent career status bar: logo, league position, date/time, balance and fixtures.
- Prominent age in player cards, profiles, bench and reserve lists.
- Existing careers on retired maps migrate to Town Quarter.

## Validation
JavaScript syntax checks passed. All 12 clubs render valid scene geometry on all four maps. Season creation, age displays and retired-map save migration passed programmatic checks. Rendered showcase artwork inspected. Browser layout testing could not be completed because the browser download failed; mobile touch and pinned-bar layout require device verification.

## Known issue and queued work
The rural plot boundary angles remain imperfect and are accepted for now; correction is queued for a later art pass. No additional maps were added. Youth intake, squad limits, player conversations and development reports are queued for the following gameplay release.
