# Clubline 1.28.0 — Matchday life

Upload these ZIP contents to your GitHub Pages repository. Nothing has been deployed.

## Changes

- Ordinary days retain a small number of pedestrians. Local curved routes, different speeds, pauses and nearby wandering replace the shared rectangular perimeter laps.
- Home matchdays add eight food/club-shop stalls, vendors, queues and much busier arrivals. Some visitors approach entrances and fade from view. During play the stalls remain but queues disappear and only six visitors plus vendors remain outside. After a home match, departures and smaller stall queues return until advancing to the next day.
- Away watched games now show the opponent's modular stadium, city setting and supporters instead of the separate flat pitch. Home games retain your actual stadium and construction state. Both use evening scenes for late kickoffs.
- The full-stadium live view has more space on portrait phones. Players follow coordinated attacking/defensive movement across the pitch. The visible ball has carry, kick/pass and receive phases near players' feet. Existing corner celebrations remain.
- Supporters in visible seating are clearer, with varied clothing, scattered quiet movement and staggered reactions to home-team goals.
- Stadium/background SVGs remain mounted during live events and controls. Ordinary career panel toggles continue to preserve their scene and panel state. Scale, branding, stadium structures and city artwork are retained.

## Verification

Browser checks cover live home/away stadiums, supporter/stall/player presence, passing and kicking, player/ball movement, pauses, goals and automatic resume, substitutions, cards, injuries, assistant controls, simulation, reports/history, reduced motion and SVG persistence. Phone-sized layouts checked at 390×844, 360×640 and 844×390; career navigation also checked at 1400×900. Panel state and designer taps/selection checks pass.

Logic checks cover phase densities, stalls retained through kickoff, empty live queues, curved routes with pauses, arrivals/departures and clearance from the actual stand backs. Existing construction, development, transfers, statistics, geometry, six day/night settings, maximum footprints and camera checks pass. Actual engine composites were reviewed across the four activity phases.

Physical-phone animation smoothness and performance still need your test. These are illustrative match animations, not a replay of every simulated action. Stalls are visual additions; existing concession finances remain. Pedestrians use the registered clear circulation area, not a city-wide road/path navigation system. Local raster-art alignment irregularities and remaining stand/corner details are unchanged.
