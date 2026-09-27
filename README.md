# GROUNDS v35.0 — Five grid locations

Upload the ZIP contents to the root of `zanderiii88/grounds`, retaining the `assets/career-sites/` paths. The `archive/` folder is a local copy of v34.9's old site and movement source and is not needed by the running page.

## Sites

- Low tier: Rural Village, 1970s Town, Railway Works
- Mid tier: British City
- Top tier: Modern Harbour

All five appear in Sandbox. Division 3 starts at a low site; Divisions 2 and 1 use British City; the top divisions use Modern Harbour. Each has a day image and a darker night variant.

Traffic and pavement walkers now use one explicit isometric road graph per tier. Actors traverse connected edges and choose the next edge at a junction. They no longer use the old independent straight-line waypoint lists. Movement is limited to the site access roads beside the stadium in this release; outlying decorative streets have no moving actors yet. The harbour's water is never included in the route graph.

This is a fresh start using `grounds-career-v2` and `stadium-workshop-layered-v35`. The earlier `grounds-career-v1` and `stadium-workshop-layered-v27` browser data is left untouched and is not read by this build. Installing the build does not delete it.

The detailed site illustrations were generated from the approved concepts. Their road edges should be reviewed on a phone against the mathematically defined movement graph; small visual offsets in the painted art may remain. The archived v34.9 ZIP is included for rollback.
