# Approved audio integration — 1.31.0

Music: menu-hip-hop, menu-french-electro, menu-fuzzy-rock (original procedural previews approved by the user).
Effects: crowd-cheer, crowd-boo, advance-tick from preview 1.
Excluded: crowd ambience, upset groan, wordless chant. A natural stadium murmur may be sourced later.

Settings: clubline-audio-settings, independent of release/career keys. musicMuted and effectsMuted are booleans; track is a bounded playlist index. No per-render audio objects, no report/reload replay of goal effects. Goal reactions follow the host supporters.

MP3 masters are derived from the preview WAV files. Music gain .22; effect gain .65. Sources have peak headroom. Two players limit overlapping effects while allowing music beneath them. Playback begins after a gesture and handles blocked playback without disrupting game logic.

Future refinements may include adjustable volumes and recorded crowd ambience after approval. Scouting and first-career guidance are separate pending notes.
