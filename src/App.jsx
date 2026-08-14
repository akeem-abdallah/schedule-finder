import './App.css'
import { useState, Fragment } from 'react'
import { subjects } from './data'
import { DAYS, generateSchedules, orderedEligibleLists, timeToMinutes, to12Hour, formatMeetings } from './schedule'

const COURSE_HUES = ["#2f6bff", "#e0561f", "#17a06a", "#9d4edd", "#c9910d", "#00a0b8", "#e0447f", "#7cb518"]

function App() {

    const [rows, setRows] = useState([{ id: 1, subject: "", code: "", sections: [] }])
    const [customizingID, setCustomizingID] = useState(null)

    const [error, setError] = useState("")

    const [results, setResults] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(0)

    const combos = rows.map((row) => row.subject + row.code)
    const hasDuplicates = new Set(combos).size !== combos.length

    function setIndex(increment) {
        const newIndex = currentIndex + increment
        if (newIndex >= 0 && newIndex < results.length) {
            setCurrentIndex(newIndex)
        }
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
            setError("Please add at least one course.")

        } else if (incomplete) {
            setError("Please fill in all fields.")

        } else if (hasDuplicates) {
            setError("Please remove all duplicates.")

        } else {
            const generated = generateSchedules(orderedEligibleLists(rows))
            if (generated.length === 0) {
                setError("No schedules found.")

            } else {
                setError("")
                setResults(generated)
                setCurrentIndex(0)

            }
        }
    }

    const customizingRow = rows.find((row) => row.id === customizingID)
    const customizingCourse = customizingRow ? subjects.find((s) => s.subject === customizingRow.subject).courses.find((c) => c.code === customizingRow.code) : null

    const usedDays = new Set()
    const meetingTimes = []
    if (results) {
        for (const schedule of results) {
            for (const section of schedule) {
                for (const meeting of section.meetings) {
                    usedDays.add(meeting.day)
                    meetingTimes.push(timeToMinutes(meeting.start), timeToMinutes(meeting.end))
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

    return (
        <>
            <div className="page-main">

                <div className="card">

                    <div className="status-strip">
                        <h1 className="strip-title">AURAK Schedule Finder</h1>
                        <span className="spacer"></span>
                        <span className="chip">Semester: Fall 2026</span>
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

                            <div className="weekly-grid" style={{
                                gridTemplateColumns: `70px repeat(${activeDays.length}, minmax(0, 1fr))`,
                                gridTemplateRows: `auto repeat(${activeHours.length * 4}, 12px)`
                            }}>
                                <div className="grid-corner" style={{ gridColumn: 1, gridRow: 1 }}></div>

                                {activeDays.map((day, dayIndex) => (
                                    <div key={day} className="day-header" style={{ gridColumn: dayIndex + 2, gridRow: 1 }}>{day.toUpperCase()}</div> // builds the header row
                                ))}

                                {activeHours.map((hour, hourIndex) => (
                                    <Fragment key={hour}>
                                        <div className={hourIndex === 0 ? "gutter-cell no-rule-top" : "gutter-cell"}
                                            style={{ gridColumn: 1, gridRow: `${hourIndex * 4 + 2} / span 4` }}>{to12Hour(`${hour}:00`)}</div>
                                        {activeDays.map((day, dayIndex) => {
                                            const hourCellClass = ["hour-cell", hourIndex === 0 && "no-rule-top", dayIndex === 0 && "no-rule-left"].filter(Boolean).join(" ")
                                            return <div key={day} className={hourCellClass} style={{ gridColumn: dayIndex + 2, gridRow: `${hourIndex * 4 + 2} / span 4` }}></div>
                                        })}
                                    </Fragment>
                                ))}

                                {/*builds every section block using map*/}
                                {results[currentIndex].map((section, sectionIndex) =>
                                    section.meetings.map((meeting) => {
                                        const startSlot = (timeToMinutes(meeting.start) - startHour * 60) / 15
                                        const durationSlots = (timeToMinutes(meeting.end) - timeToMinutes(meeting.start)) / 15
                                        const gridRowStart = startSlot + 2
                                        const gridColumn = activeDays.indexOf(meeting.day) + 2
                                        const hue = COURSE_HUES[sectionIndex % COURSE_HUES.length]

                                        return (
                                            <div
                                                key={`${section.courseCode}-${section.section}-${meeting.day}`}
                                                className="class-block"
                                                style={{ gridColumn, gridRow: `${gridRowStart} / span ${durationSlots}`, "--hue": hue }}
                                            >
                                                <div className="block-code">{section.courseSubject} {section.courseCode}-{section.section}</div>
                                                <div className="block-instructor">{section.instructor}</div>
                                                <div className="block-time">{to12Hour(meeting.start).slice(0, -3)}–{to12Hour(meeting.end).slice(0, -3)}</div>
                                            </div>
                                        )
                                    })
                                )}
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
                            <div className="section-desc">{customizingCourse.description}</div>

                            {customizingCourse.sections.map((s) => {
                                const isSelected = customizingRow.sections.includes(s.section)
                                return (
                                    <label key={s.section} className={isSelected ? "section-row section-row-selected" : "section-row"}>
                                        <input type="checkbox" checked={isSelected} onChange={() => {
                                            const alreadyIn = customizingRow.sections.includes(s.section)
                                            const newSections = alreadyIn
                                                ? customizingRow.sections.filter((sec) => sec !== s.section)
                                                : [...customizingRow.sections, s.section]
                                            updateRow(customizingID, { sections: newSections })
                                        }} />
                                        <span className="section-num">{s.section.length === 1 ? "0" + s.section : s.section}</span>
                                        <span className="section-instructor">{s.instructor}</span>
                                        <span className="section-meeting">{formatMeetings(s.meetings)}</span>
                                    </label>
                                )
                            })}

                            <p className="section-note">No selected sections means all of them will be included.</p>
                         </>

                    // Course selection view
                    ) : (

                        <> 
                            
                            <div className="table-header">
                                <span>SUBJ</span>
                                <span>CODE</span>
                                <span>TITLE</span>
                                <span>SEC</span>
                                <span></span>
                            </div>

                            {rows.map((row) => {

                                const currentSubject = subjects.find((s) => s.subject === row.subject)
                                const courses = currentSubject ? currentSubject.courses : []
                                const rowCourse = courses.find((c) => c.code === row.code)
                                const isInProgress = row.subject !== "" && row.code === ""

                                return (

                                    <div key={row.id} className={isInProgress ? "row row-active" : "row"}>

                                        <select value={row.subject} aria-label="Subject" onChange={(e) => updateRow(row.id, { subject: e.target.value, code: "" })}>
                                            <option value="">--</option>
                                            {subjects.map((s) => (
                                                <option key={s.subject} value={s.subject}>{s.subject}</option>
                                            ))}
                                        </select>

                                        <select value={row.code} aria-label="Course code" onChange={(e) => updateRow(row.id, { code: e.target.value })}>
                                            <option value="">--</option>
                                            {courses.map((c) => (
                                                <option key={c.code} value={c.code}>
                                                    {c.code === row.code ? c.code : `${c.code} - ${c.description}`}
                                                </option>
                                            ))}
                                        </select>

                                        <span className={rowCourse ? "row-title" : "row-title row-title-placeholder"}>
                                            {rowCourse ? rowCourse.description : "select a course"}
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

                                <button className="btn-primary" onClick={handleSubmit}>GENERATE →</button>

                            </div>

                        </>
                    )}

                    {error && <div className="error" role="alert">{error}</div>}

                </div>

            

            </div>

            <div className="page-footer">
                    <p>Developed by <a href="https://github.com/akeem-abdallah" target="_blank" rel="noopener noreferrer">Akeem Abdallah</a> · © 2026</p>
                    <p>Unofficial student tool — not affiliated with or endorsed by AURAK. By using this site, you take full responsibility for any consequences of relying on this data.</p>
            </div>
        </>
    )
}

export default App
