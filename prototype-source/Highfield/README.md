# CLUBLINE 99 — Highfield, revised study

More varied terrace heights, mature garden trees and a taller existing commercial end building. The accepted streets, shopping centre, school and unequal park spaces remain.

Final counts: 1,372 assets; 16 connected street segments; 397 trees. Counts include props and sheds, not just buildings.


## Source and scope

This is an isolated revision of the accepted study, not a release integration. Original accepted files are retained separately. The five modular stadium modules and league.json match their accepted source byte for byte. Projection is east [10.8,6.3], south [-11.025,6.3], upright verticals. The current complete stand roof/rear envelope plus 1.0 growth and 0.8 clearance defines the reduced reserve. Future upgrades must fit the fixed site; the career restriction is still a note, not implemented. No location selector is being added to the game.

The three neighbourhood revisions check inverse-projected full tree canopy extents against buildings, roads, pavements, paths, driveways and the reserve. Tree foliage may overlap other foliage in planted groves. Existing street layouts and landmarks are retained. These original approximate game settings use the previous reference interpretation; no new historic map survey or exact reconstruction was made. The two seat-only corrections preserve all prior geometry.

## Verification

Independent geometry checks and HTML control script harness pass. Vale additionally checks every interior mews path has a connected public pavement route and middle-row doorstep routes clear other fixed assets. Riverpool verifies all mixed residential frontages and rear lanes. Static landscape/portrait phone renders are visually reviewed. Real-browser, physical-device, full-game HUD and runtime performance testing remain outstanding.

Run `node scene-study.mjs`, `node verify-scene.mjs`, `node render-phone.mjs` from this directory with Node and sharp available. Generate one scene at a time to limit memory use.

Release 1.49 is unchanged. Nothing deployed.
