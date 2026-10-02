# City maps — 1.33.0

Six day/evening pairs retain their fixed pitch anchors. Artwork coordinates use width 1200; the renderer projects into width 1100. Shared stadium scale remains 1.2615 (0.87 × 1.45), with east [7.2,4.2] and south [-7.35,4.2] multiplied by that scale. Modular dimensions and rotation are unchanged.

Background affine correction preserves verticals and aligns average ground slopes. Generated city roads/buildings can still deviate locally. Maximum plot/apron coordinates remain invisible validation bounds and no longer create a filled overlay. The surface beneath the current layout is made from a narrow pitch surround and each actual module's footprint, including its rear-building depth. Corners use that module's curved footprint, independently of adjacent tiers. Active works allow the current/proposed affected footprint.

Conservative maximum bounds x=2.21..69.79 and y=2.21..57.79 include stand depth 14.79, rear hospitality depth 2.6 and access allowance 0.4. Maximum layouts were reviewed against all six settings by day/evening alongside mathematical containment checks. This does not guarantee every raster building/road is perfectly aligned or that all future custom layouts are visually ideal.

Figure glyphs multiply by (site.scale*830/site.artWidth)/0.6137143383204945 to preserve their proportions relative to stadium geometry. Seat positions, player routes and pedestrian paths use that projection.

The designer includes city context using camera/panel aspect ratio 1.28. The career view frames its actual stadium within the space between fixed bars. Match views remain close. Mobile title crops stay within registered painted bounds; the largest grounds can crop at image edges. Startup images are rendered from the real engine.

Exterior movement uses conservative rectangular circulation bounds beyond the deepest current/planned stand and rear on each side. Walkers follow different local quadratic curves within those clear bands, with entrance approaches on matchdays. Stalls sit further back than the primary walking lane. This does not create a city-wide pedestrian navigation mesh or resolve every raster-art angle irregularity. Away venues use a stable club-to-location assignment from the six approved settings.

The stand structure is rendered from the same geometry into transparent cached surfaces in career/match views. Dynamic supporters and football remain overlays; the designer remains editable SVG. No map or branding artwork is replaced.
