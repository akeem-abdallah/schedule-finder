# Amber — design spec

The visual design for AURAK Schedule Finder. Decided 2026-08-12.

> **Values are given as tables, not CSS.** That is deliberate — Akeem writes every line himself, so
> this file specifies *what* the values are and *why*, not the stylesheet. Transcribing a table into
> CSS is the work; copy-pasting a finished block is not.

---

## The direction

**"The board."** A schedule tool that looks like a timetable, not like a form above a grid.

Three rules generate almost everything else:

1. **Monospace for data, sans for language.** Course codes, section numbers, times, counts, the
   result counter — mono, so columns align without setting a single width. Course titles, button
   labels, prose — system sans. Deliberately mixing the two is most of the personality.
2. **Rules, not boxes.** One hairline between rows, one 2px rule under the status strip. No cards,
   no shadows, no radius anywhere.
3. **Numbers get to be big.** The result count is the loudest thing on the results screen, because
   it is what the student came for.

Test for rule 1 when unsure: *would this value ever be sorted or compared?* Then it is data, so it
is mono.

### Rejected, with reasons

- **Tailwind-default palette** (`slate-*` / `indigo-600`) — the single biggest reason the first
  three attempts read as machine-generated. `#4f46e5` in particular is the most over-used accent of
  the last three years.
- **Soft/rounded SaaS card look** — uniform softness (everything rounded, every shadow diffuse) is
  itself the tell. Real design lets some things be sharp.
- **Serif / editorial direction** — distinctive, but a serif on a dense timetable is a commitment
  with no upside here.
- **Big centered `<h1>`** — the most generic element on the page. Replaced by the status strip.
- **Hardcoded pastel block fills** — a pastel has no dark counterpart, so dark mode would need a
  second full set of eight colors. See *Course hues* below for what replaced it.

---

## 1 — Tokens

Same names in both themes, different values.

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--bg` | `#fbfbfa` | `#0d0d0c` | page behind the board |
| `--surface` | `#ffffff` | `#141413` | the board itself |
| `--surface-alt` | `#f4f3f0` | `#1c1b19` | column header, day header |
| `--text` | `#16150f` | `#e8e6df` | codes, titles, block text |
| `--muted` | `#8a867c` | `#8a867c` | **same both themes** — labels, instructor |
| `--faint` | `#b8b3a8` | `#5c5a55` | time gutter, placeholder, `×` at rest |
| `--rule` | `#eceae5` | `#232220` | hairline between rows / hours |
| `--rule-med` | `#d8d6d1` | `#2e2d2a` | board border, gutter divider |
| `--rule-strong` | `#16150f` | `#e8e6df` | the 2px rule under the strip |
| `--accent` | `#b8600d` | `#ffb020` | generate button, result total, narrowed count |
| `--accent-hover` | `#9a4f0a` | `#ffc247` | light darkens, dark brightens |
| `--accent-fg` | `#ffffff` | `#16150f` | text *on* accent — note it flips |
| `--danger` | `#a8321a` | `#ff6b4a` | errors, `×` on hover |
| `--focus` | `rgba(184,96,13,.35)` | `rgba(255,176,32,.35)` | 3px outer focus ring |

Two things worth noticing:

- **`--muted` is identical in both themes.** It sits at the midpoint, so labels and instructor names
  need no theme-specific value at all.
- **`--accent-fg` flips.** Burnt amber is dark enough for white text; `#ffb020` is not, so on dark it
  takes near-black. Getting this wrong is the most likely single-token mistake.

---

## 2 — Type

Two families, strictly assigned.

| | Stack |
|---|---|
| `--font-data` | `ui-monospace, "Cascadia Mono", "Segoe UI Mono", "SF Mono", Consolas, monospace` |
| `--font-ui` | `system-ui, "Segoe UI", -apple-system, sans-serif` |

| Role | Family | Size | Weight | Tracking | Color |
|---|---|---|---|---|---|
| strip title | ui | 11 | 800 | `.12em` | `--text` |
| chip | data | 9 | 700 | `.10em` | `--surface` on `--rule-strong` |
| strip meta | data | 10 | 400 | — | `--muted` |
| column header | ui | 9 | 800 | `.13em` | `--muted` |
| row subj / code | data | 15 | 600 | — | `--text` |
| row title | ui | 14 | 400 | — | `--text` |
| row sections | data | 12 | 500 | — | `--muted`, or `--accent` if narrowed |
| button | ui | 10 | 800 | `.12em` | per variant |
| day header | ui | 10 | 800 | `.12em` | `--text` |
| time gutter | data | 10 | 400 | — | `--faint` |
| block code | data | 11 | 700 | — | `--text` |
| block instructor | ui | 10 | 400 | — | `--muted` |
| block time | data | 10 | 400 | — | `--muted` |
| counter | data | 22 | 700 | `-.02em` | `--text`; total in `--accent` |
| error | ui | 13 | 500 | — | `--danger` |

---

## 3 — Layout primitives

- **Spacing scale:** `4 · 6 · 8 · 10 · 14 · 20`
- **Rule weights:** `1px` hairline, `2px` strong. No other weights.
- **Radius: `0` everywhere.** Buttons, blocks, chips, inputs, the board. No exceptions — this is
  the identity.
- **Minimum tap target:** `44×44px` on touch. The current `×` is about 20px.

---

## 4 — Components

### Status strip
Replaces the `<h1>`. One flex row, 2px `--rule-strong` bottom border. Left: title, 11px/800,
`.12em` tracking. Right: update time in mono `--muted`, then an `UNOFFICIAL` chip — filled
`--rule-strong`, text `--surface`, 9px/700 mono.

### Course table (view 1)
A column header row on `--surface-alt` (tiny tracked caps, `--muted`), then one ruled row per
course. Columns: `SUBJ · CODE · TITLE · SEC · ×`. Subject and code are mono 15/600; title is sans
14/400 and **must truncate with an ellipsis** — real course titles are long. Section cell reads
`ALL` in `--muted`, or `1/2` in `--accent` when narrowed.

Empty row state: subject select bordered `--rule-strong`, code select bordered `--rule-med` with an
em-dash placeholder in `--faint`, title cell reads *select a course* in `--faint`.

### Selects
Native element, closed state styled only — border, padding, mono text, zero radius. **Do not
replace with a custom dropdown**: the open list can't be styled in CSS anyway, and on a phone the
native picker is far better than anything hand-rolled, which matters with ~700 rows.

### Buttons
| Variant | Background | Text | Border |
|---|---|---|---|
| primary (Generate) | `--accent` | `--accent-fg` | none |
| secondary (Add course, prev/next) | transparent | `--text` | `1px --rule-med` |
| ghost (Back, Edit) | none | `--muted` | none |
| destructive (`×`) | none | `--faint`, `--danger` on hover | none |

### Error
Its own ruled row *inside* the board, not floating below it. `--danger` text on a ~6% `--danger`
wash.

### Section rows (view 2)
One ruled row per section: checkbox, zero-padded mono section number, sans instructor, mono meeting
days and times right-aligned. Selected rows get the accent wash **and** a 3px `--accent` left rule;
unselected rows carry a 3px *transparent* left rule so nothing shifts when ticked.

Meeting days/times are new here — currently sections are picked blind.

### Results header
`← EDIT` ghost button, then prev/next around the counter. Counter is `003 / 048`: current in
`--text`, total in `--accent`, 22px mono. **Leading zeros are deliberate** — fixed width, so
nothing shifts while paging.

### Weekly grid
Day header band on `--surface-alt`. Time gutter right-aligned mono `--faint`, divided from the
days by `--rule-med`. Hour lines `--rule`. Whole grid inside a `--rule-med` border so it reads as
one object.

### Class blocks
Wash + 3px left rule in the course hue; text always `--text` / `--muted`. Desktop shows code,
instructor, time.

---

## 5 — Course hues

Eight hues, **one hex each**:

`#2f6bff` `#e0561f` `#17a06a` `#9d4edd` `#c9910d` `#00a0b8` `#e0447f` `#7cb518`

- Fill = the hue at **10%** on light, **24%** on dark.
- Left rule = the hue at full.
- Block text = `--text` / `--muted`, never a per-course color.

That last rule is what makes dark mode nearly free: identity comes from the rule and the wash, so
one value per course covers both themes and contrast is guaranteed in each.

**Eight, not six.** The current `SECTION_COLORS` has six and cycles with `%`, so a 7-course
shortlist gives two courses the same color — invisible with 5 fake courses, real at 700 rows.

---

## 6 — Responsive

Target: **the whole week visible on a phone, no horizontal scrolling.**

Budget per column = viewport − 16px page padding − 2px border − 36px gutter, split between days.
A column needs ~12px overhead; `104-01` at 9px mono needs 33px.

| Viewport | 4 days | 5 days | 6 days | 7 days |
|---|---|---|---|---|
| 320px | 66.5 ✅ | 53.2 ✅ | 44.3 ⚠️ | 38.0 ❌ |
| 360px | 76.5 ✅ | 61.2 ✅ | 51.0 ✅ | 43.7 ⚠️ |
| 390px | 84.0 ✅ | 67.2 ✅ | 56.0 ✅ | 48.0 ✅ |

### The five changes

1. **Columns become `minmax(0, 1fr)`, not `1fr`.** Plain `1fr` is shorthand for `minmax(auto, 1fr)`,
   and that `auto` floor makes the column refuse to shrink below its widest content — one long code
   silently forces the grid wider than the screen. `minmax(0, 1fr)` sets the floor to zero.
   **This is the whole trick and the easiest thing to get wrong.**
2. **`overflow: hidden` on cells and blocks.** Even with a zero floor, over-wide content paints
   outside its cell.
3. **Gutter 110px → 36–40px**, label `9:00 AM` → `9 AM`. Still 12-hour — only the `:00` is dropped,
   and it is always zero on an hour line. `to12Hour()` itself does not change; blocks and the
   section list keep the full format.
4. **Blocks shed lines as space runs out.** Desktop: code, instructor, time. Phone: subject over
   code-section only. *The time is redundant on a grid* — vertical position already encodes it.
   Instructor is the real loss and is one tap away in the section picker.
5. **Page padding 20px → 8px** on mobile. Buys 24px.

All five are CSS. Point 4 renders every line always and hides two in the media query, so there is
**no resize listener and no width in state**. The only JSX edit is the column string in
`gridTemplateColumns`.

### Where it stops

7 days at 320px gives 26px of text space against a 33px requirement. It does not fit, and 7px type
is not a fix.

This may never matter: the UAE working week is Mon–Fri, `App.jsx` only widens past Thursday when a
class actually falls there, and the current data tops out at Friday. **Check against the real 700
rows rather than engineering for it now.** If a 6–7 day week does appear, a `max-width: 340px` query
re-enabling horizontal scroll *for that case only* is a few lines and degrades instead of breaking.

---

## 7 — States

- **Focus** — `outline: none` plus a 3px `--focus` ring, on every select, button and checkbox.
  Nothing in the app currently shows focus at all; this is accessibility, not polish.
- **Hover** — primary → `--accent-hover`; secondary → border to `--rule-strong`; `×` → text to
  `--danger`, no background change.
- **Disabled** — prev/next at the ends of the result list: `--faint` text, `--rule` border,
  `cursor: default`. Do not hide them; the layout would jump.
- **Row hover** — background `--surface-alt`. That is the whole effect.

---

## 8 — Build order

1. **Tokens + page frame** — both theme blocks, `body`, board container.
2. **Status strip** — replaces the `<h1>`. JSX.
3. **Buttons, selects, focus, error** — pure CSS. Biggest visible jump for the least work.
4. **View 1 → table** — JSX: row grid, column header, mobile collapse.
5. **View 2 → section rows** — JSX: meeting days/times per section.
6. **Grid restyle** — day header band, gutter, rules, blocks.
7. **Grid responsive** — `minmax(0, 1fr)`, gutter shrink, block line-shedding.
8. **Theme toggle** — optional. The dark values already exist, so it is a button plus
   `localStorage`.

---

## On custom properties

`plan.md` says extract custom properties as a refactor *once repetition is visible*, not upfront,
because "naming colors before choosing them is backwards."

That precondition is now met — the colors are chosen. Two themes also make variables **structural
rather than cosmetic**: a theme cannot be swapped without them. So starting from the token block is
the refactor arriving on schedule, not jumping the gun.

---

## Still open

- **Theme switcher.** Every theme is the same token names with different values, so shipping more
  than one is nearly free in CSS — each extra is one `[data-theme]` block, zero markup change. The
  real cost is the switcher UI and persisting the choice. Four other themes were designed and
  rejected in favour of Amber (Ink, Signal, Terminal, Blueprint) and could be revived cheaply.
- **Agenda view for phones.** A vertical list grouped by day reads better at 320px than any grid
  can, and is what most mobile calendar apps do. Not proposed — the grid was the requirement — but
  noted as the fallback if the grid disappoints on real devices.
