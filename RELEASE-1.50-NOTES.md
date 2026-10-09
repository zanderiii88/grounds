CLUBLINE — RELEASE 1.50.0 / FIXED STADIUM SURROUNDINGS

Full runnable application extending the accepted three-ground pilot to all 20 clubs. Based on release 1.49.0 and pilot 1.50.0-pilot.1. Nothing deployed.

IMPLEMENTED
Every club now uses its accepted original FSM-inspired neighbourhood around the live modular stadium. There is no location selector. The start menu cycles the 20 fixed grounds in day and evening framing; watched away matches use the host club's world. Portrait and landscape are different views of the same scene.

Highfield, Vale Park and Riverpool use their latest accepted refinements. Mancaster uses the improved industrial yards, containers and vehicles. The Dene defaults to red-dominant seating and Hillside to blue-dominant seating, with silver/white accents. Existing saved seat choices are retained; new careers use the revised default palettes. Period kit files and league data are unchanged.

Scenery uses two transparent WebP layers around the live stadium. Stadium tiers, pitch, crowd, players and match animation still use the existing modular engine. No large reserve carpet is painted beneath the stadium.

All 20 grounds enforce their own buildable site: stand/roof/rear-building options outside the reserve are disabled with an explanation, and construction is refused before funds change. Oversized existing saved stadiums/pending works safely use the prior scenery until a fitting layout is used; their stadium is not forcibly changed.

An integration check found Ellbank's SE corner roof/rear extends beyond the original study reserve. Its south reserve was extended to include that corner plus 0.8 clearance. Complete roads/pavements, building/eave and tree bounds still clear it. No surrounding objects were moved.

VERIFICATION
Passed: all 20 accepted-study clearance checks and integrated full building/eave/tree/road/pavement reserve checks; default layouts and blocked build proposals; all 20 careers at 390×844, 844×390 and 360×640 with no horizontal overflow; saved-career reload; watched home matches retaining identical stadium/world nodes through synthetic goal/card/half-time/injury refreshes; representative evening views; title rotation; 258 existing cache paths; service-worker install; offline Highfield reload and a new Selwood career started offline through the actual UI. No browser script errors or missing HTTP assets were recorded. All 27 root JS modules passed syntax checks.

The self-contained review gallery also passed club-filter and portrait/landscape control checks. See review/browser-checks.json, additional-browser-checks.json, source-checks.json, accepted-clearance-checks.json and syntax-checks.json for records. The original 1.49 full-season test record is preserved in RELEASE-1.49-NOTES.md; those older tests are not evidence that a full season was rerun for this scenery release.

LIMITS
Physical-phone speed, memory usage and touch behaviour remain untested. Town scenery is static; the existing stadium animation remains live. Evening worlds darken the day artwork and retain the stadium lights; bespoke lit-town artwork has not been made. The broader branding and tactics UI redesign are still future work.

MANUAL UPLOAD
Extract Clubline-Release-1.50.0-Fixed-Surroundings.zip and upload its contents to the repository root, with index.html at the root and assets/ and data/ beside it. Upload the contents, not the ZIP file. No deployment has been performed. A local web server can also serve the extracted folder. Compatible 1.49/pilot careers use the same save key; export a backup before changing a live installation.

EDITABLE SOURCES / SCREENSHOTS
The separate CLUBLINE-Surroundings-Sources-and-Review-1.50.0.zip is a development companion, not required for hosting. It preserves all accepted procedural scene studies, reusable street kits, vector layers, world specifications, actual browser screenshots, and build tools. Extract it over this release folder to restore those development files. Do not upload that companion as the game.
