# Clubline 1.44.0 — Wide scenes & landscape framing

Complete release. Extract this ZIP and upload its contents to the existing GitHub Pages repository. Earlier ZIPs are not needed. Nothing has been deployed.

Eight wide settings now have day and night artwork: Granite Harbour, Dockside Quarter, Cottonmill Quarter, Dragonwater Quarter, Harpbridge Quarter, Foundry Quarter, Sandstone Viaduct and Tyne Quarter. These replace the narrow city artwork. Existing careers keep their location IDs; the two new settings are selectable for new careers.

The landscape career camera fits the complete stadium in both width and height. Rotating preserves the mounted stadium and animation state, and portrait returns to a fuller city view with the stadium lower down. Camera positioning stays within the painted background where the screen aspect permits it. The designer also uses stadium-relative framing rather than a fixed minimum zoom. Start-screen images have been regenerated for all eight day/night scenes, with the stadium fully framed in portrait and on the right in landscape. Missing prerenders still fall back to the engine.

Map placement uses the calibrated engine axes and keeps buildings upright. Small painted-edge angle differences accepted during the previews remain; the artwork is not mathematically exact. The clear plots have been checked with the maximum stand layout. People remain proportional to the stadium; no whole-plot carpet overlay is added.

An accidental start-screen reference in the live minute updater was removed, fixing a possible match-update error. Existing training, contracts, recruitment, scouting, audio preferences, backups and other features remain included.

Validation: eight location choices; full stadium bounds at 390×844, 844×390 and 915×412; rotation preserves the stadium element; maximum stand geometry; live minutes/goals/pauses/substitutions and reports; training/backups; offline core asset inventory and regenerated title images. Physical Android rotation still needs user testing.
