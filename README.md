# GROUNDS v35.1 — Map and route correction

Upload the ZIP contents to the root of `zanderiii88/grounds`, retaining the `assets/career-sites/` paths. Replace existing files with matching names. The old files left on GitHub are not referenced by this build; you do not need to delete them.

The five active sites are Rural Village, 1970s Town, Railway Works, British City and Modern Harbour. Their day and night artwork has an empty central placement plot, with no baked-in pitch, fixed stands or fence.

Ambient cars now use a short route explicitly checked on each site's painted asphalt. Pedestrians use the adjacent pavement. Routes no longer inherit a tier-wide ring that could cross removed roads, plots or harbour areas. Movement is intentionally limited to these verified streets until a fuller map-by-map network is authored.

This update keeps the v35 browser save keys `grounds-career-v2` and `stadium-workshop-layered-v35`, so a save started in v35 remains available. The earlier `grounds-career-v1` and `stadium-workshop-layered-v27` data is untouched. The `archive/` folder contains the older site source for reference and is not loaded by the game.
