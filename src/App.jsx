import './App.css'
import { useState, Fragment, useEffect, useMemo } from 'react'
import { DAYS, generateSchedules, orderedEligibleLists, timeToMinutes, to12Hour, formatMeetings } from './schedule'
import { Analytics } from "@vercel/analytics/react"

const COURSE_HUES = ["#2f6bff", "#e0561f", "#17a06a", "#9d4edd", "#c9910d", "#00a0b8", "#e0447f", "#7cb518"]

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

    const [rows, setRows] = useState([{ id: 1, subject: "", code: "", sections: [] }])
    const [customizingID, setCustomizingID] = useState(null)

    const [error, setError] = useState("")
    const [errorId, setErrorId] = useState(0)

    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(0)

    const combos = rows.map((row) => row.subject + row.code)
    const hasDuplicates = new Set(combos).size !== combos.length

    const [courses, setCourses] = useState([])
    const subjects = useMemo(() => groupBySubject(courses), [courses])

    const [lastUpdated, setLastUpdated] = useState(null)

    // fetches courses
    useEffect(() => {
        fetch('https://aurak-schedule-finder.onrender.com/courses')
            .then(r => r.json())
            .then(data => {
                console.log(data)
                setCourses(data)
            })
    }, [])

    // fetches last updated
    useEffect(() => {

        fetch('https://aurak-schedule-finder.onrender.com/fetch_log')
            .then(r => r.json())
            .then(data => {
                console.log(data)
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
            setRows(validRows.length === 0 ? [{ id: 1, subject: "", code: "", sections: [] }] : validRows)
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

    const creditList = rows.map((row) => {
        if (row.subject == "") return 0

        const subj = subjects.find((s) => row.subject === s.subject)
        if (!subj) return 0

        const course = subj.courses.find((c) => c.code === row.code)

        return course ? course.credits : 0

    })

    const totalCredits = creditList.reduce((sum, c) => sum + c, 0)

    function setIndex(increment) {
        const newIndex = currentIndex + increment
        if (newIndex >= 0 && newIndex < results.length) {
            setCurrentIndex(newIndex)
        }
    }

    function showError(message) {
        setError(message)
        setErrorId((n) => n + 1)
    }

    function updateRow(id, changes) {
        setRows(rows.map((row) => row.id === id ? { ...row, ...changes } : row))
    }

    function addRow() {
        const nextId = rows.length === 0 ? 1 : Math.max(...rows.map((r) => r.id)) + 1
        setRows([...rows, { id: nextId, subject: "", code: "", sections: [] }])
    }

    function removeRow(id) {
        setRows(rows.filter((row) => row.id !== id))
    }

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

            setTimeout(() => {
                const generated = generateSchedules(orderedEligibleLists(rows, subjects))

                if (generated.length === 0) {
                    showError("No schedules found.")

                } else {
                    setError("")
                    setResults(generated)
                    setCurrentIndex(0)

                }

                setLoading(false)
            }, 0)
        }
    }

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

    function formatLastUpdated(iso) {
        if (!iso) return "…"
        const date = new Date(iso + "Z")
        return date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit' })
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

                    {/*Schedule view*/}
                    {results ? (
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

                        // Edit sections view
                    ) : customizingID ? (

                        <>

                            <div className="sub-strip">
                                <button onClick={() => setCustomizingID(null)}>← BACK</button>
                                <span className="spacer"></span>
                                <span className="section-code">{customizingRow.subject} {customizingCourse.code}</span>
                            </div>
                            <div className="section-desc">{customizingCourse.title}</div>

                            {customizingCourse.sections.map((s) => {
                                const isSelected = customizingRow.sections.includes(s.section_number)
                                return (
                                    <label key={s.section_number} className={isSelected ? "section-row section-row-selected" : "section-row"}>
                                        <input type="checkbox" checked={isSelected} onChange={() => {
                                            const alreadyIn = customizingRow.sections.includes(s.section_number)
                                            const newSections = alreadyIn
                                                ? customizingRow.sections.filter((sec) => sec !== s.section_number)
                                                : [...customizingRow.sections, s.section_number]
                                            updateRow(customizingID, { sections: newSections })
                                        }} />
                                        <span className="section-num">{s.section_number.length === 1 ? "0" + s.section_number : s.section_number}</span>
                                        <span className="section-instructor">{s.instructor}</span>
                                        <span className="section-meeting">{formatMeetings(s.meetings)}</span>
                                    </label>
                                )
                            })}

                            <p className="section-note">Leave all sections unchecked to include every one of them.</p>
                        </>

                        // Course selection view
                    ) : (

                        <>

                            <div className="table-header">
                                <span>SUBJ</span>
                                <span>CODE</span>
                                <span>TITLE</span>
                                <span>SEC</span>
                                <button className="btn-clear-all" onClick={() => setRows([])} disabled={rows.length === 0}
                                    aria-label="Remove all courses" title="Remove all courses">CLEAR</button>
                            </div>

                            {rows.map((row) => {

                                const currentSubject = subjects.find((s) => s.subject === row.subject)
                                const courses = currentSubject ? currentSubject.courses : []
                                const rowCourse = courses.find((c) => c.code === row.code)
                                const isInProgress = row.subject !== "" && row.code === ""

                                return (

                                    <div key={row.id} className={isInProgress ? "row row-active" : "row"}>

                                        <select value={row.subject} aria-label="Subject" onChange={(e) => updateRow(row.id, { subject: e.target.value, code: "", sections: [] })}>
                                            <option value="">--</option>
                                            {subjects.map((s) => (
                                                <option key={s.subject} value={s.subject}>{s.subject}</option>
                                            ))}
                                        </select>

                                        <select value={row.code} aria-label="Course code" onChange={(e) => updateRow(row.id, { code: e.target.value, sections: [] })}>
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
                                                    <span className={row.sections.length === 0 ? "sec-text" : "sec-text sec-text-accent"}>
                                                        {row.sections.length === 0 ? "ALL" : `${row.sections.length}/${rowCourse.sections.length}`}</span>

                                                </>
                                            )}
                                        </div>

                                        <button className="btn-destructive" onClick={() => removeRow(row.id)} aria-label="Remove course">×</button>

                                    </div>

                                )
                            })}

                            <div className="table-footer">

                                <button className="btn-secondary" onClick={addRow}>+ ADD COURSE</button>
                                <div className="spacer"></div>
                                <div className="footer-top-row">
                                    <span className="footer-credits">TOTAL CREDITS: <span className="credits-value">{totalCredits}.0</span></span>
                                    <button className="btn-clear-all footer-clear-mobile" onClick={() => setRows([])} disabled={rows.length === 0}
                                        aria-label="Remove all courses" title="Remove all courses">CLEAR</button>
                                </div>
                                <button className="btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? "GENERATING…" : "GENERATE →"}</button>

                            </div>

                        </>
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
