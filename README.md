# Clubline — Release 1.13.0

Copy **all** ZIP contents into the root of your GitHub Pages repository, including `sw.js`, `assets`, `data` and the HTML/JS/CSS files. Use **Check for updates** in the installed app if it still shows the previous version.

## Fixed stadium locations

- Seven rebuilt portrait sites: Civic Quarter, Riverside Quarter, City Waterfront, Civic Gardens, Rail District, University Quarter and Old Town. Each has several blocks of map above the fixed stadium plot for mobile framing.
- Plots are empty and have a clear paved edge. Older town and campus settings keep a tighter frontage; larger city grounds have more open space. Painted pedestrians and road vehicles have been removed from the new site art. Riverside/Waterfront boats and the Rail District train remain environmental details.
- Each location has a fixed stadium position and orientation. The ground and pitch grow together from that datum; there are no placement or rotation controls.
- Site-specific visual scale fits the generated stands in each plot. A maximum-depth stand preview was checked on all seven locations.
- Location capacity limits are shown in club setup and enforced in the stadium designer: 40k Old Town, 45k University Quarter, 60k Rail District, 70k Civic Gardens, and 75k at the other three sites. Clubs starting above a site's limit cannot choose it.
- Seven regenerated engine stadium frames rotate on the start screen. Mobile controls are more compact so the ground can show beneath them.

The evening versions currently grade the day art darker; separately painted night maps are still to come. The painted surroundings and generated stadium now follow the same approximate isometric axes, but a final pixel-level registration pass may still be needed for every street edge. This release does not add moving pedestrians or traffic.
