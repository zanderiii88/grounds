# Clubline 1.18.0 — City locations and stadium detail

Upload the ZIP contents to your existing GitHub Pages repository, replacing the previous files. Keep index.html at the repository root. On your phone use Check for updates, then Load update if offered.

## Included
- Three new location choices: Granite Harbour (Aberdeen-inspired, revised mixed architecture), Sandstone Viaduct (Glasgow-inspired, straight railway) and Tyne Quarter (Newcastle-inspired).
- Dedicated evening artwork for the three new city locations, with lit windows and streets. The four earlier approved locations remain available.
- Seven fixed placements share one catalogue used by setup, game rendering and menu generation. Stadium movement and rotation remain locked; each site uses its measured pitch centre.
- Corrected Woodland Station plot artwork and a clear front apron.
- Fourteen prerendered day/evening menu scenes, each supplied in portrait and desktop framing. Portrait source is used for portrait mobile devices; landscape devices use the wider composition. Gentle 14-second pans and decoded-image crossfades. Labels change with the displayed scene.
- Stadium detail: individual seat backs, concourse railings, outer cladding ribs, entry canopies and roof bracing. The existing stand profiles, capacities, seat colours and design controls remain available.
- Starting XI has touchlines, halfway line, centre circle, penalty areas, six-yard boxes, penalty spots and corner arcs behind the player shirts. Low-contrast markings do not receive taps or drag events.
- Stadium gallery updated to use the current location catalogue.
- Existing youth, development, contracts, assistant delegation and match systems are retained.

## Validation
JavaScript syntax and module checks passed. Automated app checks cover all seven locations across twelve clubs, career setup, save reload, obsolete-site fallback, player ages, promotion persistence, a promoted player's simulated match and new-season rollover. Existing youth progression tests passed. All menu files and referenced backgrounds were checked, and maximum-size stadium placement renders were inspected.

Full browser and physical-phone layout testing could not be completed in this environment. Please check the portrait menu, location selection and Starting XI on your phone after updating.

Run the included progression tests with: node tests/development.mjs

## Later
More city-inspired maps (Manchester, Dublin, Cardiff, Birmingham and Liverpool), further stadium architecture polish and full training management. New locations will continue to be previewed before inclusion.
