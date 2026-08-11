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

### /src
- src/App.jsx — known (2026-08-07, extended 2026-08-08/09/11) — the root component; imports `subjects` from `data.js`. Three-way view swap on `.courses` — results/pagination, the section-customize panel, or the main shortlist — driven by `results`/`customizingID` state. Submit validates the shortlist, generates real schedules (`generateSchedules(orderedEligibleLists(rows))`), and swaps to the grid with Back/Previous/Next controls (`setIndex`, bounds-checked). The grid dynamically sizes itself per schedule: `activeDays` (Mon–Thu baseline, `DAYS.slice()`) and `activeHours` (floor/ceil of the real earliest/latest class, no padding) replace the old fixed `DAYS`/`GRID_HOURS` everywhere. Every grid cell — header, hour labels, placeholders, and the positioned `.class-block` divs — has an explicit `gridColumn`/`gridRow` at 15-minute-slot precision. Dead `submitted` state removed once it stopped being read. `handleSubmit` checks `generated.length === 0` before calling `setResults`, so an empty result set shows an error message on the main list instead of crashing to a blank page (an empty array is truthy, so the old `results ? ...` check alone couldn't tell "no results yet" from "results came back empty"). Written and debugged by Akeem, with the agent's help on the auto-placement bug fix → [[jsx]], [[react-components]], [[react-state]], [[controlled-inputs]], [[rendering-lists]], [[derived-state]], [[immutable-array-updates]], [[form-validation-with-array-methods]], [[named-exports]], [[controlled-checkboxes]], [[jsx-fragments]], [[array-reference-equality]], [[array-membership-toggle]], [[css-grid-layout]], [[bounded-index-navigation]], [[explicit-grid-item-placement]], [[array-slice]], [[js-truthy-falsy]]
- src/data.js — known (2026-08-09) — the fake `subjects` data, now with real `sections`/`meetings` (day + start/end time, 24-hour) to test conflicts against; CSCI written by Akeem, PHYS/MATH mirrored by the agent at his request once he'd established the pattern → [[named-exports]]
- src/schedule.js — known (2026-08-09, extended 2026-08-10/11) — the algorithm module; `timeToMinutes`, `getEligibleSections` (each section enriched with `courseSubject`/`courseCode` so it's self-contained once inside generated results), the bitmask pipeline (`timeToSlot`, `setSlot`, `sectionToMask`, `masksConflict`, `combineMasks`), the recursive generator (`generateSchedules`), and `to12Hour`/`GRID_HOURS`/`DAYS`/`DAY_START` (exported) for the grid's display and dynamic sizing — written by Akeem (skeleton + guidance from the agent); `orderedEligibleLists` (sorts courses fewest-sections-first) written and toured by the agent, not yet a fill-in he's done himself. `meetingsConflict` removed 2026-08-10, superseded by the mask pipeline it had already been verified against → [[time-conflict-detection]], [[strict-mode-variable-declaration]], [[bitmask-representation]], [[classic-for-loops]], [[backtracking-with-pruning]], [[arrow-function-object-literal]]
- src/Course.jsx — known (2026-08-07) — a reusable component taking a course's `code`/`title` as props, authored by Akeem → [[react-components]], [[react-props]]. ⚠️ **Currently dead code** (noticed 2026-08-11): still imported at the top of `App.jsx` but never rendered — it was superseded when section 2 replaced the hardcoded course list with editable dropdown rows. Harmless, but worth a 10-second decision in section 4 (delete both the file and the import, or keep it as reference). Don't let a fresh session mistake it for something load-bearing.
- src/main.jsx — known (2026-08-07) — finds `<div id="root">` in `index.html` and tells React to render `App` into it; the one-time handoff from plain HTML to React. Wrapped in `StrictMode`, a dev-only double-run check → [[useeffect]]
- src/App.css — known (2026-08-08, extended 2026-08-09/11) — `.row` flexbox for dropdown rows, `.courses` container styling, `.checkboxes { display: block }` to stack section checkboxes vertically, `.weekly-grid` (CSS Grid, sized dynamically per schedule via inline styles — fixed-px columns/rows plus `width/height: fit-content` and `margin: 0 auto` so it shrinks and centers instead of stretching), `.schedule-navigation` (centered flex row for pagination), `.class-block` (styling for a positioned class in the grid), all written by Akeem
- src/index.css — parked — emptied of template styles, not yet replaced with anything real
- src/assets/ — deleted 2026-08-07 (template image assets, no longer applicable)
- .vs/ — generated — Visual Studio's own project cache/index; gitignored, never tracked, machine-rebuildable. Locks a file while VS is open, which crashed both Vite's dev server and `git add` until both were told to ignore it

Nothing else exists yet.

---

## Coming later — pre-parked so they're never mystery boxes

Not on disk yet. Listed so that when a command creates them, the lesson can tour them rather than let them pile up unexplained. **Delete an entry from here and add it above once it actually exists.**

### Section 4 will create
- The parser script — fetches AURAK's page and turns its HTML table into structured course data → [[html-parsing]]
- A saved copy of AURAK's HTML — kept locally so debugging doesn't hit their server repeatedly, and reused as the test fixture in section 7 → [[testing-a-parser]]

### Section 5 will create
- `.env` — 🔑 **the database connection string lives here. Gitignored from the very first commit, before it ever holds a real value.** His first real secret → [[environment-secrets]]
- `requirements.txt` — the Python packages this project needs. He wrote one last project
- SQLAlchemy model definitions — the three tables described as Python classes → [[sqlalchemy-models]], [[orm-relationships]]
- `alembic/` and `alembic.ini` — migration history: a versioned record of every schema change, replacing last project's "delete the database and restart" → [[alembic-migrations]]

### Section 6 will create
- The FastAPI application — routes serving course data as JSON → [[fastapi-routes]], [[pydantic-models]]

### Section 7 will create
- Test files — checking the parser against the saved HTML, and the algorithm against hand-worked examples → [[testing-a-parser]], [[testing-the-algorithm]]
- `__pycache__/` — generated — Python's compiled-bytecode cache. Gitignore it; he hit exactly this last project and had to untrack it after the fact

### Section 8 will create
- `.github/workflows/` — the YAML file telling GitHub Actions to run the refresh on a schedule → [[github-actions]], [[yaml-workflows]]

### Section 9 will create
- `README.md` — the repo's front door: what it is, the live URL, tech stack, how to run it, and the disclaimer → [[readme-portfolio-framing]], [[disclaimer-and-unofficial-framing]]
