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

Nothing else exists yet. The project has not been scaffolded.

---

## Coming later — pre-parked so they're never mystery boxes

Not on disk yet. Listed so that when a command creates them, the lesson can tour them rather than let them pile up unexplained. **Delete an entry from here and add it above once it actually exists.**

### Section 1 will create
- `package.json` — the list of frontend packages this project asks for, plus the commands to run it. The React equivalent of `requirements.txt`, which he already understands → [[node-and-npm]]
- `package-lock.json` — generated — records the *exact* versions actually installed, so another machine gets an identical setup. Never hand-edited
- `node_modules/` — generated — where npm puts the packages it downloaded. Enormous, machine-made, always rebuildable from `package.json`. **Must be gitignored before the first commit** → [[node-and-npm]]
- `index.html`, `src/`, `vite.config.js` — the React app itself and its build configuration → [[vite]], [[jsx]]
- `.gitignore` — tells git never to track `node_modules/`, `.env`, and Python caches. He built one of these last project and learned that adding a *already-tracked* file to it doesn't untrack it

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
