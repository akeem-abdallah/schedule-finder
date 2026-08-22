import './App.css'
import { useState, Fragment, useEffect, useMemo, useRef } from 'react'
import { DAYS, COURSE_HUES, SEMESTER, generateSchedules, getEligibleSections, orderedEligibleLists, findIncompatiblePairs, scheduledLists, timeToMinutes, to12Hour, formatMeetings, buildBlockedMask, combinedScheduleMask, longestGapMinutes, emptyFilteredRow, passesFilters } from './schedule'
import { Analytics } from "@vercel/analytics/react"
import { renderSchedule, saveCanvas, canShareFiles, ensureExportFonts, EXPORT_PRESETS, DESIGNS } from './exportImage'



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

const LONGEST_GAP_OPTIONS = [
  { label: "15 MIN", minutes: 15 },
  { label: "30 MIN", minutes: 30 },
  { label: "1 HR", minutes: 60 },
  { label: "2 HR", minutes: 120 },
  { label: "3 HR", minutes: 180 },
  { label: "ANY", minutes: "" },
]

const GAP_VALUES = LONGEST_GAP_OPTIONS.map((option) => option.minutes)

const DEFAULT_FILTERS = {
  excludedDays: [],
  nothingBefore: "",
  nothingAfter: "",
  busyBlocks: [],
  instructorAssigned: false,
  fullSections: false,
  longestGap: ""
}

function isTimeValue(value) {
  return value === "" || (typeof value === "string" && /^\d{1,2}:\d{2}$/.test(value))
}

function isValidBusyBlock(block) {
  return typeof block === "object" && block !== null &&
    typeof block.id === "number" && Number.isFinite(block.id) &&
    (block.day === "ALL" || DAYS.includes(block.day)) &&
    isTimeValue(block.start_time) && isTimeValue(block.end_time) &&
    typeof block.note === "string"
}

// tries to load rows from localStorage by going through checks, otherwise returns null

function loadFromStorage(type) {
  const saved = localStorage.getItem(type)
  if (!saved) return null

  try {
    const parsed = JSON.parse(saved)
    let isValid

    if (type === "rows") {
      if (!Array.isArray(parsed)) return null
      isValid = parsed.every((row) =>
        typeof row === "object" && row !== null &&
        typeof row.subject === "string" &&
        typeof row.code === "string" &&
        Array.isArray(row.sections)
      )

      return isValid ? parsed : null

    } else if (type === "filters") {
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return null

      const merged = { ...DEFAULT_FILTERS, ...parsed }
      isValid =
        Array.isArray(merged.excludedDays) && merged.excludedDays.every((d) => DAYS.includes(d)) &&
        isTimeValue(merged.nothingBefore) && isTimeValue(merged.nothingAfter) &&
        typeof merged.instructorAssigned === "boolean" &&
        typeof merged.fullSections === "boolean" &&
        GAP_VALUES.includes(merged.longestGap) &&
        Array.isArray(merged.busyBlocks) && merged.busyBlocks.every(isValidBusyBlock)

      return isValid ? merged : null

    } else if (type === "theme") {

      isValid = parsed === "system" || parsed === "light" || parsed === "dark"

      return isValid ? parsed : null
    }

    return null

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

  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const [lastUpdated, setLastUpdated] = useState(null)

  const [theme, setTheme] = useState("system")
  const [exportOpen, setExportOpen] = useState(false)
  const [exportPreset, setExportPreset] = useState("story")
  const [exportTheme, setExportTheme] = useState("dark")
  const [exportDesign, setExportDesign] = useState("classic")
  const [exportBusy, setExportBusy] = useState(false)
  const [fontsReady, setFontsReady] = useState(false)

  // EFFECT HOOKS

  // fetches courses + last updated in one request
  useEffect(() => {
    fetch('https://aurak-schedule-finder.onrender.com/initial-data')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(data => {
        if (!data || !Array.isArray(data.courses)) throw new Error("bad payload")
        setCourses(data.courses)
        setLastUpdated(data.fetched_at)
      })
      .catch(() => {
        showError("Couldn't load course data. The server may be waking up — please refresh in a moment.")
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
        const validLocked = row.locked && course.sections.some((s) => s.section_number === row.locked) ? row.locked : null
        return { ...row, sections: validSections, locked: validLocked }
      })
      .filter((row) => row !== null)

    if (JSON.stringify(rows) !== JSON.stringify(validRows)) {
      setRows(validRows.length === 0 ? [{ id: 1, subject: "", code: "", sections: [], locked: null }] : validRows)
      showError("Some of your saved courses are no longer available and were removed.")
    }

  }, [courses])

  // loads from localStorage
  useEffect(() => {
    const loaded = loadFromStorage("rows")
    if (loaded) {
      setRows(loaded)
    }
  }, [])

  useEffect(() => {
    const loaded = loadFromStorage("filters")
    if (loaded) {
      setFilters(loaded)
    }
  }, [])

  useEffect(() => {
    const loaded = loadFromStorage("theme")
    if (loaded) {
      setTheme(loaded)
    }
  }, [])


  // saves courses to localStorage
  useEffect(() => {
    localStorage.setItem("rows", JSON.stringify(rows))
  }, [rows])

  useEffect(() => {
    localStorage.setItem("filters", JSON.stringify(filters))
  }, [filters])

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme))
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

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
  const blockedMask = buildBlockedMask(filters)
  const totalEligibleSections = rows.reduce((sum, row) => sum + getEligibleSections(row, subjects).length, 0)
  const excludedSections = totalEligibleSections - orderedEligibleLists(rows, subjects, blockedMask, filters).reduce((sum, list) => sum + list.length, 0)

  const activeFilterCount = [
    filters.excludedDays.length > 0,
    filters.nothingBefore !== "",
    filters.nothingAfter !== "",
    filters.busyBlocks.length > 0,
    filters.instructorAssigned,
    filters.fullSections,
    filters.longestGap !== ""
  ].filter(Boolean).length

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
  const canvasRef = useRef(null)
  const exportPopupRef = useRef(null)
  const exportOpenBtnRef = useRef(null)

  function removeBusyBlock(id) {
    updateFilters({ busyBlocks: filters.busyBlocks.filter((block) => block.id !== id) })
  }

  function addBusyBlock() {
    const ids = filters.busyBlocks.map((f) => f.id).filter((id) => Number.isFinite(id))
    const nextId = ids.length === 0 ? 1 : Math.max(...ids) + 1
    updateFilters({ busyBlocks: [...filters.busyBlocks, { ...{ day: "ALL", start_time: "", end_time: "", note: "" }, id: nextId }] })
  }

  function updateBusyBlock(id, changes) {
    updateFilters({ busyBlocks: filters.busyBlocks.map((block) => block.id === id ? { ...block, ...changes } : block) })
  }

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
        const blockedMask = buildBlockedMask(filters)
        const eligibleLists = orderedEligibleLists(rows, subjects, blockedMask, filters)
        const generated = generateSchedules(eligibleLists)
        const withinGap = filters.longestGap === "" ? generated :
          generated.filter((schedule) => longestGapMinutes(combinedScheduleMask(schedule)) <= filters.longestGap)

        if (withinGap.length === 0) {
          const gapOption = LONGEST_GAP_OPTIONS.find((option) => option.minutes === filters.longestGap)
          const impossibleWindow = filters.nothingBefore !== "" && filters.nothingAfter !== "" &&
            timeToMinutes(filters.nothingBefore) >= timeToMinutes(filters.nothingAfter)
          const row = emptyFilteredRow(rows, subjects, blockedMask, filters)

          if (eligibleLists.every((list) => list.length > 0) && scheduledLists(eligibleLists).length === 0) {
            showError("None of your courses have scheduled meeting times.")

          } else if (generated.length > 0) {
            showError(`No schedules match LONGEST BREAK: ${gapOption ? gapOption.label : "your limit"}. Try a longer one.`)

          } else if (filters.excludedDays.length === DAYS.length) {
            showError("Every day is marked as a day off.")

          } else if (impossibleWindow) {
            showError(`Courses can't both start after ${to12Hour(filters.nothingBefore)} and end before ${to12Hour(filters.nothingAfter)}.`)

          } else if (row) {
            const rowEligible = getEligibleSections(row, subjects)

            // the student ticked sections, and every one of them is filtered out
            if (row.sections.length > 0) {
              showError(`Your selected sections of ${row.subject} ${row.code} are excluded by your filters.`)

            // nothing ticked, and the whole course is full
            } else if (!filters.fullSections && rowEligible.every((s) => s.available_seats === 0)) {
              showError(`All sections of ${row.subject} ${row.code} are full.`)

            } else {
              showError(`No sections of ${row.subject} ${row.code} fit your filters.`)
            }

          } else {
            const pairs = findIncompatiblePairs(eligibleLists)

            pairs.length === 0 ? showError("No schedules found.") :
              showError(`${pairs[0].a[0].courseSubject} ${pairs[0].a[0].courseCode} is incompatible with ${pairs[0].b[0].courseSubject} ${pairs[0].b[0].courseCode}`)
          }

        } else {
          setError("")
          setResults(withinGap)
          setCurrentIndex(0)
        }
        setLoading(false)

      }, 0) // the delay until function runs (0 means instant)
    }
  }

  // The preview canvas IS the export canvas — drawn at full resolution and
  // scaled down by CSS — so what's on screen is exactly the file you get.
  async function handleSave(preferShare) {
    if (!canvasRef.current || exportBusy) return
    setExportBusy(true)
    // try/finally so a throw can't leave the buttons disabled forever.
    try {
      const name = `aurak-schedule-${currentIndex + 1}`
      const result = await saveCanvas(canvasRef.current, { basename: name, preferShare })
      // "cancelled" is the student dismissing the share sheet — stay quiet.
      if (result === "failed") {
        showError("Couldn't save the image. Try a smaller size, or use Download instead.")
      }
    } catch {
      showError("Couldn't save the image. Try a smaller size, or use Download instead.")
    } finally {
      setExportBusy(false)
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

  const earliestMinute = meetingTimes.length === 0 ? 480 : Math.min(...meetingTimes)
  const latestMinute = meetingTimes.length === 0 ? 1020 : Math.max(...meetingTimes)
  const startHour = Math.floor(earliestMinute / 60)
  const endHour = Math.ceil(latestMinute / 60)
  const activeHours = []

  for (let hour = startHour; hour < endHour; hour++) {
    activeHours.push(hour)
  }

  const exportSize = EXPORT_PRESETS.find((p) => p.id === exportPreset) ?? EXPORT_PRESETS[0]
  const shareSupported = useMemo(() => canShareFiles(), [])

  useEffect(() => {
    if (!exportOpen) return
    let alive = true
    ensureExportFonts()
      .catch(() => null)
      .then(() => {
        if (alive) setFontsReady(true)
      })
    return () => { alive = false }
  }, [exportOpen])

  useEffect(() => {
    if (!exportOpen || !canvasRef.current) return
    renderSchedule(canvasRef.current, {
      schedule: results ? results[currentIndex] : [],
      activeDays,
      activeHours,
      theme: exportTheme,
      design: exportDesign,
      credits: totalCredits,
      width: exportSize.width,
      height: exportSize.height,
    })
  }, [exportOpen, fontsReady, exportPreset, exportTheme, exportDesign, totalCredits, results, currentIndex])

  useEffect(() => {
    if (!exportOpen) return

    const opener = exportOpenBtnRef.current
    const popup = exportPopupRef.current
    const focusables = () =>
      popup
        ? [...popup.querySelectorAll('button, [href], input, select, [tabindex]:not([tabindex="-1"])')]
            .filter((el) => !el.disabled && el.offsetParent !== null)
        : []

    focusables()[0]?.focus()

    const onKey = (e) => {
      if (e.key === "Escape") {
        setExportOpen(false)
        return
      }
      if (e.key !== "Tab") return

      const items = focusables()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("keydown", onKey)
      if (opener && typeof opener.focus === "function") opener.focus()
    }
  }, [exportOpen])

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
          const usableCount = getEligibleSections(row, subjects).filter((s) => passesFilters(s, blockedMask, filters)).length

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
                      {row.locked ? <LockIcon locked={true} /> : (usableCount === rowCourse.sections.length ? "ALL" : `${usableCount}/${rowCourse.sections.length}`)}</span>
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
            <button className={`btn-secondary ${activeFilterCount !== 0 ? "filter-active" : ""}`} onClick={() => setFiltersOpen(!filtersOpen)}>
              FILTERS{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </button>
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
          const isTBA = s.instructor === "TBA" && filters.instructorAssigned && !isLockedSection
          const isFull = s.available_seats === 0 && !filters.fullSections && !isLockedSection
          return (
            <label key={s.section_number} className={`section-row${isSelected ? " section-row-selected" : ""}${(otherLocked || isFull || isTBA) ? " section-row-disabled" : ""}${isLockedSection ? " section-row-locked" : ""}`}>
              <input type="checkbox" checked={isSelected} disabled={otherLocked || isLockedSection || isFull || isTBA} onChange={() => {
                const alreadyIn = customizingRow.sections.includes(s.section_number)
                const newSections = alreadyIn
                  ? customizingRow.sections.filter((sec) => sec !== s.section_number)
                  : [...customizingRow.sections, s.section_number]
                updateRow(customizingID, { sections: newSections })
              }} />
              <span className="section-num">{s.section_number.length === 1 ? "0" + s.section_number : s.section_number}</span>
              <span className="section-instructor">{s.instructor}</span>
              {isSelected && !otherLocked && !isFull && !isTBA && (
                <button type="button" className={isLockedSection ? "lock-toggle lock-toggle-active" : "lock-toggle"} aria-label={isLockedSection ? "Unlock section" : "Lock section"}
                  onClick={() => {
                    updateRow(customizingID, { locked: isLockedSection ? null : s.section_number })
                  }}>
                  <LockIcon locked={isLockedSection} />
                </button>
              )}
              <span className="section-seats">{s.available_seats === 0 ? "FULL" : s.available_seats + (s.available_seats === 1 ? " SEAT" : " SEATS")}</span>
              <span className="section-meeting">{formatMeetings(s.meetings)}</span>

            </label>
          )
        })}

        <div className="table-footer">
          <p className="section-note">Leave all sections unchecked to include every one of them.</p>
          <button className="btn-primary" onClick={() => setFiltersOpen(false)}>DONE →</button>
        </div>
      </>
    )
  }

  function filtersView() {
    return (
      <>
        <div className="sub-strip">
          <button onClick={() => setFiltersOpen(false)}>← BACK</button>
          <span className="spacer"></span>
          <button className="btn-reset" onClick={() => updateFilters(DEFAULT_FILTERS)}>RESET ALL</button>
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
          <div className="filter-label">COURSES START AFTER</div>
          <div className="filter-chips filter-chips-times">
            {START_TIMES.map((time) => (
              <button
                key={time}
                className={`filter-chip ${filters.nothingBefore === time ? "filter-chip-active" : ""}`}
                onClick={() => updateFilters({ nothingBefore: time })}>
                {time === "" ? "NONE" : to12Hour(time)}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-block">
          <div className="filter-label">COURSES END BEFORE</div>
          <div className="filter-chips filter-chips-times">
            {END_TIMES.map((time) => (
              <button
                key={time}
                className={`filter-chip ${filters.nothingAfter === time ? "filter-chip-active" : ""}`}
                onClick={() => updateFilters({ nothingAfter: time })}>
                {time === "" ? "NONE" : to12Hour(time)}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-block">
          <div className="filter-label">LONGEST BREAK</div>
          <div className="filter-chips">
            {LONGEST_GAP_OPTIONS.map((option) => (
              <button
                key={option.label}
                className={`filter-chip ${filters.longestGap === option.minutes ? "filter-chip-active" : ""}`}
                onClick={() => updateFilters({ longestGap: option.minutes })}>
                {option.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <label className={`filter-row ${filters.instructorAssigned ? "filter-row-selected" : ""}`}>
          <input type="checkbox" checked={filters.instructorAssigned} onChange={() => updateFilters({ instructorAssigned: !filters.instructorAssigned })} />
          <span className="filter-row-text">Only sections with an assigned instructor</span>
        </label>
        <label className={`filter-row ${filters.fullSections ? "filter-row-selected" : ""}`}>
          <input type="checkbox" checked={filters.fullSections} onChange={() => updateFilters({ fullSections: !filters.fullSections })} />
          <span className="filter-row-text">Include full sections</span>
        </label>

        <div className="filter-block filter-block-tight">
          <div className="filter-label">BUSY TIMES</div>
        </div>
        {filters.busyBlocks.map((block) => (
          <div key={block.id} className="busy-row">
            <select value={block.day} className="busy-day" onChange={(e) => updateBusyBlock(block.id, { day: e.target.value })}>
              <option value="ALL">ALL</option>
              {DAYS.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <div className="busy-time-pair">
              <input type="time" className="busy-time" min="08:00" max="21:00" value={block.start_time}
                onChange={(e) => updateBusyBlock(block.id, { start_time: e.target.value })} />
              <span className="busy-time-sep">to </span>
              <input type="time" className="busy-time" min="08:00" max="21:00" value={block.end_time}
                onChange={(e) => updateBusyBlock(block.id, { end_time: e.target.value })} />
            </div>
            <input type="text" className="busy-note" value={block.note} placeholder="note (optional)"
              onChange={(e) => updateBusyBlock(block.id, { note: e.target.value })} />
            <button className="busy-remove" aria-label="Remove busy time" onClick={() => removeBusyBlock(block.id)}>×</button>
          </div>
        ))}
        <div className="busy-add-wrap">
          <button className="btn-add-busy" onClick={addBusyBlock}>+ ADD BUSY TIME</button>
        </div>

        <div className="table-footer">
          <div className="filter-count">EXCLUDED <b>{excludedSections}</b> OF <b>{totalEligibleSections}</b> SECTIONS</div>
          <span className="spacer"></span>
          <button className="btn-primary" onClick={() => setFiltersOpen(false)}>DONE →</button>
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
          <button className="export-open-btn" ref={exportOpenBtnRef} onClick={() => setExportOpen(true)}>SHARE / EXPORT</button>
          <span className="spacer export-gap"></span>
          <div className="pager-group" aria-live="polite">
            <button className="pager" aria-label="Previous schedule" disabled={currentIndex === 0} onClick={() => setIndex(-1)}>‹</button>
            <span className="counter-current">{String(currentIndex + 1).padStart(3, "0")}</span>
            <span className="counter-sep">/</span>
            <span className="counter-total">{String(results.length).padStart(3, "0")}</span>
            <button className="pager" aria-label="Next schedule" disabled={currentIndex === results.length - 1} onClick={() => setIndex(1)}>›</button>
          </div>
        </div>

        {exportOpen && (
          <div
            className="export-backdrop"
            onClick={() => setExportOpen(false)}
            role="presentation"
          >
            <div
              className="export-popup"
              ref={exportPopupRef}
              role="dialog"
              aria-modal="true"
              aria-label="Save your schedule as an image"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="export-head">
                <h2 className="export-title">SAVE YOUR SCHEDULE</h2>
                <button
                  className="export-close"
                  onClick={() => setExportOpen(false)}
                  aria-label="Close"
                >×</button>
              </div>

              <div className="export-body">
                <div className="export-field">
                  <span className="export-label">PREVIEW</span>
                  <div className="export-preview-frame">
                    <canvas ref={canvasRef} className="export-preview"></canvas>
                  </div>
                </div>

                <div className="export-controls">
                  <div className="export-field">
                    <span className="export-label">SIZE</span>
                    <div className="export-presets">
                      {EXPORT_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          className={preset.id === exportPreset ? "export-preset export-preset-active" : "export-preset"}
                          onClick={() => setExportPreset(preset.id)}
                        >
                          <span className="export-preset-label">{preset.label}</span>
                          <span className="export-preset-sub">{preset.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="export-field">
                    <span className="export-label">DESIGN</span>
                    <div className="export-designs">
                      {DESIGNS.map((design) => (
                        <button
                          key={design.id}
                          className={design.id === exportDesign ? "export-design export-design-active" : "export-design"}
                          onClick={() => setExportDesign(design.id)}
                          title={design.label}
                        >
                          <span className="export-swatch" aria-hidden="true">
                            {design.swatch.map((color, i) => (
                              <i key={i} style={{ background: color }}></i>
                            ))}
                          </span>
                          <span className="export-design-label">{design.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="export-field">
                    <span className="export-label">THEME</span>
                    <div className="export-segment">
                      <button
                        className={exportTheme === "light" ? "export-seg-active" : ""}
                        onClick={() => setExportTheme("light")}
                      >LIGHT</button>
                      <button
                        className={exportTheme === "dark" ? "export-seg-active" : ""}
                        onClick={() => setExportTheme("dark")}
                      >DARK</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="export-footer">
                <div className="export-count">
                  SCHEDULE <b>{String(currentIndex + 1).padStart(3, "0")}</b> OF <b>{String(results.length).padStart(3, "0")}</b>
                </div>
                <span className="spacer"></span>
                <div className="export-actions">
                  {shareSupported && (
                    <button
                      className="btn-secondary export-action"
                      disabled={exportBusy || !fontsReady}
                      onClick={() => handleSave(true)}
                    >SHARE</button>
                  )}
                  <button
                    className="btn-primary export-action"
                    disabled={exportBusy || !fontsReady}
                    onClick={() => handleSave(false)}
                  >DOWNLOAD PNG</button>
                </div>
              </div>
            </div>
          </div>
        )}

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
                    {meeting.room && durationSlots >= 12 && <div className="block-room">{meeting.room}</div>}
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
                target="_blank" rel="noopener noreferrer">{SEMESTER} · Updated {formatLastUpdated(lastUpdated)}</a>
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
        <div className="theme-toggle">
          <button
            className={theme === "system" ? "theme-btn-active" : ""}
            onClick={() => setTheme("system")}
          >SYSTEM</button>
          <button
            className={theme === "light" ? "theme-btn-active" : ""}
            onClick={() => setTheme("light")}
          >LIGHT</button>
          <button
            className={theme === "dark" ? "theme-btn-active" : ""}
            onClick={() => setTheme("dark")}
          >DARK</button>
        </div>
      </div>

    </>
  )
}

export default App
