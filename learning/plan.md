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

### 2. The interactive shortlist  [ ] not started
**Deliverable:** Pick a subject, pick a course, add it to your list, remove it — all working, with made-up data.
**Concepts:** react-state, event-handling-in-react, controlled-inputs, rendering-lists, derived-state

**Notes for the lesson:**
- This is the conceptual jump of the whole project: **he stops changing the page directly and starts changing data, letting React re-render.** Contrast it explicitly with his `createElement`/`appendChild` work in the matrix app — he knows the old way well, which makes the comparison land.
- **Controlled inputs** need both `value` and `onChange`; missing `onChange` produces an input that won't type, which is baffling if you haven't seen it.
- React warns about missing `key` props on lists. Don't skip past the warning — it's a good teaching moment about how React tracks items.
- State updates are not immediate. Reading a state variable right after setting it gives the *old* value. This will bite; let it, then explain.
- Hardcode 5–6 fake courses with a handful of sections. Enough to test conflicts in section 3, small enough to reason about.

### 3. The algorithm and the grid  [ ] not started
**Deliverable:** Click Generate and page through valid schedule combinations on a weekly calendar. **The working tool — just with fake courses.**
**Concepts:** time-conflict-detection, bitmask-representation, backtracking-with-pruning, result-capping, css-grid-layout

**Notes for the lesson:**
- ⭐ **This is Akeem's home turf** (NeetCode 150, A-level CS). Give him much more room here than elsewhere — describe the problem and let him solve it. Scaffolding this section would waste the one part he's best equipped for.
- **Correct order: make it work, then make it fast.** Start with the naive version — represent times as minutes-since-midnight, compare ranges. Get correct results. *Then* introduce bitmasks as an optimisation he can measure against the naive version.
- **Cap results at ~50 and stop generating.** Not a nice-to-have — without it, 8 courses × 5 sections is ~390,000 combinations and the page hangs.
- Prune *during* generation (abandon a partial schedule the moment it conflicts), never generate-then-filter.
- ⚠️ **He must not read the AUS scheduler's source before attempting this himself.** Agreed explicitly. It's the one piece of this project he can solve alone, and seeing a finished solution first destroys that.
- The weekly grid is CSS Grid — he did a 2×2 grid last project, this is the same property at larger scale.

### 4. The parser  [ ] not started
**Deliverable:** A Python script that prints 700 real courses pulled from AURAK's live schedule page.
**Concepts:** http-requests-python, html-parsing, data-cleaning, multi-value-fields

**Notes for the lesson:**
- Back in Python — comfortable ground after three React sections. Good pacing.
- `requests` + `BeautifulSoup`. The page is **server-rendered static HTML**, so no browser automation is needed. Verified 2026-08-06.
- 💡 **Save one copy of the HTML to a local file early and develop against that.** Two reasons: you're not hitting AURAK's server on every run while debugging, and that saved file becomes the test fixture in section 7. Do this in the first task of the section, not as an afterthought.
- **The real difficulty is `Day/Time/Room`** — it spans multiple lines when a section meets more than once a week. That single field is where nearly all the parsing effort goes, and it's what makes the `Meeting` table necessary.
- Expect the parse to be wrong several times. That's normal and worth saying out loud so it doesn't read as failure.

### 5. The database  [ ] not started
**Deliverable:** Run the script, then look at 700 real rows sitting in Supabase.
**Concepts:** postgres-server, connection-strings, environment-secrets, sqlalchemy-models, orm-relationships, alembic-migrations, idempotent-full-replace

**Notes for the lesson:**
- 🔑 **First real secret he's ever handled.** He's only used `$PORT`, which isn't sensitive. The database connection string is. `.env` file, gitignored from the very first commit — before it ever contains a real value. Getting a credential into git history is genuinely hard to undo.
- Data model is fixed and reasoned: **Course → Section → Meeting.** `Meeting` is separate because a section meets multiple times a week; flattening it makes conflict detection painful. Don't re-design this.
- **ORM is a genuinely new mental model** — tables described as Python classes rather than SQL strings. Connect it to the raw SQL he wrote last project; he'll see what's being done for him.
- **Migrations are the point of Alembic.** Last project his schema change process was "delete `tasks.db` and restart." Name that contrast explicitly — it's the clearest possible motivation.
- **Full replace inside one transaction**: parse everything, then atomically clear and reinsert. Simpler than upserts at 700 rows, and makes re-running the job safe. Store the fetch timestamp in the same transaction.
- Good understanding check: **why does re-running the loader twice have to be safe?** (Because a scheduled job will run it unattended, forever, and nobody will be watching.)

### 6. Connecting the halves  [ ] not started
**Deliverable:** Your React app showing real AURAK courses instead of the fake ones.
**Concepts:** fastapi-routes, pydantic-models, sqlalchemy-queries, fetch-in-react, useeffect, cors

**Notes for the lesson:**
- FastAPI's routes will feel familiar — decorator, function, return. Lean on the Flask comparison hard; the jump is small.
- **FastAPI's auto-generated docs at `/docs` are a genuine gift for a learner.** Show them early. He can click endpoints and see real responses without writing any frontend code, which separates "is my API broken?" from "is my React broken?"
- **Pydantic response models** replace the hand-rolled validation he wrote in Flask (`if "text" not in data`). Make that connection — it's the same problem solved properly.
- ⚠️ **CORS lands here and it will be confusing.** The error message doesn't say "you need CORS." Expect one frustrating session. FastAPI's `CORSMiddleware` fixes it in about four lines.
- 💡 Vite's dev proxy can sidestep CORS *in development*. Tempting — but it hides the problem until deployment, where it reappears with no dev server to help. **Recommend meeting CORS properly here rather than deferring it to section 8.**
- `useEffect` is where beginners get hurt. React's StrictMode deliberately double-invokes effects in development, so a fetch appearing to run twice is *expected*, not a bug. Say this before he sees it and panics.

### 7. Tests and safety rails  [ ] not started
**Deliverable:** One command that checks your parser and your algorithm still work.
**Concepts:** pytest-recap, testing-a-parser, testing-the-algorithm, fixtures

**Notes for the lesson:**
- He wrote four pytest tests last project, so the tooling is recall, not new learning. **`pytest` runs as a bare command on his machine** — PATH was fixed permanently on 2026-08-05.
- **Test the parser against the saved HTML fixture from section 4.** This is the highest-value test in the project: parsing is where bugs hide, and the parser runs unattended every day where nobody sees it fail.
- **Test the algorithm with small hand-checked inputs** — two courses, known conflicts, a schedule count you worked out on paper. His DSA background makes this natural.
- ⚠️ Last project he wrote correct, passing test code he could not explain, and said so himself. **Watch for it here.** Ask him to explain what each test would catch before moving on.

### 8. Going live  [ ] not started
**Deliverable:** A URL an AURAK student can open on their phone, with data that refreshes itself daily.
**Concepts:** github-actions, yaml-workflows, scheduled-jobs, secrets-in-ci, deploying-two-services, custom-domain *(optional)*

**Notes for the lesson:**
- **Three deploys, so do them one at a time and verify each** before starting the next: Render (API) → Vercel (React) → GitHub Actions (refresh).
- Render start command is uvicorn bound to `$PORT` — same environment-variable idea he already met with gunicorn.
- **Production CORS must include the real Vercel domain.** Localhost working proves nothing about production. Expect this to break once.
- **GitHub Actions secrets** hold the database URL. Same concept as `.env`, different place — connect them explicitly.
- ⚠️ Verify whether GitHub disables scheduled workflows after repository inactivity (believed ~60 days). Also, scheduled runs are delayed under platform load, so "daily" is approximate.
- Custom domain is optional and belongs at the end. Vercel handles HTTPS automatically.
- **Known and accepted:** Render's free tier sleeps, ~1 min cold start. It hurts least during registration week when real traffic keeps it warm. Show a loading state.

### 9. Wrapping the MVP  [ ] not started
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

Build immediately after section 9, not "someday". These are Akeem's stated priorities.

- **Exclude sections that are already full** — makes the output actionable. A schedule containing a section nobody can register for is a wasted result.
- **Server-side filtering** — query params, ORM filters, indexes. *Honestly a learning goal at 700 rows, not a performance need.* It does give the backend a real job again after client-side generation reduced it to a data dump.
- **Raise refresh to ~30 min** during registration week, daily otherwise. Deliberately not earlier: frequency only matters once seats are shown or filtered on, so the two ship together.

> ⚠️ **Seat counts stay parked as a *display* feature even in v1.1.**
> The harm is asymmetric. Stale data saying **FULL** when a section is open costs a student one option. Stale data saying **"3 seats left"** when it's full costs them their whole schedule — and makes the tool worse than not using it.
> Filtering on seats is safe well before displaying them is. If displaying, prefer coarse **Open / Almost full / Full** over numbers that invite false precision.
