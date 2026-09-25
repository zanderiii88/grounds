# Fixed district registration

## Projection
Parallel dimetric geometry: screen ground axes have slopes +1/2 and -1/2; vertical edges remain vertical. The optional flatter camera compresses both artwork and ground geometry to slopes ±1/3. No perspective convergence or runtime road drawing.

All paintings use a nominal 1586×992 registration canvas; source artwork is scaled to it when drawn. Each district declares its image origin and pixels per world unit, used by the camera and inverse image-to-world transform. The world anchor remains (36,30); the pitch-side stand anchors are unchanged. The four larger settings use build bounds x=4..68 and y=-2..62. Woodland uses x=16..56 and y=10..50 (40×40). Props use 2×2 logical placement cells within that area, preserving edge access rows.

| Setting | Image origin | Ground half-tile pixels |
| --- | --- | --- |
| Terrace & Park | 810,492 | 9.2,4.6 |
| Modern Riverside | 810,492 | 9.2,4.6 |
| Nordic Town | 792,502 | 9.4,4.7 |
| European Seaside | 784,461 | 9,4.5 |
| Woodland Ground | 805,490 | 14.6,7.3 |

Different registrations account for each illustration's clear plaza. They do not change stadium world dimensions. Parking centres, pedestrian routes, hospitality frontage and water masks are authored per illustration and do not move with the stadium.

## Concept, production art, implementation
Concepts established the Nordic winter and Mediterranean seaside direction. They are not bundled as alternate assets. The production image edits removed their pitches and created night versions; Terrace and Riverside were repainted around the enlarged layout. The actual stadium, parking occupancy, people and event effects are rendered by tested code.

## Image workflow and prompt briefs
Produced with the built-in image-generation tool, using the approved concepts and earlier district paintings as references:
1. Nordic day: preserve the approved snowy town layout, replace only the pitch and goals with matching plaza paving.
2. Seaside day: preserve the approved Mediterranean layout, replace only the pitch and goals with matching plaza paving.
3. Nordic night: preserve day geometry; blue night ambient, warm windows and existing lamps; white fairy lights on existing evergreens.
4. Seaside night: preserve day geometry; warm cafés and promenade lights, dark teal sea and reflections.
5. Terrace day: use the enlarged Nordic layout as a geometry reference and the existing British district as an architecture reference; clear coach/car bays, no snow, a corner pub and park, empty central site.
6. Terrace night: preserve new day geometry; warm pub/windows and streetlamps, no seasonal lights.
7. Riverside day: preserve enlarged Terrace layout and parking; restore modern glass/cream buildings, public square, cafés and riverside promenade outside the site.
8. Riverside night: preserve day geometry; warm windows, lamps and river reflections.

In every prompt: fixed parallel projection, roads on the two ground axes, no vanishing points, no baked-in stadium or traffic. Small painted details should be refined through art updates rather than opaque runtime road patches.


## Woodland production pass — v27
Built-in image generation was used for both plates. The day plate used Terrace & Park only as a visual-style reference, with a new layout; the night plate edited the day lighting while preserving geometry. The original woodland images were 1586×992. Their actual clear area was inspected before assigning the smaller 40×40 build boundary. No image-generated numerical coordinates are assumed exact.

Day prompt: chunky bright block-art British woodland recreation ground, strict parallel 2:1 ground axes, empty central grass diamond with no pitch or stadium; narrow straight access road along upper-left, two small corrugated workshops at upper edge, playground upper-right, small striped car park, red/cream burger van and picnic tables lower-left, woodland around the perimeter. No perspective convergence, text, UI, or objects within the stadium clearing. The engine supplies pitch, stand geometry and traffic.

Night prompt: change lighting only on the same day image, preserving framing, road/parking geometry, tree, fence, workshop and play-park positions. Moonlit grass and deep teal woods, warm existing lamps, workshop windows and burger hatch. No new stadium, pitch, structures or roads.

Registered site corners in source-image pixels: top (805,198), right (1389,490), bottom (805,782), left (221,490). They sit conservatively inside the painted fence, leaving paths, trees, playground and parking outside the buildable area. Woodland roads are painted only; vehicle and pedestrian paths use image-to-world registration and the same transform as the stadium. No runtime roads are added.

Concept art: visual inspiration only. Production art: the two registered woodland backdrop plates. Implemented functionality: modular small stands, capacity, independent woodland/main design slots, placement limits, authored walking/driving paths, existing event system. Future career features are not implemented.


## Woodland access correction — v27.1
Day plate edited with the built-in image-generation tool. Prompt: fix only the lower-left car park access, add a short unobstructed asphalt driveway from the main road, remove blocking fence/hedge/tree within that corridor, dropped kerbs at the path crossing, and shorten bay dividers to preserve an internal driving aisle. Preserve the grass clearing, stadium site, surrounding buildings and projection.
Night plate edited from the corrected day plate. Prompt: lighting-only conversion with exact same framing, entrance, parking bays, fence and clearing; cool moonlit woods with warm existing lamps and windows. A first night edit with shifted geometry was rejected.
Both accepted source PNGs use the same framing and are drawn into the existing nominal registration. Six parked-car centres run from (149,552) to (326,641); main-road stop point added at route fraction 0.14. The driveway and aisle are painted production artwork, not runtime overlays. Cars do not dynamically enter or leave parking bays.

## Backwoods and Railway Works production plates — v30

Both settings were made with the built-in image generation tool, using Woodland Ground as a style and central registration reference. New daytime compositions and lighting-only night edits are stored as four PNGs in `assets/`. The intended nominal canvas is 1586×992; generated dimensions vary by one or two pixels and are scaled to nominal by the renderer. Their registration is origin (800,495), ground half-tile pixels (16.8,8.4), fixed 2:1 parallel projection. The small build bounds are x18..54, y12..48, a 36×36 site. The plate centre remains empty; pitch and stands are rendered at runtime.

Backwoods: dense woodland, weathered fence, workshop, rough three-bay car park and upper-left narrow road with an entrance. Railway Works: industrial warehouses, rail yard and four-bay parking area outside the lower-left corner. Both have image-space pedestrian/vehicle paths and event occupancy coordinates; no opaque road overlay is drawn. Night assets were edited for lighting while preserving layout. The venue boundaries are deliberately tight while the whole standard playing surface remains full-sized.
