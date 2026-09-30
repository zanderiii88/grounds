# Artwork and placement notes

Artwork edits used the built-in image-generation tool. Approved daytime city backgrounds are retained; the revised Aberdeen version replaces the repetitive tenement preview. Final production assets are in assets/sites as WebP files. Stadiums are drawn by scene.js from the modular stand model and composited into the menu images; they are not painted into the site backgrounds.

Evening edit brief for each city: change only the lighting to blue-hour evening; preserve the exact composition, dimensions, camera, buildings, streets and empty stadium plot. Add cool ambient light, warm window and existing street lighting, and harbour/river reflections where appropriate. Do not move or redesign geometry. Keep plots empty, with no people, vehicles or text.

Rural correction brief: preserve the approved woodland, low cottages, farm, straight railway, station and large empty carpark. Match plot and surrounding road directions to the stadium vectors [7.2,4.2] and [-7.35,4.2], keeping upright verticals and no perspective convergence. Keep the pitch centre fixed at [420,1156] in 830×1895 artwork, and keep the front apron clear of trees, fences, lamps or other obstructions. Rich detailed artwork remains; no people or vehicles.

Placement centres in 830×1895 artwork:
- Town Quarter: [430,1210]
- Riverside City: [425,1210]
- Beach Resort: [427,1250]
- Woodland Station: [420,1156]
- Granite Harbour: [430,1210]
- Sandstone Viaduct: [390,1150]
- Tyne Quarter: [415,1230]

All sites share the engine ground vectors. Image-generated geometry is visually checked against the maximum engine stadium; these backgrounds are artwork rather than a collision/navigation model.

## Release 1.22.0 check

All 28 startup composites were regenerated. Seven approved backgrounds and placement centres are unchanged. Maximum layouts use 14.79-unit triple-setback stands, 2.6-unit hospitality rear blocks and a .4-unit access allowance. The rectangular envelope extends from ground x=2.21 to69.79 and y=2.21 to57.79. Its projected width is about 894 pixels, exceeding the 830-pixel artwork. All sites need further maximum-footprint plot work; neither axes nor clearance are certified. Diagnostic yellow guides appear only in the separate review images.


## Release 1.23.0 city artwork

See CITY-MAP-NOTES.md. Six city day/night maps are integrated, using natural image proportions and shared stadium scale. This supersedes the former Granite Harbour artwork and its earlier placement audit. Five cities are added; other approved maps remain available.
