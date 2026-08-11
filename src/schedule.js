import { subjects } from './data'

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const DAY_START = 480
const SLOTS_PER_DAY = 48

export function getEligibleSections(row) {

    const eligibleSubject = subjects.find((r) => r.subject === row.subject)
    const eligibleCourse = eligibleSubject.courses.find((c) => c.code === row.code)

    return row.sections.length === 0 ? eligibleCourse.sections : eligibleCourse.sections.filter((s) => row.sections.includes(s.section))
}

export function orderedEligibleLists(rows) {
    const lists = rows.map((row) => getEligibleSections(row))
    return lists.sort((a, b) => a.length - b.length)
}

export function timeToMinutes(time) {
    const parts = time.split(":")
    return (Number(parts[0]) * 60) + Number(parts[1])
}

export function timeToSlot(day, time) {
    const dayIndex = DAYS.indexOf(day)
    return dayIndex * SLOTS_PER_DAY + (timeToMinutes(time) - DAY_START) / 15
}

export const MASK_WORDS = 11

export function setSlot(mask, slot) {
    const word = slot >> 5
    const bit = slot & 31
    mask[word] |= 1 << bit
}

export function sectionToMask(section) {
    const mask = new Array(MASK_WORDS).fill(0)

    for (const meeting of section.meetings) {
        const startSlot = timeToSlot(meeting.day, meeting.start)
        const endSlot = timeToSlot(meeting.day, meeting.end)

        for (let slot = startSlot; slot < endSlot; slot++) {
            setSlot(mask, slot)
        }
    }

    return mask
}

export function combineMasks(maskA, maskB) {
    const combined = new Array(MASK_WORDS).fill(0)

    for (let i = 0; i < MASK_WORDS; i++) {

        combined[i] = maskA[i] | maskB[i]
    }
    return combined
}

export function generateSchedules(orderedLists) {
    const results = []

    function solve(courseIndex, accumulatedMask, chosenSoFar) {

        if (courseIndex >= orderedLists.length) {
            results.push(chosenSoFar)
            return results
        }

        for (const section of orderedLists[courseIndex]) {

            if (!masksConflict(sectionToMask(section), accumulatedMask)) {

                solve(courseIndex + 1, combineMasks(sectionToMask(section), accumulatedMask), [...chosenSoFar, section])
            }
        }
    }

    solve(0, new Array(MASK_WORDS).fill(0), [])
    return results
}

export function masksConflict(maskA, maskB) {

    for (let i = 0; i < MASK_WORDS; i++) {

        if ((maskA[i] & maskB[i]) !== 0) { return true }

    }

    return false
}


