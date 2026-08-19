# FILTERS panel — approved design

> **Approved by Akeem 2026-08-19**, after a full design session. He said plainly:
> *"This is the last time I'll ask for the design"* and *"I want the page to look exactly like
> the widget, with no differences (even desktop)."*
>
> 🔴 **`filters-panel.html` in this folder is the pixel reference.** Open it beside the running app
> and diff. Do not redesign, do not "improve" spacing, do not substitute values. If something must
> change, it is a decision for Akeem, not a judgement call while building.

---

## Why this folder exists

`plan.md` refers to a full Amber design system at `docs/design/amber.md`. **That file does not exist
on disk** and never did in this repo's history as far as anyone here can see — the reason is unknown,
and nobody should invent one. The real design system lives in `src/App.css` (tokens at the top,
components below). This file documents only the FILTERS panel.

---

## Layout order — top to bottom

| # | Element | Notes |
|---|---|---|
| 1 | `.status-strip` | Unchanged from every other view |
| 2 | `.sub-strip` | `← BACK` · spacer · `RESET` · `FILTERS` title |
| 3 | `DAYS OFF` | content-sized chips, wrapping row; `WEEKEND` inline last, with a small gap. **Phone only** (`<640px`): switches to 7 equal columns + `WEEKEND` full-width on its own row below — see below |
| 4 | `START NO EARLIER THAN` | content-sized chips, one row: `ANY 8:00 9:00 10:30 12:00 1:30` |
| 5 | `END NO LATER THAN` | content-sized chips, one row: `11:45 1:15 2:45 4:15 5:45 ANY` |
| 6 | `LONGEST GAP` | 5-column grid (`NONE 1 HR 2 HR 3 HR ANY`) · ends with `--rule-med` |
| 7 | `Instructor assigned` | `.filter-row` checkbox |
| 8 | `Include full sections` | Disabled, 35% opacity, `SOON` chip · ends with `--rule-med` |
| 9 | `BUSY TIMES` | Label, then one `.busy-row` per block, then `+ Add busy time` |
| 10 | Footer | `EXCLUDED n OF m SECTIONS`, then full-width `DONE →` |

**Group headers were deliberately removed.** An earlier draft had `WHEN YOU'RE FREE` /
`WHICH SECTIONS COUNT` / `WHAT MAKES A GOOD SCHEDULE`. Akeem rejected them — they sat directly above
labels like `DAYS OFF`, so every control was labelled twice. Grouping is carried by a heavier
`--rule-med` divider instead of a header bar. **Do not reintroduce them.**

---

## The decisions, and why

- 🔴 **REVISED 2026-08-19, after Akeem saw it at real desktop width.** The original rule — *"phone and
  desktop identical, enforced by `--filter-col: 420px`"* — is **dead**, and so is the token. He looked at
  the shipped panel on a wide screen and rejected it. The replacement rule:

  **Chips are sized to their own content, in a wrapping flex row, left-aligned.**
  ```css
  .filter-chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .filter-chip  { padding: 5px 8px; }   /* width: auto — never a grid track */
  ```
  ⚠️ **Do not use `grid-template-columns: repeat(N, 1fr)` here.** `1fr` forces every chip to equal width
  *and* stretches them to fill the row — which is exactly what he rejected. `ANY` must be narrow, `10:30`
  wider, `WEEKEND` wider still. Three failed revisions (v2, v3, v4) all argued about the column count `N`
  and about `max-width` while keeping `1fr`; none of them could have worked. The fix was never the number
  of columns, it was not using columns.

  Density is a **desktop** baseline (~25px chips, for a mouse), bumped under `640px` to ~38px for thumbs.
  So phone and desktop now differ *deliberately* — a reversal of the original rule, made with his eyes on
  both renders.

  🔴 **DAYS OFF is the one exception, added 2026-08-19 after v5 shipped.** Akeem asked for the 7 days to
  stretch to fill the row under 640px, with `WEEKEND` wrapping to its own line — matching the *original*
  v1 grid layout, but phone-only this time:
  ```css
  @media (max-width: 640px) {
    .filter-chips-days { display: grid; grid-template-columns: repeat(7, 1fr); }
    .filter-chips-days .filter-chip-weekend { grid-column: 1 / -1; margin-top: 3px; }
  }
  ```
  So `DAYS OFF` is grid on phone, flex on desktop — every other chip row (`START NO EARLIER THAN`, `END
  NO LATER THAN`, `LONGEST GAP`) stays flex/content-sized at both widths. This is deliberate, not an
  inconsistency to "fix" later: 7 near-identical 3-letter labels read fine as equal columns, but content-
  sized chips with real width variance (`ANY` vs `10:30`) don't.

- 🔴 **Real CSS specificity bug, fixed 2026-08-19 — worth remembering for any future `.sub-strip` button.**
  `.sub-strip > button { padding: 0; font-size: 9px; }` was silently winning over `.btn-reset`'s own
  `padding: 3px 8px; font-size: 10px`, because *one class + one element type* (`.sub-strip > button`) is
  more specific than *one class alone* (`.btn-reset`) — source order didn't matter, `.btn-reset` lost even
  though it's defined later in the file. RESET rendered as a bare bordered box with no breathing room.
  Fixed by excluding it explicitly: `.sub-strip > button:not(.btn-reset)`, in both the desktop rule (line
  ~444) and its `640px` phone override (line ~968, which had the same bug independently — `padding: 16px 0;
  min-width: 44px` was also stomping RESET on phone).
- **Labels are 11px / `.08em`,** up from the app's usual 9px / `.13em`. Akeem asked for labels that
  are easier to read; at 9px it was the *tracking* hurting legibility more than the size.
- **Days stayed as seven chips, not a single "no weekend" button.** At AURAK courses pair Mon/Wed and
  Tue/Thu, so "day off: Monday" *is* "give me a Tue/Thu week" — a real request a weekend-only button
  cannot express. The 7-column grid makes it read as a week strip and equalises tap targets. The
  `WEEKEND` chip covers the common case in one tap. Akeem explicitly approved keeping both.
- **Everything tappable is ~41px tall** (`padding: 12px 0` on chips, `13px` on rows).
- **`SOON`, never `SECTION 15`.** An earlier draft leaked internal planning vocabulary onto a
  student's screen. Students have no idea what "section 15" means.
- **Two ways back, deliberately.** `← BACK` top-left matches the other two views; `DONE →` is a
  full-width bottom target because the top-left corner is the hardest place to reach one-handed on a
  6.7" phone. Both do the same thing (filters apply live — there is nothing to "submit").
- **Per-chip impact counts were cut** (`MON 18` etc.) — too noisy across seven chips. The single
  footer count survives.
- **"Give me one free weekday" was cut** by Akeem.

---

## Three groups, three mechanisms

The visual grouping is not cosmetic — each band is a different code path, and a student never has to
know that:

| Band | Mechanism | Where |
|---|---|---|
| Days · Earliest · Latest · Busy times | Writes `blockedMask`, pruned by `masksConflict` | `buildBlockedMask` → `orderedEligibleLists` |
| Instructor assigned · Include full sections | Plain predicate — **no mask can express these** | `orderedEligibleLists` |
| Longest gap | **Cannot prune.** Filters finished schedules | after `generateSchedules` |

⭐ **Why the gap filter cannot prune during the search:** conflicts are *monotonic* — once two classes
overlap, adding more can never un-overlap them, which is what makes backtracking valid. Gaps are
**not** monotonic: a 3-hour hole at 11 AM can be *filled* by a class added later, so abandoning that
branch early would throw away valid schedules. It must run on completed results.

**Computing gap from the mask:** per day, find the first occupied slot and the last occupied slot,
count the occupied slots between them —
`dead slots = (last − first + 1) − occupied`, `× 5 min per slot`.

---

## ✅ Verified data facts — measured 2026-08-19 against the live API, do not re-derive

`GET https://aurak-schedule-finder.onrender.com/initial-data` → **272 courses · 423 sections · 621 meetings**
(note: sections moved 421 → 423 since section 5; the plan's "421" is stale.)

**Days:** `Mon 149 · Wed 145 · Thu 145 · Tue 144 · Sat 20 · Fri 14 · Sun 4` — Mon–Thu is 94% of meetings.

**Start times (this is AURAK's real period grid, 90-minute spacing):**
`08:00(8) · 09:00(119) · 10:30(124) · 12:00(58) · 13:30(132) · 15:00(108) · 16:30(48) · 18:00(13)`
Only 4 meetings start at 10:00 — round clock numbers are *not* the real boundaries, which is why the
`EARLIEST`/`LATEST` chips use grid times.

**End-time clusters:** `10:15(82) · 11:45(112) · 13:15(44) · 14:45(102) · 16:15(74) · 17:45(32) · 17:30(29)`

**Filter impact:**

| Filter | Meetings hit (of 621) |
|---|---|
| Weekend (Fri+Sat+Sun) | 38 (6%) |
| Nothing before 10:00 | 127 (20%) |
| Nothing ending after 15:00 | 213 (34%) |
| Nothing ending after 17:45 | 26 (4%) |

**Instructor TBA:** **54 of 423 sections (13%)** — this is what `Instructor assigned` filters.

**Saturday is all exec/MBA:** every Sat meeting is a 2.5-hour block
(`09:00–11:30`, `12:00–14:30`, `15:00–17:30`). An undergrad will never take one.

🚫 **Jumu'ah preset — checked and NOT needed.** All 14 Friday meetings run `09:00–12:30` or
`14:00–16:30`. **Zero classes between 12:30 and 14:00** — AURAK already builds Friday prayer into the
timetable. A "free for Jumu'ah" button would do nothing. Same outcome as task 14.1's TBA-mix check.

⚠️ **The 5:45 bus edge case, Akeem's call to make:** 32 meetings end *exactly* at 17:45, and
`nothingAfter = "17:45"` allows those — so a student gets a class letting out precisely at bus time.
If the intent is "catch the bus", the value should be 17:30.

---

## Measured, not assumed — 2026-08-19, dark mode, in a real browser

| | 390px phone | 1280px desktop |
|---|---|---|
| Card | 356px | 900px |
| Control grids | 324px | **420px (capped)** |
| Day chip | 43 × 39 | 57 × 39 |
| Toggle row | 46px tall | 46px tall |
| `DONE →` | 324 × 51 | 420 × 51 |
| Horizontal overflow | none | none |

⚠️ **Precise claim, so nobody over-promises later:** phone and desktop are identical in *structure* —
same rows, same order, same wrapping, nothing reflows, and every control caps at 420px so the desktop
card is just whitespace to the right. Chip **width** still scales (43px → 57px) because the grid
columns are `1fr`. Making them literally pixel-identical would need fixed chip widths, which would
overflow a 320px phone. If Akeem wants that anyway, it is his call — but it is a real trade, not a
free win.

`border-radius: 0` and the dark accent `#ffb020` confirmed live on the rendered page.

## CSS classes (already written in `filters-panel.html`, copy them across)

`.filter-block` `.filter-block-end` `.filter-label` `.filter-chips` `.filter-chips-7/-3/-5`
`.filter-chip` `.filter-chip-active` `.filter-chip-wide` `.filter-row` `.filter-row-selected`
`.filter-row-end` `.filter-row-disabled` `.filter-row-text` `.chip-soon` `.busy-row` `.busy-day`
`.busy-time` `.busy-remove` `.busy-add-wrap` `.btn-add-busy` `.filter-footer` `.filter-count`
`.btn-done` `.btn-reset`

Nothing here invents a new visual language: chips are the existing `.chip` with an active state
borrowed from `.section-row-selected`, and `.filter-row`/`.busy-row` are `.section-row` with the same
3px transparent left border that turns accent when active.

**Two new tokens** on `:root` and the dark block: `--chip-active-bg` and `--filter-col`.

---

## 🚫 Rejected — do not re-propose

Instructor *preference* filters (picking Professor X) · max-days-on-campus · "no mornings" /
"afternoons only" presets · "which filter killed it" diagnosis · group header bars · per-chip impact
counts · "give me one free weekday" · a Jumu'ah preset (measured unnecessary, above) ·
collapsing the seven day chips into a single weekend button.
