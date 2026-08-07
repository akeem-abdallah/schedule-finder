# Knowledge graph

<!-- statuses: seed → introduced → practicing → understood -->
<!-- seed: not yet taught | introduced: explained once | practicing: used it with help | understood: explained in own words + passed a quiz -->

**This file decides what Akeem gets quizzed on. Its value is entirely in its honesty.**

## Rules for updating it — please follow these exactly

1. **Upgrade only on evidence.** Evidence means *he* explained it in his own words, made a correct prediction, passed a quiz, or wrote a correct fill-in. Watching him copy working code is not evidence.
2. **Record only what he actually said or did.** Never credit him with something the agent performed. Never embellish. Quote him where the wording matters — his own phrasing is the best record of what he understood.
3. **Never reach `understood` on the day a concept is introduced.** Cap first contact at `practicing`, however well the lesson went. `understood` requires a *later* successful cold recall after days away. One great session proves performance; only retrieval proves it stuck.
4. **Record struggles too.** A concept he got wrong, or needed told, is more useful information than a clean pass. Write down what he said, including "I don't know."
5. **Downgrade on a failed review.** `understood` → `practicing` with a note. Forgetting is normal; hiding it isn't.
6. 🔴 **A vague answer is not a pass.** Akeem asked for this directly: *"bluntly and honestly correct my response so that I can actually know the correct answer."* If his answer is directionally right but has no real content — *"it initializes a git for my project to save commits"* — say so, give the precise version, and **record the vague answer plus the fact that it needed correcting.** Do not write it up as though he got it. Accepting "roughly right" as right is the fastest way to inflate this file into uselessness.

> ⚠️ **The single most valuable behaviour to protect:** Akeem volunteers when he doesn't understand — *"I didn't understand anything in test_get_tasks"*, *"I don't understand anything thats going on right now"*, *"I'm not sure"*. Each time, that sentence was the most useful thing in the session. When it comes, stop completely and rebuild from the ground up in plain language. Never respond with more explanation stacked on top.

---

## Carried forward from the Eisenhower Matrix project

Shipped 2026-08-05. Full history with detailed evidence lives in
`D:\Claude\eisenhower-matrix\learning\knowledge-graph.md` — worth reading before the first lesson.

**The honest summary: almost everything sat at `practicing`. Exactly one concept — `event-listeners` — ever reached `understood`.** He is competent and fast, not yet fluent. Treat prior knowledge as "has done this once with help," not "knows this."

| Area | Level | Notes that matter for this project |
|---|---|---|
| git, GitHub, `.gitignore` | practicing | Strong. Correctly predicted that adding an already-tracked file to `.gitignore` doesn't untrack it. Writes his own commit messages |
| HTML / CSS | practicing | Did a full from-scratch dark-theme redesign, writing every rule himself |
| DOM manipulation | practicing | `createElement`/`appendChild`. **Useful contrast for teaching React** — he knows the manual way well |
| event-listeners | **understood** | The only one. Self-diagnosed a handler-fires-immediately bug |
| JS functions, variable scope | practicing | Independently found and diagnosed a shared-variable bug across closures |
| fetch / promises | practicing | Understood `.then()` chaining after a real struggle; got there properly |
| Flask routes, REST, JSON | practicing | **Direct springboard to FastAPI** — lean on the comparison |
| SQL, schema design | practicing | Raw SQL only. Never used an ORM or migrations |
| pytest | practicing | ⚠️ Wrote correct passing tests he could not explain, and said so himself |
| Deployment (Render, gunicorn, `$PORT`) | practicing | Had forgotten gunicorn entirely by the final walkthrough |
| Data persistence | practicing | Experienced SQLite being wiped by Render restarts — **the concrete anchor for why Postgres needs its own home** |

**Known weak spots to watch for:**
- **Confuses GitHub / live / localhost URLs.** Three similar-looking things meaning different things. Cost several passes on the last README.
- **Correct code, absent understanding.** The failure mode to actively hunt for, since libraries make it easy.
- **Loses things between introduction and recall** (gunicorn). Spaced review matters.

---

## Checked during `/plan-journey`, 2026-08-06

### why-fastapi-not-django
- status: practicing
- depends-on: none
- introduced: 2026-08-06
- last-reviewed: 2026-08-06
- evidence: **he drove this reversal himself.** Spotted unprompted that the MVP needs no user accounts — *"I don't think this mvp really needs users"* — which removed Django's central advantage. On the check he gave the load-bearing reason correctly (*"because we don't need user accounts or schedule saving for now"*) but not the two supporting pieces: that Django's value is concentrated in auth, and that Django + React means learning DRF as a second framework. Both were supplied to him

### why-postgres-needs-its-own-home
- status: practicing
- depends-on: none
- introduced: 2026-08-06
- last-reviewed: 2026-08-06
- evidence: answered **"I'm not sure"** when first asked — honest, and consistent with earlier confusion (*"I'm so confused why are there three homes?"*). After being shown that SQLite is a *file his code opens* while Postgres is a *separate running program*, and that the matrix app's data loss on Render happened precisely because the SQLite file sat on the app's disposable disk, he passed the re-check cleanly in his own words: *"nothing happens to my course data, because it lives in a separate program, postgres won't even notice that the app restarted."* The struggle-then-pass sequence is the point; don't read the first answer as failure

### why-client-side-generation
- status: practicing
- depends-on: none
- introduced: 2026-08-06
- last-reviewed: 2026-08-06
- evidence: **the strongest answer of the session.** Fully unprompted, covering the reason, the tradeoff *and* the cost angle — Render's free tier can't generate multiple schedules at once under load, generation moves to the client's machine, the drawback is writing it in JavaScript rather than Python (which he explicitly accepted), and he doesn't want to pay for Render

### why-postgres-not-mysql
- status: introduced
- depends-on: why-postgres-needs-its-own-home
- introduced: 2026-08-06
- last-reviewed: 2026-08-06
- evidence: he returned to this three times, most likely because MySQL is simply more *famous* rather than for any technical reason. Explained to him: Postgres is stricter (rejects bad data rather than silently converting it), is the Python-ecosystem default so tutorials match, and has pgvector waiting for the deferred ML project. Settled by a hard fact — Supabase is Postgres-only. **Not yet explained back in his own words; good early review candidate**

### why-split-hosting
- status: introduced
- depends-on: none
- introduced: 2026-08-06
- last-reviewed: 2026-08-06
- evidence: chose the three-service split after all three arrangements were laid out, and explicitly rejected familiarity as a reason (*"I don't care if I'm familiar with render"*). The deciding argument was given to him rather than derived: CORS is one well-documented problem solved once, whereas serverless Python is a category of thinly-documented ones. **Not yet explained back; good early review candidate**

### data-pipeline-concept
- status: practicing
- depends-on: none
- introduced: 2026-08-06
- last-reviewed: 2026-08-06
- evidence: asked why this project needs a data pipeline when the matrix app didn't, answered correctly and unprompted — *"because the course data comes from AURAK and changes every semester, the seats also change frequently depending on how busy registration is."* The sharper framing (matrix-app data was **created by its users**; this data **belongs to someone else**, so the job is syncing a copy of a source you don't control) was supplied afterwards

---

## Section 1 — React foundations

### node-and-npm
- status: seed
- depends-on: none
- introduced: —
- last-reviewed: —
- evidence: —
<!-- Bridge: same relationship as pip and requirements.txt, which he already met -->

### vite
- status: seed
- depends-on: node-and-npm
- introduced: —
- last-reviewed: —
- evidence: —

### jsx
- status: seed
- depends-on: none
- introduced: —
- last-reviewed: —
- evidence: —

### react-components
- status: seed
- depends-on: jsx
- introduced: —
- last-reviewed: —
- evidence: —

### react-props
- status: seed
- depends-on: react-components
- introduced: —
- last-reviewed: —
- evidence: —

## Section 2 — The interactive shortlist

### react-state
- status: seed
- depends-on: react-components
- introduced: —
- last-reviewed: —
- evidence: —
<!-- The conceptual jump of the project: stop changing the page, start changing data.
     Contrast explicitly with his createElement/appendChild work -->

### event-handling-in-react
- status: seed
- depends-on: react-state
- introduced: —
- last-reviewed: —
- evidence: —
<!-- event-listeners is his one `understood` concept — build directly on it -->

### controlled-inputs
- status: seed
- depends-on: react-state
- introduced: —
- last-reviewed: —
- evidence: —

### rendering-lists
- status: seed
- depends-on: react-components
- introduced: —
- last-reviewed: —
- evidence: —

### derived-state
- status: seed
- depends-on: react-state
- introduced: —
- last-reviewed: —
- evidence: —

## Section 3 — The algorithm and the grid

### time-conflict-detection
- status: seed
- depends-on: none
- introduced: —
- last-reviewed: —
- evidence: —
<!-- ⭐ His home turf. Give room, don't scaffold. Naive version first, optimise second -->

### bitmask-representation
- status: seed
- depends-on: time-conflict-detection
- introduced: —
- last-reviewed: —
- evidence: —

### backtracking-with-pruning
- status: seed
- depends-on: time-conflict-detection
- introduced: —
- last-reviewed: —
- evidence: —

### result-capping
- status: seed
- depends-on: backtracking-with-pruning
- introduced: —
- last-reviewed: —
- evidence: —

### css-grid-layout
- status: seed
- depends-on: none
- introduced: —
- last-reviewed: —
- evidence: —
<!-- He built a 2×2 grid last project — same property, larger scale -->

## Section 4 — The parser

### http-requests-python
- status: seed
- depends-on: none
- introduced: —
- last-reviewed: —
- evidence: —

### html-parsing
- status: seed
- depends-on: http-requests-python
- introduced: —
- last-reviewed: —
- evidence: —

### data-cleaning
- status: seed
- depends-on: html-parsing
- introduced: —
- last-reviewed: —
- evidence: —

### multi-value-fields
- status: seed
- depends-on: data-cleaning
- introduced: —
- last-reviewed: —
- evidence: —
<!-- The Day/Time/Room field. Where nearly all parsing effort goes, and why Meeting is its own table -->

## Section 5 — The database

### postgres-server
- status: seed
- depends-on: why-postgres-needs-its-own-home
- introduced: —
- last-reviewed: —
- evidence: —

### connection-strings
- status: seed
- depends-on: postgres-server
- introduced: —
- last-reviewed: —
- evidence: —

### environment-secrets
- status: seed
- depends-on: connection-strings
- introduced: —
- last-reviewed: —
- evidence: —
<!-- 🔑 His first real secret. He has only ever used $PORT, which isn't sensitive -->

### sqlalchemy-models
- status: seed
- depends-on: postgres-server
- introduced: —
- last-reviewed: —
- evidence: —
<!-- New mental model: tables as Python classes. Connect to the raw SQL he already wrote -->

### orm-relationships
- status: seed
- depends-on: sqlalchemy-models
- introduced: —
- last-reviewed: —
- evidence: —

### alembic-migrations
- status: seed
- depends-on: sqlalchemy-models
- introduced: —
- last-reviewed: —
- evidence: —
<!-- Motivation: last project his schema-change process was "delete tasks.db and restart" -->

### idempotent-full-replace
- status: seed
- depends-on: sqlalchemy-models
- introduced: —
- last-reviewed: —
- evidence: —

## Section 6 — Connecting the halves

### fastapi-routes
- status: seed
- depends-on: none
- introduced: —
- last-reviewed: —
- evidence: —
<!-- Small jump from Flask routes, which he knows. Lean on the comparison -->

### pydantic-models
- status: seed
- depends-on: fastapi-routes
- introduced: —
- last-reviewed: —
- evidence: —
<!-- Replaces the hand-rolled `if "text" not in data` validation he wrote in Flask -->

### sqlalchemy-queries
- status: seed
- depends-on: sqlalchemy-models
- introduced: —
- last-reviewed: —
- evidence: —

### fetch-in-react
- status: seed
- depends-on: react-state
- introduced: —
- last-reviewed: —
- evidence: —

### useeffect
- status: seed
- depends-on: fetch-in-react
- introduced: —
- last-reviewed: —
- evidence: —
<!-- Warn about StrictMode double-invoking effects in dev BEFORE he sees it -->

### cors
- status: seed
- depends-on: why-split-hosting
- introduced: —
- last-reviewed: —
- evidence: —
<!-- Will be confusing. The error message doesn't say "you need CORS" -->

## Section 7 — Tests and safety rails

### pytest-recap
- status: seed
- depends-on: none
- introduced: —
- last-reviewed: —
- evidence: —
<!-- Recall, not new learning. `pytest` runs bare — PATH permanently fixed 2026-08-05 -->

### testing-a-parser
- status: seed
- depends-on: pytest-recap, html-parsing
- introduced: —
- last-reviewed: —
- evidence: —

### testing-the-algorithm
- status: seed
- depends-on: pytest-recap, backtracking-with-pruning
- introduced: —
- last-reviewed: —
- evidence: —

### fixtures
- status: seed
- depends-on: pytest-recap
- introduced: —
- last-reviewed: —
- evidence: —

## Section 8 — Going live

### github-actions
- status: seed
- depends-on: data-pipeline-concept
- introduced: —
- last-reviewed: —
- evidence: —

### yaml-workflows
- status: seed
- depends-on: github-actions
- introduced: —
- last-reviewed: —
- evidence: —

### scheduled-jobs
- status: seed
- depends-on: github-actions
- introduced: —
- last-reviewed: —
- evidence: —

### secrets-in-ci
- status: seed
- depends-on: github-actions, environment-secrets
- introduced: —
- last-reviewed: —
- evidence: —

### deploying-two-services
- status: seed
- depends-on: why-split-hosting
- introduced: —
- last-reviewed: —
- evidence: —

### custom-domain
- status: seed
- depends-on: deploying-two-services
- introduced: —
- last-reviewed: —
- evidence: —

## Section 9 — Wrapping the MVP

### mvp-review
- status: seed
- depends-on: none
- introduced: —
- last-reviewed: —
- evidence: —

### readme-portfolio-framing
- status: seed
- depends-on: mvp-review
- introduced: —
- last-reviewed: —
- evidence: —
<!-- Last time the recurring difficulty was confusing GitHub / live / localhost URLs -->

### disclaimer-and-unofficial-framing
- status: seed
- depends-on: none
- introduced: —
- last-reviewed: —
- evidence: —

### demo-practice
- status: seed
- depends-on: readme-portfolio-framing
- introduced: —
- last-reviewed: —
- evidence: —
