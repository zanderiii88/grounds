# City maps — 1.26.0

Six day/night city pairs retain their fixed pitch anchors and existing artwork. Native artwork coordinates use width 1200; the renderer projects into width 1100. The shared stadium scale is 1.2615 (previous 0.87 × the approved 1.45 enlargement), with east [7.2,4.2] and south [-7.35,4.2] multiplied by that scale. The stadium's modular ground dimensions and rotation are unchanged.

The background affine correction preserves verticals and aligns average ground slopes. Generated city roads and buildings can still deviate locally. The clear apron is engine-drawn paving on the exact stadium axes. Its bounds contain the maximum upgrade footprint and the existing registered empty plot. It covers the original painted plot boundaries. There is no visible grey perimeter or inner boxed polygon. Invisible maximum plot coordinates support fit validation only.

Conservative maximum bounds x=2.21..69.79 and y=2.21..57.79 include stand depth 14.79, rear hospitality depth 2.6 and access allowance 0.4. The invisible plot adds 2.5 ground units on every side. All six maximum layouts were visually reviewed with their artwork by day and night, in addition to mathematical containment checks. Pitch anchors stay fixed through upgrades.

Figure glyphs multiply by (site.scale*830/site.artWidth)/0.6137143383204945 to retain their previous size relative to stadium geometry. Seat positions, player routes and pedestrian paths use that same projection.

Designer framing includes surrounding city context while remaining responsive to larger layouts. Its camera and panel use aspect ratio 1.28. Match views retain close framing. Mobile title crops are clamped to the registered background's safe painted bounds; their largest grounds can crop at image edges. All startup imagery is browser-rendered from the actual engine.
