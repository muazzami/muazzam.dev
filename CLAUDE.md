# muazzam.dev

Personal portfolio. Astro static site, house convention (see `astro-static-site` skill): all copy in `src/data/site.json` + `src/data/pages/home.json`, types in `src/data/content.ts`.

## Deploy
Public repo: github.com/muazzami/muazzam.dev (`main`). Pre-publication history is kept locally on branch `private-history` (never push it). Cloudflare Pages project `muazzam` is direct upload, not git-connected:

    npm run build && npx wrangler pages deploy dist --project-name muazzam --branch main

Commit and `git push`, then deploy. Private notes (`updates-*.md`) are gitignored.

## Facts to keep consistent with the résumé (~/Projects/daily/docs/resume-build.js)
- Career start: April 2014 ("12 years in", "since 2014"). Pre-2014 study-era work is not counted.
- Agency: 8+ years (2018–), developer → lead developer → Solutions Architect.
