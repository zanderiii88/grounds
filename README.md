# GROUNDS — Prototype 32: Career view and mobile layout

For an existing GitHub Pages repository running v31, replace its root `index.html` with the one in `GROUNDS-v32-GitHub-Update.zip`. Keep the fourteen PNGs already uploaded. This version finds them either in `assets/` or beside `index.html`, so the current flat upload works. Career saves continue under `grounds-career-v1`; the Sandbox key remains `stadium-workshop-layered-v27`.

Career now has a **View ground** action in the top bar. The ground view shows a **Career** button to return to the same management tab. The Stadium tab also offers View ground alongside Open designer. Calendar, Club and the other tabs sit in a compact translucent panel over the live scene: a bottom sheet on portrait phones and a side panel in landscape. The menu, cards, action buttons and tables use tighter spacing.

The rest of the v31 season model is unchanged. Existing career progress should resume without reset. Artwork is visible on a fresh career even if Sandbox had hidden the environment.

## Verification

The source JavaScript parses, all fourteen art paths have matching files, and the standalone regenerates with embedded images. Navigation, save-key and responsive-layout checks are in `TEST-RESULTS-v32.json`. Visual phone testing is still needed after the GitHub update, particularly landscape on the user's device.
