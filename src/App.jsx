import './App.css'
import { useState, Fragment, useEffect, useMemo } from 'react'
import { DAYS, generateSchedules, orderedEligibleLists, findIncompatiblePairs, timeToMinutes, to12Hour, formatMeetings, buildBlockedMask } from './schedule'
import { Analytics } from "@vercel/analytics/react"

// course colors in weekly grid render
const COURSE_HUES = ["#2f6bff", "#e0561f", "#17a06a", "#9d4edd", "#c9910d", "#00a0b8", "#e0447f", "#7cb518"]

// lock icon svg
function LockIcon({ locked, className }) {
  return (
    <svg className={className} viewBox="0 0 16 16" width="14" height="14"
      fill="none" stroke="currentColor" strokeWidth="2.25">
      <rect x="3" y="7" width="10" height="7" />
      <path d={locked ? "M5 7V5a3 3 0 0 1 6 0v2" : "M5 7V5a3 3 0 0 1 6 0"} />
    </svg>
  )
}

// sorts all subjects
function groupBySubject(courses) {
  const bySubject = {}

  for (const course of courses) {

    if (!bySubject[course.subject]) {
      bySubject[course.subject] = { subject: course.subject, courses: [] }
    }

    bySubject[course.subject].courses.push(course)

  }

  const grouped = Object.values(bySubject).sort((a, b) => a.subject.localeCompare(b.subject))
  grouped.forEach((s) => s.courses.sort((a, b) => a.code.localeCompare(b.code)))
  return grouped
}

// tries to load rows from localStorage by going through checks, otherwise returns null
function loadRowsFromStorage() {
  const saved = localStorage.getItem("rows")
  if (!saved) return null

  try {
    const parsed = JSON.parse(saved)

    if (!Array.isArray(parsed)) return null

    const isValid = parsed.every((row) =>
      typeof row === "object" && row !== null &&
      typeof row.subject === "string" &&
      typeof row.code === "string" &&
      Array.isArray(row.sections)
    )

    return isValid ? parsed : null

  } catch {
    return null
  }
}

function App() {

  // STATE HOOKS (triggers re-render)
  const [rows, setRows] = useState([{ id: 1, subject: "", code: "", sections: [], locked: null }])
  const [customizingID, setCustomizingID] = useState(null)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const [error, setError] = useState("")
  const [errorId, setErrorId] = useState(0)

  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const combos = rows.map((row) => row.subject + row.code)
  const hasDuplicates = new Set(combos).size !== combos.length

  const [courses, setCourses] = useState([])
  const subjects = useMemo(() => groupBySubject(courses), [courses])

  const [filters, setFilters] = useState({
    excludedDays: [],
    nothingBefore: "",
    nothingAfter: "",
    busyBlocks: []
  })

  const [lastUpdated, setLastUpdated] = useState(null)

  // EFFECT HOOKS

  // fetches courses + last updated in one request
  useEffect(() => {
    fetch('https://aurak-schedule-finder.onrender.com/initial-data')
      .then(r => r.json())
      .then(data => {
        console.log(data)
        setCourses(data.courses)
        setLastUpdated(data.fetched_at)
      })
  }, [])

  // sets error toast
  useEffect(() => {
    if (!error) return
    const timer = setTimeout(() => setError(""), 5000)
    return () => clearTimeout(timer)
  }, [error, errorId])

  // checks if rows are still valid in case of updates, strip out if not
  useEffect(() => {
    if (courses.length === 0) return

    const validRows = rows
      .map((row) => {
        if (row.subject === "") return row

        const subj = subjects.find((s) => s.subject === row.subject)
        if (!subj) return null

        if (row.code === "") return row

        const course = subj.courses.find((c) => c.code === row.code)
        if (!course) return null

        const validSections = row.sections.filter((num) => course.sections.some((s) => s.section_number === num))
        return { ...row, sections: validSections }
      })
      .filter((row) => row !== null)

    if (JSON.stringify(rows) !== JSON.stringify(validRows)) {
      setRows(validRows.length === 0 ? [{ id: 1, subject: "", code: "", sections: [], locked: null }] : validRows)
      showError("Some of your saved courses are no longer available and were removed.")
    }

  }, [courses])

  // loads courses from localStorage
  useEffect(() => {
    const loaded = loadRowsFromStorage()
    if (loaded) {
      setRows(loaded)
    }
  }, [])

  // saves courses to localStorage
  useEffect(() => {
    localStorage.setItem("rows", JSON.stringify(rows))
  }, [rows])

  // creates an array of credits for each re-render
  const creditList = rows.map((row) => {
    if (row.subject == "") return 0

    const subj = subjects.find((s) => row.subject === s.subject)
    if (!subj) return 0

    const course = subj.courses.find((c) => c.code === row.code)

    return course ? course.credits : 0

  })

  // .reduce iterates elements of an array into one output
  const totalCredits = creditList.reduce((sum, c) => sum + c, 0)

  // sets the schedule index
  function setIndex(increment) {
    const newIndex = currentIndex + increment
    if (newIndex >= 0 && newIndex < results.length) {
      setCurrentIndex(newIndex)
    }
  }

  // sets error, triggers error useEffect toast
  function showError(message) {
    setError(message)
    setErrorId((n) => n + 1)
  }

  // updates row using changes
  function updateRow(id, changes) {
    setRows(rows.map((row) => row.id === id ? { ...row, ...changes } : row))
  }

  // adds new default row with setter
  function addRow() {
    const nextId = rows.length === 0 ? 1 : Math.max(...rows.map((r) => r.id)) + 1
    setRows([...rows, { id: nextId, subject: "", code: "", sections: [], locked: null }])
  }

  // filters out removed row
  function removeRow(id) {
    setRows(rows.filter((row) => row.id !== id))
  }

  // sets rows to null, except locked ones
  function clearRows() {
    setRows(rows.filter((row) => row.locked !== null))
  }

  function updateFilters(changes) {

    setFilters({ ...filters, ...changes })
  }

  //
  function toggleExcludedDay(day) {
    const alreadyIn = filters.excludedDays.includes(day)
    alreadyIn ? updateFilters({ excludedDays: filters.excludedDays.filter((d) => d !== day) }) :
      updateFilters({ excludedDays: [...filters.excludedDays, day] })
  }

  const WEEKEND = ["Fri", "Sat", "Sun"]

  function toggleWeekend() {
    const allExcluded = WEEKEND.every((day) => filters.excludedDays.includes(day))

    if (allExcluded) {
      updateFilters({ excludedDays: filters.excludedDays.filter((d) => !WEEKEND.includes(d))})
    } else {
      const merged = [...new Set([...filters.excludedDays, ...WEEKEND])]
      updateFilters({ excludedDays: merged })
    }
  }

  const START_TIMES = ["", "08:00", "09:00", "10:30", "12:00", "13:30"]
  const END_TIMES = ["11:45", "13:15", "14:45", "16:15", "17:45", ""]

  // goes through checks when generate is clicked
  function handleSubmit() {
    const incomplete = rows.some((row) => row.subject === "" || row.code === "")

    if (rows.length === 0) {
      showError("Please add at least one course.")

    } else if (incomplete) {
      showError("Please fill in all fields.")

    } else if (hasDuplicates) {
      showError("Please remove all duplicates.")

    } else {
      setLoading(true)

      // setTimeout only runs when the main code finishes running
      setTimeout(() => {
        const eligibleLists = orderedEligibleLists(rows, subjects, buildBlockedMask(filters))
        const generated = generateSchedules(eligibleLists)

        if (generated.length === 0) {
          const pairs = findIncompatiblePairs(eligibleLists)

          pairs.length === 0 ? showError("No schedules found.") :
            showError(`${pairs[0].a[0].courseSubject} ${pairs[0].a[0].courseCode} is incompatible with ${pairs[0].b[0].courseSubject} ${pairs[0].b[0].courseCode}`)

        } else {
          setError("")
          setResults(generated)
          setCurrentIndex(0)
        }
        setLoading(false)

      }, 0) // the delay until function runs (0 means instant)
    }
  }

  // turns last updated into readable format
  function formatLastUpdated(iso) {
    if (!iso) return "…"
    const date = new Date(iso + "Z")
    return date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  //
  const customizingRow = rows.find((row) => row.id === customizingID)

  function getCustomizingCourse() {
    if (!customizingRow) return null

    const subj = subjects.find((s) => s.subject === customizingRow.subject)
    if (!subj) return null

    return subj.courses.find((c) => c.code === customizingRow.code)

  }

  const customizingCourse = getCustomizingCourse()

  const usedDays = new Set()
  const meetingTimes = []
  if (results) {
    for (const schedule of results) {
      for (const section of schedule) {
        for (const meeting of section.meetings) {
          usedDays.add(meeting.day)
          meetingTimes.push(timeToMinutes(meeting.start_time), timeToMinutes(meeting.end_time))
        }
      }
    }
  }
  const usedIndexes = []
  DAYS.forEach((day, index) => {
    if (usedDays.has(day)) usedIndexes.push(index)
  })

  const firstIndex = Math.min(0, ...usedIndexes)
  const lastIndex = Math.max(3, ...usedIndexes)
  const activeDays = DAYS.slice(firstIndex, lastIndex + 1)

  const earliestMinute = Math.min(...meetingTimes)
  const latestMinute = Math.max(...meetingTimes)
  const startHour = Math.floor(earliestMinute / 60)
  const endHour = Math.ceil(latestMinute / 60)
  const activeHours = []

  for (let hour = startHour; hour < endHour; hour++) {
    activeHours.push(hour)
  }


  function courseSelectionView() {

    return (

      <>

        <div className="table-header">
          <span>SUBJ</span>
          <span>CODE</span>
          <span>TITLE</span>
          <span>SEC</span>
          <button className="btn-clear-all" onClick={clearRows} disabled={rows.length === 0 || rows.every((row) => row.locked !== null)}
            aria-label="Remove all courses" title="Remove all courses">CLEAR</button>
        </div>

        {rows.map((row) => {

          const currentSubject = subjects.find((s) => s.subject === row.subject)
          const courses = currentSubject ? currentSubject.courses : []
          const rowCourse = courses.find((c) => c.code === row.code)
          const isInProgress = row.subject !== "" && row.code === ""

          return (

            <div key={row.id} className={isInProgress ? "row row-active" : "row"}>

              <select value={row.subject} aria-label="Subject" disabled={!!row.locked} onChange={(e) => updateRow(row.id, { subject: e.target.value, code: "", sections: [], locked: null })}>
                <option value="">--</option>
                {subjects.map((s) => (
                  <option key={s.subject} value={s.subject}>{s.subject}</option>
                ))}
              </select>

              <select value={row.code} aria-label="Course code" disabled={!!row.locked} onChange={(e) => updateRow(row.id, { code: e.target.value, sections: [], locked: null })}>
                <option value="">--</option>
                {courses.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code === row.code ? c.code : `${c.code} - ${c.title}`}
                  </option>
                ))}
              </select>

              <span className={rowCourse ? "row-title" : "row-title row-title-placeholder"}>
                {rowCourse ? rowCourse.title : "select a course"}
              </span>


              <div className="sec-cell">
                {rowCourse && (
                  <>
                    <button className="btn-secondary" aria-label={`Edit sections for ${row.subject} ${row.code}`}
                      onClick={() => setCustomizingID(row.id)}>EDIT</button>
                    <span className={`sec-text ${row.sections.length !== 0 ? "sec-text-accent" : ""} ${row.locked ? "lock-toggle-active" : ""}`} onClick={() => row.locked ? updateRow(row.id, { locked: null }) : {}}>
                      {row.locked ? <LockIcon locked={true} /> : (row.sections.length === 0 || row.sections.length === rowCourse.sections.length ? "ALL" : `${row.sections.length}/${rowCourse.sections.length}`)}</span>
                  </>
                )}
              </div>

              <button className="btn-destructive" disabled={!!row.locked} onClick={() => removeRow(row.id)} aria-label="Remove course">×</button>

            </div>

          )
        })}

        <div className="table-footer">

          <div className="footer-primary-actions">
            <button className="btn-secondary" onClick={addRow}>+ ADD COURSE</button>
            <button className="btn-secondary" onClick={() => setFiltersOpen(!filtersOpen)}>FILTERS</button>
          </div>
          <div className="spacer"></div>
          <div className="footer-top-row">
            <span className="footer-credits">TOTAL CREDITS: <span className="credits-value">{totalCredits}.0</span></span>
            <button className="btn-clear-all footer-clear-mobile" onClick={clearRows} disabled={rows.length === 0 || rows.every((row) => row.locked !== null)}
              aria-label="Remove all courses" title="Remove all courses">CLEAR</button>
          </div>
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? "GENERATING…" : "GENERATE →"}</button>

        </div>
      </>
    )
  }
  function editSectionsView() {

    return (

      <>

        <div className="sub-strip">
          <button onClick={() => setCustomizingID(null)}>← BACK</button>
          <span className="spacer"></span>
          <button className="btn-reset" onClick={() => { updateRow(customizingID, { sections: [], locked: null }) }}>RESET</button>
          <span className="section-code">{customizingRow.subject} {customizingCourse.code}</span>
        </div>
        <div className="section-desc">{customizingCourse.title}</div>

        {customizingCourse.sections.map((s) => {
          const isSelected = customizingRow.sections.includes(s.section_number)
          const isLockedSection = customizingRow.locked === s.section_number
          const otherLocked = customizingRow.locked && !isLockedSection
          return (
            <label key={s.section_number} className={`section-row${isSelected ? " section-row-selected" : ""}${otherLocked ? " section-row-disabled" : ""}${isLockedSection ? " section-row-locked" : ""}`}>
              <input type="checkbox" checked={isSelected} disabled={otherLocked || isLockedSection} onChange={() => {
                const alreadyIn = customizingRow.sections.includes(s.section_number)
                const newSections = alreadyIn
                  ? customizingRow.sections.filter((sec) => sec !== s.section_number)
                  : [...customizingRow.sections, s.section_number]
                updateRow(customizingID, { sections: newSections })
              }} />
              <span className="section-num">{s.section_number.length === 1 ? "0" + s.section_number : s.section_number}</span>
              <span className="section-instructor">{s.instructor}</span>
              {isSelected && !otherLocked && (
                <button type="button" className={isLockedSection ? "lock-toggle lock-toggle-active" : "lock-toggle"} aria-label={isLockedSection ? "Unlock section" : "Lock section"}
                  onClick={() => {
                    updateRow(customizingID, { locked: isLockedSection ? null : s.section_number })
                  }}>
                  <LockIcon locked={isLockedSection} />
                </button>
              )}
              <span className="section-meeting">{formatMeetings(s.meetings)}</span>

            </label>
          )
        })}

        <p className="section-note">Leave all sections unchecked to include every one of them.</p>
      </>
    )
  }

  function filtersView() {
    return (
      <>
        <div className="sub-strip">
          <button onClick={() => setFiltersOpen(false)}>← BACK</button>
          <span className="spacer"></span>
          <button className="btn-reset" onClick={() => {
            updateFilters({
              excludedDays: [],
              nothingBefore: "",
              nothingAfter: "",
              busyBlocks: []
            })}}>RESET ALL</button>
          <span className="section-code">FILTERS</span>
        </div>

        <div className="filter-block">
          <div className="filter-label">DAYS OFF</div>
          <div className="filter-chips filter-chips-days">
            {DAYS.map((day) => (
              <button
                key={day}
                className={`filter-chip ${filters.excludedDays.includes(day) ? "filter-chip-active" : ""}`}
                onClick={() => toggleExcludedDay(day)}>
                {day.toUpperCase()}
              </button>
            ))}
            <button
              className={`filter-chip filter-chip-weekend ${WEEKEND.every((day) => filters.excludedDays.includes(day)) ? "filter-chip-active" : ""}`}
              onClick={toggleWeekend}>
              WEEKEND
            </button>
          </div>
        </div>

        <div className="filter-block">
          <div className="filter-label">EARLIEST</div>
          <div className="filter-chips filter-chips-times">
            {START_TIMES.map((time) => (
              <button
                key={time}
                className={`filter-chip ${filters.nothingBefore === time ? "filter-chip-active" : ""}`}
                onClick={() => updateFilters({ nothingBefore: time })}>
                {time === "" ? "ANY" : to12Hour(time)}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-block">
          <div className="filter-label">LATEST</div>
          <div className="filter-chips filter-chips-times">
            {END_TIMES.map((time) => (
              <button
                key={time}
                className={`filter-chip ${filters.nothingAfter === time ? "filter-chip-active" : ""}`}
                onClick={() => updateFilters({ nothingAfter: time })}>
                {time === "" ? "ANY" : to12Hour(time)}
              </button>
            ))}
          </div>
        </div>

      </>
    )
  }

  function resultsView() {

    return (
      <>

        <div className="sub-strip">
          <button onClick={() => setResults(null)}>← BACK</button>
          <span className="spacer"></span>
          <div className="pager-group" aria-live="polite">
            <button className="pager" aria-label="Previous schedule" disabled={currentIndex === 0} onClick={() => setIndex(-1)}>‹</button>
            <span className="counter-current">{String(currentIndex + 1).padStart(3, "0")}</span>
            <span className="counter-sep">/</span>
            <span className="counter-total">{String(results.length).padStart(3, "0")}</span>
            <button className="pager" aria-label="Next schedule" disabled={currentIndex === results.length - 1} onClick={() => setIndex(1)}>›</button>
          </div>
        </div>

        <div className="grid-scroll">
          <div className="weekly-grid" style={{
            gridTemplateColumns: `var(--gutter-w, 70px) repeat(${activeDays.length}, var(--day-w, minmax(0, 1fr)))`,
            gridTemplateRows: `auto repeat(${activeHours.length * 12}, var(--slot-h, 5px))`
          }}>
            <div className="grid-corner" style={{ gridColumn: 1, gridRow: 1 }}></div>

            {activeDays.map((day, dayIndex) => (
              <div key={day} className="day-header" style={{ gridColumn: dayIndex + 2, gridRow: 1 }}>{day.toUpperCase()}</div> // builds the header row
            ))}

            {activeHours.map((hour, hourIndex) => (
              <Fragment key={hour}>
                <div className={hourIndex === 0 ? "gutter-cell no-rule-top" : "gutter-cell"} style={{ gridColumn: 1, gridRow: `${hourIndex * 12 + 2} / span 12` }}>
                  <span className="gutter-full">{to12Hour(`${hour}:00`)}</span>
                  <span className="gutter-short">{to12Hour(`${hour}:00`).replace(":00", "")}</span>
                </div>
                {activeDays.map((day, dayIndex) => {
                  const hourCellClass = ["hour-cell", hourIndex === 0 && "no-rule-top", dayIndex === 0 && "no-rule-left"].filter(Boolean).join(" ")
                  return <div key={day} className={hourCellClass} style={{
                    gridColumn: dayIndex + 2, gridRow: `${hourIndex * 12 + 2} / span 12`
                  }}></div>
                })}
              </Fragment>
            ))}

            {/*builds every section block using map*/}
            {results[currentIndex].map((section, sectionIndex) =>
              section.meetings.map((meeting) => {
                const startSlot = (timeToMinutes(meeting.start_time) - startHour * 60) / 5
                const durationSlots = (timeToMinutes(meeting.end_time) - timeToMinutes(meeting.start_time)) / 5
                const gridRowStart = startSlot + 2
                const gridColumn = activeDays.indexOf(meeting.day) + 2
                const hue = COURSE_HUES[sectionIndex % COURSE_HUES.length]

                return (
                  <div
                    key={`${section.courseCode}-${section.section_number}-${meeting.day}`}
                    className={durationSlots < 12 ? "class-block class-block-short" : "class-block"}
                    title={`${section.courseSubject} ${section.courseCode}-${section.section_number} · ${section.instructor} · ${to12Hour(meeting.start_time)}–${to12Hour(meeting.end_time)}`}
                    style={{ gridColumn, gridRow: `${gridRowStart} / span ${durationSlots}`, "--hue": hue }}
                  >
                    <div className="block-code">{section.courseSubject} {section.courseCode}-{section.section_number}</div>
                    <div className="block-instructor">{section.instructor}</div>
                    <div className="block-time">{to12Hour(meeting.start_time).slice(0, -3)}–{to12Hour(meeting.end_time).slice(0, -3)}</div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </>
    )
  }

  return (
    <>

      <Analytics></Analytics>
      <div className="page-main">

        <div className="card">

          <div className="status-strip">
            <h1 className="strip-title">AURAK Schedule Finder</h1>
            <span className="spacer"></span>
            <div className="chip-row">
              <a className="chip" href="https://eums.aurak.ac.ae/Public/Schedule?h42blu9ygNZPnBJmMbXuWAu8XR3hS4tcKtMIP6xFd2U="
                target="_blank" rel="noopener noreferrer">Fall 2026 · Updated {formatLastUpdated(lastUpdated)}</a>
            </div>
          </div>

          {results ? (

            resultsView()

          ) : customizingID ? (

            editSectionsView()

          ) : filtersOpen ? (

            filtersView()

          ) : (

            courseSelectionView()

          )}

          {error && (
            <div className="toast" role="alert">
              <span className="toast-msg">{error}</span>
              <button className="toast-close" onClick={() => setError("")} aria-label="Dismiss error">×</button>
            </div>
          )}

        </div>

      </div>

      <div className="page-footer">
        <p>Developed by <a href="https://github.com/akeem-abdallah" target="_blank" rel="noopener noreferrer">Akeem Abdallah</a> · © 2026</p>
        <p>Unofficial student tool — not affiliated with or endorsed by AURAK. By using this site, you take full responsibility for any consequences of relying on this data.</p>
        <p className="footer-feedback">Found a bug or have feedback? <a href="https://forms.gle/zvn9hKr27aUjvTMXA" target="_blank" rel="noopener noreferrer">Let me know</a>.</p>
      </div>
    </>
  )
}

export default App
