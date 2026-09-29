# Clubline — Release 1.12.0

Copy **all** ZIP contents to the root of your GitHub Pages repository, including `sw.js` and the `assets` directory. Use **Check for updates** in the installed app if it still shows the previous release. Existing Clubline careers retain their save key.

## Stadium and settings

- The engine stadium is larger within its plot. Partial roofs sit farther back, exposing the raked tiers on far stands; curved corner roofs follow the adjoining sections. Open corner layouts gain a low concourse edge rather than an abrupt visual gap.
- Civic Quarter and Riverside Quarter are two new portrait location pilots in club setup. Both use the game's generated stadiums and designer layouts on top of their site art. Existing locations remain available.
- Portrait locations use a shared scene projection and view framing for menu, designer and career views. Their evening treatment darkens the daytime painting; separate night paintings and a full redraw of surrounding street geometry are future art work.

## Start screen

- A smaller menu stays toward the upper portion of the phone screen so the stadium and neighbourhood are visible below it.
- Six distinct stadiums cycle across the two pilot locations in day and evening. Their desktop and mobile frames are pre-rendered from the actual stadium engine. The frames crossfade and pan gently without rebuilding the SVG at every transition.

This release is a pilot for the new locations. Some lines and small painted details in the background art do not yet match the engine's exact isometric projection; the site paintings will need a geometry pass before every street edge and moving vehicle can be aligned perfectly.
