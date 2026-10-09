# CLUBLINE 99 — Middleborough FC / Riverbank Stadium, study 1

Isolated prototype using supplied C13 stadium (35,049 base capacity).

## Implemented

Large marked matchday car parks contrast with warehouse compounds, varied roof heights, trucks, coloured containers, reusable dock cranes and storage tanks. A broad river and bridge approaches separate further works; housing occupies the southern and western neighbourhoods. Supplied red seating is retained.

Final scene counts: 1,665 placed assets; 100 connected street segments; 248 trees. Asset counts include sheds and individual props, not just homes.

## Shared neighbourhood refinements

Residential plots vary in width and depth. Opposite rows face their respective streets; some short end rows face the crossing street. Larger semi-detached pairs and detached houses interrupt selected runs. Short runs change facade theme and eaves height. Rear courts now favour grass and garden trees, mixed with paving, sheds and gravel. Each scene includes one taller apartment court paired with a lower block. Short-street splits require enough depth for both residential rows, their eaves and rear alleys. Larger car parks include internal marked parking bays. Original dock cranes and storage tanks are reusable assets in the shared sprite kit. These are original approximate game layouts, retaining an orthogonal ground basis; regular terrace rows remain intentional in some streets.

## Geometry and source

The five supplied modular stadium modules and complete league data are unchanged. Projection east [10.8, 6.3], south [-11.025, 6.3] retains the original basis at 1.5×; verticals remain upright. The reduced reserve contains current full stand roof/rear extents plus 1.0 growth and 0.8 clearance per side. It does not guarantee every future upgrade fits.

Full road/pavement, building/eave and tree canopy extents are checked. Tree canopy bounds now inverse-project the complete visible foliage ellipse at canopy height; candidate placement uses a conservative enclosing bound. Rail and river corridors are checked against full road/pavement extents; designated road bridges use breaks in the corridor bounds. Frontage access, rear alleys, cars, driveway connections and named public path networks are checked. Fitted paved/asphalt courts surround the stadium without a slab under the pitch.

## Rebuild and review

Open the self-contained HTML in review/. Run `node scene-study.mjs`, `node verify-scene.mjs`, then `node render-phone.mjs` from this directory with Node and sharp available. Generate one scene at a time: the detailed SVG preview is memory intensive.

Portrait, landscape, wider town and detail frames show the same world. HTML controls are verified with a script harness. Static phone renders are visual checks without the full game HUD, not real browser screenshots or a physical-device test. The SVG previews remain study outputs; runtime performance and integration have not been validated.

## Future work — notes only

Career stadium upgrades should check the complete stand/roof/rear geometry against each club’s fixed buildable site. This is not implemented. Previously noted Dene red-seat and Hillside blue-seat corrections are not included in this new batch; those earlier studies remain unchanged. No full-release integration or deployment.
