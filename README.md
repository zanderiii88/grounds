# GROUNDS — Prototype 34.8

Upload the seven app files to the root of your GitHub repository, replacing the previous versions: `index.html`, `manifest.webmanifest`, `sw.js`, `version.json`, `icon-192.png`, `icon-512.png`, and `icon-maskable-512.png`. Keep the existing `assets/` folder. Its images are included for completeness and need not be uploaded again when already present.

## Event experience

- Before opening an event, Operations shows a short readiness summary: expected attendance, pitch condition, ticket price and serving stands.
- Beginning or simulating a match or other event opens a dedicated event view. The normal Career navigation is covered until the event report is acknowledged.
- The live view shows score (for matches), attendance, a progress clock, sales by item, missed orders, stock by stand and a timeline of occurrences.
- Matches pause at half time. You may restock 10 of a selected item per stand for its displayed cost, then resume or simulate the remainder. Away matches play through the same event view without home stock or gate income.
- The final report shows the match score or event result, attendance, gate and food income, stock spend, pitch change, and for each food and drink item the quantities bought, sold, left and missed. It includes a supporter survey for enjoyment of the game or event and for service and prices. Survey scores react to results, prices and missed sales; service feedback affects supporter or community mood.
- The report is saved on its calendar day. If the app closes while a live event or final report is open, continuing Career restores it. Earlier reports with missing item details identify them as unavailable.

The existing `grounds-career-v1` and `stadium-workshop-layered-v27` save keys are unchanged. The 34.6 startup fix and 34.7 Career management update remain included.
