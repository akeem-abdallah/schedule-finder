import './App.css'
import Course from './Course'
import { useState } from 'react'
import { subjects } from './data'

// rerun when a state setter is called. example: "setSelectedSubject"
function App() {

    const [rows, setRows] = useState([{ id: 1, subject: "", code: "", sections: [] }])
    const [customizingID, setCustomizingID] = useState(null)

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

    const [error, setError] = useState("")
    const [submitted, setSubmitted] = useState(null)

    const combos = rows.map((row) => row.subject + row.code)
    const hasDuplicates = new Set(combos).size !== combos.length

    function handleSubmit() {
        setSubmitted(null)
        const incomplete = rows.some((row) => row.subject === "" || row.code === "")
        
        if (rows.length === 0) {
            setError("Please add at least one course")
            
        } else if (incomplete) {
            setError("Please fill in all fields")

        } else if (hasDuplicates) {
            setError("Please remove all duplicates")

        } else {
            setError("")
            setSubmitted(rows)
        }
    }

    const customizingRow = rows.find((row) => row.id === customizingID)
    const customizingCourse = customizingRow ? subjects.find((s) => s.subject === customizingRow.subject).courses.find((c) => c.code === customizingRow.code) : null

    return (
        <>
            <h1>AURAK Schedule Finder</h1>

            <div className="courses">
                {customizingID ? (
                    <>

                        <button onClick={() => setCustomizingID(null)}>Back</button>

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
                    </>
                    
                ) : (

                    <>
                    {rows.map((row) => {

                        const currentSubject = subjects.find((s) => s.subject === row.subject)
                        const courses = currentSubject ? currentSubject.courses : []
                        const rowCourse = courses.find((c) => c.code === row.code)

                        return (

                            <div key={row.id} className="row">

                                <p>Course:</p>
                                <select value={row.subject} onChange={(e) => updateRow(row.id, { subject: e.target.value, code: "" })}>
                                    <option value="">-- pick a subject --</option>
                                    {subjects.map((s) => (
                                        <option key={s.subject} value={s.subject}>{s.subject}</option>
                                    ))}
                                </select>

                                <p>Code:</p>
                                <select value={row.code} onChange={(e) => updateRow(row.id, { code: e.target.value })}>
                                    <option value="">-- pick a course --</option>
                                    {courses.map((c) => (
                                        <option key={c.code} value={c.code}>{c.code} - {c.description}</option>
                                    ))}
                                </select>

                                

                                {rowCourse && (
                                    <>
                                        <p>{row.sections.length === 0 ? "All sections" : `${row.sections.length} / ${rowCourse.sections.length} selected`}</p>

                                        <button onClick={() => setCustomizingID(row.id)}>Customize</button>
                                    </>

                                )}
                                

                                <button onClick={() => removeRow(row.id)}>x</button>

                            </div>

                        )
                    })}

                    <div>

                        <button onClick={addRow}>+ Add</button>

                        <button onClick={handleSubmit}>Submit</button>

                    </div>
                    </>
                )}
            </div>
            
            {error && <p>{error}</p>}

            {submitted && (
                <ul>
                    {submitted.map((row) => (
                        <li key={row.id}>{row.subject} {row.code} | Sections: ({row.sections.length !== 0 ? row.sections.join(", ") : "All"})</li>
                    ))}
                </ul>
            )}

        </> 
    )
}

export default App
