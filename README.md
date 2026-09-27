# GROUNDS v35.2 — Nine sites and career improvements

Upload the contents of this ZIP to the root of `zanderiii88/grounds`, replacing files with matching names. Keep the `assets/career-sites/` folder structure. Older unreferenced files in the repository can remain. The `archive/` folder is for reference and is not loaded by the game.

## What changed

- Four new day/night site pairs: Seaside Resort and University District for the mid tier; Civic Gardens and Rail District for the top tier. All nine sites are available in Sandbox. New Career choices use three sites per tier. Each new site has its own short checked road route and adjacent pavement movement; the outer decorative streets do not yet have animated traffic.
- Three editable starting stadium presets for each tier. Cycle through the layouts in New Game before placing the ground; edit the chosen layout later in Designer. Div 1 starts with slightly larger mid-tier stands, while Div 3 stays within its stand limits.
- Away league fixtures now resolve on the calendar date, with a result briefing and calendar score. They no longer enter the live venue screen or create home-ground stock and service reports. Existing in-progress away fixtures from v35 are resolved when that Career save resumes.
- Live home matches and venue events track per-stand opening, half-time and closing stock. At half-time you can move quantities between serving stands. Final reports include the per-stand snapshot where available; earlier reports remain readable.
- Start menu and mobile Career/placement UI styling has been refined. The start menu, header, version check and service-worker cache now agree on v35.2. The update button requests a fresh navigation when a newer version is available.

The existing `grounds-career-v2` and `stadium-workshop-layered-v35` browser storage keys are retained. Earlier `grounds-career-v1` and `stadium-workshop-layered-v27` data remains untouched. Starting a new Career still replaces the current Career save, as the game warns.
