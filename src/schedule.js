import { subjects } from './data'

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
export const DAY_START = 480
export const SLOTS_PER_DAY = 156

// TODO(you): "13:30" -> "1:30 PM". Split the string like timeToMinutes does,
// figure out AM/PM from the hour, convert the hour with % 12, then build the string.
export function to12Hour(time) {

    const parts = time.split(":")
    let hour = Number(parts[0])

    if (hour >= 12) {

        hour = hour % 12 === 0 ? 12 : hour % 12
        time = `${hour}:${parts[1]} PM`

    } else {time = `${Number(parts[0])}:${parts[1]} AM`}

    return time
}

export function formatMeetings(meetings) {

    const days = meetings.map(m => m.day.toUpperCase()).join(" ")
    let s = to12Hour(meetings[0].start)
    let e = to12Hour(meetings[0].end)

    const time = s.slice(-2) === e.slice(-2) ? `${s.slice(0, -3)}–${e}` : `${s}–${e}`
    return `${days}\n${time}`
}

// extracts all eligible sections in a row
export function getEligibleSections(row) {

    const eligibleSubject = subjects.find((r) => r.subject === row.subject)
    const eligibleCourse = eligibleSubject.courses.find((c) => c.code === row.code)

    const eligible = row.sections.length === 0 ? eligibleCourse.sections : eligibleCourse.sections.filter((s) => row.sections.includes(s.section))

    // TODO(you): map over `eligible`, returning a new object for each section
    // that spreads in the original section's fields (...s) plus two new ones:
    // courseCode (eligibleCourse.code) and courseDescription (eligibleCourse.description)
    return eligible.map((s) => ({ ...s, courseSubject: eligibleSubject.subject, courseCode: eligibleCourse.code }))

}

// orders those eligible sections
export function orderedEligibleLists(rows) {
    const lists = rows.map((row) => getEligibleSections(row))
    return lists.sort((a, b) => a.length - b.length)
}

// converts time to minutes, from 24 hour clock (13:00 --> 780 minutes)
export function timeToMinutes(time) {
    const parts = time.split(":")
    return (Number(parts[0]) * 60) + Number(parts[1])
}

// converts minutes to slot (48 slots per day, day starts at 8:00) each slot is 15 min, formula: 1(Tue) * 48 + (780 - 480) / 15 = 68
export function timeToSlot(day, time) {
    const dayIndex = DAYS.indexOf(day)
    return dayIndex * SLOTS_PER_DAY + (timeToMinutes(time) - DAY_START) / 5
}

// js stores each number with 32 bits, so 32 x 35 = 1120, 156 x 7 = 1092
export const MASK_WORDS = 35

// sets one slot in a mask
export function setSlot(mask, slot) {
    const word = slot >> 5 // which sub mask
    const bit = slot & 31 // which position inside sub mask
    mask[word] |= 1 << bit // adds new bit into mask and moves by bit without removing anything because of |=
}

// converts a section to a mask, so 9:00 to 10:15 would create 5 slots in a mask
export function sectionToMask(section) {
    const mask = new Array(MASK_WORDS).fill(0) // fills mask with 352 bits made of 0s

    for (const meeting of section.meetings) {
        const startSlot = timeToSlot(meeting.day, meeting.start)
        const endSlot = timeToSlot(meeting.day, meeting.end)

        for (let slot = startSlot; slot < endSlot; slot++) {
            setSlot(mask, slot)
        } // for each meeting, create slots in the mask depending on startSlot and endSlot
    }

    return mask
}

// check if both masks conflict by AND, if even one bit conflicts then its invalid 
export function masksConflict(maskA, maskB) {

    for (let i = 0; i < MASK_WORDS; i++) {

        if ((maskA[i] & maskB[i]) !== 0) { return true }

    }

    return false
}

// combine both masks when nothing conflicts
export function combineMasks(maskA, maskB) {
    const combined = new Array(MASK_WORDS).fill(0)

    for (let i = 0; i < MASK_WORDS; i++) {

        combined[i] = maskA[i] | maskB[i]
    }
    return combined
}

// generate schedules 
export function generateSchedules(orderedLists) {
    const results = []

    // solves each schedule recursively
    function solve(courseIndex, accumulatedMask, chosenSoFar) {

        if (courseIndex >= orderedLists.length) {
            results.push(chosenSoFar)
            return results // base case, push schedule result
        }

        for (const section of orderedLists[courseIndex]) {

            // if masks don't conflict, recurse with new acculumatedMask
            if (!masksConflict(sectionToMask(section), accumulatedMask)) {

                solve(courseIndex + 1, combineMasks(sectionToMask(section), accumulatedMask), [...chosenSoFar, section])
            }
        }
    }

    // initiate schedule generation
    solve(0, new Array(MASK_WORDS).fill(0), [])
    return results
}




