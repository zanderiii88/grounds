# GROUNDS — Prototype 34.6

Upload the seven app files to the root of your GitHub repository, replacing the previous versions: `index.html`, `manifest.webmanifest`, `sw.js`, `version.json`, `icon-192.png`, `icon-512.png`, and `icon-maskable-512.png`. Keep your existing `assets/` folder and its images. The `assets/career-sites/` images are included in this ZIP for completeness; they are the same site artwork as 34.4 and do not need to be uploaded again if already present. Keep the folder path if you do upload them.

## Changes

- Mobile and short landscape designer controls float over a full-screen ground view. Small top actions provide Career, day/night, Fit and Done.
- The camera fills the site image and stops at its edges, removing blank areas when panning.
- New site pedestrians use routes along front road pavements and clear public plaza paths. Car routes stay on the roads; corrected image-to-scene registration removes movement drift. Junction pauses and bus/tram stops remain.
- On an event day, the calendar shows **Begin event** and **Simulate event**. A live score or event sales progress appears as the event runs; Operations shows stand stock. Half-time allows a stock check before resuming.
- Selecting a completed day shows its saved result and event take: attendance, gate/event income, food and drink sales, stock cost, unsold units, missed sales, and pitch change. Existing saves load and gain the report list automatically. Previous match results remain available through the existing history.

Career and Sandbox keep the existing local save keys, `grounds-career-v1` and `stadium-workshop-layered-v27`. Upload `version.json` and `sw.js` with `index.html` so the installed app detects the update. GitHub Pages can take several minutes to publish.

Hotfix: restored startup by initializing Career state before the first UI update. Existing saves remain compatible.
