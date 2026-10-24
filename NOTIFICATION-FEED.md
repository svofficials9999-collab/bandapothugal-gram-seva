# Official notification feed

`notifications.json` is the only production notification source. Currently empty: do not add examples or treat old schemes as fresh launches. The UI count is unread eligible entries, not the total number of schemes or an invented marketing count.

Each item needs:
- `id`: stable lowercase hyphenated ID; `revision`: stable version, changed only for a material source-backed change.
- `te`, `en`: plain text titles; `summaryTe`, `summaryEn`: careful scope, distinguish announcements/proposals from launched schemes and open applications.
- `source`: verified exact HTTPS government source URL (`gov.in` or `nic.in`). Read the source first, never only a search excerpt.
- `quote`: verbatim passage supporting the alert.
- `published`, `checked`: ISO YYYY-MM-DD actual source publication date and check date. Do not use check date as a launch date.
- `expires`: optional ISO date for a real deadline. Remove obsolete notices during the existing currency review.

No HTML. No private contact details. No examples in production. No new watcher/service needed: the existing scheme-currency duty publishes source-checked notices here with the normal Pages deploy/cache QA gate.

Read status uses local storage per device/browser, keyed by id:revision. Reading is explicit. Opening the bell does not clear the count. Revised notices become unread again. Expired/future/unverified items are filtered out. The feed is refreshed on page load, return to foreground, online reconnection or manual Refresh, without polling. Failed reads are labelled offline/stale and use the last saved feed.

There is no background push infrastructure. Closed apps do not fetch new notices. `setAppBadge` is attempted where available and failures are caught; OS/browser support, installation, permissions and icon color vary. The app cannot force green OS icons. In-app green count is the reliable UI. No permission prompt or device-token collection is implemented.
