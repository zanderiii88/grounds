CLUBLINE 99 — FULL RELEASE 1.52.0 / ARTWORK START SCREEN

Based on the repaired, integrity-checked Clubline-Release-1.51.0-Clubline-99-Rebrand.zip. Nothing deployed.

IMPLEMENTED
The approved retro football-management cover artwork now forms the start screen. New Career, Continue, Options and Check for Updates are working native UI buttons over the artwork; Continue is visible but disabled without a saved career. Music/FX controls remain in Options and are removed from the start screen. Portrait retains the entire cover without cropping its logo; landscape keeps the cover on the left and controls on the right. The same artwork remains behind the New Game menus with no start-screen buttons. Selected stadium preview stays inside the club-details panel.

New careers use the club's fixed seat palette; the colour selector and Home location row are removed. Club renaming is retained. Selection is sorted by fictional/displayed names and immediately re-sorts during typing. Canonical club IDs, kit/stadium associations, league schedule and source ordering remain unchanged. Club names persist into the new career.

PRESERVED
All 20 accepted fixed stadium surroundings, modular stadium, construction footprint protections, period kits, 1998–99 league data and compatible saves. No changes to match or tactics systems. Top-three-player selection and opposing tactics boards remain pending.

VERIFIED
Browser checks at 390×844, 844×390, 360×640 and 640×360: all four start controls fit with no horizontal overflow or clipped text. A 1.51.0 career continues in 1.52.0; Options retains audio controls; update check succeeds; fictional names sort A–Z; renaming moves the selected club without losing identity/input and persists into a new career. Setup artwork has no start controls, location row or colour controls. Service worker installs; artwork and saved renamed career load offline. Fresh installation has disabled Continue. No script errors or missing assets. All root JS modules pass syntax checks. League, kit and fixed-world files match 1.51.0. See review/artwork-browser-checks.json and artwork-source-checks.json. Earlier review reports are inherited evidence and were not all rerun. No full season or physical-phone testing performed for this release.

MANUAL UPLOAD
This is a complete release. Extract Clubline-Release-1.52.0-Artwork-Start.zip and upload its CONTENTS to your repository yourself, with index.html at the root, alongside assets/ and data/. No prior release upload is required. Nothing has been deployed.
