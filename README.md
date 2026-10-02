# Clubline 1.31.0 — Music and match reactions

Upload the ZIP contents to your GitHub Pages repository. Nothing has been deployed.

## Audio

- The start page has separate Music and Effects on/off buttons, Play music and Skip track. Browsers require a user interaction before audio begins; a first tap on Music can mute it before it starts.
- Organiser → Options has Mute music and Mute effects checkboxes, a track selector, Play music and Skip track. Choose Hip-hop, French electro or Fuzzy rock. Selecting a track starts from that track; the playlist then rotates through all three and repeats continuously, including during watched matches and pauses.
- Audio settings use a stable device-local storage key independent of careers and version numbers. Updates and new careers retain mute choices and the current track, provided browser site data is retained.
- Home-side goals trigger the approved cheer; away-side goals trigger the approved boo. Thus the player's own goal cheers at home and boos away; conceding does the opposite. Goal effects play when new goal events are generated, not when an existing report or saved match is reopened.
- The approved light Advance tick is included. Effects mute stops the current effect and suppresses later effects. Music mute stops music immediately; skipping while muted changes the selected track without unmuting it.
- Music is quieter than reactions. Hidden tabs pause audio; returning resumes the music if enabled. One persistent music player and one effects player sit outside screen rendering, so navigation and live UI updates do not recreate them.
- Rejected ambient crowd, upset groan and chant are excluded. Scouting, payroll explanations and the beginner guide remain future work.

## Assets and verification

Three original synthesized instrumental sketches and the previously approved synthetic cheer/boo/tick are included as compact MP3 assets. They are bundled into the offline cache. No sampled commercial music or third-party recordings were used.

Chromium checks cover actual MP3 decoding/playback, first-interaction gating, initial mute, reload/new-career preference persistence, selection/skipping/playlist wrap, Organiser options, music continuing through navigation and paused live matches, all four home/away goal mappings, effect suppression and persistent stadium SVG identity. Existing match, notification/Back and career-panel checks pass. Start/options screens were reviewed at phone size. Imports, version references, sound asset decoding, offline-cache entries and ZIP integrity were checked.

Physical-phone volume balance, audio restrictions and background/resume behaviour still need your test. Music repeats through the playlist; it does not stop at kickoff. Existing gameplay, stadium geometry, maps and celebrations are retained.
