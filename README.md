# GROUNDS v35.5 — Marked district traffic routes

Upload the contents of this ZIP to the root of the existing GitHub Pages repository. Include the new `vehicle-paths.js` file with `index.html`. The service worker and in-game version number are 35.5.

- Moving cars follow the blue routes and buses follow the red routes drawn on the nine annotated daytime site maps. Each site's daytime and nighttime art uses the same paths.
- Vehicles travel along complete authored paths rather than choosing another branch at every tiny junction. Route availability is specific to each site. Civic Gardens runs buses without cars, and Rail District has no moving cars or buses.
- Rail District and Civic Gardens show many more pedestrians; other districts with light traffic have additional people too. Mid and top tier districts have more moving vehicles on their marked routes.
- Moving buses have a taller body, windows, and a clearer roof profile.

This update changes movement and leaves the artwork and stadium placement registration as they were. Some annotated routes end within an image; a vehicle re-enters on its next assigned trip after reaching an endpoint. The earlier seat colour picker and pre-season stadium adjustment requests remain queued.

Career and Sandbox saves retain `grounds-career-v2` and `stadium-workshop-layered-v35`. Earlier `grounds-career-v1` and `stadium-workshop-layered-v27` records are not removed. Uploading files does not replace an existing local save.
