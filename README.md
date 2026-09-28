# Clubline — Release 1.5.0

An independent, mobile-first football club career prototype. It does not read or overwrite GROUNDS saves.

## Play

Upload the contents of this ZIP to the root of a GitHub Pages repository, or serve this folder locally with a web server. Open `index.html` through the resulting URL. The game stores the career in this browser using the `clubline-career-r1` key.

The title screen has **Check for updates**. It compares the running build with `version.json` on the uploaded site and offers **Load update** when a newer version is available. Keep `version.json` with the uploaded contents for this to work. Reloading does not delete the career saved in this browser.

Choose one of 12 fictional clubs in the Premier Division, optionally rename any team, pick a large-district location and lock a primary colour. Club selection includes facilities and youth programme stars. The colour appears on the ground's seats. Your team plays 22 fixtures, home and away against each other club.

Select numbered player shirts by tapping a name then an XI or bench slot. Each shirt shows the surname, position, overall rating and condition. Dragging a shirt shows a ghost jersey and highlights the slot to be swapped; tapping works too. Choose among nine formations directly above the pitch, with Play style and Orders alongside. Advance through dates with the button at the bottom left. On matchday you can simulate instantly or confirm your lineup and watch at 4, 2 or 1 minute per half. Skip to the next event or the end of the half. Goals, cards and injuries pause briefly then resume; half-time waits for you. Full-time reports include player ratings, minutes, condition and home match revenue.

The Transfers tab lets you list players, inquire about valuations, bid for players in the division and respond to proposals. Incoming offers appear as a shortcut when the day advances. Training injuries occasionally appear in the league news. A sale or purchase updates both squads and refreshes your lineup.

## Scope of this release

Twelve distinctive starting grounds now use a common, editable 32-section model adapted from the GROUNDS stand catalogue. In **Facilities → Design stadium**, select any side section or corner and change its stand family, tier structure, roof, rear building or exterior. The preview shows the updated stadium, capacity change and cost; confirm to pay for and save the work. The club's primary colour automatically appears on its seats. The saved layout appears on the career background and during home matches, and persists in an existing `clubline-career-r1` save. Existing 1.4.1 careers load with a starting layout. Stadium income/attendance uses the updated capacity. Construction is limited to 10,000–75,000 places and available cash.

The start menu chooses a random club and compatible location on each launch, frames the whole stadium and shows a matchday crowd under evening lights. Club selection previews the selected team's own starting ground. Five large and mid GROUNDS locations have day and night views; the two smaller available sites remain limited to clubs below 45,000 seats at setup. Home match overlays use night art for 17:30 and 19:45 kick-offs; away results remain text-led.

This is the first Clubline modular designer. The GROUNDS section families and pitch/grid alignment are present, but its original full canvas editor, site decorations, move/rotate controls and Sandbox mode are not yet in Clubline. The SVG art and roof occlusion still need refinement. Full kit editing, pricing and venue operations remain later work. The game does not import GROUNDS careers.

Open `stadium-gallery.html` after extracting the ZIP to compare all twelve grounds in day and evening views without starting careers.

The finances are provisional: opening cash derives from the club's pilot budget, weekly wages are deducted on Mondays, and home matchday income is estimated automatically. Opponent match results use club attack and defence ratings. The user's watched and quick-simulated matches use the same event engine, with live tactical choices affecting later chances.

## Files

- `index.html`, `style.css`, `app.js`, `scene.js`, `stadium-model.js`: the standalone game.
- `data/league.json`: 12 clubs and 288 player records with recalibrated positional ratings.
- `assets/clubline-logo.svg`: the approved chrome Clubline wordmark and metallic red arrow.
- `assets/sites/`: day and night GROUNDS location art.
- `assets/icon.svg` and `assets/icon-192.png`, `icon-512.png`, `icon-180.png`: the angular C and trend arrow app icon.
- `manifest.webmanifest`, `version.json`: install branding and update checking.
