# GROUNDS — Prototype 31: Career foundation

Extract the ZIP and open `START-HERE.html` in a browser. It contains the district artwork and runs offline. `index.html` and `assets/` are editable source; run `python3 build-standalone.py` to regenerate the standalone.

## Career Mode

From the GROUNDS menu, choose Career Mode. Name a club, pick one of four starting divisions, select from three grounds offered for that division, and choose a weaker, balanced or stronger squad. Place and confirm the stadium on its site. That position and rotation are permanent in this career. The fifth, top division becomes reachable by promotion.

The first season starts in August 2026. Each division has 20 clubs and a 38-round home-and-away schedule through May. Generated opponents have different strengths. Play one round at a time, inspect upcoming fixtures and their rough attendance, ticket income and pitch wear, and follow results, form and the table in Club. Three clubs move up or down between adjacent divisions each season, with top and bottom divisions capped. Promotion and relegation change the next season's club funds.

The Calendar also lists five proportional event offers each season, with an attendance range, potential income and pitch wear. Approve or decline before the event date. Confirmed events pay out and wear the pitch as the calendar advances; unattended offers expire. Home games earn gate receipts, while each fixture has a cost. Capacity limits home attendance. The bottom navigation contains Calendar, Stadium, Grounds, Operations and Club. Stadium opens the existing stand designer; Grounds displays pitch condition; Operations is a preview of planned management.

Career progress saves separately as `grounds-career-v1`. The Sandbox design remains on its existing `stadium-workshop-layered-v27` key. The main menu can resume a career. Starting a new career from Club replaces only the career save.

## Scope and known limits

This is the first playable progression loop. Squad strength and home advantage affect results; stadium capacity affects attendance and money. Stand changes are currently free and immediate. The financial balance is intentionally simple, with no debt, wages, construction times, ticket pricing, food and staffing decisions, council process, board targets or pitch-maintenance actions yet. Pitch condition records wear and recovery, but does not alter match results. All top-three and bottom-three movements are automatic without playoffs.

The event estimates are rough and events do not require a detailed preparation plan yet. Sandbox's visual event scenes are separate from career calendar simulation. Existing v30 sites, taller stands and artwork are included.

See `TEST-RESULTS-v31.json` for automated checks. Fresh browser screenshots and real-phone performance measurements were unavailable in this environment, so visual gameplay and touch review are still open.
