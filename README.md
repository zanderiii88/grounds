# Clubline 1.17.0 — Youth and player development

Upload the ZIP contents to your existing GitHub Pages repository, replacing the previous files. Keep index.html at the repository root. Use Check for updates on your phone, then Load update if offered.

## Included
- Squad → Youth: five leading prospects, generated names, personalities and traits, estimated current ability and potential stars. Exact overall is revealed when promoted.
- Facilities-influenced annual youth intake. Retained unpromoted prospects compete with the next intake for five featured places. Five-star potential is rare.
- Standout youth news every three weeks when performances merit attention; news links open the Youth screen.
- 24 senior squad places plus five additional under-20 development places. Promoted players can play first-team games. Turning-20 warnings and registration checks handle aging out and returning loans.
- Finances → Youth funding: lasting investment improves academy coaching and future intake quality. Fully developed systems cannot accept unnecessary extra funding.
- Squad → Development: reports three days before fixtures, grouped by position, with overall and positional changes. Development considers age, potential, facilities, match form and experience; no instant attribute penalty for one poor game.
- Squad → Conversations: retirement plans and gradual positional trials. Trials require minutes in the chosen position. Existing playing-time, loan and transfer requests remain available.
- New-season rollover from the Home hub after all fixtures are completed. Includes birthdays, retirement, loan returns and fresh prospects. Past match reports remain accessible in the calendar.
- Existing careers receive the new systems automatically.

## Validation
JavaScript syntax checks passed. Automated checks cover youth generation, promotion limits, persistence, report cadence, conversations, retirement, annual intake, facilities influence, returning loans, age-out registration and gradual position trials. 1,500 generated featured prospects produced 21 five-star potentials in the deterministic test sample. App-level checks cover all club/map renders, saved-game migration, promotion and reload, a promoted player's simulated match, and new-season rollover.

Run the included progression tests with: node tests/development.mjs

Browser and physical-phone layout testing could not be completed in this environment. Please verify the new Squad tabs and funding controls on your device.

## Still queued
Rural plot-angle correction, more locations only on request, further stadium detail, and full training management. Only the four previously approved maps are included.
