# Clubline — Release 1.7.1

Copy the contents of this ZIP to the root of your GitHub Pages repository. The update check reads `version.json`.

This fixes a blocked Start season flow when the phone refuses to write the career save. The career screen opens even when device storage is unavailable, with a visible warning that progress may be lost on reload. On a storage quota error, Clubline first removes the obsolete GROUNDS career save and retries. Current Clubline saves and GROUNDS stadium designer data are retained.

This is a focused fix to release 1.7.0. The pitch and menu framing notes remain scheduled for a later visual update.
