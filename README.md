# Clubline 1.35.0 — Season expectations and club confidence

Upload the ZIP contents to your GitHub Pages repository. Nothing has been deployed.

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
- Starting XI labels separate positional suitability from physical Condition. Suitability labels use green (90%+), amber (75–89%) and red (below 75%, 60% of overall effectiveness). Club shirt colours are retained. Organiser → Options includes a short League Rules section.

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
