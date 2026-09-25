# GROUNDS — Prototype 34.2

Extract this ZIP and replace the six app files in the root of your GitHub repository: `index.html`, `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`. Keep the existing district artwork PNGs. The large `START-HERE.html` is not needed.

## Changes

- New careers start with no future event offers displayed. Offers are revealed one at a time on later days, generally a few weeks before their event date. The daily briefing offers Approve, Decline or Decide later; a reminder appears when an unanswered event is close.
- A confirmed community event can trigger a competing Corporate showcase booking for the same date. Taking it cancels the community booking and lowers supporter and community favour; keeping the booking raises favour and declines the larger income.
- The Club tab shows Supporters, Community and Team mood ratings, plus the latest reason for a change. Match results shift team and supporter mood; decisions change local favour. Supporter mood has a modest effect on attendance and team mood a modest effect on match performance.
- The landscape layout and seven-day forecast from v34.1 are included.

Existing local save keys are unchanged: `grounds-career-v1` and `stadium-workshop-layered-v27`. Old career saves acquire default ratings. Unanswered far-future offers from an old save are hidden until their reveal day; approved bookings remain confirmed. The service worker cache is updated to refresh the installed app after Pages publishes this version.
