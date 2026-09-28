# Clubline — Release 1.2

An independent, mobile-first football club career prototype. It does not read or overwrite GROUNDS saves.

## Play

Upload the contents of this ZIP to the root of a GitHub Pages repository, or serve this folder locally with a web server. Open `index.html` through the resulting URL. The game stores the career in this browser using the `clubline-career-r1` key.

The title screen has **Check for updates**. It compares the running build with `version.json` on the uploaded site and offers **Load update** when a newer version is available. Keep `version.json` with the uploaded contents for this to work. Reloading does not delete the career saved in this browser.

Choose one of 12 fictional clubs in the Premier Division, optionally rename any team, pick a large-district location and lock a primary colour. Club selection includes facilities and youth programme stars. The colour appears on the ground's seats. Your team plays 22 fixtures, home and away against each other club.

Select numbered player shirts by tapping a name then an XI or bench slot. Each shirt shows the surname, position, overall rating and condition. Drag and drop also works. Use the Formation, Play style and Orders tabs for your match plan. Advance through dates with the button at the bottom left. On matchday you can simulate instantly or confirm your lineup and watch the text match at three speeds. Goals, cards, injuries and half-time pause play. Full-time reports include player ratings, minutes, condition and home match revenue.

## Scope of this release

The ground preview is a new schematic isometric scene, with size, roof, location and seat colour variations. Detailed stadium assets, construction, full kit editing, transfers, pricing and venue operations are scheduled for later releases. The single season can be restarted with New career; there is no GROUNDS save migration.

The finances are provisional: opening cash derives from the club's pilot budget, weekly wages are deducted on Mondays, and home matchday income is estimated automatically. Opponent match results use club attack and defence ratings. The user's watched and quick-simulated matches use the same event engine, with live tactical choices affecting later chances.

## Files

- `index.html`, `style.css`, `app.js`, `scene.js`: the standalone game.
- `data/league.json`: 12 clubs and 288 player records with recalibrated positional ratings.
- `assets/clubline-logo.svg`: the new Clubline wordmark and rising red arrow.
- `assets/icon.svg` and `assets/icon-192.png`, `icon-512.png`, `icon-180.png`: the angular C and trend arrow app icon.
- `manifest.webmanifest`, `version.json`: install branding and update checking.
