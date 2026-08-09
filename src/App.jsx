import './App.css'
import Course from './Course'
import { useState } from 'react'

const subjects = [

    {
        subject: "CSCI",
        courses: [

            { code: "104", description: "Introduction to Computing" },
            { code: "112", description: "Introduction to Computer Programming" },
            { code: "113", description: "Introduction to Computer Programming Lab" },

        ],
    },

    {
        subject: "PHYS",
        courses: [

            { code: "095", description: "Introductory Physics" },
            { code: "110", description: "University Physics I" },
            { code: "111", description: "University Physics I Lab" },

        ],
    },

    {
        subject: "MATH",
        courses: [

            { code: "095", description: "Precalculus" },
            { code: "113", description: "Calculus I" },
            { code: "114", description: "Calculus II" },

        ],
    },
]

// rerun when a state setter is called. example: "setSelectedSubject"
function App() {

    const [rows, setRows] = useState([{ id: 1, subject: "", code: "" }])

    function updateRow(id, changes) {
        setRows(rows.map((row) => row.id === id ? { ...row, ...changes } : row))
    }

    function addRow() {
        const nextId = rows.length === 0 ? 1 : Math.max(...rows.map((r) => r.id)) + 1
        setRows([...rows, { id: nextId, subject: "", code: "" }])
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

    return (
        <>
            <h1>AURAK Schedule Finder</h1>

            {rows.map((row) => {

                const currentSubject = subjects.find((s) => s.subject === row.subject)
                const courses = currentSubject ? currentSubject.courses : []

                return (

                    <div key={row.id} className="row">

                        <p>Course:</p>
                        <select value={row.subject} onChange={(e) => updateRow(row.id, { subject: e.target.value, code: "" }) }>
                            <option value="">-- pick a subject --</option>
                            {subjects.map((s) => (
                                <option key={s.subject} value={s.subject}>{s.subject}</option>
                            ))}
                        </select>

                        <p>Code:</p>
                        <select value={row.code} onChange={(e) => updateRow(row.id, { code: e.target.value }) }>
                            <option value="">-- pick a course --</option>
                            {courses.map((c) => (   
                                <option key={c.code} value={c.code}>{c.code} - {c.description}</option>
                            ))}
                        </select>

                        <button onClick={() => removeRow(row.id)}>Remove</button>

                    </div>

                )
            })}

            <button onClick={addRow}>+ Add</button>

            <button onClick={handleSubmit}>Submit</button>

            {error && <p>{error}</p>}

            {submitted && (
                <ul>
                    {submitted.map((row) => (
                        <li key={row.id}>{row.subject} {row.code}</li>
                    ))}
                </ul>
            )}

        </> 
    )
}

export default App
