
## v101 - 26 October 2026: launch-readiness fixes
- Fixed exact offline entry-resource cache keys on a fresh install. Verified v100 to v101 automatic update keeps language/read preferences and unrelated app caches.
- Fixed narrow-screen action wrapping, touch targets and listen-button contrast; hid the home install prompt while forms/cards are open.
- Language switching now tolerates blocked browser storage. Missing matching text-to-speech voices give a readable-text notice, not an unrelated language voice.
- Corrected EMI fractional-month validation, tiny-rate numerical stability and non-finite results. Complaint labels/privacy now state draft-only behavior without promising direct sending.
- Repaired current NLM and MPLADS official routes, changed RSETI reference to SBI, encoded bank PDF filenames, reconciled SVANidhi coverage and Stand Up India status, and removed overclaims about scheme discovery/village fund coverage.
- Added structural content/cache gate. Preserved 199 service cards, 26 sections, 50 scheme-index entries, 9 course tracks, 57 lessons and 17 videos.
- Tested in Chrome mobile emulation at 320/375/414/430 px plus desktop: both languages, every section, special views, search, quiz gates, simulator, calculators, print-to-PDF, empty/error states, first offline visit and upgrade. Existing 103 MP3 files decoded without errors. Government source access was checked with direct requests and readable-page checks; a network error alone was not classified as a globally broken site.
- Limits: no physical Android/iOS install/dialer/printer or audible-device-voice verification; external portals and YouTube need network and may vary by location/device. Videos are introductory demonstrations, not a video for every lesson or a certified course. Only matching prerecorded audio is used; other text depends on device voices. Complaints are not submitted by this app. Individual card check dates remain distinct from the release date.

## v102 - reliable icons across devices
- Launch visual review found missing system emoji glyphs in headings and action labels. Replaced decorative glyph rendering through a shared local inline-vector layer, including dynamically opened cards, notices and course views. Text/action labels, form values, speech content and all existing behavior remain intact. No external font dependency added.
- Repeated full functional/mobile layout suites, source structural gate, first-offline tests and automatic upgrade checks. Inspected corrected banking, complaint and calendar pixels before deployment.
