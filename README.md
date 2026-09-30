# Clubline 1.20.0 — Persistent matchday

Upload the contents of this ZIP to your existing GitHub Pages repository. Keep index.html at the repository root. Nothing has been deployed. Use Check for updates and Load update on an existing installation.

## Changes

- A watched match keeps its background and complete stadium SVG mounted. Goals, cards, injuries, half-time, automatic resumes, speed changes, tactics, assistant controls, substitutions and simulation jumps update the surrounding interface without rebuilding the ground.
- Players and the ball use a persistent animation controller. Pauses retain their positions and animation clock. Scoring players gather at a corner and return; home supporters celebrate with individual timing. White goal-screen flashes have been removed. Reduced-motion settings freeze decorative movement.
- Pitch players are substantially larger, the ball is larger and outlined, the match camera is closer, and supporters are larger. Exterior walker counts are 28 on ordinary days, 100 before home kickoff and 12 during a home match. These remain decorative apron routes, not road traffic.
- A compact possession bar shows the most recent five simulated match minutes. Before five minutes have elapsed, it uses the available minutes. Whole-match possession, shots, shots on target, goals and cards are saved in reports and accessible from fixture history.
- Possession is simulated minute by minute using team strength, style and variation. Shots and shots on target are recorded when the chance/goal events occur. Decorative player/ball movement does not determine these statistics or match results.
- The report identifies a player of the match from both teams, shows attendance (including away fixtures), and retains ticket, concession and shop revenue, operating costs, net club income, player performance and fitness. After the report, the league table shows movement and returns to the news hub.
- Half-time stops at 45 minutes; resuming starts minute 46, keeping watched and simulated statistic windows consistent.
- Career scrolling stays in the content pane. The top status bar and mobile bottom navigation remain outside it. Live commentary scrolls within the match screen; touchline decisions open over it.
- Far-side stands stay behind the pitch. Roof surfaces are opaque. Tier fronts and rear gaps have additional solid surfaces. Exposed side profiles use actual neighbour depths, with side closures where rear blocks differ. This is a structural repair pass, not a complete stadium redesign.
- All 28 startup images were regenerated from the corrected modular engine. The approved Clubline branding and seven existing maps are retained.

## Verification

Browser regression checks passed at 390×844, 360×640, 320×568 and 844×390. The same SVG and background nodes survived the match actions listed above. Player movement, pausing, goals/resumes, substitutions, genuine half-time, home/away fixtures, saved reports, reloads, statistics orientation and calendar report access were checked. No JavaScript page errors were observed. The tested mobile navigation stayed anchored while content scrolled.

Construction, development, match-statistics and scene-geometry checks passed. Scene tests cover twelve default layouts across seven sites and all stand families. Module syntax, asset references, startup image sizes and ZIP contents were checked.

These are browser checks at phone dimensions. Physical-phone scrolling, paint behaviour, visual readability and frame rate still need your feedback after uploading. The deployed site has not been independently verified.

## Maps and remaining work

The separate review pack contains seven maximum-layout composites, mobile screenshots, a map audit and a Tyne artwork proposal with an engine composite. The proposal is not included as replacement artwork: its clean outline is an improvement, but exact plot positioning and axes still need further correction. No map should yet be treated as fully certified for every stadium/roof/rear-block combination.

More detailed stand architecture, richer fan zones/stalls and animated road traffic remain future work.

## Local checks

Run `node tests/construction.mjs`, `node tests/development.mjs`, `node tests/match-stats.mjs` and `node tests/scene-geometry.mjs`.

The optional browser check is `tests/browser.cjs`, requiring Playwright and a local server on port 8765 serving this directory. `CLUBLINE_CHROME` can point to an existing Chromium binary. Test hooks are injected only by the browser test; the production game exposes none.
