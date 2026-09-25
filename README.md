# GROUNDS — Prototype 33: Mobile career calendar

For the current GitHub Pages repository, replace the root `index.html` with the one in `GROUNDS-v33-GitHub-Update.zip`. The existing PNGs can remain beside it. The game also supports an `assets/` folder. Career and Sandbox save keys remain `grounds-career-v1` and `stadium-workshop-layered-v27`.

## Mobile changes

- Career Mode is first on the start menu. Selecting it shows Continue (when a save exists), New Game and Back. New Game asks before replacing a career save.
- The stadium remains full screen behind career sections. Calendar uses a translucent month grid with home/away markers and event diamonds. Select a date to inspect a fixture or event, including approval actions. Month arrows browse the schedule. Play next round stays available below the selected date.
- A slim bottom banner switches Calendar, Stadium, Grounds, Operations and Club. An eye button hides or restores that banner. X at top right closes the section and leaves the banner over the ground; selecting a tab reopens a section. The home button returns to the start menu.
- Portrait framing zooms into the ground rather than leaving a large blank area. Landscape uses the same full-screen scene, with the calendar grid over it. Non-calendar sections appear in a smaller overlay.

Desktop retains the v32 side panel. Stadium designer and the season model are unchanged. The v32 image fallback handles the earlier flat PNG upload.

## Verification

JavaScript parsing and focused calendar, menu-order, artwork and save-key checks passed. Direct visual and touch testing on a phone remains open; adjust grid density and contrast based on the next screenshots.
