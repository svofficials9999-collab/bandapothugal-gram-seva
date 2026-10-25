# bandapothugal-gram-seva
Bandapothugal Gram Seva - village services app (Telugu first)

### Content release checklist
Before each content deploy, from this directory run `node scripts/prepare-release.mjs YYYY-MM-DD` once. This updates the app release date, asset pins, scoped cache version and data-integrity SHA together. Keep individual card `u` source-check dates and `emergencyVerified` unchanged unless those facts were actually checked. A release is not a whole-dataset verification. Inspect mobile Telugu/English and offline upgrade before pushing; verify served bytes afterward.
