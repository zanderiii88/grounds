CLUBLINE 99 — FULL RELEASE 1.53.0 / FIRST DAYS & MATCH PLANNING

Based on the verified full release 1.52.1. Nothing deployed.

IMPLEMENTED
Club selection removes Ground Character and shows the three highest-rated players with name, primary position and overall rating. Club renaming and sorting by displayed names remain.

A chairperson's welcome appears when starting a new career. Six recommendations link to the squad list, starting XI, finances, contracts, pre-season calendar and expectations. Links save a Viewed marker, not a task-completion claim. The welcome remains available from Home and can be dismissed with Later or Head to the stadium. Existing careers can open it from Home without a forced popup. Pre-season friendly invitations also appear alongside the calendar.

Contracts & renewals shows current weekly payroll, a weekly planning allowance, headroom/overspend and the projected remaining-season wage cost. The advisory allowance is 10% above opening payroll, rounded up to £100 per week, and stays fixed for the season. It resets at the start of the next season. For older careers it is first established from the current payroll when loaded in this version; the UI discloses that date. It is not extra cash and does not impose a new hard spending cap. Forecasts count future Monday payments, excluding today, through 30 June, assuming unchanged registered squad/wages; payroll continues in the off-season. Renewal previews show the offered payroll, headroom and remaining-season cost before agreeing. Existing renewal rules and Monday wage processing remain.

Pre-match briefing has a marked full pitch with your selected eleven facing a projected opposing eleven. Shirt numbers and tactical roles identify positions; both elevens can be opened as name/role/ability lists. Opponent ability remains the existing deterministic scout estimate, labelled estimated; their projected lineup is not a confirmed team sheet. Portrait and landscape layouts are responsive. This update changes the pre-match comparison, not the live simulation or the interactive lineup editor.

PRESERVED
The approved full-height start artwork, menu, audio under Options, all 20 fixed neighbourhood worlds and period kits, modular stadium/construction system, league data, saved-career key, and portable backup format. All assets and league data match the verified 1.52.1 ZIP byte-for-byte. Existing save data remains compatible.

VERIFICATION
Browser checks at 390×844, 844×390 and 320×568; screenshots in the companion review gallery are actual captures of the implemented game, not mockups. All 20 top-three lists checked against the actual source. All six welcome destinations, persistent Viewed markers and older-save behaviour passed. Renewal preview, agreement, wage persistence, fixed allowance and next-season reset passed. Nine formations render 11 players per side inside the pitch with two keepers and opposing orientation. Scouting ranges verified at all four funding levels. Offline loading of the updated app and its new modules passed. No script errors or missing assets. Payroll Monday/date arithmetic checked against independent day-by-day counting including a leap-year boundary. Root JavaScript syntax passed. See review/first-days-browser-checks.json and first-days-source-checks.json. Other review files are inherited evidence from prior releases, not newly rerun tests. A complete season and physical-phone testing were not performed for this release.

STILL PLANNED
Occasional club stories, stadium events/gigs and their day-of-event animations are not implemented in 1.53.0.

MANUAL UPLOAD
This is a complete standalone release. Extract Clubline-Release-1.53.0-First-Days.zip and upload its CONTENTS yourself, with index.html at the root alongside assets/ and data/. No earlier release upload is required. Nothing deployed.
