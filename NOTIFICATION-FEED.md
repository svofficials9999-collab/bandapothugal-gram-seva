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

## Courses and accommodation (24 October2026)
User permits paid course listings, not spending or registration. The same feed supports `category`: `scheme`, `course` or `accommodation` (legacy omitted = scheme); `cost`: `free`, `paid` or `unknown` (omitted = unknown). These are displayed, with a category filter; total unread badge still covers ALL categories. No fake event is added merely because a listing was added.

Accepted exact HTTPS sources: gov.in/nic.in domains, plus explicitly allowlisted bank hosts `sbi.bank.in`, `bankofbaroda.bank.in`, `www.unionbankofindia.bank.in`. This validates a source HOST, not the contents or its author. Read and verify the actual source/quotation/date/current scope before publication. Unlisted provider sites are not silently accepted; require independently verified identity and a reviewed allowlist change. No rseti.in government-identity assumption.

Course notices must distinguish beginner CTS from CITS instructor training and name trade-specific eligibility, true deadline, published fees, certificate costs and current batch status. Accommodation notices must distinguish a general policy from available hostel places; state gender/safety/residency restrictions and meals/mess costs where verified. Unknowns remain explicit. Do not invent a publication date or turn old fees/course catalogues into fresh batch notices. If no new dated announcement has been verified, leave feed empty. Existing source-check responsibility continues; no duplicate monitor.
