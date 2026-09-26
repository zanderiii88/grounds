# GROUNDS — Prototype 34.7

Upload the seven app files to the root of your GitHub repository, replacing the previous versions: `index.html`, `manifest.webmanifest`, `sw.js`, `version.json`, `icon-192.png`, `icon-512.png`, and `icon-maskable-512.png`. Keep the existing `assets/` folder. The included artwork is unchanged and need not be uploaded again if it is already in place. Keep the `assets/career-sites/` paths if uploading the images.

## Career management update

- Stand previews show the construction bill, seats and standing spaces gained or lost, and the remaining club balance. The cost is deducted on confirmation. Division 3 allows up to the second small seated stand; larger stands unlock in higher divisions. Career undo and redo are disabled so confirmed spending cannot be reversed without accounting for it.
- Operations sets a home ticket price; price changes influence estimated demand and match gate receipts. A live match uses the price set before it opens.
- The weather display includes pitch condition. Grounds offers one pitch care action per day: mowing, repairs, drainage upgrades, or extra groundskeeper cover during severe weather. Drainage and cover reduce pitch wear. Unprotected heavy rain or snow can worsen the pitch overnight.
- An unfit home pitch can request a league postponement. Severe weather and low condition lead to an approved two-day delay. An unjustified request is refused and fined once.
- Daily briefings link directly to Grounds and Operations. Match preparation highlights relevant navigation icons. Club Outlook shows live funds, likely crowd, pitch risk, ticket effects and mood.
- A local business may offer an advertising investment if funds become tight after the season begins. The offer appears as a green amount and can be accepted or declined under Club.

The existing `grounds-career-v1` and `stadium-workshop-layered-v27` save keys remain unchanged. Career saves gain new fields on load. The 34.6 startup fix remains included.
