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
- src/App.jsx — known (2026-08-07, extended 2026-08-08/09) — the root component; imports `subjects` from `data.js`, holds an editable array of subject/course dropdown rows (add/remove/submit/customize sections), a box-and-panel view swap for narrowing a course to specific sections, and validation, all written and debugged by Akeem → [[jsx]], [[react-components]], [[react-state]], [[controlled-inputs]], [[rendering-lists]], [[derived-state]], [[immutable-array-updates]], [[form-validation-with-array-methods]], [[named-exports]], [[controlled-checkboxes]], [[jsx-fragments]], [[array-reference-equality]], [[array-membership-toggle]]
- src/data.js — known (2026-08-09) — the fake `subjects` data, now with real `sections`/`meetings` (day + start/end time, 24-hour) to test conflicts against; CSCI written by Akeem, PHYS/MATH mirrored by the agent at his request once he'd established the pattern → [[named-exports]]
- src/schedule.js — known (2026-08-09, extended 2026-08-10/11) — the algorithm module; `timeToMinutes`, `getEligibleSections`, the bitmask pipeline (`timeToSlot`, `setSlot`, `sectionToMask`, `masksConflict`, `combineMasks`), and the recursive generator (`generateSchedules`) — written by Akeem (skeleton + guidance from the agent); `orderedEligibleLists` (sorts courses fewest-sections-first) written and toured by the agent, not yet a fill-in he's done himself. `meetingsConflict` removed 2026-08-10, superseded by the mask pipeline it had already been verified against → [[time-conflict-detection]], [[strict-mode-variable-declaration]], [[bitmask-representation]], [[classic-for-loops]], [[backtracking-with-pruning]]
- src/Course.jsx — known (2026-08-07) — a reusable component taking a course's `code`/`title` as props, authored by Akeem → [[react-components]], [[react-props]]
- src/main.jsx — known (2026-08-07) — finds `<div id="root">` in `index.html` and tells React to render `App` into it; the one-time handoff from plain HTML to React. Wrapped in `StrictMode`, a dev-only double-run check → [[useeffect]]
- src/App.css — known (2026-08-08, extended 2026-08-09) — `.row` flexbox for dropdown rows, `.courses` container styling, `.checkboxes { display: block }` to stack section checkboxes vertically instead of the default inline flow, all written by Akeem
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
