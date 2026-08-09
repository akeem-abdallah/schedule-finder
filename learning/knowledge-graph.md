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
- status: practicing
- depends-on: none
- introduced: 2026-08-07
- last-reviewed: 2026-08-07
- evidence: correctly predicted `node_modules/` would appear after `npm install`. On the quiz "difference between `package.json` and `node_modules/`" he answered cleanly and unprompted: *"package.json is what I asked for, node_modules is what actually got installed"* — a clean pass, no correction needed
<!-- Bridge: same relationship as pip and requirements.txt, which he already met -->

### vite
- status: introduced
- depends-on: node-and-npm
- introduced: 2026-08-07
- last-reviewed: 2026-08-07
- evidence: scaffolded the project and ran the dev server himself, noticed and accepted the port-5173-not-5000 difference without confusion. No explicit explain-back check was done on Vite itself, so capped at `introduced`

### jsx
- status: practicing
- depends-on: none
- introduced: 2026-08-07
- last-reviewed: 2026-08-07
- evidence: wrote a hardcoded `<h1>` + `<ul>`/`<li>` list from a plain-language spec (no skeleton given). Self-corrected a real JSX mistake unprompted — wrapped his title in stray quote marks, saw them render literally, and fixed it himself: *"quotes because I removed them"*

### react-components
- status: practicing
- depends-on: jsx
- introduced: 2026-08-07
- last-reviewed: 2026-08-07
- evidence: first attempt at `Course.jsx` was an empty stub — said plainly *"Idk how to make the function"*. Given a parallel example (a `Greeting` component, not the answer itself), he adapted it correctly, then on his own follow-up fixed a missing `export default` and a missing closing brace without being told exactly what was wrong, just that something was missing. Also caught himself that list items inside a `<ul>` should be `<li>` not `<p>` once it was named

### react-props
- status: practicing
- depends-on: react-components
- introduced: 2026-08-07
- last-reviewed: 2026-08-07
- evidence: 🔴 first answer to "what's a prop?" was wrong — *"its like self from python"* (confused an object's own reference with data passed in from outside) — corrected with the function-argument comparison. Second attempt, *"It's a placeholder for data from the outside"*, was graded as vague, not a pass: "placeholder" implies something unfilled, when a prop is the actual value already flowing in. Precise version was given directly. Real first-contact struggle, correctly capped at `practicing` — good early review candidate

## Section 2 — The interactive shortlist

### react-state
- status: practicing
- depends-on: react-components
- introduced: 2026-08-07
- last-reviewed: 2026-08-07
- evidence: initially asked to stop and rebuild from scratch (*"start from useState, I didn't even understand that yet"*). After a plain-variable-vs-state contrast, correctly predicted unprompted: *"it would set selectedSubject to CMP and re-render the page"*. Also correctly reasoned that `useState("")` sets the starting value only, changed later only via the setter

### event-handling-in-react
- status: practicing
- depends-on: react-state
- introduced: 2026-08-07
- last-reviewed: 2026-08-07
- evidence: bridged to `addEventListener` (his one `understood` concept from project #1) mostly unprompted, though first framing was slightly off — *"setSelectedSubject is technically the listener"* (corrected: the arrow function passed to `onChange` is the listener; `setSelectedSubject` is what it calls inside). Pushed hard past the surface explanation of `key` all the way to asking for React's actual reconciliation mechanism, rejected a pseudocode answer explicitly (*"why pseudocode? please, you're sonnet 5"*), and confirmed only once given the real `Map`-based mechanism

### controlled-inputs
- status: practicing
- depends-on: react-state
- introduced: 2026-08-07
- last-reviewed: 2026-08-07
- evidence: struggled initially or the `value={selectedSubject}` half (*"I don't get it"*), then correctly predicted the dropdown would show MATH selected if state held "MATH". Correctly concluded unprompted that `selectedSubject` "isn't related to the DOM... it's a separate variable" — the core of what makes it a controlled input

### rendering-lists
- status: practicing
- depends-on: react-components
- introduced: 2026-08-07
- last-reviewed: 2026-08-07
- evidence: correctly predicted `.map()` over `subjects` would render all three as options, confirmed in the browser. Wanted much deeper-than-usual grounding on `key` — rejected a surface analogy and a pseudocode explanation in turn, only satisfied once shown React's real `Map.get()`/`.delete()` based reconciliation. Note for future sessions: he wants the actual mechanism, not a simplified stand-in, once he pushes back a second time. 2026-08-08: hit a real "adjacent JSX elements" error returning two `<select>`s with no wrapper inside a `.map()`; didn't recall the one-root-element rule unprompted (said "idk"), but once reminded, fixed it himself and correctly placed `key` on the new wrapping element

### derived-state
- status: practicing
- depends-on: react-state
- introduced: 2026-08-07
- last-reviewed: 2026-08-07
- evidence: 🔴 hard first contact. Answered *"Idk"* on why deriving beats storing, then twice proposed storing the course list as its own `useState` (*"cant we just make a new const [selectedCode, setSelectedCodes]"*, then *"make a new state to update the dropdown"*), then stopped the lesson entirely — *"I dont understand ANYTHING that happened in 2.3, genuinely."* Rebuilt from zero via a paper-scanning analogy, after which he correctly described the two-step search, chose deriving over storing once the drift problem was made concrete, and predicted `.find()` returning `undefined` on no match plus the resulting crash on `.courses`. Real struggle-then-recover; the understanding is his, but it needed a full teardown to get there

### stale-state-on-dependent-change
- status: practicing
- depends-on: react-state, derived-state
- introduced: 2026-08-07
- last-reviewed: 2026-08-07
- evidence: predicted the course dropdown would visually reset when switching subjects (correct), but a debug line revealed `selectedCode` was still `"104"` underneath — the display was blank only because no matching option existed. Once shown the gap, he named the fix himself unprompted: *"call setSelectedCode("") in there too"*. Also hit and fixed a real JS syntax error on the way — an arrow function with two statements needs its own `{ }` body
<!-- The bug class: a state variable silently outliving the thing it depended on -->

### immutable-array-updates
- status: practicing
- depends-on: react-state
- introduced: 2026-08-08
- last-reviewed: 2026-08-08
- evidence: introduced when the shortlist design changed (Akeem's request) from two standalone variables to an array of row objects. Initially misdescribed `setRows` as selectively patching changed rows — corrected to "total replace, never selective." Once corrected, correctly hand-traced the spread+computed-key expression for a worked example (`{ id: 1, subject: "MATH", code: "" }`), and correctly identified the ternary's bare `: row` branch as "hand back this row unchanged" after one nudge. Also correctly reasoned, unprompted, that `key={row.id}` belongs on the wrapping `<div>` "because it's the div that repeats, not the selects individually" — direct application of the `key` mechanism from 2.3. Immediately after the task was marked done, said plainly *"I honestly didn't understand anything in rows.map((row) => {"* — a full second teardown was needed, rebuilding `.map()`'s single-execution behavior, the `{ }`-requires-`return` rule, and closures (why each row's `onChange` remembers its own `row`) from scratch. He didn't recall closures from project #1 unprompted. Real understanding by the end, but it took two full passes on the same day. 2026-08-08: extended to `.filter()` (correctly inferred "keep only if true, throw away if false" from a worked example) and `[...rows, newThing]` for appending. **Found and correctly diagnosed a real bug independently** — `Math.max()` called on an empty array returns `-Infinity`, causing every row added after emptying the list to collide on the same id (*"I found a bug... I'm guessing the id is the same for all of them"* — correct guess, before any explanation). Also live-verified the `key` mechanism from 2.3's trace actually holding in his own running app: added 3 differently-configured rows, removed the middle one, and confirmed the other two kept their own correct selections — though his own prediction beforehand was wrong (guessed all three would be deleted). Also correctly predicted and diagnosed a stale-closure bug from calling `updateRow` twice in one handler (both calls read the same unchanged `rows`, so the second call's result silently wins and drops the first). By end of session, explicitly said *"looking at all this syntax is genuinely messing up my brain"* — spread (`...`) specifically, across its three forms used today (object copy, array-to-arguments, object-merge), was the piece that didn't land. Correctly capped at `practicing`, not downgraded further since this is same-day first contact, not a failed review. Good candidate for the next spaced-review check, and worth re-approaching spread as its own isolated mini-lesson before piling more onto it. **2026-08-09, next-day review:** asked to explain `...` cold, first answer was still vague ("it makes a copy out of something") — corrected to the real mechanism (spread contents out individually; copying is a side effect in one of three cases, not the definition). After that correction, correctly predicted all three isolated examples (object spread, `Math.max(...[3,7,2])` → 7, and a double-spread merge result) without further help, then independently applied it for real — refactored `updateRow(id, field, value)` into `updateRow(id, changes)` using `{ ...row, ...changes }`, updated both call sites correctly, and confirmed the subject-change-resets-code bug from yesterday was actually fixed. Real forward progress, but the first-recall vagueness means still `practicing`, not `understood` yet — check cold again after a longer gap
<!-- New leaf not in the original plan — added when the browse-then-shortlist design became N editable dropdown rows -->

### form-validation-with-array-methods
- status: practicing
- depends-on: rendering-lists
- introduced: 2026-08-09
- last-reviewed: 2026-08-09
- evidence: correctly inferred `.some()`'s behavior from naming pattern alone, unprompted ("checks if at least one item matches"). For duplicate-detection, went straight to the right algorithm in plain DSA terms before any code — *"use a hash set to track seen ones"* — then correctly predicted `new Set([...]).size` for a hand-worked example (2 unique out of 3). Wrote the full `hasDuplicates` check and wired it into `handleSubmit` as a new `else if` branch independently, correctly placed `combos`/`hasDuplicates` as derived values outside the function (same pattern as `courses`). Fastest, cleanest first-contact of the session — direct payoff of his DSA background. Also added a fourth validation case unprompted (submitting with zero rows), correctly predicted its behavior, and independently spotted the repeated `setSubmitted(null)` across three branches, proposing the fix himself (set it once up top, only override on success)
<!-- Not in the original plan.md concept list for section 2 — added when Akeem asked for duplicate-course validation on Submit -->

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
