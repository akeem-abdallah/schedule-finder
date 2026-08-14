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
- last-reviewed: 2026-08-14
- evidence: asked why this project needs a data pipeline when the matrix app didn't, answered correctly and unprompted — *"because the course data comes from AURAK and changes every semester, the seats also change frequently depending on how busy registration is."* The sharper framing (matrix-app data was **created by its users**; this data **belongs to someone else**, so the job is syncing a copy of a source you don't control) was supplied afterwards. **2026-08-14 review, entering section 5:** asked why the fetch needs to rerun *automatically* rather than by hand, answered *"because AURAK can update their database, and during registration week it updates quite alot"* — graded as vague, not a pass: correctly re-derived why the *data* changes, but didn't address why the *fetching mechanism* has to be unattended. Corrected: a scheduled job removes the human from the loop, since "run it by hand" only works as long as someone remembers to, and this job needs to keep working long after nobody's thinking about it — which is also the motivation for idempotent-full-replace in section 6

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

### controlled-checkboxes
- status: practicing
- depends-on: controlled-inputs
- introduced: 2026-08-09
- last-reviewed: 2026-08-09
- evidence: built the section-picker checkbox list. First pass had several real mistakes at once — `customizingCourse.subjects` (wrong field name, should be `.sections`), no `key` on the mapped `<label>`, `onChange={}` (empty, invalid), and label text placed inside `<input>...</input>` (an `<input>` is a void element, can't wrap children). Corrected each once named individually, including recalling unprompted that `<input>` needed to self-close once told it was a void element like `<img>`. Correctly identified `key={s.section}` himself when asked to recall the pattern from his own `<option>` dropdowns rather than being told directly
<!-- Not in original section 3 concept list — added when the section picker became a task -->

### jsx-fragments
- status: practicing
- depends-on: rendering-lists
- introduced: 2026-08-09
- last-reviewed: 2026-08-11
- evidence: 🔴 real struggle. Wrote `{rows.map(...)} <div>...</div>` as two siblings inside plain `{}`, which isn't valid — `{}` in JSX is a single-value slot, not a multi-child container the way `<>...</>` is. My own instruction to "swap `{` for `<>`" was imprecise (there was no matching `}` to swap, a `</>` needed inserting), which contributed to a second break when he tried to apply it himself and deleted a brace the `.map()` call actually needed. Once both were fixed and explained precisely, he independently and correctly wrapped a new 3-sibling block (Back button, header, checkbox list) in `<>...</>` **without being told to** later in the same session — strong proactive-application evidence, not just following an instruction. **2026-08-11:** first use of explicit `<Fragment key={...}>` (imported from `react`) instead of the `<>` shorthand, needed for grouping a label + 7 placeholder cells per grid row where a `key` was required — applied correctly on the first attempt once the reason shorthand fragments can't take a `key` was explained
<!-- Not in original section 3 concept list -->

### array-reference-equality
- status: introduced
- depends-on: none
- introduced: 2026-08-09
- last-reviewed: 2026-08-09
- evidence: wrote `row.sections === []`, which is always `false` since `===` on arrays checks identity (same object in memory), not contents — `[]` on the right creates a brand-new array every time. Said *"idk"* when asked to predict the result rather than guessing. Given the real mechanism (identity vs. value comparison, contrasted with `.length === 0` which he'd already used correctly one line above) and correctly applied the fix on the first attempt afterward, including separately catching and fixing an inverted ternary branch order in the same line on his own once asked to trace both cases by hand. Capped at `introduced` since the mechanism was told, not self-derived — good candidate for a cold re-check
<!-- Not in original section 3 concept list -->

### array-membership-toggle
- status: practicing
- depends-on: immutable-array-updates
- introduced: 2026-08-09
- last-reviewed: 2026-08-09
- evidence: 🔴 hardest struggle of the session. First attempt at the checkbox toggle handler was a garbled, unparseable mix of `.find()`/`.filter()`/ternary with mismatched parens — immediately followed by *"idk what im doing"*, a full stop-and-rebuild. Rebuilt entirely in plain language with concrete array traces (`["1"]` + click "2" → `["1","2"]`; then click "1" → `["2"]`), including a genuine and well-reasoned tangent question about whether `checked` and the toggle logic could desync (answered by tying back to `controlled-inputs`: the array is the only source of truth for both, so they can't drift apart). After the rebuild, correctly and unprompted stated the rule himself: *"if the section is already in the array, filter it out. if its not in the array, add it in."* Translating to code, made one further mistake — wrote `{s.section}` (JSX-embedding habit) inside a plain array literal instead of the bare value — self-corrected once told the `{}` was building an invalid object, not embedding a value. Real, hard-won understanding by the end of a difficult stretch
<!-- Not in original section 3 concept list -->

### named-exports
- status: introduced
- depends-on: none
- introduced: 2026-08-09
- last-reviewed: 2026-08-09
- evidence: when `subjects` was pulled out of `App.jsx` into its own `data.js` (`export const subjects = [...]`), asked what would happen with `import subjects from './data'` (no braces) instead of the named-export form actually used. Answered *"idk"* — honest, no guess offered. Given the real mechanism: no-braces asks for the *default* export, `data.js` has none, so `subjects` comes back `undefined` and the first `.map()`/`.find()` on it crashes. Contrasted with `Course.jsx`'s `export default Course`, which is why that import has no braces. He then confirmed the app still ran correctly with the actual (correct) import, but that's behavioural confirmation, not an explanation in his own words — capped at `introduced`, good re-check candidate next session
<!-- Bridges to import { useState } from 'react' — same brace syntax, own file instead of a library -->

### time-conflict-detection
- status: practicing
- depends-on: none
- introduced: 2026-08-09
- last-reviewed: 2026-08-09
- evidence: pushed back on "home turf" framing (*"I only solved 15 neetcode questions"*), correctly — more scaffolding was used than the plan assumed. First attempt at the overlap logic was over-complicated (*"compare startA/startB, startA/endB, endA/startB, endA/endB"*). Guided to the "when do they NOT overlap" reframe, correctly derived both halves himself unprompted (`endA <= startB`, then the mirror `endB <= startA`). Said "yes" to understanding the OR→AND negation, but asked to explain it back, revealed real confusion (tried to negate the already-negated expression) — the "yes" was correctly not trusted. Rebuilt with concrete numbers (540–615 vs 660–735, etc.) instead of letters; then correctly predicted three real cases cold: a back-to-back non-conflict (touching boundaries, `615==615`), and after I over-compressed a same-day check into an ambiguous two-meeting example and he wrongly said "true", correctly predicted both a clean different-day non-conflict and a same-day conflict once the meetings were unambiguous. Confirmed both against the actual running function in the browser console. **Confirms the section 2 calibration prediction exactly:** his logic was right every time; every real mistake in the code itself was JavaScript syntax (`AND` instead of `&&`, missing `const` on four assignments) — named as such at the time
<!-- Predicted split (design correct, JS syntax the friction) held up in practice -->

### strict-mode-variable-declaration
- status: practicing
- depends-on: none
- introduced: 2026-08-09
- last-reviewed: 2026-08-09
- evidence: wrote `startA = timeToMinutes(...)` with no `const`/`let` — never hit this before because he's always declared his variables. Asked what happens on that line, described what `timeToMinutes` computes (correct but not the question) rather than the missing-declaration issue — a real gap, not a vague dodge. Explained: ES modules run in strict mode, so assigning to an undeclared name throws `ReferenceError`, not a silent global. He then correctly added `const` to all four lines unprompted alongside adding the missing `return true`/`return false` — a correct fill-in, evidence enough for `practicing` even though the *why* wasn't explained back in his own words
<!-- New leaf, not in original section 3 concept list -->

### bitmask-representation
- status: practicing
- depends-on: time-conflict-detection
- introduced: 2026-08-10
- last-reviewed: 2026-08-10
- evidence: 🔴 asked to build the optimised (bitmask) version directly instead of naive-then-optimise, reordering this ahead of the generator. First contact with bit mechanics was a real struggle — said *"I don't understand anything you just did"* after the initial explanation and needed a full stop-and-rebuild on a shrunk 8-slot example. After the rebuild, correctly wrote out 8 bits for "busy at slots 0 and 2" himself (`00000101`), and correctly explained `<<`/`|=` back in his own words (*"<< shifts the 1 left, |= merges it into the mask"*). Real code had several rounds of bugs — a stray pasted character breaking `setSlot` twice, loop-variable naming mismatches (`index` vs `i`) in `masksConflict`, and critically using `&&` (logical) instead of `&` (bitwise) for the actual conflict check, which he initially didn't self-correct even after one explanation and needed a second, concrete-numbers walkthrough (`5 && 2` vs `5 & 2`) before fixing it correctly. Full pipeline (`sectionToMask` + `masksConflict`) verified live against the known-correct `meetingsConflict` on two real cases, both predicted correctly beforehand. **Same-day follow-up, after the task was already closed:** said *"I still want to understand the whole mask thing"* — honest signal the first pass hadn't fully settled. Got genuinely confused conflating three unrelated numbers (the toy 8-bit example, `2^8=256`, and the real 32-bit width), needed that named explicitly as three separate facts with no formula connecting them. Struggled through several wrong manual computations of `70 & 31` (said 7, then 8, correct answer 6) before I just showed the binary directly — manual bit arithmetic itself was correctly deprioritized as "not an actual skill needed" once it became clear he was stuck on execution, not concept. Once shown, correctly and independently explained *why* `& 31` isolates a remainder (place-value argument, same as reading the last two decimal digits for mod 100) and *why 31 specifically* — "because 31 in binary is exactly five 1s." That second explanation is real, from-first-principles understanding, not pattern-matching — good evidence the concept is now solid, even though the same-day cap still applies
<!-- Reordered ahead of backtracking-with-pruning 2026-08-10 at Akeem's request -->

### classic-for-loops
- status: practicing
- depends-on: none
- introduced: 2026-08-10
- last-reviewed: 2026-08-11
- evidence: first `for (let i = 0; i < n; i++)` loops in the project — previously only used `.map()`/`.filter()`/`.find()`. Wrote the slot-setting loop in `sectionToMask` correctly by reusing an example shown a few messages earlier verbatim (didn't need it re-explained, just pointed back to it). The word-iteration loop in `masksConflict` had loop-variable naming bugs, fixed once each was named specifically. **2026-08-11:** correctly reused the same loop shape for `combineMasks` a day later, from a pointer back to `masksConflict` rather than a fresh explanation — real evidence the shape itself has stuck, though he still needed the loop *body* (`|` vs `&`) spelled out
<!-- New leaf, not in original section 3 concept list -->

### backtracking-with-pruning
- status: practicing
- depends-on: time-conflict-detection, bitmask-representation, classic-for-loops
- introduced: 2026-08-11
- last-reviewed: 2026-08-11
- evidence: 🔴 the flagged risk from the previous session materialised exactly as predicted — asked to trace `solve(0, ...)` for a real 2-course example, said *"I have no idea"*, confirming the earlier *"I understand recursion, don't worry"* had been a bare assertion, not real understanding. Full stop-and-rebuild: correctly traced `countdown(2)` by hand (*"2, 1, done"*) on the first try; then, given a `pairUp` example with a loop inside the recursive call, correctly predicted the result of adding a third `colors` option **and explained why** unprompted — *"pairup will fire 3 times for the colors option before base case and 2 times for the sizes option before the base case, so 3x2 = 6."* That's real, from-first-principles understanding of recursive fan-out, not pattern-matching. Applying it to the actual `generateSchedules`/`solve` function, made two real bugs: the base-case condition compared `courseIndex` to the array itself instead of `.length` (self-corrected once asked to trace `0 <= orderedLists.length` by hand), and tried to reassign a `const` with `results = {...chosenSoFar}` instead of `results.push(chosenSoFar)` — this one he said outright *"I don't understand"* rather than guessing, and needed the real reason explained (plain local variable vs. React state, why mutation is fine here but never for `rows`). After both fixes, the recursive search itself was correct on the first attempt. Verified against real, hand-computed data — correctly predicted 3 valid combinations out of 4 for a 2-course case and identified which pair conflicts, then confirmed live in the browser. **Same-day follow-up:** said *"I understand everything completely except generateSchedules... not completely"* — honest, precise self-assessment (correctly distinguished the helper functions from the whole assembled thing). Full call-by-call trace with the real C1/C2/P1/P2 example landed cleanly, but explaining *what `accumulatedMask` represents* took two imprecise passes (*"different accumulated masks"*, then *"the masks that weren't conflicting so far"*) before correctly settling on it as an actual occupancy picture per search path, not a record of a passed check
<!-- Recursion itself has no separate leaf — folded into this one, since it's the concept the plan named for this piece -->

### result-capping
- status: seed — **decision reversed 2026-08-10, see plan.md section 3.** Akeem chose no cap after the tradeoff was explained twice; this concept may not get built at all unless testing surfaces a real freeze. Leaving at `seed` rather than deleting, in case it's revisited
- depends-on: backtracking-with-pruning
- introduced: —
- last-reviewed: —
- evidence: —

### bounded-index-navigation
- status: practicing
- depends-on: react-state
- introduced: 2026-08-11
- last-reviewed: 2026-08-11
- evidence: built the pagination logic (`setIndex`) unprompted, ahead of where the lesson had gotten to. First version checked bounds against `currentIndex` itself (`currentIndex > 0 && currentIndex < results.length - 1`) rather than where the *new* index would land — meant movement got blocked entirely at both ends instead of only in the direction that would go out of range. Correctly self-diagnosed the symptom in his own words (*"it wont be incremented, and wont be decremented when the index is equal to results.length - 1"*) once asked to test it at the boundary, then correctly rewrote it to compute `newIndex` first and check that instead, after the shape was described rather than given verbatim. Also caught and fixed his own Next/Previous button mislabeling (wired to the wrong direction) without being told which one was wrong, just that something was
<!-- New leaf, not in original section 3 concept list -->

### arrow-function-object-literal
- status: introduced
- depends-on: none
- introduced: 2026-08-11
- last-reviewed: 2026-08-11
- evidence: wrote `eligible.map((s) => {...s, courseCode: ...})`, which JS parses as a function *body* (a block of statements) because it starts with `{`, not as the object literal he intended — a real, common gotcha. Told directly that returning an object literal from a concise arrow function needs to be wrapped in parentheses (`=> ({...})`) to disambiguate it from a block, and applied the fix correctly on the first attempt. Capped at `introduced` since the mechanism was told, not self-derived
<!-- New leaf, not in original section 3 concept list -->

### explicit-grid-item-placement
- status: practicing
- depends-on: css-grid-layout
- introduced: 2026-08-11
- last-reviewed: 2026-08-11
- evidence: computed real CSS Grid placement math himself from a plain-language description — `gridColumn`/`gridRowStart` from `.indexOf() + 2` (skipping the header row/column), `durationHours` via `Math.ceil()` on a time difference so a class doesn't get cut short. Genuinely stuck on the first of these (*"idk what im doing"*), recovered with a fully concrete numeric walkthrough (`timeToMinutes("10:15")` → `615`, `Math.floor(615/60)` → `10`) rather than more abstract explanation, then completed the remaining three formulas independently. Separately hit a real CSS Grid auto-placement bug — spanning class blocks (explicitly positioned) were knocking auto-placed hour labels out of position, since auto-placement skips cells already claimed by explicit items regardless of DOM order. Understood the explanation and confirmed the fix (giving every background cell an explicit position too) worked by checking the browser, though the fix itself was written by the agent given the session's length at that point. **Follow-up same day:** independently applied the *outer* `.map()` index (`sectionIndex`, distinct from the inner meetings loop) to look up a stable color per section — `SECTION_COLORS[sectionIndex % SECTION_COLORS.length]` — written correctly on the first attempt once the idea (same section index across multiple meetings gives the same color) was described, without needing the exact expression given. **Task 3.8, generalizing the technique to finer granularity:** switching the grid from hourly to 15-minute rows, correctly wrote `startSlot`/`durationSlots`/`gridRowStart` (the exact-precision replacements for the earlier hour-rounded versions) entirely independently from a plain-language description, and correctly predicted a 75-minute class would span exactly 5 slots rather than overshooting to the next hour. Only missed wiring the final computed variables into the `gridRow` template string, which was named and fixed in one pass. **Task 3.9, dynamic sizing:** correctly diagnosed himself (unprompted) that both `1fr` columns and `1fr` rows would stretch to fill a fixed container size rather than shrinking with fewer tracks, and that the fix was the same one twice — fixed pixel sizes plus `width/height: fit-content`. Also caught, on his own, that "only show days with a class" reads as a bug (a day missing from the middle of the week), correcting the design to a baseline range instead. Real recurring syntax slips doing the actual computation — a nested `timeToMinutes(timeToMinutes(...))` call that would have crashed (passing a number where a string was expected), a missing `Math.` prefix on `floor`/`ceil`, and using the `activeHours` array where the single `startHour` number was needed — each caught and fixed in one pass once named specifically
<!-- New leaf, not in original section 3 concept list -->
<!-- New leaf, not in original section 3 concept list -->

### js-truthy-falsy
- status: practicing
- depends-on: none
- introduced: 2026-08-11
- last-reviewed: 2026-08-11
- evidence: found a real, self-reported bug — an empty results array (`[]`, when no valid schedule could be generated) still passed a plain `results ? (...)` truthiness check, showing the grid branch with no actual data and crashing to a blank page. Said *"idk"* honestly when asked whether `[]` is truthy or falsy, rather than guessing. Given the real rule (only `false, 0, "", null, undefined, NaN` are falsy — everything else, including empty arrays/objects, is truthy), correctly identified `results.length === 0` as the distinguishing check, and independently reasoned that it needed combining with a null-check first (same short-circuit `&&` pattern as `rowCourse && (...)`) to avoid crashing on `null.length`. Ultimately solved it more cleanly than the guided direction — checking emptiness once in `handleSubmit` and branching to `setError` there, instead of adding a whole new render branch
<!-- New leaf, not in original section 3 concept list -->

### array-slice
- status: practicing
- depends-on: none
- introduced: 2026-08-11
- last-reviewed: 2026-08-11
- evidence: first use of `.slice()` in the project. Given a concrete trace (Mon at index 0, Thu at index 3, `DAYS.slice(0, 4)` → `["Mon","Tue","Wed","Thu"]`, explicitly naming why the second argument is `lastIndex + 1` rather than `lastIndex` since slice's end is exclusive), correctly wrote `DAYS.slice(firstIndex, lastIndex + 1)` on the first attempt
<!-- New leaf, not in original section 3 concept list -->

### css-grid-layout
- status: practicing
- depends-on: none
- introduced: 2026-08-11
- last-reviewed: 2026-08-11
- evidence: correctly derived `grid-template-columns: 60px repeat(7, 1fr)` and the row equivalent from a plain-language description of 8 columns/13 rows, after correctly working out the 8×13 dimension itself (initially said 7×12, self-corrected once asked where day names and hour labels would go). One real slip: wrote `repeat(13, 1fr)` for rows, double-counting the header row that was already the separate `40px` — self-corrected once it was traced through. Struggled genuinely on the nested-`.map()` JSX (said "I don't get it" on the day-header map, needed a direct side-by-side comparison to the `<option>` pattern he already knew), and made a real content bug in the placeholder cells (rendered `{day}` in every cell instead of leaving them empty) — self-corrected once named. First real use of `Fragment` with an explicit `key` (vs. the `<>` shorthand, which can't take props) for grouping a label + 7 placeholder cells per row. Also drove a genuine design refinement himself — asked for the hour labels to sit at the top of their row like a real calendar app rather than centered, correctly predicting/confirming the fix (`align-items: start`) worked by checking the browser. **Follow-up styling pass, same day:** flagged real UX problems himself (rows too compact, labels visually detached from their lines) — root cause was no explicit `height` on the grid, so `1fr` rows had no real space to divide, which was explained and fixed by him (`height: 600px`). That fix then caused a genuine regression (`align-items: start` shrinking each cell to its own content, breaking row-height consistency and producing a double-line effect) — he removed it correctly once the mechanism was traced through, and separately diagnosed (with a screenshot) that double-digit hour labels were wrapping because the label column was too narrow, correctly identifying that padding was the wrong fix and a wider column was the right one. **3.7 wiring pass:** diagnosed unprompted why pagination buttons were stacking vertically (a block-level `<p>` breaking the flex flow), and independently applied `justify-content: center` (no explanation needed) once told it was the property for horizontal centering in a flex container
<!-- He built a 2×2 grid last project — same property, larger scale -->

## Section 4 — Styling and responsiveness
<!-- Renamed from "Usable on a phone" on 2026-08-14, retroactively — see plan.md section 4 for why -->
<!-- ⚠️ Read the cap levels here carefully. A large volume of CSS shipped, but most values were measured by the agent and handed over to type, which rule 1 says is not evidence. Only slot-granularity-must-divide-the-data reaches `practicing`, and that one is his outright. -->



### static-build-deployment
- status: introduced
- depends-on: why-client-side-generation
- introduced: 2026-08-11
- last-reviewed: 2026-08-11
- evidence: asked to predict what clicking Vercel's Deploy button would do, answered *"It's gonna run my react on vercel"* — graded as wrong, not vague: conflated deploying a static frontend with running a live server process (the mental model that's correct for his Flask app on Render, not for this). Corrected with the real mechanism: Vercel runs `npm install` + `vite build`, which compiles JSX/JS into plain static HTML/CSS/JS files, then serves those files with no Node process running per-request — same as handing it a folder of plain HTML. Not yet restated in his own words; good re-check candidate once section 6/9 make the FastAPI contrast concrete (a backend that *does* stay running)
<!-- New leaf, not in original section 4 concept list -->

### slot-granularity-must-divide-the-data
- status: practicing
- depends-on: bitmask-representation, explicit-grid-item-placement
- introduced: 2026-08-14
- last-reviewed: 2026-08-14
- evidence: ⭐ **the strongest independent catch of the whole project so far, and it came from him unprompted.** After the grid was already "finished" and deployed, he said: *"the shortest is 50 minutes, so tell me what you think, I think that also means its incompatible for desktop."* Both halves correct. 50 minutes is not divisible by the 15-minute slot size the whole system was built on (chosen back in 3.4 from AURAK's live page), so `durationSlots` evaluated to `3.333`. Two distinct failures followed, and he had predicted the second: `grid-row: span 3.3333` is **rejected outright** by CSS (verified live — computes to `auto`), so the block collapsed to one row *and* fell to grid auto-placement, landing at the wrong time; and `timeToSlot` truncated the same fraction inside the conflict mask, over-claiming ~10 minutes and **silently discarding valid schedules with no visible symptom at all**. Fix (5-minute slots throughout: `SLOTS_PER_DAY` 48 → 156, `MASK_WORDS` 11 → 35, `/ 15` → `/ 5`) was worked out with the agent, and the arithmetic for `MASK_WORDS` was supplied rather than derived by him — so `practicing`, not higher. **What is unambiguously his: noticing that a real-world data property silently invalidated a design decision made three sections earlier, and reasoning correctly about its blast radius before any code was looked at.** Worth quizzing cold later: *why is 5 the right slot size and not 10?* (50 and 75 both divide by 5; 75 does not divide by 10.)
<!-- New leaf. The general lesson: your discretisation has to divide every value your real data can take -->

### responsive-design
- status: introduced
- depends-on: css-grid-layout
- introduced: 2026-08-14
- last-reviewed: 2026-08-14
- evidence: ⚠️ **cap deliberately low despite a large volume of shipped CSS.** Two breakpoints (640px / 480px) now drive a full mobile layout across all three views, but essentially every value was derived by the *agent* measuring the live DOM and handed to him to type — that is explicitly not evidence under rule 1. He wrote every line and drove every design decision, but never derived a breakpoint or predicted a layout outcome himself. What *is* his: consistently accurate visual QA against a real iPhone 15 Pro Max, repeatedly catching real defects the agent had missed or mis-verified — misaligned gutter labels (*"the labels on phone resolution (10 AM, 11 AM, 12 PM) are not aligned with the other hours"*), unequal spacing between `EDIT`/`ALL`/`×`, and a `×` that had drifted off the footer's edge. He also correctly rejected an over-complicated fix — *"I feel like you're overcomplicating it, I really feel like its just one change"* — and he was right; the answer was a single `margin-left`. **Good first quiz when section 4 is revisited: what does `minmax(0, 1fr)` do that plain `1fr` doesn't, and why does it matter here?** (He has never been asked to explain this, though it is load-bearing in his grid.)

### css-custom-properties
- status: introduced
- depends-on: none
- introduced: 2026-08-14
- last-reviewed: 2026-08-14
- evidence: the `--gutter-w` / `--day-w` / `--slot-h` / `--hue` variables and the whole Amber token block are now central to how the app is styled and themed. Mechanism explained to him, not derived: that `var(--x, fallback)` lets an **inline JSX style string** read a value the **stylesheet** decides, which is what makes the grid respond to a media query without React re-rendering or any width in state. He applied it correctly on the first attempt each time. No explain-back check was done, so `introduced`. ⚠️ This is genuinely worth re-teaching properly rather than leaving as told-once — it is the mechanism the entire responsive grid rests on

### settimeout-and-cleanup
- status: introduced
- depends-on: react-state
- introduced: 2026-08-14
- last-reviewed: 2026-08-14
- evidence: his first timer, delivered as part of the toast. The `useEffect` + `setTimeout` + `return () => clearTimeout(timer)` block was written by the agent and typed by him — no prediction or derivation, so `introduced` only. Two mechanisms were explained and are worth cold-checking later: **why the cleanup exists** (without it an old timer survives and can clear a *newer* error early), and **why the effect depends on `[error, errorId]` rather than `[error]`** — React bails out of a re-render when `setError` is called with an identical string, so re-clicking GENERATE on the same validation failure would not restart the timer and the toast would vanish early. Verified live: toast still showing 5.7s after the first click, dismissed ~5s after the second. ⚠️ The plan flags this as the concept that buys `useeffect` early at a discount for section 7 — that payoff is only real if it gets re-taught there rather than assumed

### rules-of-hooks
- status: introduced
- depends-on: settimeout-and-cleanup
- introduced: 2026-08-14
- last-reviewed: 2026-08-14
- evidence: 🔴 real, instructive failure. He placed the `useEffect` **inside `handleSubmit`**, in the `else` branch after `generateSchedules` — so it only executed on a valid submit. Symptom was confirmed live rather than asserted: console threw `Invalid hook call. Hooks can only be called inside of the body of a function component`, and the app **stayed stuck on view 1** because the throw happened before `setResults` ran, making GENERATE silently do nothing. Mechanism was explained, not self-derived: React identifies hooks purely by **call order** (first `useState` is slot 0, second slot 1, …), which only works if every render calls the same hooks in the same sequence — so a hook inside an `if`, a loop, or an event handler breaks the mapping. Also explained: `useEffect` is a *declaration* evaluated every render, not a step you run inside a handler, which is why it belongs beside the `useState` calls. Fixed correctly on the first attempt once told. Capped at `introduced`, and this one should be **re-checked cold in section 7** before `useEffect` is used for fetching

### toast-notifications
- status: introduced
- depends-on: settimeout-and-cleanup
- introduced: 2026-08-14
- last-reviewed: 2026-08-14
- evidence: replaced the inline `.error` row with a fixed-position toast — desktop top-right, phone bottom full-width, auto-dismiss plus a manual `×`. Design direction was entirely his across several rounds (*"I don't like how the size and it looks weird on phone, I want it to be professional"*, then *"maybe a bit more obvious? I feel like they're so small"*), and he correctly judged the final 13px against the surrounding type. Implementation values were supplied. One genuine agent error he was told about rather than discovering: the mobile override was never actually written into the file on the first pass, so the phone rendered the desktop variant — found by grep, not by reasoning

### deferred-rendering
- status: seed — **not built. Moved to v1.1** on 2026-08-14 at Akeem's call
- depends-on: settimeout-and-cleanup
- introduced: —
- last-reviewed: —
- evidence: —
<!-- ⚠️ Still the only thing distinguishing "thinking" from "broken", since Akeem declined the result cap in section 3 -->

### event-listener-cleanup
- status: seed — **not built. Moved to v1.1** on 2026-08-14 with arrow-key paging
- depends-on: settimeout-and-cleanup
- introduced: —
- last-reviewed: —
- evidence: — ⚠️ Briefly believed complete on 2026-08-14; checked against the source and it was not — `src/` contains no `keydown`, `addEventListener`, or arrow-key handling, and no commit references it. Most likely confused with the `‹ ›` pager **buttons** (click handlers, section 3.7). Worth naming the distinction when it is built: a click handler is attached by React to one element and cleaned up automatically when that element unmounts; a `window` listener is attached by *you* and outlives the component unless *you* remove it — which is the whole reason it pairs with the toast's `clearTimeout`

### typographic-alignment
- status: introduced
- depends-on: none
- introduced: 2026-08-14
- last-reviewed: 2026-08-14
- evidence: emerged from him repeatedly rejecting alignments that measured "correct" but looked wrong — *"the edit label is a little higher than the section label on its right"*, *"the X buttons are lower than the sec on its left"*, and finally *"make them exactly aligned, not even 0.5px difference."* Each was a genuine defect and each had a different cause, which is what makes this worth a leaf: boxes centred perfectly while **baselines** differed (mixed 9px/12px text); a glyph centred in its box while the *box* was flush and the **ink** was not (the `×` sitting 15.7px short of the footer edge); and a label overflowing its content box so `text-align: right` silently stopped holding the edge (`10 AM` needing 32.2px in a 30px box). Mechanisms were explained, not derived — so `introduced`. **The limit he should be able to state back:** two texts of different sizes cannot share both a baseline and an ink centre; the residual is exactly half the cap-height difference, so you pick one anchor (baseline for text-to-text, ink centre for symbol-to-text) rather than chasing zero on both

## Section 5 — The parser

### python-venv
- status: practicing
- depends-on: none
- introduced: 2026-08-14
- last-reviewed: 2026-08-14
- evidence: had only ever `pip install`ed globally before. Correctly predicted, before running, how he'd know activation worked (*"it shows (venv)"*) — confirmed against the real terminal output. Ran `python -m venv venv` and the activation two-liner himself. When asked why `requirements.txt` matters beyond "remembering what I installed," said *"idk"* honestly rather than guessing; given the real reason (reproducible environment elsewhere, exact pinned versions, same relationship as `package.json`/`package-lock.json` he already knows)
<!-- New leaf, not in original section 5 concept list -->

### html-parsing
- status: practicing
- depends-on: none
- introduced: 2026-08-14
- last-reviewed: 2026-08-14
- evidence: bridged to `document.getElementById`/DOM tree navigation (already `practicing`) — same idea, static text instead of a live browser DOM. Correctly predicted `table is not None` would be `True`, though only answered the "what" half of a two-part question, not the "why check `is not None`" half (supplied: a clean boolean instead of a giant HTML dump or a silent `None`). Predicted `len(rows)` at "around 400" — real count came back 421, both from his own script's `print()` and independently confirmed against AURAK's own page UI, which is a real signal the parse is correct, not just non-empty. Skipped predict-before-run on the `get_text()`/`repr()` step (ran straight away), but correctly identified both messy fields on inspection afterward. His explanation for *why* was incomplete — *"because the \\n's are end lines"* restates what the character is, not why it's there — corrected: the seats field is sloppy whitespace formatting (needs `.strip()`), the Day/Time/Room field is a genuinely different problem, multiple `<span>` meetings concatenated by `.get_text()`, which is real structure, not noise
<!-- The real row count (421) is meaningfully lower than project.md's original ~700 estimate from 2026-08-06 — worth a docs update once section 5 has clean data, not a bug -->

### http-requests-python
- status: practicing
- depends-on: none
- introduced: 2026-08-14
- last-reviewed: 2026-08-14
- evidence: bridged to `fetch()` (JS, already `practicing`) once told the two are the same idea — send a request, get an object back. First prediction of `response.status_code` on success was wrong (*"uhhh 500?"*, which is a server error code) despite having returned status codes himself from Flask routes last project — the knowledge didn't transfer unprompted. Corrected (200 = success, 400s = client error, 500s = server error) and got the real 200 back when he ran it. Wrote the fetch + file-write code himself from a plain-language description of `open()`/`with`/`"w"` mode, ran it, and correctly identified the saved file as "thousands of lines" of real HTML. Capped at `practicing`, not higher — the wrong status-code prediction is real evidence the mental model isn't fully connected yet, good re-check candidate

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

## Section 6 — The database

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

## Section 7 — Connecting the halves

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
- status: introduced — ⚠️ **met early, in section 4, not here**
- depends-on: fetch-in-react
- introduced: 2026-08-14 (section 4, toast timer)
- last-reviewed: 2026-08-14
- evidence: first contact came early and by side door — the toast's auto-dismiss timer, not data fetching. He wrote it from a supplied block, and immediately hit a **Rules of Hooks** violation by placing it inside `handleSubmit` (see [[rules-of-hooks]]), which threw and left GENERATE silently doing nothing. What he has seen: an effect as a *declaration* re-evaluated each render, the dependency array, and the cleanup function. **What he has NOT seen, and section 7 still owns in full:** effects for fetching, the async/`await` shape inside one, loading and error states, and — critically — **StrictMode double-invoking effects in dev**, which `main.jsx` already wraps his app in. ⚠️ **Do not treat this as pre-taught.** The plan's bet was that section 4's `setTimeout` buys `useEffect` "at a discount"; the discount is real but small, and section 7 should re-teach from the dependency array up rather than assume it
<!-- Warn about StrictMode double-invoking effects in dev BEFORE he sees it -->
<!-- Status raised from seed 2026-08-14: he used it in section 4 for the toast. Fetching remains untouched -->
<!-- ⚠️ Being at `introduced` here means "has typed one", NOT "has understood effects" -->

### cors
- status: seed
- depends-on: why-split-hosting
- introduced: —
- last-reviewed: —
- evidence: —
<!-- Will be confusing. The error message doesn't say "you need CORS" -->

## Section 8 — Tests and safety rails

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

## Section 9 — Going live

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

## Section 10 — Wrapping the MVP

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
