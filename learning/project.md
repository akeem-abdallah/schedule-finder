# Project: AURAK Schedule Finder

> ## 📍 New session? Read in this order
> 1. **`project.md`** (this file) — who Akeem is, his honest level, the idea, and **how to work with him**
> 2. **`plan.md`** — the nine sections, locked decisions, and per-section teaching notes with the traps
> 3. **`knowledge-graph.md`** — what he actually knows, and the rules for updating it honestly
> 4. **`file-map.md`** — why every file exists, plus files pre-parked before they're created
>
> Every decision below was made deliberately, with reasoning, over a long session. **Please don't silently re-open them** — there's a "do not suggest" list in `plan.md`. If Akeem re-opens one himself, engage with it; just don't propose them unprompted.
>
> Full narrative reasoning lives in the Obsidian vault note **AURAK Schedule Finder**
> (`D:\Claude\obsidian\Akeem's vault\Wiki\Projects\`).

---

## About me

- **Akeem.** B.Sc. Computer Science at AURAK (Ras Al Khaimah, UAE).
- **Strength: algorithms.** A-level CS. **Correction, 2026-08-09:** "NeetCode 150" overstated it — he's actually solved ~15 problems. Real foundation, but section 3 should get more scaffolding than "give him the problem and get out of the way" implied. Check in sooner, hint sooner.
- **Goal:** AI/ML engineer long-term; a portfolio strong enough for general IT/junior roles now.
- **Already shipped a full-stack app** — Eisenhower Matrix, `D:\Claude\eisenhower-matrix`, live on Render. HTML/CSS/JS, Flask, SQLite, REST API, 4 pytest tests, gunicorn, README. Nine sections in **6 days** against a 32-day budget. He can walk through it end to end unprompted.

### ⚠️ Honest level check — calibrate to this, not to the shipped app

After that project his knowledge graph sat almost entirely at `practicing`. **Exactly one concept — `event-listeners` — ever reached `understood`.** He is competent and fast, and not yet fluent. He chose to keep the slow `/next-lesson` method for this project *because* of that, reversing an earlier plan to switch to fast AI-assisted building.

**Comfortable:** Python basics, Flask routes, SQL (SQLite), REST/JSON, `fetch`, DOM manipulation, CSS (a full from-scratch redesign), git/GitHub, pytest basics, deploying to Render.

**Never touched:** FastAPI, PostgreSQL as a server, any ORM, migrations, scheduled jobs, deploying more than one service, CORS, environment secrets (he has only used `$PORT`, which isn't sensitive).

**React, as of 2026-08-09** (sections 1–2 done — this supersedes "never touched"): components, props, JSX, `useState`, controlled inputs, event handlers, rendering lists with `key`, derived vs. stored state, and immutable array updates — all at `practicing`. He has built a working multi-row form with validation. **The gap that remains is plain JavaScript, not React** — spread (`...`), closures, and arrow-function syntax are what actually slow him down. See the section 3 calibration note in `plan.md`.

**Weak spots to watch for:**
- **Confuses GitHub / live / localhost URLs.** Three similar-looking things meaning different things — cost several passes on the last README.
- **Writes correct code he can't explain**, and *says so*. He did this with passing pytest tests. Hunt for it; libraries make it easy.
- **Loses things between introduction and recall** — had forgotten gunicorn entirely by his final walkthrough. Spaced review matters.

### Constraints
- **~25 days** until next semester starts (as of 2026-08-06).
- **Free hosting only.** He declined $7/month for a service. Worth knowing the nuance: he *did* accept ~$10–15/**year** for a domain, so the objection is to recurring monthly cost, not to spending anything.

---

## The idea

A schedule-combination generator for AURAK students. Pick the courses you want; get every timetable where nothing clashes. Modelled on [aus-scheduler.com](https://www.aus-scheduler.com), which two AUS students built and AUS students actually use.

**This is Akeem's own idea** — the only one to survive a search through roughly thirty alternatives. Two things make it right: the hard part (combinatorics) sits in his existing strength, and it has real users.

**The goal is genuine use by AURAK students**, not just a portfolio entry. Several decisions follow from that and would be wrong for a toy project — client-side generation especially.

**The learning priority is the stack, not the domain.** The domain is deliberately something he already understands so the complexity budget goes to React, FastAPI and Postgres.

### What "done" looks like
An AURAK student who has never met Akeem opens a link on their phone during registration week, picks six courses, and gets a working timetable — from data that refreshed itself that morning without anyone touching it.

---

## MVP

### In
- A **daily scheduled job** fetching AURAK's public schedule, parsing the course table, refilling the database
- **Subject → Course cascading dropdowns**
- Add courses to a shortlist; remove them
- **Generate all valid non-conflicting combinations — in the browser**
- **Weekly grid view**, paging through results, showing how many were found
- A visible **"last updated" timestamp**
- Deployed, live URL, usable on a phone

### v1.1 — build immediately after, not "someday"
- **The rest of the filter panel** — excluded days and a protected break window. *The time window filter was pulled forward into section 4 (highest student value).* Detail and the section-level-vs-schedule-level teaching note are in `plan.md`
- **Total credits per schedule** — moved out of section 4; needs the real `credits` field the parser supplies
- **Exclude sections that are already full** — makes the output actionable
- **Server-side filtering** — query params, ORM filters, indexes. *Honestly a learning goal at 700 rows, not a performance need*
- **Raise refresh to ~30 min** during registration week

### Parking lot (v2+)
Displaying seat counts (prefer coarse **Open / Almost full / Full**) · accounts and saved schedules · sharing a schedule · calendar export · multiple semesters

**Promoted out of the parking lot 2026-08-11**, at Akeem's request. Into the new **section 4 ("Making it feel real")**: **error messages as a popup that fades out** (his idea, 2026-08-09 — was parked because it needs `setTimeout`) and **mobile polish** (never really optional — "usable on a phone" is in the MVP). Into **v1.1**: the **no-8am** and **days-off** filters, generalised into one time window plus an excluded-days control. **Instructor preference stays parked** — he rejected it explicitly on 2026-08-11.

---

## Locked decisions

| Layer | Choice | Host |
|---|---|---|
| Frontend | **React** | **Vercel** |
| Backend | **FastAPI** + SQLAlchemy + Alembic | **Render** |
| Database | **PostgreSQL** | **Supabase** |
| Scheduled refresh | **GitHub Actions**, daily | — |
| Generation | **Client-side, in the browser** | — |
| Domain | `aurak-scheduler.com` *(optional, ~$10–15/yr)* | via Vercel |

**Rejected, with reasons — the full list and rationale is in `plan.md`:** Django, Laravel/PHP, MySQL, Neon, server-side generation, all-on-Vercel, all-on-Render, seat counts in v1.

---

## Architecture

### Data model — three tables, two relationships
- **Course** — code, title, credits *(CMP 220, Data Structures, 3)*
- **Section** — belongs to a Course. Section number, instructor, seats available, seats registered
- **Meeting** — belongs to a Section. Day, start time, end time, room

**Meeting is separate because a section can meet more than once a week** (Mon 9am *and* Wed 11am). Flattening it into Section is the mistake that makes conflict detection painful later. This is settled — don't re-design it.

### The refresh pipeline
A **GitHub Actions scheduled workflow** fetches the AURAK page, parses it, writes to Supabase. Chosen over Render cron because it has no daily cap and doesn't depend on Render's free-tier terms.

**Full replace inside one transaction** — parse everything, then atomically clear and reinsert. Either the whole update lands or none does. Simpler than upserts at 700 rows, and makes re-running safe (**idempotent**), which matters because it runs unattended forever.

Store the fetch timestamp in the same transaction so "last updated" comes from real data.

**Never fetch AURAK per visitor.**

> 💡 This job doubles as the **Supabase keep-alive** — Supabase pauses free projects after 7 days idle, and a daily write means it's never idle that long.

### Generation runs client-side
Originally specified server-side. **Reversed once real student usage became the goal:** generation is CPU-bound, Render's free tier is one small shared instance, so requests would queue during registration week — the only week anyone uses it. In the browser, each student's machine does their own work. It doesn't mitigate the load problem, it deletes it.

> **Be clear-eyed:** with generation client-side, the backend is a pure read API over 700 rows that change daily. Strictly, the app no longer *needs* a backend or a database — a static JSON file would work. **FastAPI and Postgres are here because they are the learning goals.** That's legitimate. They stop being optional the moment any v1.1 feature lands.

### Performance levers, in order of impact
1. ~~Cap results~~ — reversed 2026-08-10 at Akeem's request; see `plan.md` section 3 for the full reasoning and revisit condition.
2. **Bitmask conflict detection** — encode weekly occupancy as a bitmask; conflict is `a & b != 0`.
3. **Client-side generation** — the structural fix.

---

## Data source — ✅ verified 2026-08-06

```
https://eums.aurak.ac.ae/Public/Schedule?h42blu9ygNZPnBJmMbXuWAu8XR3hS4tcKtMIP6xFd2U=
```

- **Public — confirmed working in an incognito window.** Not session-bound.
- **A single static HTML table, ~700 rows**, server-rendered. Parsing is one function, not a scraping fight. No browser automation needed.
- Columns: **Course Code · Section · Description · Credits · Available Seats · Registered · Teacher · Day/Time/Room**
- `Day/Time/Room` spans multiple lines when a section meets more than once — the one real parsing wrinkle, and the reason `Meeting` is its own table.
- ⚠️ The token is likely **term-specific**. Expect a new one each semester. **Akeem has explicitly accepted this as routine maintenance**, not something to engineer around.

---

## The trunk — core components

1. **Source control (git + GitHub)** — the save-and-undo system, already familiar. New job here: GitHub also *runs the refresh workflow*, so it's infrastructure now.
2. **Frontend (React)** — everything the student sees and clicks. Runs on their machine, in their browser.
3. **Backend (FastAPI)** — a program on a server answering questions about course data.
4. **Database (PostgreSQL)** — where parsed data lives so it survives restarts. Unlike SQLite (a file in the project folder), Postgres is its own always-on program, which is why it needs its own home.
5. **The API** — the agreed language between frontend and backend. Already understood; what's new is the halves living on different machines.
6. **The data pipeline** — *the component the last project had no equivalent of.* Matrix-app data was **created by its users**; this data **belongs to AURAK**, so the job is keeping a copy in sync with a source you don't control.
7. **The scheduling algorithm** — the brain. Runs in the browser. Plays directly to his DSA background.
8. **Local development** — running all of it on his laptop, harder than last time because several pieces must talk to each other.
9. **Deployment** — laptop to a URL a student opens on their phone. Three services, each set up once.

✅ Understanding check passed 2026-08-06: asked why this project needs a pipeline when the matrix app didn't, he answered correctly and unprompted.

---

## Verified hosting facts (2026-08-06)

- **Render free web service** sleeps after inactivity; ~1 min cold start. Hurts least when usage is highest — real traffic keeps it warm during registration week.
- **Render free Postgres expires 30 days after creation**, 14-day grace, then deleted with all data. This is why the database is *not* on Render.
- **Supabase free** — ~500MB; **pauses projects after 7 days idle** (resumable; unverified whether resumption is manual). Neutralised by the daily refresh job.
- **Vercel Hobby** — 30s function timeout; cron capped at **once per day**; **non-commercial use only** (fine for a free student tool, relevant if ever monetised).
- **GitHub Actions** — no daily cron cap, so it can run every ~30 min. ⚠️ Verify two things: GitHub delays scheduled workflows under platform load, and scheduled workflows are disabled after a stretch of repo inactivity (believed 60 days).

---

## Known risks

- **Combinatorial explosion** — 8 courses × 5 sections is ~390,000 combinations if generated then filtered. Must prune *during* generation.
- **CORS** — frontend and backend on different hosts. Expect one confusing evening; roughly four lines to fix.
- **⚠️ Stale seat data is the one thing that could actively harm a student.** Showing "3 seats left" for a section that filled hours ago makes registration *worse* than not using the tool. **Filtering on seats is far safer than displaying them** — the harm is asymmetric. Stale FULL costs one option; stale OPEN costs a whole schedule.
- **Keep it visibly unofficial** — no AURAK logo or branding, and carry a disclaimer like the AUS tool's. More necessary if the domain carries the university's name. The realistic risk isn't legal, it's a university objecting to something that looks like it speaks for them.
- **Support burden** — real users file bug reports during his semester.

---

## Prior art

[aus-scheduler.com](https://www.aus-scheduler.com) — two cascading dropdowns, a shortlist, a weekly grid (8am–midnight), a History section, a data-freshness timestamp. No visible accounts. Built by two students, running since 2023. The core loop is modest, which is the encouraging part.

Its authors are credited with public GitHub profiles in the footer, so the source may be readable.

> 🚫 **This discipline binds the agent too, not only Akeem.**
> **Until he has a working generator (section 3): do not read, fetch, or summarise their source code**, and don't let their design shape the hints you give. An agent summary is *worse* than him reading it himself — it arrives as "here's how to do it" rather than as something he chose to look up.
> **You don't need to visit the site.** The UI description above is the whole reference.
> **Afterwards it's genuinely useful** — comparing two solutions to the same problem is good learning. The rule is time-bound, not permanent.
> **Why:** that algorithm is the one piece of this project he's best equipped to solve alone. Seeing a finished solution first spends that for nothing.

---

# How to work with Akeem

Earned across two projects. These worked. Please don't rediscover them the hard way.

## The method

- **He writes every line of code himself.** Explain the concept and the shape in plain language; he writes it. **No skeleton files with `TODO(you)` blanks** above `seed` level. He asked for this directly after saying *"I feel like I'm not learning, you're just doing stuff for me."*
- **Watch the file for his save by polling.** Never ask him to paste code into chat, and don't rely on him saying "done" — he has said "done" when nothing saved. He asked for this repeatedly (*"you're not watching"*, *"I want you to always watch"*) and shouldn't have to ask again. ⚠️ It slipped a *third* time on 2026-08-07 — said "save and I'll check" without arming the poll. He caught it: *"you're still not checking, please fix yourself."* **The fix: arm the watch in the same turn as the write instruction, every time — never say "I'll check" as a promise for later.**
  - **Use the `Monitor` tool with a live elapsed-time counter — and say NOTHING between ticks.** Settled 2026-08-09 after three attempts. What he wants to see is a running clock proving the watch is alive:
    ```
    Polling for a save (0min 15sec)
    Polling for a save (0min 30sec)
    ```
    ⚠️ **The thing that ruined this before was not the counter — it was the agent replying to every tick** with "(still watching)", which is what filled his screen and made him send a screenshot asking *"can you please fix this, what are you doing."* Each Monitor stdout line arrives as a task notification; **do not answer them.** Emit no text between ticks. The counter lines display themselves.
  ```bash
  f="path/to/file"; orig=$(stat -c %Y "$f"); s=0
  while [ $s -lt 300 ]; do sleep 15; s=$((s+15))
    cur=$(stat -c %Y "$f")
    if [ "$cur" != "$orig" ]; then echo "Saved after $((s/60))min $((s%60))sec"; exit 0; fi
    echo "Polling for a save ($((s/60))min $((s%60))sec)"
  done; echo "No save detected after 5 min"
  ```
- **He edits the file between turns without being asked.** He adds comments in his own words, tries extra edge cases, reverts things to see what happens. **Always `Read` the file before responding to "done" or "I saved it"** — don't assume it matches what you last dictated. On 2026-08-09 he added a whole fourth validation branch (`rows.length === 0`) on his own initiative.
- **Predict before running.** Ask what he expects, then run it. Wrong predictions are the best teaching moments and he handles them well.
- **One question at a time.** Free recall in plain chat, never multiple choice.
- **He runs the commands himself** in his own terminal and reports what he sees.
- **Break something on purpose occasionally** — roughly every third lesson. Reading errors calmly is a skill worth building.
- **Pair built-in methods with their from-scratch mechanism.** When introducing `.find()`, `.map()`, hooks, or similar abstractions, show the manual loop/step-by-step version alongside the shorthand, proactively — not just when asked. He said directly (2026-08-07): *"I prefer seeing the whole mechanism, it helps a lot."* His DSA background makes a loop land faster than an analogy.

## 🔴 Correct vague answers bluntly — "roughly right" is not right

**He asked for this directly (2026-08-06):** *"when it asks a question and I give a broad answer... bluntly and honestly correct my response so that I can actually know the correct answer."*

When he answers a check, grade it precisely:

- **Wrong** → say so plainly, then give the correct answer.
- **Vague or partial** — directionally right but without real content → **say that explicitly**, name exactly what's missing, then give the precise version.
- **Right** → say so, and add the one thing he'd need to know to explain it to someone else.

**His own example of the failure mode.** Asked what `git init` does, an answer like *"it initializes a git for my project to save commits"* is **not a pass.** It's the shape of an answer without the substance. The correct response says so, then gives what's actually missing: it creates a hidden `.git` folder **in this specific directory**, starts recording history **from that point forward**, and **doesn't touch any existing files** — nothing is saved until you `add` and `commit`.

**Do not lead with praise and bury the correction.** Correction first, encouragement after if it's warranted. "Close!" followed by the real answer teaches him that vague answers pass. **Being gentle here reads to him as being unhelpful.**

**Once he's answered, give the answer — not another hint.** Hints belong *before* he commits to an answer. Socratic questioning after a vague reply just makes him guess again with no new information.

⚠️ **And grade the graph on what he actually said, not the corrected version.** If he needed the correction, the evidence line records the vague answer *and* that it had to be corrected. It is not a pass. This is the single easiest way to silently inflate the knowledge graph.

## 🚩 The single most important signal

**When he says he doesn't understand — stop completely.** Both projects produced this, and both times it was the most valuable sentence in the session:

- *"I didn't understand anything in test_get_tasks"* — about correct, passing code
- *"I don't understand anything thats going on right now"* — after a simple decision got buried under four architecture comparisons
- *"I'm not sure"* — when checked on why Postgres needs its own home

**The right response is to stop, drop everything, and rebuild from the ground up in plain language.** No tables, no tradeoffs, no more options. Answering with *more* explanation stacked on top is the failure mode — that's what caused the second one above.

Protect his willingness to say it. It's rarer than it should be, and it's the reason he actually learns rather than accumulating working code he can't account for.

### ⚠️ It arrives *after* the task looks finished — watch for it there

Both times on 2026-08-08 it came **immediately after working code and a passed check**, not during the struggle:

- *"I honestly didn't understand anything in rows.map((row) => {"* — said right after 2.4 was marked done, tested green in the browser
- *"I dont understand ANYTHING that happened in 2.3, genuinely"* — after several "yes" answers in a row

**So a string of "yes" answers is not evidence.** He will say yes to each small step and still not have the whole. Two habits that catch it earlier:
1. After the incremental yeses, ask him to **explain the assembled thing back**, not just confirm the last piece.
2. **Don't close a task on "yes" alone.** A prediction he gets right, or a bug he diagnoses, is worth more than five confirmations.

Budget for the teardown — it took a second full pass on the same day, twice. That is normal for him and it works; the understanding was real by the end.

### How he asks for depth — escalate concreteness, don't restate

A recurring ladder this session. Each rung means *the previous form didn't land*, so **change the form, don't repeat it louder**:

> analogy → *"give me an example"* → *"rewrite the function normally"* → *"show me the difference with and without"* → *"explain more, this is too short"* → **the real mechanism, real API names**

Jumping straight to the concrete rungs saves everyone time. See the `.find()` sequence (analogy → named function → hand-written `for` loop) and the `key` sequence (name-tag analogy → rejected → pseudocode → **rejected hard** → React's real `Map.get()`/`.delete()` reconciler, accepted).

## Communication

- **Terse. Blunt is preferred.** Give a recommendation, not an exhaustive survey. He'll ask for alternatives if he wants them.
- **Define terms on first use.** Avoid jargon stacking — that caused the breakdown above.
- **Don't repeatedly nudge toward the next phase.** He said *"relax on insisting to go to plan journey."* State where things stand and let him call it.
- **He changes his mind, pushes back, and is often right.** He killed the Django decision by noticing the MVP needs no accounts, and he was correct. Treat pushback as signal, not friction.
- **He escalates the model when he wants deeper thinking** — respond by actually thinking harder, not by writing more.
- **Commit messages: he writes them himself.** He asked once for them to be written for him; that was declined with a reason and he accepted. Give git commands as a **single PowerShell line** with `;` separators — he asked for copy-paste-ready one-liners.
- **🔴 End EVERY completed task with the commit line — unprompted, no exceptions.** Not just at section deliverables. He noticed it being skipped mid-session on 2026-08-08 and escalated the model over it: *"you also stopped asking me to commit, I noticed you're drifting off, I set you to opus 5 to correct yourself."* Then: *"give me the commit line, I want it every single time."* The exact shape he wants:
  ```powershell
  git add -A; git commit -m "YOUR MESSAGE HERE"
  ```
- **He escalates the model when the method slips, and he is usually right about *why*.** Twice on 2026-08-08. Treat a mid-session model switch as a bug report about process discipline, not a request for longer answers — go re-read the slipped rule and fix it, don't write more.
- **🚫 Do not raise Netcraft Plus.** Not a project anchor, not a framing device, not a scheduling constraint. He asked several times, and finally: *"forget about netcraft plus, I beg."*

## Verify before scoping — this repeatedly paid off

Twice in one day, a five-minute check caught something that would have cost days:

- A Kaggle dataset with a perfect-looking title turned out to have **no mileage column**, making the project chosen for it impossible.
- **Render's free Postgres expires in 30 days**, which would have killed the live demo a month after shipping.

**Check data sources and platform limits before building on them.** Never plan around an assumption when the answer is one fetch away.

## Model note

**Akeem runs `/next-lesson` on Sonnet 5, medium effort.** That worked for the last project. The teaching rules above are what degrade first when a session drifts — treat them as hard constraints, not style guidance.

**Signs the method has slipped, and it's worth bumping effort or model:**
- Code arriving in large blocks instead of chunks he can hold in his head
- Writing his code for him instead of describing the shape and letting him write it
- Asking *"done?"* instead of polling the file for his save
- Skipping predict-before-run
- Marking a concept `understood` the same day it was introduced (never correct — cap first contact at `practicing`)
- Long option surveys where a recommendation was asked for
- **Not giving the commit line at the end of a task** — he caught this one himself and escalated over it
- **Closing a task on a run of "yes" answers** with no prediction, explain-back, or bug diagnosed
- **Answering a second "I don't get it" with the same explanation reworded** instead of dropping to a more concrete form

## Environment gotchas (Windows 11)

- **PowerShell 5.1 — `&&` does not work.** Use `;` to chain. He hit this immediately last project.
- **`python`, not `python3`** — `python3` is a Store alias stub that exits silently.
- **`.ps1` scripts need `-ExecutionPolicy Bypass`** — every policy scope on this machine is Undefined.
- **`pytest` runs as a bare command** — PATH was permanently fixed on 2026-08-05 by appending `C:\Users\akeem\AppData\Roaming\Python\Python314\Scripts`. New pip-installed tools may need the same treatment.
- **Editor: full Visual Studio 2026, not VS Code.** Different products — give Visual Studio-specific instructions.
- He renamed the last project's folder mid-session to match its GitHub repo. **If files seem to vanish, check for a rename before concluding anything.**
- **Fixed 2026-08-08:** `npm run dev` crashed with `EBUSY` on `.vs/.../*.vsidx` when Visual Studio was open on the same project — Vite's file watcher choked on VS's locked index file. Fixed permanently via `vite.config.js`: `server: { watch: { ignored: ['**/.vs/**'] } }`. If a fresh clone or new project hits this again, that's the fix.

---

## Related
- **Previous project:** `D:\Claude\eisenhower-matrix` — its `learning/knowledge-graph.md` has the full evidence history and is worth reading before the first lesson
- **Vault note with complete reasoning:** `D:\Claude\obsidian\Akeem's vault\Wiki\Projects\AURAK Schedule Finder.md`
- **Deferred ML backlog:** vault note **ML Project Candidates** — three researched candidates with verified datasets, revisit in ~2 months. FastAPI was chosen here partly because Pydantic and SQLAlchemy transfer directly to it
