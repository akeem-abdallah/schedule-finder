import './App.css'
import { useState, Fragment } from 'react'
import { subjects } from './data'
import { DAYS, DAY_START, generateSchedules, GRID_HOURS, orderedEligibleLists, timeToMinutes, to12Hour } from './schedule'

const SECTION_COLORS = ["#f08080", "#87ceeb", "#90ee90", "#ffd27f", "#dda0dd", "#f4a6a6"]

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

        for (const section of results[currentIndex]) {
            for (const meeting of section.meetings) {
                usedDays.add(meeting.day)
                meetingTimes.push(timeToMinutes(meeting.start), timeToMinutes(meeting.end))
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
                    </div>

                    {results ? (
                        <div className="view-body">

                            <button onClick={() => setResults(null)}>← BACK</button>

                            <div className="schedule-navigation">

                                <button className="btn-secondary" onClick={() => setIndex(-1)}>Previous</button>
                                <p>{currentIndex + 1} of {results.length}</p>
                                <button className="btn-secondary" onClick={() => setIndex(1)}>Next</button>
                            </div>


                            <div className="weekly-grid" style={{ gridTemplateColumns: `110px repeat(${activeDays.length}, 140px)` }}>
                                <div style={{ gridColumn: 1, gridRow: 1 }}>Time</div>

                                {activeDays.map((day, dayIndex) => (
                                    <div key={day} className="grid-header" style={{ gridColumn: dayIndex + 2, gridRow: 1 }}>{day}</div> // builds the header row
                                ))}

                                {activeHours.map((hour, hourIndex) => (
                                    <Fragment key={hour}>
                                        <div style={{ gridColumn: 1, gridRow: `${hourIndex * 4 + 2} / span 4` }}>{to12Hour(`${hour}:00`)}</div>
                                        {activeDays.map((day, dayIndex) => (
                                            <div key={day} style={{ gridColumn: dayIndex + 2, gridRow: `${hourIndex * 4 + 2} / span 4` }}></div>
                                        ))}
                                    </Fragment>
                                ))}

                                {/*builds every section block using map*/}
                                {results[currentIndex].map((section, sectionIndex) =>
                                    section.meetings.map((meeting) => {
                                        const startSlot = (timeToMinutes(meeting.start) - startHour * 60) / 15
                                        const durationSlots = (timeToMinutes(meeting.end) - timeToMinutes(meeting.start)) / 15
                                        const gridRowStart = startSlot + 2
                                        const gridColumn = activeDays.indexOf(meeting.day) + 2
                                        const color = SECTION_COLORS[sectionIndex % SECTION_COLORS.length]

                                        return (
                                            <div
                                                key={`${section.courseCode}-${section.section}-${meeting.day}`}
                                                className="class-block"
                                                style={{ gridColumn, gridRow: `${gridRowStart} / span ${durationSlots}`, backgroundColor: color }}
                                            >
                                                {section.courseSubject} {section.courseCode}-{section.section}<br />
                                                {section.instructor} <br />
                                                {to12Hour(meeting.start)} - {to12Hour(meeting.end)}
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                    ) : customizingID ? (
                        <div className="view-body">

                            <button onClick={() => setCustomizingID(null)}>← BACK</button>

                            <p>{customizingCourse.code} - {customizingCourse.description}</p>

                            {customizingCourse.sections.map((s) => (

                                <label key={s.section} className="checkboxes">
                                    <input type="checkbox"
                                        checked={customizingRow.sections.includes(s.section)}
                                        onChange={() => {
                                            const alreadyIn = customizingRow.sections.includes(s.section)
                                            const newSections = alreadyIn
                                                ? customizingRow.sections.filter((sec) => sec !== s.section)
                                                : [...customizingRow.sections, s.section]
                                            updateRow(customizingID, { sections: newSections })
                                        }}
                                    /> {s.section.length === 1 ? "0" + s.section : s.section} - {s.instructor}


                                </label>

                            ))}

                            <p>No selected courses means all of them will be included.</p>
                        </div>

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
