# Clubline 1.37.0 — Compact phone layouts

Upload the ZIP contents to your GitHub Pages repository. Nothing has been deployed.

## New in 1.37

- Club selection uses a table with sticky headings. Attack, defence, capacity, facilities and youth fit together on a phone; style and starting funds appear under the club name. Wider screens show dedicated style/funds columns. Selected-club details and stadium preview are retained. Location buttons show names without the repeated 75k limit.
- Starting XI has Shirts / Table controls, covering the XI, substitutes and reserves. The same saved view appears during lineup confirmation and live touchline decisions. Select a row/shirt then a destination to swap; tap the abbreviated name for full information. Drag the small shirts to swap. Injury and suspension markers remain visible. Actual slot suitability determines the position colour; condition and performance form are separate.
- Compact Player / POS / OVR / CND / FORM tables fit phone widths down to 320px in automated checks. Names use first initial and surname, with full names in details and accessibility labels. Age and extra season statistics are expandable in Squad list. XI/bench order remains the actual selection order, rather than sorting formation slots.
- Standings have narrower numeric columns, smaller type, shorter rows and sticky headings. P/W/D/L/GF/GA/Pts and club names fit together at the tested phone widths, including post-match standings. Season player statistics default to Player / Apps / G / A / AVG; full starts/minutes/goalkeeper records remain expandable and sortable. AVG is match performance, never base ability.
- Formation/style/orders and auto-pick controls are in an expandable Tactics section. Its open state survives squad selection updates. Scouting leads with assessment, recommended plan, threats and absences; extra tactical analysis and expected/full rosters expand on demand. Player cards show condition/form near the top and expand attributes/positions.
- Phone panels, headings, welcome information, tabs and notifications use less space. Review/Dismiss and reminder opt-out controls remain available; selection targets and main navigation are retained.
- Icon investigation found stale v1.33.0 URLs in the manifest. It now references the revised continuous-arrow icons with fresh filenames and v1.37.0 URLs. Both PNG icons and SVG are included in the offline cache. Android controls when an already-installed launcher/splash icon refreshes; this cannot be verified by desktop Chromium.
- Existing finance scale, league rules, stadium geometry/artwork, crowd behaviour and audio are retained. No deployment performed.

### 1.37 verification

Browser checks passed for sticky club headings, selected club, shorter location labels, core table widths at 320/360/390px and landscape, XI/bench swaps, player details, disclosures and saved view, pre-match/live tables, substitutions and retained stadium SVG, compact statistics and sorting, updated icon files/references. Existing match checks passed for events, pause/resume, tactics, substitutions, reports, anchored bars and screen fit. Scouting and notification/Android Back regression checks passed. Physical-phone scrolling, dragging and Android icon refresh remain to be tested.

## New in 1.36

- Starting XI shirts show surname (overall), coloured position and CND percentage. Information is top left and mood top right. The same summaries appear in match selection and touchline substitutions. Green ≥90%, yellow 80–89%, orange 75–79%, red <75%; effectiveness calculations are unchanged.
- Squad → Squad list is a sortable table with All/XI/Bench/Reserves filters, condition, last-five performance form, age, appearances, goals and assists. Names remain visible while scrolling horizontally. Tap a name for the full card.
- Drag from the shirt to move vertically and scroll near the panel edges. Dragging from the surrounding text still permits normal vertical scrolling. Gesture cancellation, leaving the app and rendering clear drag ghosts. Native mouse drag and tap swaps remain available; live dragging enforces the three-substitution limit and cannot replace a dismissed player.
- Transfer proposals have full-width information followed by Accept / Review / Reject. Review shows value, role, wage, contract, form and own-squad positional cover. Counter-offers are entered inside Review. New bids and incoming acceptances show cash, payroll and a four-payroll illustration before confirmation. New bids can still be accepted or countered by the selling club.
- Weekly wages increased eightfold, to £2,080–£9,120 for the initial senior squads. Opening reserves increased 2.5-fold, to £1.625m–£5.75m. Existing transfer valuations, match income, construction and investment costs are retained. This makes payroll meaningful against home-match income rather than merely increasing every price. Wages are processed on Mondays for registered players currently at the club; current loan handling is retained.
- Existing careers are migrated once: positive cash ×2.5, saved generated-player/prospect wages ×8. Negative balances, agreed transfer offers and historical reports retain their amounts. A finance-rebalance news note explains the adjustment. Audio and notification preferences keep their stable keys. Contract negotiation remains a future pass.
- Scouting has a distinct recommended formation, team style/order and individual-order suggestions with reasons and suitability reminders. Suggestions use available game settings and do not apply automatically.
- Location labels: Granite Harbour, Dockside Quarter, Cottonmill Quarter, Dragonwater Quarter, Harpbridge Quarter and Foundry Quarter. Internal map identifiers and approved day/night artwork are retained.
- The red trend arrow is now one continuous bevelled ribbon in the logo and C icon. Approved chrome lettering is retained; app icons regenerated.

### Verification

Browser checks passed for squad labels/table/filter/player details, stacked proposal controls, counter-offers, signing confirmation, vertical touch drag/edge scrolling/cancellation, scouting advice, once-only economy migration and live player details/substitution. Existing checks passed for mounted match SVG/background through events and controls, match statistics/reports, phone/landscape fit, career panel continuity, anchored bars, notifications and Android Back. Logic checks passed for scouting, disciplinary rules, youth/development, season objectives and transfer search. Physical-phone dragging, scrolling and frame rate still need testing. No deployment performed.

## Club browsing and scouting

- Organiser → Clubs lists all twelve clubs. League table club names and fixture previews also open the club browser. View expected formation, XI, full squad, injuries, suspensions, recent news/results and individual scout profiles.
- A report announcement appears three days before a fixture (or immediately if a new/continued career is already within that window). Review opens the club scout report. Reports and expected lineups reflect current availability, with assessments clearly marked as estimates and lineup changes possible.
- Finances → Opponent scouting has four funding levels: Basic, Local network, Dedicated scouts and Division specialists. Upgrades cost £75,000, £150,000 and £225,000 respectively and last until the end of the season. Higher levels narrow ability ranges and reveal more traits/playable positions. Existing careers default to Basic; funding persists through reloads and resets at the new season.
- Assessments use repeatable estimates, so opening/reloading a report cannot reroll ratings. Reports highlight likely threats and stronger/weaker estimated units, with suggested approaches based on the opponent's style and formation. Advice is not a guaranteed advantage or automatic tactical change.
- Match lineup confirmation includes a collapsed Opponent scouting panel. Expand it to compare their expected formation/players, review absences/news and inspect players while choosing your own XI.
- Opponent injuries now persist after watched and simulated matches, can occur in training, heal daily and exclude players from selection. Your medical investment affects your own players only.
- Club/player browsing uses Back to close the player first and then the club. Browsing and live injury events retain the mounted stadium scene.

## League rules and squad status

- Three substitutions per team per match, with seven bench places. Manual and assistant controls both enforce the limit. Sending-offs cannot be replaced.
- Straight reds and second-yellow dismissals suspend the player for their next league fixture. Every five seasonal cautions also gives a one-match ban. The second caution counts; overlapping card penalties in one match give one fixture missed.
- Bans apply across all twelve clubs, including simulated fixtures. Suspensions are served by fixtures, including while injured, and persist through saves. Unserved bans carry into the next season; seasonal yellow totals reset. Existing saves start disciplinary counters when upgraded; old match reports are not retrospectively punished.
- Auto pick, bench selection, manual swaps and kickoff validation exclude injured or suspended players. Badges and notifications show suspensions; profiles show seasonal cautions.
- Starting XI labels separate positional suitability from physical Condition. Suitability labels use green (90%+), yellow (80–89%), orange (75–79%) and red (below 75%, 60% of overall effectiveness). Club shirt colours are retained. Organiser → Options includes a short League Rules section.

## Landscape

The career stadium expands across the width in landscape and stays centred in the available space between compact bars. This may crop parts of large grounds vertically on short screens. During matches the stadium uses the large left column, with score, controls, possession and commentary on the right. Rotation retains the existing scene and animation rather than recreating it. Portrait framing is retained.

## New in 1.35

- Home has a compact expandable Season expectations card, with two fixed objectives: a club-strength-based league finish and a positive closing balance. Targets stay fixed throughout each season. The first three matches have a league-position grace period.
- Board confidence and supporter mood have colour-plus-text indicators with expandable reasons. Board assessment reflects results against starting expectations, league position once established and cash/payroll risk. Supporters react to recent points and goal difference. Scores are advisory; no manager dismissal, forced spending or financial penalties are added.
- Confidence/news checks are deterministic. Routine changes stay in Home news; meaningful concerns and financial-risk episodes use Review/Dismiss notices above the ticker. Confidence announcements are limited to avoid spam, and financial warnings repeat only after the earlier risk has cleared. Important notices take priority over routine reminders.
- End-of-season review saves final position, points, cash, objective results and confidence. Reviews remain available in Home after starting the next season. New targets appear on Home following rollover.
- Home separates club news from other league news. Organiser's news section is labelled News archive. Board/season review news links open Home expectations; payroll-risk notices link to Finances. Navigation preserves the mounted stadium and uses existing Back behaviour.
- Existing saves acquire objectives from their club strength without replaying historical notifications. Existing completed seasons gain an accessible review. New career saves and later seasons preserve review history.
- Contracts and wage negotiation remain a later pass: primarily off-season, with optional in-season changes, under Finances.

## Retained from 1.34

- Smaller start menu: Music, FX and Options share a compact row. Track controls move into Options, available before starting a career and in Organiser. Android Back closes the start Options screen.
- Seven original tracks, approximately 2:51–3:03: Touchline, Floodlights, Away End, Kickoff 90, Turnstile Funk, Saturday Radio and Last Minute Winner. Floodlights is the first-use default; previous saved choices take precedence. Repeat selected track is the default mode; ordered and shuffled playlists are optional. Individual checkboxes select tracks; Music off clears all selections, and selecting a track enables music.
- Weekly wages and opponent scouting reminders have independent persistent notification settings. A “Don’t notify me again” checkbox suppresses these routine notices, without deleting the underlying news. Reenable under Options. Important notifications retain Review and Dismiss.
- Monday payroll announcements show amount, date and resulting balance. Finances shows the next Monday payroll, gross home revenue, operating costs, wage history and a four-week wage-only forecast. Investments remain one-off deductions when confirmed: youth/medical levels carry forward; scouting resets each season. Player details label wages per week.
- Optional Getting started guide in Options, also opened from Home. Includes squad suitability/condition, discipline, payroll, funding, construction and scouting.
- Goal reactions animate about one fifth of the seated crowd, staggered individually; other supporters remain visible. Attendance is set before kickoff and reused in the report. Lower tiers fill first; higher tiers become occupied as attendance rises. Construction closures remain empty. No crowd reseeding on events.
- Pitch animation updates at up to 30 fps, stops positional updates while paused, and suspends when the tab is hidden or reduced motion is selected. Fast simulations suppress rapid overlapping goal effects. Watched goals retain host-supporter cheer/boo reactions. No new crowd ambience.

## Audio

Audio starts after a user gesture. Music continues during matches. Track/playlist/mode and separate music/FX mute settings use a stable device-local key across updates and new careers, provided site data is retained. Existing saved track indexes retain their corresponding musical style. Interface notification preferences have their own stable key. No per-render audio objects.


## Assets and verification

Seven original synthesized instrumental arrangements and the previously approved synthetic cheer/boo/tick are included as compact MP3 assets. They are bundled into the offline cache. No sampled commercial music or third-party recordings were used.

Chromium checks cover actual MP3 decoding/playback, first-interaction gating, initial mute, reload/new-career preference persistence, selection and actual same-track looping, Organiser options, music continuing through navigation and paused live matches, all four home/away goal mappings, effect suppression and persistent stadium SVG identity. Discipline checks cover live and simulated league fixtures, fifth/tenth yellows, red/second-yellow cards, ban serving, overlapping penalties, carryover, save persistence, selection exclusions and three-sub enforcement. Existing match, notification/Back and career-panel checks pass. Start/options and squad screens were reviewed at phone size, and career/match views in landscape. Imports, version references, sound asset decoding, offline-cache entries and ZIP integrity were checked.

Physical-phone volume balance, audio restrictions and background/resume behaviour still need your test. Music repeats the selected track; it does not stop at kickoff. Existing gameplay, stadium geometry, maps and celebrations are retained.

Scouting tests cover all twelve clubs, stable estimates, funding cost/reload, report timing/notification review, player Back hierarchy, opponent lineup exclusions and persistent injuries/daily recovery. Phone-size profiles and opponent panels were visually reviewed. Physical-phone interaction testing remains outstanding.

### 1.34 verification

Automated browser checks cover compact menu size, seven tracks/default and persisted options, playlist clearing, Back, payroll debit/review/suppression, guide access, stopped/resumed pitch updates, and bounded supporter reactions. Existing match, audio, scouting, navigation, away-ground and roof-occlusion checks were run where affected. Geometry and tier occupancy checks pass. Actual physical-phone frame rate, scrolling and listening remain unverified. No deployment performed.

### 1.35 verification

Season logic tests cover fixed targets, early-match grace, deterministic confidence/form, limited notifications, financial-risk episodes, save/reload review idempotence and fresh-season targets. Browser checks cover Home cards, reasons, financial review links, significant notice dismissal, mounted stadium identity, review persistence and the real next-season flow. Existing match and notification/Back checks pass. Physical-phone review remains outstanding; nothing deployed.
