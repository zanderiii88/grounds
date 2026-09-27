# GROUNDS v35.7 — Visible matchday and calmer streets

Upload the contents of this ZIP to the root of the existing GitHub Pages repository. Include `vehicle-paths.js` with `index.html`. The service worker and in-game version number are 35.7.

- Each site has at most one moving bus, with a long break between trips. Cars remain on their directed marked routes. Vehicle paths have been simplified into straighter road stretches and clear turns, within six image pixels of the prior marked routes.
- Home is fixed at the upper right during play. Back appears at the lower right of Career pages and the live event, returning to the stadium view. A Live event or Final report button reopens a panel left in progress.
- Home matchdays use the stadium's football scene with players and people in the stands. Pre-match crowds appear in and around the ground. Visible seating occupancy tracks event attendance relative to capacity, and more pedestrians appear outside during the event.
- The live match or venue event uses a compact lower panel for phase, score, attendance, sales, missed orders and the latest occurrence. The stadium remains visible above it. Half-time stock, transfers and restocking are in an expandable section; the final report retains its detailed view.

The site artwork and stadium placement geometry have not changed. Seat colour selection and pre-season stadium editing remain planned for a later release.

Career and Sandbox saves retain `grounds-career-v2` and `stadium-workshop-layered-v35`. Earlier `grounds-career-v1` and `stadium-workshop-layered-v27` records are not removed.
