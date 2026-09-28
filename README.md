# Clubline — Release 1.7.2

Copy the contents of this ZIP to the root of your GitHub Pages repository, including the new `sw.js`.

The mobile recording showed older league data loaded with a newer Clubline screen (`Facilities undefined★`). This build requests league data under a new versioned URL and replaces the lingering GROUNDS cache-first service worker with Clubline's network-first worker. It also keeps the season-start storage recovery from 1.7.1: a failed save no longer traps the setup screen, and an obsolete GROUNDS career save is removed only if the storage quota is reached. If another error occurs while starting a season, setup stays usable and shows a message.

Current Clubline saves and GROUNDS stadium designer data are retained. This is a focused fix; pitch and menu framing notes remain scheduled for a later visual update.
