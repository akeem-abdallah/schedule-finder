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

    const [selectedSubject, setSelectedSubject] = useState("") 

    const currentSubject = subjects.find((s) => s.subject === selectedSubject) // finds the currentSubject after each rerun using selectedSubject
    const courses = currentSubject ? currentSubject.courses : [] // courses is [] instead of undefined

    const [selectedCode, setSelectedCode] = useState("")

    return (
        <>
            <h1>AURAK Schedule Finder</h1>

            <select value={selectedSubject} onChange={(e) => { setSelectedSubject(e.target.value); setSelectedCode("") }}>
                <option value="">-- pick a subject --</option>
                {subjects.map((s) => (
                    <option key={s.subject} value={s.subject}>{s.subject}</option>
                ))}
            </select>

            <select value={selectedCode} onChange={(e) => setSelectedCode(e.target.value)}>
                <option value="">-- pick a course --</option>
                {courses.map((c) => (   
                    <option key={c.code} value={c.code}>{c.code} - {c.description}</option>
                ))} {/*  */}
            </select>

            <p>selectedSubject is: "{selectedSubject}" selectedCode is: "{selectedCode}"</p>

        </> 
    )
}

export default App
