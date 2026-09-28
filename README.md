# Clubline — Release 1.6.0

An independent, mobile-first football club career prototype. It does not read or overwrite GROUNDS saves.

## Play

Upload the contents of this ZIP to the root of a GitHub Pages repository, or serve this folder locally with a web server. Open `index.html` through the resulting URL. The game stores the career in this browser using the `clubline-career-r1` key.

The title screen has **Check for updates**. It compares the running build with `version.json` on the uploaded site and offers **Load update** when a newer version is available. Keep `version.json` with the uploaded contents for this to work. Reloading does not delete the career saved in this browser.

Choose one of 12 fictional clubs in the Premier Division, optionally rename any team, pick a large-district location and lock a primary colour. Club selection includes facilities and youth programme stars. The colour appears on the ground's seats. Your team plays 22 fixtures, home and away against each other club.

Select numbered player shirts by tapping a name then an XI or bench slot. Each shirt shows the surname, position, overall rating and condition. Dragging a shirt shows a ghost jersey and highlights the slot to be swapped; tapping works too. Choose among nine formations directly above the pitch, with Play style and Orders alongside. Advance through dates with the button at the bottom left. On matchday you can simulate instantly or confirm your lineup and watch at 4, 2 or 1 minute per half. Skip to the next event or the end of the half. Goals, cards and injuries pause briefly then resume; half-time waits for you. Full-time reports include player ratings, minutes, condition and home match revenue.

The Transfers tab lets you list players, inquire about valuations, bid for players in the division and respond to proposals. Incoming offers appear as a shortcut when the day advances. Training injuries occasionally appear in the league news. A sale or purchase updates both squads and refreshes your lineup.

## Scope of this release

Twelve distinctive starting grounds use one editable 32-section model adapted from the GROUNDS stand catalogue. In **Facilities → Design stadium**, choose sections and change stand family, tiers, roof, rear building or exterior. The preview shows capacity and cost before changes are saved. The club's primary colour appears on the seats. Existing `clubline-career-r1` saves continue and retain stadium edits; matchday attendance reflects the edited capacity.

Release 1.6 focuses on the visuals. The approved angular Option A wordmark is in the game. The stadium renderer now closes exterior and exposed end walls, draws supported tier separation and concourse bands, and paints near/far sides in an order that keeps the seating and roof structure legible. Grounds are visually enlarged on their existing plots. The menu frames the stadium closer, rotates through all 12 clubs and five compatible GROUNDS maps at day and night, and pans gently over each 12-second scene. Mobile uses its own crop to keep the stadium inside a portrait frame. Day/night art continues to follow home fixture kick-off times; away results remain text-led.

The modular SVG renderer is still a Clubline adaptation, not a copy of GROUNDS' full canvas renderer. The original Sandbox decoration, move and rotate tools have not been ported. Some large roof structures and site-to-stadium detail can benefit from further art passes. The title preview is a background scene, while the player can edit the career ground under Facilities. The game does not import GROUNDS careers.

Open `stadium-gallery.html` after extracting the ZIP to compare all twelve grounds in day and evening views without starting careers.

The finances are provisional: opening cash derives from the club's pilot budget, weekly wages are deducted on Mondays, and home matchday income is estimated automatically. Opponent match results use club attack and defence ratings. The user's watched and quick-simulated matches use the same event engine, with live tactical choices affecting later chances.

## Files

- `index.html`, `style.css`, `app.js`, `scene.js`, `stadium-model.js`: the standalone game.
- `data/league.json`: 12 clubs and 288 player records with recalibrated positional ratings.
- `assets/clubline-logo.svg`: the approved chrome Clubline wordmark and metallic red arrow.
- `assets/sites/`: day and night GROUNDS location art.
- `assets/icon.svg` and `assets/icon-192.png`, `icon-512.png`, `icon-180.png`: the angular C and trend arrow app icon.
- `manifest.webmanifest`, `version.json`: install branding and update checking.
