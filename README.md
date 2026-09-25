# GROUNDS — Prototype 34.3

Extract this ZIP and upload the **seven app files** to the root of your GitHub repository, replacing the old versions: `index.html`, `manifest.webmanifest`, `sw.js`, `version.json`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`. Keep the existing district artwork PNGs at the root. The oversized `START-HERE.html` is not needed.

## What changed

- Career placement now uses the full ground view. Instructions, directional controls, Rotate, Pan/Move, zoom, Fit, Reset, Confirm and a way back to the main menu float over the scene. Drag to move the ground; tap Pan to drag the view instead. Confirm locks the Career location permanently.
- In short landscape Career views, the full-width top club bar is replaced by small corner actions. Calendar and Grounds have more vertical space.
- The start menu has a small Check for updates button. It checks `version.json` from the network, asks the service worker to check for an update, and offers Reload to update when a newer published version is available. It reports an offline check failure without changing your save.

Career and Sandbox keep their existing local save keys, `grounds-career-v1` and `stadium-workshop-layered-v27`. `version.json` must be uploaded with the other app files and updated on future releases. GitHub Pages may take a few minutes to publish. Reload after that if your installed app still shows an older screen.
