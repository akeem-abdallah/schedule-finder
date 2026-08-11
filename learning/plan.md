# Learning plan: AURAK Schedule Finder

> **Read `learning/project.md` first** — it holds who Akeem is, his honest level, and how he wants to work. This file is the route; that one is the driver's manual.
>
> Sections carry **notes for the lesson**: traps, sequencing, and what to check understanding on. They are *not* task breakdowns — `/next-lesson` breaks one section into tasks when it reaches it, and not before.

---

## Locked decisions

| Decision | Choice | One-line reason |
|---|---|---|
| Frontend | **React** on **Vercel** | The planned next step after deliberately learning plain JS/DOM first |
| Backend | **FastAPI** + SQLAlchemy + Alembic on **Render** | No user accounts needed → Django's main advantage vanished; one framework instead of Django + DRF |
| Database | **PostgreSQL** on **Supabase** | Stricter than MySQL, Python-ecosystem default, pgvector for the later ML project. Supabase because a friend uses it and can help |
| Scheduled refresh | **GitHub Actions**, daily | No daily cron cap (Vercel has one), and it doubles as the Supabase keep-alive |
| Generation | **Client-side, in the browser** | CPU-bound; Render's free tier would queue during registration week — the only week anyone uses it |
| Domain | `aurak-scheduler.com` *(optional)* | ~$10–15/yr. Adoption depends on students sharing a link that looks trustworthy |

### 🚫 Do not suggest these — they were considered and rejected with reasons

- **Django** — rejected once Akeem noticed the MVP needs no accounts
- **Laravel / PHP** — transfers to nothing on his AI/ML path
- **MySQL** — Supabase is Postgres-only; the combination doesn't exist
- **Neon** — better free tier, but Supabase won on "a friend can help me"
- **Server-side generation** — would queue under load; this was reversed deliberately
- **Everything on Vercel** (serverless FastAPI) — real option, rejected because serverless Python is thinly documented
- **Everything on Render** — React needs Node to build; Render's Python service doesn't, forcing a dual-toolchain build script
- **Showing seat counts in v1** — stale seat data actively harms students. See the warning at the bottom

If Akeem re-opens one of these himself, that's his call — engage with it. Just don't propose them unprompted.

---

## Sections

### 1. React foundations  [x] done 2026-08-07
**Deliverable:** A React page running on your machine, showing a hardcoded list of courses.
**Concepts:** node-and-npm, vite, jsx, react-components, react-props

**Tasks:**
- [x] 1.1 Init git repo, scaffold with `npm create vite@latest`, gitignore `node_modules/` before first commit
- [x] 1.2 Run the dev server, tour the generated files (`index.html`, `src/`, `vite.config.js`, `package.json`)
- [x] 1.3 Replace the default page with a hardcoded list of courses, written directly in JSX
- [x] 1.4 Split the list into a `Course` component, passing each course in as props
- [x] 1.5 Commit — deliverable reached

**Notes for the lesson:**
- `npm create vite@latest` is the current standard path. Vite's dev server runs on port **5173**, not 5000 — expect confusion, since he associates "local server" with Flask's 5000.
- **`node_modules/` must be gitignored immediately.** He hit exactly this with `__pycache__` last project and learned that `.gitignore` doesn't untrack something already tracked — good chance to have him recall `git rm -r --cached` rather than be told.
- `node_modules/` is a permanent one-liner in the file map: machine-made, never edited, rebuildable from `package.json`.
- Good understanding check: **what's the difference between `package.json` and `node_modules/`?** (What you asked for vs. what actually got installed — the same relationship as `requirements.txt` and site-packages, which he already met.)
- Don't explain hooks, state, or effects yet. This section is *only* getting something on screen.

> ### ⚠️ Applies to sections 1–3 and 6: separate "React confusion" from "JavaScript gap"
> **React is JavaScript.** He will write *more* JS here than in the matrix app, not less — `.map()`, arrow functions, destructuring, spread, template literals, closures.
>
> His JavaScript sits at **`practicing`**, not solid. Known gaps from project #1: got `if` syntax wrong three times, used raw element IDs as if they were variables, needed promises explained twice. **React will expose these rather than hide them.**
>
> **So when he's stuck, diagnose which it is before explaining:**
> - *"Why does `courses.map(c => <Course ... />)` work?"* → **a JavaScript question** (arrow functions, array methods). Teach it as JS, and say so — *"this is JavaScript, not React."*
> - *"Why didn't the page update when I changed the variable?"* → **a React question** (state and re-rendering).
>
> Conflating the two is how learners conclude React is hard when they're actually stuck on arrow functions. Naming which layer the confusion lives in is often the whole fix.
>
> Context, if he asks whether picking React was a mistake — he asked twice on 2026-08-06 after seeing generic advice online: **no.** He built a full app in plain JS first, deliberately, and personally hit the bug React exists to prevent (manually syncing DOM and data, and losing track). The prerequisite is done.

### 2. The interactive shortlist  [x] done 2026-08-09
**Deliverable:** Pick a subject, pick a course, add it to your list, remove it — all working, with made-up data.
**Concepts:** react-state, event-handling-in-react, controlled-inputs, rendering-lists, derived-state

**Tasks:**
- [x] 2.1 Hardcode fake subjects/courses as data (no UI change yet)
- [x] 2.2 Subject dropdown wired to `useState`
- [x] 2.3 Course dropdown that depends on the selected subject
- [x] 2.4 Convert the two standalone state variables into an array of rows (`[{subject, code}]`), rendering one dropdown pair per row
- [x] 2.5 "Add" button appends an empty row; "Remove" deletes one row from the middle
- [x] 2.6 "Submit" button reads all rows and shows the chosen courses
- [x] 2.7 Commit — deliverable reached

**What actually shipped:** editable subject/course dropdown rows with `+ Add` and per-row `Remove`, a
`Submit` that validates four cases (no rows / incomplete row / duplicate course / success) and lists the
chosen courses. Flexbox row layout in `App.css`. Two real bugs found and fixed by Akeem: `Math.max()`
returning `-Infinity` on an empty array (duplicate ids), and two `updateRow` calls in one handler silently
dropping one update (stale closure over `rows`).

**Concepts actually covered** — the planned five, plus two unplanned:
`immutable-array-updates` and `form-validation-with-array-methods` (`.some()`, `Set`, `.filter()`).

> **Design changed 2026-08-08 at Akeem's request.** Originally a browse-then-shortlist UI (pick one course,
> click Add, it joins a list). He replaced it with **N editable dropdown pairs**: "Add" spawns another
> empty subject+course pair, every pair stays editable, and "Submit" is when the selections get used.
> Closer to how students actually think ("I want these six"), and closer to the AUS tool.
> **Cost, named at the time:** `selectedSubject`/`selectedCode` as two standalone variables can't hold N rows,
> so section 2's state moves into an array of row objects. **Payoff:** `key` becomes load-bearing for real —
> rows carrying live selections get removed from the middle, which is exactly the trace he worked through.

**Notes for the lesson:**
- This is the conceptual jump of the whole project: **he stops changing the page directly and starts changing data, letting React re-render.** Contrast it explicitly with his `createElement`/`appendChild` work in the matrix app — he knows the old way well, which makes the comparison land.
- **Controlled inputs** need both `value` and `onChange`; missing `onChange` produces an input that won't type, which is baffling if you haven't seen it.
- React warns about missing `key` props on lists. Don't skip past the warning — it's a good teaching moment about how React tracks items.
- State updates are not immediate. Reading a state variable right after setting it gives the *old* value. This will bite; let it, then explain.
- Hardcode 5–6 fake courses with a handful of sections. Enough to test conflicts in section 3, small enough to reason about.

### 3. The algorithm and the grid  [x] done 2026-08-11
**Deliverable:** Click Submit and page through valid schedule combinations on a weekly calendar. **The working tool — just with fake courses.** **Revised 2026-08-11** — no separate Generate button; Submit both validates and generates, swapping to the grid view the same way `customizingID` swaps to the section-customize panel.
**Concepts:** time-conflict-detection, bitmask-representation, backtracking-with-pruning, result-capping, css-grid-layout

**Tasks:**
- [x] 3.1 Expand the fake course data so each course has sections with real meeting times (day + start/end) — something to actually collide against
- [x] 3.2 Write the conflict check between two meetings — naive version, minutes-since-midnight range comparison
- [x] 3.3 Section picker — box-per-course main view with a summary line, a "Customize" panel per course (checkbox list of its sections, Back), row state gains a `sections` array (unplanned addition, added 2026-08-09 at Akeem's request)
- [x] 3.4 Bitmask representation — encode each section's weekly occupancy as bits (15-min slots), verify against the existing naive `meetingsConflict`. **Reordered before the generator 2026-08-10 at Akeem's request** — he asked to build the optimised version directly rather than naive-then-optimise, so the mask is now a prerequisite. **Real slot layout used, not a guess** — checked AURAK's live schedule page mid-lesson and found 7 days (Mon–Sun, not 6) and an 08:00–20:00 range (not 07:00–22:00), so `DAYS`/`DAY_START`/`SLOTS_PER_DAY` are calibrated to the actual data source
- [x] 3.5 Backtracking generator — recursion carrying an accumulated occupancy mask (O(1) check per candidate), courses ordered fewest-candidates-first. No result cap for now — reversed 2026-08-10 at Akeem's request (see note below)
- [x] 3.6 Weekly grid — CSS Grid shell for the calendar (days across, time down). Fixed 08:00–20:00 × 7-day grid for now, 12-hour display (real conversion function, not just a guess at formatting)
- [x] 3.7 Wire it together — Submit swaps the main view to the grid (same pattern as `customizingID`), generates schedules on submit, renders the current one into the grid cells, and adds pagination — `<`/`>` arrows, a "1 of 6" label, and a Back button to return to the list. **Data-shape fix along the way:** `getEligibleSections` now enriches each section with `courseCode`/`courseDescription`, since sections alone didn't carry a reference back to their parent course once inside `results`. **Real bug fixed mid-task:** class blocks that span multiple rows were disrupting CSS Grid's auto-placement for the background cells (hour labels, placeholders) that came after them in DOM order — fixed by giving every cell an explicit `gridColumn`/`gridRow` instead of relying on auto-flow for any of them
- [x] 3.8 Exact-time positioning — grid switched from 12 hourly rows to 48 fifteen-minute rows (`DAY_START` exported so `App.jsx` can compute exact slots); class blocks now start/end at their real time instead of rounding to the nearest hour. Deferred out of 3.7, 2026-08-11, at Akeem's request
- [x] 3.9 Dynamic grid sizing — shrink the grid to the actual used range now that real schedules exist. Days: always show Mon–Thu as a baseline, extending further only if real data needs it (revised 2026-08-11 from "only show used days," which looked broken with a day missing from the middle). Time: floor/ceil the earliest/latest real class to the nearest hour, no extra padding (simplified 2026-08-11 from the original "pad ~1hr" idea)
- [ ] 3.10 Commit — deliverable reached

**Notes for the lesson:**
- ⭐ **This is Akeem's home turf** (NeetCode 150, A-level CS). Give him much more room here than elsewhere — describe the problem and let him solve it. Scaffolding this section would waste the one part he's best equipped for.
- **Correct order: make it work, then make it fast.** Start with the naive version — represent times as minutes-since-midnight, compare ranges. Get correct results. *Then* introduce bitmasks as an optimisation he can measure against the naive version.
- ~~Cap results at ~50 and stop generating~~ — **reversed 2026-08-10.** Akeem wants to skip this after the tradeoff was explained twice (total-university-dataset-size doesn't bound per-shortlist combinatorics; the real risk is the main thread freezing on the student's own phone during registration week, since generation is client-side). He wants to see a real freeze before capping it. Cheap to add back later — one length check inside the generation loop. If testing produces one, that's the moment to revisit, not before.
- Prune *during* generation (abandon a partial schedule the moment it conflicts), never generate-then-filter.
- 🚫 **This rule binds the agent, not just Akeem: do not read, fetch, or summarise the AUS scheduler's source code before he has produced a working generator himself.**
  - **Not allowed until then:** opening their GitHub, describing their approach, or letting their design shape the hints you give. A summary from you is *worse* than him reading it — it arrives as "here's how to do it" rather than as something he chose to look up.
  - **Fine:** the UI description already in `project.md` (dropdowns, shortlist, weekly grid, freshness timestamp). That's the whole reference; there's no need to visit the site at all.
  - **After** he has a working generator, reading their source is genuinely useful — comparing two solutions to the same problem is good learning. The rule is time-bound, not permanent.
  - **Why:** the combination algorithm is the one piece of this project he is best equipped to solve alone (NeetCode 150, A-level CS). Seeing a finished solution first spends that for nothing.
- The weekly grid is CSS Grid — he did a 2×2 grid last project, this is the same property at larger scale.

> #### 🎯 Calibration from section 2 (2026-08-09) — read this before starting
> Section 2 gave a sharp, evidence-backed read on where the difficulty will actually sit here.
>
> **The algorithm will not be the hard part. The JavaScript will be.** Asked how to detect duplicate
> courses, he answered *"use a hash set to track seen ones"* instantly, unprompted — then wrote the check
> and wired it in himself, first try. Fastest, cleanest thing he did all session. In the *same session* he
> needed two full teardowns of `.map()` and three separate passes on spread (`...`).
>
> **So expect this split:** he designs the backtracking correctly in plain terms within minutes, then
> loses real time to array/closure/spread syntax while implementing it. **Name which layer he's stuck on,
> out loud, every time** — *"this is JavaScript, not the algorithm"* — because conflating the two will
> make him think he's bad at the one thing he's genuinely excellent at.
>
> **Give him the problem statement and get out of the way.** Do not scaffold the search. Where he'll need
> help is turning correct pseudocode into working JS — help there, not with the logic.
>
> **Shaky going in, worth one cold review question first:** spread (`...`) — three passes and he still
> opened the next-day recall with a vague *"it makes a copy out of something."* Closures were also not
> recalled unprompted from project #1, and backtracking leans on them.
>
> **Solid now, no need to re-teach:** `.map()`, `.filter()`, `.find()`, `.some()`, `Set`, ternaries,
> `key`, immutable array updates, React state and what triggers a re-render.

### 4. Usable on a phone  [ ] not started
**Deliverable:** A live URL you can open on your own phone and actually use, with the rough edges filed off.
**Concepts:** responsive-design, settimeout-and-cleanup, toast-notifications, deferred-rendering, event-listener-cleanup

> **Added 2026-08-11, at Akeem's request** — his reasoning: finish the frontend while React context is still loaded, rather than switching to Python for sections 5–7 and coming back cold. Sound argument, and it also unparks the fade-out error popup idea he had on 2026-08-09 (parked at the time because it needed `setTimeout`, which hadn't been taught).

> ✂️ **Cut down 2026-08-11, same day it was created.** It grew to ~12 items across three rounds of scoping; Akeem then said plainly *"I feel like section 4 is too much"* — and he was right. The deadline math: ~20 days to semester, and sections 5–10 (parser, Postgres, SQLAlchemy, Alembic, FastAPI, CORS, tests, deployment) are where this project's actual learning goals live. Spending a third of the remaining time on polish against fake data was the wrong trade.
>
> **The specific insight worth keeping:** every item on the original list had a clear "done" *except styling/design tokens*. Design is open-ended — it can quietly eat a section without ever finishing. That was the real sprawl risk, not the item count.

**In (this is the whole section — ~2 days):**
1. **Early Vercel deploy** — first, before the mobile work
2. **Mobile/responsive** — the one genuinely blocking item
3. **Three tiny fixes** — "clear all" · disabled Previous/Next at boundaries · first-run hint line
4. **Toast errors + loading state** — one lesson, same mechanism
5. **Arrow-key paging** — same cleanup discipline as the toast, practiced twice

**Moved out, nothing dropped:** full styling/design-token pass → v1.1 · localStorage persistence → v1.1 · time-window filter → v1.1 (rejoining the rest of the filter panel) · total credits → v1.1 · button icons → parking lot · header → parking lot · download/screenshot button → parking lot.

**Notes for the lesson:**
- 🔑 **Mobile is the only genuinely blocking item.** `project.md` says "usable on a phone," and `body { padding: 24px 450px 0 450px }` currently makes the app unusable below ~1000px wide. Do the *minimum that stops it being broken on a phone* — resist turning this into the full design pass that just got deferred.
- 🚀 **Vercel deploy goes first, before the mobile work.** The reason is specific, not "ship early": a desktop browser's device emulator misrepresents touch targets, font rendering, and how the grid feels under a thumb. A live URL makes the mobile work testable on his actual phone instead of guesswork. It also splits section 9's deployment into an easy half (static frontend — no env vars, no CORS, no backend) and a hard half. **Section 9 already updated to expect this.**
- **The toast is where `setTimeout` lands** — his first timer, and the first place cleanup matters (a toast dismissed early shouldn't have a stale timer firing later). Product-wise it's pure polish (the inline error already works); the real payoff is that `setTimeout` + cleanup is the exact mental model `useEffect` needs in section 7. Buying a section-7 concept early, at a discount — which is why it survived the cut.
- ⚠️ **The loading state needs deferred rendering, not just a label.** Akeem's first instinct (2026-08-11) was that a plain label set before generation would show. It won't — React batches state updates, so the handler runs to completion before any repaint and `loading` goes true→false unpainted. Needs `setTimeout(..., 0)` around the generation so the handler returns and React paints first. He accepted the correction. **Worth more than it looks:** since he declined the result cap, a large shortlist could freeze the page, and this is the only thing distinguishing "thinking" from "broken."
- **Arrow keys pair deliberately with the toast** — a `keydown` listener on `window` needs the same cleanup discipline as `setTimeout`. Teach it as the same idea seen twice, not as a new concept.
- **Disabled Previous/Next is closer to a real bug than polish.** At "1 of 9", Previous silently does nothing — the bounds check works but gives no feedback, which reads as broken. Tiny fix, and it surfaces his existing `setIndex` bounds logic in the UI.
- **First-run hint line** — a cold visitor sees one empty dropdown row and no explanation. One sentence orients them. Matters disproportionately because the goal is *real student adoption*, and adoption fails at first contact more than anywhere else.
- He's driven every design decision in section 3 himself (chip vs. panel layouts, centering, hour-label placement, color-coding). **Give him the same room here** — describe mechanisms, let him make the calls.
- 🚫 **No AURAK logo or branding** (`project.md`).

> #### 🎯 Calibration from section 3 (2026-08-11) — read this before starting
> Section 3 was the biggest section so far (9 tasks, 3 days, the whole algorithm + grid). What it showed:
>
> **The section-2 prediction held exactly: his logic is right, his syntax isn't.** He designed the
> backtracking correctly, predicted combination counts with correct reasoning (*"3x2 = 6"*), derived the
> overlap condition himself, and diagnosed real layout bugs unprompted. Every genuine loss of time was
> plain JavaScript: a missing `Math.` prefix, an array passed where a scalar was needed, a nested
> `timeToMinutes(timeToMinutes(...))` that would have crashed, `&&` vs `&`, `{}` vs `<>`.
> **Keep naming which layer he's stuck on, out loud.**
>
> **Concrete numbers rescue him; more explanation does not.** Every recovery in this section came from
> dropping to real values — `timeToMinutes("10:15")` → `615` → `Math.floor(615/60)` → `10`; a toy 8-slot
> bitmask; `countdown(3)` traced call by call. Abstract re-explanation reliably failed first. When he says
> he's lost, **shrink the example, don't expand the prose.**
>
> ⚠️ **"I don't understand" still arrives *after* things work.** It happened twice in section 3, both times
> after a task was already marked done and verified green (*"I don't understand anything you just did"*
> about bitmasks; *"I understand everything completely except generateSchedules"*). This is his most
> valuable habit — he now routinely asks for a full walkthrough after a feature works. **Budget for it and
> protect it.** Those follow-up sessions produced his best explanations of the whole project.
>
> **He catches real bugs himself.** The blank page on zero results, the stretched columns, the
> missing-middle-day looking broken, the wrong `onClick` shape. Let him find them; ask what he's seeing
> before diagnosing.
>
> ⚠️ **He over-scopes, then self-corrects if asked honestly.** Section 4 grew to ~12 items across three
> rounds before he said *"I feel like section 4 is too much"* — and he was right. **Give him the honest
> read the first time**, including the deadline math, rather than agreeing and letting him discover it.
>
> 🔴 **The one method failure this section, don't repeat it:** building the section picker, I wrote ~50
> lines of structure (a ternary, two `.find()` chains, new JSX) and left one `TODO(you)`. He stopped it
> hard — *"No, bad, I want to learn everything, revert everything back, what are you doing?"* — and the
> work was reverted and rebuilt one small piece at a time. **When a feature has several structural pieces,
> decompose it across turns from the start.** A TODO blank inside a big block you wrote is not the same as
> a small block he wrote in full.
>
> **Solid now, no need to re-teach:** `.map()`/`.filter()`/`.find()`/`.some()`/`.slice()`, `Set`, spread,
> ternaries, `key`, immutable array updates, `for...of` and classic `for` loops, recursion with a base case,
> CSS Grid with explicit `gridColumn`/`gridRow`, React state and what triggers a re-render.

### 5. The parser  [ ] not started
**Deliverable:** A Python script that prints 700 real courses pulled from AURAK's live schedule page.
**Concepts:** http-requests-python, html-parsing, data-cleaning, multi-value-fields

**Notes for the lesson:**
- Back in Python — comfortable ground after three React sections. Good pacing.
- `requests` + `BeautifulSoup`. The page is **server-rendered static HTML**, so no browser automation is needed. Verified 2026-08-06.
- 💡 **Save one copy of the HTML to a local file early and develop against that.** Two reasons: you're not hitting AURAK's server on every run while debugging, and that saved file becomes the test fixture in section 8. Do this in the first task of the section, not as an afterthought.
- **The real difficulty is `Day/Time/Room`** — it spans multiple lines when a section meets more than once a week. That single field is where nearly all the parsing effort goes, and it's what makes the `Meeting` table necessary.
- Expect the parse to be wrong several times. That's normal and worth saying out loud so it doesn't read as failure.

### 6. The database  [ ] not started
**Deliverable:** Run the script, then look at 700 real rows sitting in Supabase.
**Concepts:** postgres-server, connection-strings, environment-secrets, sqlalchemy-models, orm-relationships, alembic-migrations, idempotent-full-replace

**Notes for the lesson:**
- 🔑 **First real secret he's ever handled.** He's only used `$PORT`, which isn't sensitive. The database connection string is. `.env` file, gitignored from the very first commit — before it ever contains a real value. Getting a credential into git history is genuinely hard to undo.
- Data model is fixed and reasoned: **Course → Section → Meeting.** `Meeting` is separate because a section meets multiple times a week; flattening it makes conflict detection painful. Don't re-design this.
- **ORM is a genuinely new mental model** — tables described as Python classes rather than SQL strings. Connect it to the raw SQL he wrote last project; he'll see what's being done for him.
- **Migrations are the point of Alembic.** Last project his schema change process was "delete `tasks.db` and restart." Name that contrast explicitly — it's the clearest possible motivation.
- **Full replace inside one transaction**: parse everything, then atomically clear and reinsert. Simpler than upserts at 700 rows, and makes re-running the job safe. Store the fetch timestamp in the same transaction.
- Good understanding check: **why does re-running the loader twice have to be safe?** (Because a scheduled job will run it unattended, forever, and nobody will be watching.)

### 7. Connecting the halves  [ ] not started
**Deliverable:** Your React app showing real AURAK courses instead of the fake ones.
**Concepts:** fastapi-routes, pydantic-models, sqlalchemy-queries, fetch-in-react, useeffect, cors

**Notes for the lesson:**
- FastAPI's routes will feel familiar — decorator, function, return. Lean on the Flask comparison hard; the jump is small.
- **FastAPI's auto-generated docs at `/docs` are a genuine gift for a learner.** Show them early. He can click endpoints and see real responses without writing any frontend code, which separates "is my API broken?" from "is my React broken?"
- **Pydantic response models** replace the hand-rolled validation he wrote in Flask (`if "text" not in data`). Make that connection — it's the same problem solved properly.
- ⚠️ **CORS lands here and it will be confusing.** The error message doesn't say "you need CORS." Expect one frustrating session. FastAPI's `CORSMiddleware` fixes it in about four lines.
- 💡 Vite's dev proxy can sidestep CORS *in development*. Tempting — but it hides the problem until deployment, where it reappears with no dev server to help. **Recommend meeting CORS properly here rather than deferring it to section 9.**
- `useEffect` is where beginners get hurt. React's StrictMode deliberately double-invokes effects in development, so a fetch appearing to run twice is *expected*, not a bug. Say this before he sees it and panics.

### 8. Tests and safety rails  [ ] not started
**Deliverable:** One command that checks your parser and your algorithm still work.
**Concepts:** pytest-recap, testing-a-parser, testing-the-algorithm, fixtures

**Notes for the lesson:**
- He wrote four pytest tests last project, so the tooling is recall, not new learning. **`pytest` runs as a bare command on his machine** — PATH was fixed permanently on 2026-08-05.
- **Test the parser against the saved HTML fixture from section 5.** This is the highest-value test in the project: parsing is where bugs hide, and the parser runs unattended every day where nobody sees it fail.
- **Test the algorithm with small hand-checked inputs** — two courses, known conflicts, a schedule count you worked out on paper. His DSA background makes this natural.
- ⚠️ Last project he wrote correct, passing test code he could not explain, and said so himself. **Watch for it here.** Ask him to explain what each test would catch before moving on.

### 9. Going live  [ ] not started
**Deliverable:** A URL an AURAK student can open on their phone, with data that refreshes itself daily.
**Concepts:** github-actions, yaml-workflows, scheduled-jobs, secrets-in-ci, deploying-two-services, custom-domain *(optional)*

**Notes for the lesson:**
- ⚠️ **Vercel is already deployed** — done early in section 4 (2026-08-11) so the mobile work could be tested on a real phone. So this section is **two new deploys, not three**: Render (API) → GitHub Actions (refresh), plus *reconnecting* the existing Vercel frontend to the real API instead of fake data. Don't re-teach the Vercel setup; do verify the redeploy picks up the API URL.
- **Do the remaining deploys one at a time and verify each** before starting the next.
- Render start command is uvicorn bound to `$PORT` — same environment-variable idea he already met with gunicorn.
- **Production CORS must include the real Vercel domain.** Localhost working proves nothing about production. Expect this to break once.
- **GitHub Actions secrets** hold the database URL. Same concept as `.env`, different place — connect them explicitly.
- ⚠️ Verify whether GitHub disables scheduled workflows after repository inactivity (believed ~60 days). Also, scheduled runs are delayed under platform load, so "daily" is approximate.
- Custom domain is optional and belongs at the end. Vercel handles HTTPS automatically.
- **Known and accepted:** Render's free tier sleeps, ~1 min cold start. It hurts least during registration week when real traffic keeps it warm. Show a loading state.

### 10. Wrapping the MVP  [ ] not started
**Deliverable:** MVP checklist fully checked, a README, and the app in front of an actual AURAK student.
**Concepts:** mvp-review, readme-portfolio-framing, disclaimer-and-unofficial-framing, demo-practice

**Notes for the lesson:**
- ⚠️ **The disclaimer is not decoration.** Students will make registration decisions from this data. The AUS tool carries one for exactly this reason.
- **Keep it visibly unofficial** — no AURAK logo, no branding, nothing implying endorsement. This matters *more* if the domain carries the university's name. The realistic risk isn't legal trouble; it's a university objecting to something that looks like it speaks for them.
- README: he wrote one last project and it took several passes. The recurring difficulty was **confusing the GitHub URL, the live URL, and localhost** — three similar-looking things meaning different things. Expect it again; it's a real gap, not carelessness.
- ⭐ **The actual deliverable is watching a real student use it.** Everything before that is him deciding whether it works. Don't let this become "and then share it sometime."
- Full unprompted walkthrough at the end, as last project. It surfaced a genuine gap (he'd forgotten gunicorn entirely) that nothing else would have found.

---

## After the MVP — v1.1

Build immediately after section 10, not "someday". These are Akeem's stated priorities.

- ⭐ **The advanced filter panel** — the highest-value item in v1.1, and the one students would actually tell each other about. All three are **section-level**: they run *before* generation, shrinking each course's candidate list, so they make the search faster rather than slower.
  - **A time window** ("nothing before X, nothing after Y") — covers "no 8am classes" and "nothing after 5pm" in one control. *Was pulled into section 4 on 2026-08-11 and moved back the same day when section 4 was cut down: it's a feature, not a blocker, and features can ship in v1.1.*
  - **Exclude specific days.**
  - **A protected break window** (his idea, e.g. no classes 12:00–13:00). 💡 Nearly free to build: encode the break as a mask and reuse `masksConflict` — a section is excluded if any meeting overlaps it, which is the exact check he already wrote in section 3.
  - **Explicitly rejected 2026-08-11:** "max days on campus" and instructor filters. Don't re-propose.
  - 📝 Worth teaching when built: **section-level** filters (these) prune before generation and speed it up; **schedule-level** filters (max days on campus, minimum gap between classes) can only be checked on a finished schedule, so they can't prune. Different mechanism, different cost.
- **The full styling / design-token pass** — moved out of section 4 on 2026-08-11. Section 4 does only the minimum that stops the app being broken on a phone. ⚠️ **This is the item that ate section 4 and will do it again if unwatched:** design has no natural "done." Two reasons it belongs here and not earlier — an unstyled app with real data beats a styled app with fake data, and real data (long course descriptions, ~700 rows, many subjects) is what you actually want to design against. Extract CSS custom properties (`--color-primary` etc.) as a *refactor once the repetition is visible*, not as an upfront task; naming colors before choosing them is backwards.
- **Remembering the shortlist across refreshes** (`localStorage`) — moved out of section 4 on 2026-08-11. New concept, moderate work, pure convenience. Independent of where the data comes from, so nothing about section 7 invalidates it. ⚠️ One real edge case when built: a saved shortlist can reference a course code that no longer exists next semester — handle the miss rather than crashing.
- **Total credits per schedule** — moved out of section 4 on 2026-08-11. Real student value, but it needs a `credits` field, and hand-adding fake ones would be thrown away when section 5's parser reads the real "No. of Credits" column. Cheap and correct once real data exists.
- **Exclude sections that are already full** — makes the output actionable. A schedule containing a section nobody can register for is a wasted result.
- **Server-side filtering** — query params, ORM filters, indexes. *Honestly a learning goal at 700 rows, not a performance need.* It does give the backend a real job again after client-side generation reduced it to a data dump.
- **Raise refresh to ~30 min** during registration week, daily otherwise. Deliberately not earlier: frequency only matters once seats are shown or filtered on, so the two ship together.

> ⚠️ **Seat counts stay parked as a *display* feature even in v1.1.**
> The harm is asymmetric. Stale data saying **FULL** when a section is open costs a student one option. Stale data saying **"3 seats left"** when it's full costs them their whole schedule — and makes the tool worse than not using it.
> Filtering on seats is safe well before displaying them is. If displaying, prefer coarse **Open / Almost full / Full** over numbers that invite false precision.
