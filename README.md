CLUBLINE — SURROUNDINGS INTEGRATION PILOT 1.50.0-pilot.1

Full runnable application based on Clubline release 1.49.0. This is a three-ground review pilot, not the completed all-club scenery release. Nothing has been deployed.

IMPLEMENTED
- Highfield / Armoury FC (C01): accepted refined neighbourhood study 8.
- Riverbank Stadium / Middleborough FC (C13): accepted docks study 1.
- Vale Park / Aston Vale (C02): accepted refined neighbourhood study 5.
- Fixed club surroundings for these three grounds, with no location selector in their setup. Their saved site IDs migrate on load/save.
- Accepted town worlds rendered as two transparent WebP layers around the actual modular stadium. Buildings, roads and trees retain the accepted projection and layout. The stadium is live, supports seat-colour choices, and keeps the existing match animation systems.
- The start menu cycles through these three grounds before the retained original menu scenes. Career portrait and landscape frame the same world.
- Build-site restrictions for these three grounds. A stand/roof/rear-building proposal extending outside its reserve is refused before charging funds; the designer displays the reason and disables construction.
- Existing oversized saved layouts or pending works safely use the original scenery instead of forcing a smaller stadium or overlapping town objects.
- The other 17 clubs keep their release 1.49 scenery during this pilot.

VERIFIED IN THIS PILOT
- Original league JSON is byte-for-byte unchanged: 20 clubs, 21 players each, 420 players, rating range 61–91. Generated league schedule has 38 rounds starting 15 August 1998. New careers start 3 August.
- Accepted-study clearance checks pass for complete roads/pavements, buildings/eaves, tree bounds, connected streets and access passages.
- Real Chromium checks at 390×844, 844×390 and 360×640: all three default grounds fit the career framing, no horizontal page overflow, fixed scene survives saved-career reload.
- Watched home matches use the fixed scenery. Synthetic goal/card/half-time interface updates retain the identical live SVG and scenery-layer elements. This checks interface continuity; it is not a full-season regression test.
- C03 retains original scenery. Setup location selector is absent for a pilot club.
- Oversized stand options are blocked without changing funds/state; default layouts fit all three reserves.
- All 224 service-worker cache paths exist. Service worker installs in Chromium; Highfield career reloads with its fixed scenery offline.
- No browser script errors or missing HTTP assets in the checks above. All root JavaScript files pass syntax checks. ZIP integrity checked.

LIMITS
Physical-phone speed, memory usage and touch behaviour still need device review. Scenery images total about 3.8 MB; this is not a measured mobile performance guarantee. Evening scenes darken the accepted day layers and retain stadium lights; dedicated lit-town artwork has not been created. The retained broader game UI and branding have not been redesigned by this pilot. The older full-release test record is preserved separately in RELEASE-1.49-NOTES.md; those full-season tests were not repeated here.

OPEN / UPLOAD
Serve this folder through a web server to review locally. For manual GitHub Pages upload, copy the extracted ZIP contents to the repository root so index.html sits at the root. Do not upload the ZIP itself. No deployment has been performed. Existing compatible 1.49 careers use the same save key; export a backup before replacing a live install.

SOURCE AND EVIDENCE
- assets/surroundings/: six runtime WebP layers, their editable source SVGs, and validated world-layout specifications.
- prototype-source/: the three accepted procedural scene sources and reusable street kits, with their original engines/data and clearance checks.
- tools/build-surroundings.mjs: regenerate the runtime WebPs from source SVGs with Node and sharp.
- tools/source-checks.mjs and tools/browser-checks.mjs: reproducible verification scripts. Browser checks need Playwright and installed Chromium; set CLUBLINE_CHROME_EXECUTABLE to an executable path if necessary.
- review/: actual browser screenshots and test-result records.
