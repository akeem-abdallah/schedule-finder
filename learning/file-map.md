# File map

<!-- Every file/folder is either explained or parked — no mystery boxes. -->
<!-- known: explained in the learner's own words | parked: honest one-liner for now, deep dive scheduled | generated: machine-made, never edit, always rebuildable -->

**The invariant:** nothing on disk is missing from this map. When a lesson creates files, they get added the same day — as `known` if Akeem authored them or was toured through them, as `parked` (naming the section where the debt comes due) otherwise, or as `generated` for machine-made things he never edits.

Entries stay **one line** forever. They record *why a file exists*, not what's inside it — depth belongs in the knowledge graph, so entries link out with `→ [[concept-name]]` rather than duplicating it.

## Currently on disk

### /learning
- learning/project.md — known (2026-08-06) — who Akeem is, his honest level, the idea, the MVP, the trunk, and how he wants to work. Written to be read cold by a fresh session
- learning/plan.md — known (2026-08-06) — the nine sections, every locked decision, and per-section teaching notes → [[why-fastapi-not-django]], [[why-postgres-needs-its-own-home]], [[why-client-side-generation]]
- learning/knowledge-graph.md — known (2026-08-06) — the living map of what he actually knows; it decides what gets quizzed
- learning/file-map.md — known (2026-08-06) — this file: why every file in the repo exists

### / (root) — scaffolded 2026-08-07 via `npm create vite@latest`
- package.json — known (2026-08-07) — packages this project needs plus run commands (`npm run dev`); React's equivalent of `requirements.txt` → [[node-and-npm]]
- package-lock.json — known (2026-08-07) — generated — exact versions actually installed, never hand-edited
- node_modules/ — known (2026-08-07) — generated — where npm put the downloaded packages; gitignored by the Vite template itself, rebuildable from `package.json` → [[node-and-npm]]
- .gitignore — known (2026-08-07) — Vite-generated; already excludes `node_modules/` and build junk
- index.html — known (2026-08-07) — the one real HTML page; React mounts into it → [[vite]]
- vite.config.js — known (2026-08-07) — Vite's dev-server/build configuration → [[vite]]
- .oxlintrc.json — parked (section 7-ish, whenever linting comes up) — config for Oxlint, the linter picked during scaffolding
- README.md — parked (section 9) — still Vite's default placeholder; gets replaced with the real one → [[readme-portfolio-framing]]
- public/ — parked — static assets served as-is (favicon, icon sprite); not toured in depth
- .superpowers/ — known (2026-08-14) — output from the design brainstorm that produced Amber: `brainstorm/1750-.../content/amber-final.html` is the visual mockup `docs/design/amber.md` was written from, and the source for the 375px reference layouts. Tool-generated, not hand-edited, safe to delete once the design is settled — nothing in `src/` imports it

### /src
- src/App.jsx — known (2026-08-07, extended 2026-08-08/09/11) — the root component; imports `subjects` from `data.js`. Three-way view swap on `.courses` — results/pagination, the section-customize panel, or the main shortlist — driven by `results`/`customizingID` state. Submit validates the shortlist, generates real schedules (`generateSchedules(orderedEligibleLists(rows))`), and swaps to the grid with Back/Previous/Next controls (`setIndex`, bounds-checked). The grid dynamically sizes itself per schedule: `activeDays` (Mon–Thu baseline, `DAYS.slice()`) and `activeHours` (floor/ceil of the real earliest/latest class, no padding) replace the old fixed `DAYS`/`GRID_HOURS` everywhere. Every grid cell — header, hour labels, placeholders, and the positioned `.class-block` divs — has an explicit `gridColumn`/`gridRow` at 15-minute-slot precision. Dead `submitted` state removed once it stopped being read. `handleSubmit` checks `generated.length === 0` before calling `setResults`, so an empty result set shows an error message on the main list instead of crashing to a blank page (an empty array is truthy, so the old `results ? ...` check alone couldn't tell "no results yet" from "results came back empty"). Written and debugged by Akeem, with the agent's help on the auto-placement bug fix. **2026-08-14 (section 4):** slot math moved to 5-minute precision (`/ 5`, `* 12` rows, `span 12`); the grid is wrapped in a `.grid-scroll` div so 5+ day weeks scroll horizontally instead of shrinking; gutter labels render **both** a full and a short form with CSS hiding one, so no width ever enters React state; class blocks gained a `class-block-short` modifier (sub-60-minute blocks drop the time line) and a `title` tooltip carrying the full detail that mobile truncates; the inline `.error` div became a `.toast` driven by a `useEffect` timer plus an `errorId` nonce; both `updateRow` calls now reset `sections: []` on a course change; a `CLEAR` button clears all rows; the semester chip became an external link → [[jsx]], [[react-components]], [[react-state]], [[controlled-inputs]], [[rendering-lists]], [[derived-state]], [[immutable-array-updates]], [[form-validation-with-array-methods]], [[named-exports]], [[controlled-checkboxes]], [[jsx-fragments]], [[array-reference-equality]], [[array-membership-toggle]], [[css-grid-layout]], [[bounded-index-navigation]], [[explicit-grid-item-placement]], [[array-slice]], [[js-truthy-falsy]], [[settimeout-and-cleanup]], [[rules-of-hooks]], [[toast-notifications]], [[slot-granularity-must-divide-the-data]]
- src/data.js — known (2026-08-09) — the fake `subjects` data, now with real `sections`/`meetings` (day + start/end time, 24-hour) to test conflicts against; CSCI written by Akeem, PHYS/MATH mirrored by the agent at his request once he'd established the pattern → [[named-exports]]
- src/schedule.js — known (2026-08-09, extended 2026-08-10/11) — the algorithm module; `timeToMinutes`, `getEligibleSections` (each section enriched with `courseSubject`/`courseCode` so it's self-contained once inside generated results), the bitmask pipeline (`timeToSlot`, `setSlot`, `sectionToMask`, `masksConflict`, `combineMasks`), the recursive generator (`generateSchedules`), and `to12Hour`/`GRID_HOURS`/`DAYS`/`DAY_START` (exported) for the grid's display and dynamic sizing — written by Akeem (skeleton + guidance from the agent); `orderedEligibleLists` (sorts courses fewest-sections-first) written and toured by the agent, not yet a fill-in he's done himself. `meetingsConflict` removed 2026-08-10, superseded by the mask pipeline it had already been verified against. **2026-08-14 — slot granularity changed 15 min → 5 min** (`SLOTS_PER_DAY` 48→156, `MASK_WORDS` 11→35, `/ 15`→`/ 5` in `timeToSlot`) because real AURAK classes run 50 minutes, which 15 does not divide; the old code produced fractional slots that CSS rejected outright and that the mask silently truncated, discarding valid schedules. `formatMeetings` added for view 2's day/time line. `GRID_HOURS` deleted (stale, stopped at hour 19). ⚠️ **`MASK_WORDS = 35` assumes nothing ends after 21:00** — a later class writes past the mask and misses conflicts with no error → [[time-conflict-detection]], [[strict-mode-variable-declaration]], [[bitmask-representation]], [[classic-for-loops]], [[backtracking-with-pruning]], [[arrow-function-object-literal]], [[slot-granularity-must-divide-the-data]]
- src/Course.jsx — known (2026-08-07) — a reusable component taking a course's `code`/`title` as props, authored by Akeem → [[react-components]], [[react-props]]. ⚠️ **Fully orphaned as of 2026-08-14** — the `import` was removed from `App.jsx` at some point during the styling work, so the file now sits on disk referenced by nothing. Superseded back in section 2 when the hardcoded course list became editable dropdown rows. **Still awaiting the 10-second decision** flagged on 2026-08-11 (delete it, or keep as reference). Don't let a fresh session mistake it for something load-bearing.
- src/main.jsx — known (2026-08-07) — finds `<div id="root">` in `index.html` and tells React to render `App` into it; the one-time handoff from plain HTML to React. Wrapped in `StrictMode`, a dev-only double-run check → [[useeffect]]
- src/App.css — known (2026-08-08, extended 2026-08-09/11, rewritten 2026-08-12→14) — **now the whole Amber design system**, ~860 lines, implementing `docs/design/amber.md`: a `:root` token block (colour, type, rule weights) with a parallel `@media (prefers-color-scheme: dark)` block, then component rules for all three views. Two responsive breakpoints, both derived from measurement: **640px** (view 1's row collapses to two lines, table header hides, footer buttons stack, tap targets go 44px) and **480px** nested inside it (grid gutter 70→42px, `9:00 AM`→`9 AM`, block type shrinks). Grid sizing is driven by custom properties read from inline JSX styles — `--gutter-w`, `--day-w`, `--slot-h` — so a media query can resize the grid with no width in React state. `--hue` per course block feeds `color-mix()` for the wash. Written by Akeem; ⚠️ **most values were measured by the agent in the live DOM and handed over to type** → [[responsive-design]], [[css-custom-properties]], [[toast-notifications]], [[css-grid-layout]]
- src/index.css — known (2026-08-14) — **deliberately empty (0 bytes), and staying that way.** Emptied of Vite's template styles back in section 1; the Amber system lives entirely in `App.css`, so this file has no job. Left in place only because `main.jsx` imports it. Safe to delete along with its import — not a debt, just a leftover
- src/assets/ — deleted 2026-08-07 (template image assets, no longer applicable)
- .vs/ — generated — Visual Studio's own project cache/index; gitignored, never tracked, machine-rebuildable. Locks a file while VS is open, which crashed both Vite's dev server and `git add` until both were told to ignore it

### /backend — added 2026-08-14
- backend/venv/ — known (2026-08-14) — generated — Python's isolated per-project package folder, created with `python -m venv venv`; never hand-edited, gitignored, rebuildable from `requirements.txt` → [[python-venv]]
- backend/requirements.txt — known (2026-08-14) — the Python packages this project needs, pinned to exact versions via `pip freeze`; same relationship to `pip install` as `package-lock.json` has to `npm install` → [[python-venv]]
- backend/fetch_schedule.py — known (2026-08-14) — **section 5's finished deliverable.** Fetches AURAK's live page, saves raw HTML, parses and normalizes all 421 rows (`parse_row`/`parse_meetings`/`parse_section`/`to_24_hour`), then groups the flat list into the same nested Subject→Course→Section(→Meeting) shape `data.js` uses, via a dict-based find-or-create pattern. Still printing to console, not yet in a database (section 6) → [[http-requests-python]], [[html-parsing]], [[data-cleaning]], [[multi-value-fields]], [[normalize-at-the-boundary]], [[dict-based-grouping]]
- backend/aurak_schedule.html — known (2026-08-14) — a saved copy of AURAK's real page (~700 rows), fetched once so the rest of section 5 develops against a local file instead of hitting AURAK's server every run; will double as the test fixture in section 8 → [[http-requests-python]]

### /docs/design — added 2026-08-12
- docs/design/amber.md — known (2026-08-12) — the design spec the app now implements: colour tokens for both themes, the two-family type scale (mono for data, sans for language), layout primitives, the eight course hues, the responsive column budget, and a build order. Deliberately written as **tables of values, not CSS**, so transcribing it is the work → [[responsive-design]], [[css-custom-properties]]
- docs/design/view3-build.md — known (2026-08-13) — an 8-task build spec for rebuilding the results grid to match the mockup, with the measured before-state (645px of dead space, grid overflowing its card) and the reasoning behind each non-obvious call. Written by the agent at Akeem's request so the work could continue on a cheaper model

Nothing else exists yet.

---

## Coming later — pre-parked so they're never mystery boxes

Not on disk yet. Listed so that when a command creates them, the lesson can tour them rather than let them pile up unexplained. **Delete an entry from here and add it above once it actually exists.**

### Section 5 will create
- `fetch_schedule.py` grows into the full parser — turning the saved HTML table into structured course data is tasks 5.2–5.5 → [[html-parsing]]

### Section 6 will create
- `.env` — 🔑 **the database connection string lives here. Gitignored from the very first commit, before it ever holds a real value.** His first real secret → [[environment-secrets]]
- `requirements.txt` — the Python packages this project needs. He wrote one last project
- SQLAlchemy model definitions — the three tables described as Python classes → [[sqlalchemy-models]], [[orm-relationships]]
- `alembic/` and `alembic.ini` — migration history: a versioned record of every schema change, replacing last project's "delete the database and restart" → [[alembic-migrations]]

### Section 7 will create
- The FastAPI application — routes serving course data as JSON → [[fastapi-routes]], [[pydantic-models]]

### Section 8 will create
- Test files — checking the parser against the saved HTML, and the algorithm against hand-worked examples → [[testing-a-parser]], [[testing-the-algorithm]]
- `__pycache__/` — generated — Python's compiled-bytecode cache. Gitignore it; he hit exactly this last project and had to untrack it after the fact

### Section 9 will create
- `.github/workflows/` — the YAML file telling GitHub Actions to run the refresh on a schedule → [[github-actions]], [[yaml-workflows]]

### Section 10 will create
- `README.md` — the repo's front door: what it is, the live URL, tech stack, how to run it, and the disclaimer → [[readme-portfolio-framing]], [[disclaimer-and-unofficial-framing]]
