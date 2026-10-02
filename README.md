# Clubline 1.33.0 — Opposition scouting and match preparation

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

## Audio

- The start page has separate Music and Effects on/off buttons, Play music and Change track. Browsers require a user interaction before audio begins; a first tap on Music can mute it before it starts.
- Organiser → Options has Mute music and Mute effects checkboxes, a track selector, Play music and Change track. Choose Hip-hop, French electro or Fuzzy rock. Your selected track repeats continuously, including during watched matches and pauses, until you change it.
- Audio settings use a stable device-local storage key independent of careers and version numbers. Updates and new careers retain mute choices and the current track, provided browser site data is retained.
- Home-side goals trigger the approved cheer; away-side goals trigger the approved boo. Thus the player's own goal cheers at home and boos away; conceding does the opposite. Goal effects play when new goal events are generated, not when an existing report or saved match is reopened.
- The approved light Advance tick is included. Effects mute stops the current effect and suppresses later effects. Music mute stops music immediately; changing track while muted changes the selected track without unmuting it.
- Music is quieter than reactions. Hidden tabs pause audio; returning resumes the music if enabled. One persistent music player and one effects player sit outside screen rendering, so navigation and live UI updates do not recreate them.
- Rejected ambient crowd, upset groan and chant are excluded. Payroll explanations and the beginner guide remain future work.

## Assets and verification

Three original synthesized instrumental sketches and the previously approved synthetic cheer/boo/tick are included as compact MP3 assets. They are bundled into the offline cache. No sampled commercial music or third-party recordings were used.

Chromium checks cover actual MP3 decoding/playback, first-interaction gating, initial mute, reload/new-career preference persistence, selection and actual same-track looping, Organiser options, music continuing through navigation and paused live matches, all four home/away goal mappings, effect suppression and persistent stadium SVG identity. Discipline checks cover live and simulated league fixtures, fifth/tenth yellows, red/second-yellow cards, ban serving, overlapping penalties, carryover, save persistence, selection exclusions and three-sub enforcement. Existing match, notification/Back and career-panel checks pass. Start/options and squad screens were reviewed at phone size, and career/match views in landscape. Imports, version references, sound asset decoding, offline-cache entries and ZIP integrity were checked.

Physical-phone volume balance, audio restrictions and background/resume behaviour still need your test. Music repeats the selected track; it does not stop at kickoff. Existing gameplay, stadium geometry, maps and celebrations are retained.

Scouting tests cover all twelve clubs, stable estimates, funding cost/reload, report timing/notification review, player Back hierarchy, opponent lineup exclusions and persistent injuries/daily recovery. Phone-size profiles and opponent panels were visually reviewed. Physical-phone interaction testing remains outstanding.
