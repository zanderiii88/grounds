# Clubline 1.19.0 — Stadium life and construction

Upload the ZIP contents to the existing GitHub Pages repository, replacing previous files. Keep index.html at the root. On the phone use Check for updates, then Load update if offered.

## Included
- Career content scrolls within its own panel. The top status bar, bottom navigation and news ticker remain outside that scrolling region. Scroll position is retained when updating the same section.
- Stadium changes are scheduled construction projects. Quotes show estimated duration, opening date, closed seats, remaining attendance capacity and affected home fixtures. Multiple affected fixtures trigger advice to wait until nearer season's end; proceeding remains your choice.
- Construction costs are charged at confirmation. Affected sections stay closed under scaffolding and protective sheeting until their opening date. Attendance and matchday income use the remaining open capacity. Completion news appears in the club hub. Existing careers initialise the construction system automatically.
- One stadium project can be active at a time. Construction continues across season rollover. A whole-ground project can leave no paying attendance; the quote warns about this.
- Outside the ground: 16 scattered walkers on ordinary days, 72 before home kickoff, five during a watched home match. Routes use the stadium ground plane and remain outside the stand and construction footprint. They are decorative stadium-apron routes; this does not add moving road traffic.
- Clearly coloured supporters populate open stands during matches. Home goals trigger individually timed bouncing. Closed sections contain no supporters.
- Two contrasting teams move through overlapping areas across both halves. Goalkeepers have alternate shirts. A visible ball travels between player routes. The animation illustrates play; it does not drive the match-result calculations.
- Either scoring side runs to a corner, briefly gathers, and returns before play resumes. Home-goal stadium lights celebrate as before. Goal pauses last about 3.5 seconds; cards keep their shorter pause. Injury and sending-off decisions retain their existing pause/assistant behaviour.
- Normal minute updates retain the pitch scene instead of rebuilding it. Manual and injury pauses freeze pitch animation; goal celebrations animate during their brief stoppage.
- Start-screen scenes remain prerendered for smooth mobile fades. The seven approved locations and their placement are retained.

## Validation
JavaScript/module checks, asset references and ZIP integrity passed. Construction tests cover quotes, home-fixture impact, costs, capacity loss, save persistence, opening dates, insufficient cash, whole-ground closure, all seven sites and player counts. App checks exercise the construction button handler, save/reload, match attendance, youth promotion and season rollover with project completion. Existing youth and player-development tests passed. Scaffold and stadium-life still renders were inspected.

Full browser/physical-phone interaction testing could not be completed in this environment. In particular, verify bar anchoring while scrolling and the live animation timing on your phone after updating.

Run: node tests/construction.mjs and node tests/development.mjs

## Later
Moving vehicles, richer fan-zone/stall interactions, more city maps, further stadium architecture and full training management.
