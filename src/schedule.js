export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
export const DAY_START = 480
export const SLOTS_PER_DAY = 156

export function to12Hour(time) {

  const parts = time.split(":")
  let hour = Number(parts[0])

  if (hour >= 12) {

    hour = hour % 12 === 0 ? 12 : hour % 12
    time = `${hour}:${parts[1]} PM`

  } else { time = `${Number(parts[0])}:${parts[1]} AM` }

  return time
}

export function formatMeetings(meetings) {
  if (meetings.length === 0) return ""

  const days = meetings.map(m => m.day.toUpperCase()).join(" ")
  let s = to12Hour(meetings[0].start_time)
  let e = to12Hour(meetings[0].end_time)

  const time = s.slice(-2) === e.slice(-2) ? `${s.slice(0, -3)}–${e}` : `${s}–${e}`
  return `${days}\n${time}`
}

// extracts all eligible sections in a row
export function getEligibleSections(row, subjects) {
  const eligibleSubject = subjects.find((r) => r.subject === row.subject)
  if (!eligibleSubject) return []

  const eligibleCourse = eligibleSubject.courses.find((c) => c.code === row.code)
  if (!eligibleCourse) return []

  let eligible
  if (row.locked) {
    eligible = eligibleCourse.sections.filter((s) => s.section_number === row.locked)
  } else if (row.sections.length === 0) {
    eligible = eligibleCourse.sections
  } else {
    eligible = eligibleCourse.sections.filter((s) => row.sections.includes(s.section_number))
  }

  return eligible.map((s) => ({ ...s, courseSubject: eligibleSubject.subject, courseCode: eligibleCourse.code }))
}

// orders those eligible sections
export function orderedEligibleLists(rows, subjects, blockedMask) {
  const lists = rows.map((row) => row.locked ? getEligibleSections(row, subjects) :
    getEligibleSections(row, subjects).filter((section) => !masksConflict(sectionToMask(section), blockedMask)))
  return lists.sort((a, b) => a.length - b.length)
}

// converts time to minutes, from 24 hour clock (13:00 --> 780 minutes)
export function timeToMinutes(time) {
  const parts = time.split(":")
  return (Number(parts[0]) * 60) + Number(parts[1])
}

// converts minutes to slot (156 slots per day, day starts at 8:00) each slot is 5 min, formula: 1(Tue) * 156 + (780 - 480) / 5 = 216
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
  const mask = new Array(MASK_WORDS).fill(0) // 35 words x 32 bits = 1120 bits, enough for 156 slots x 7 days

  for (const meeting of section.meetings) {
    const startSlot = timeToSlot(meeting.day, meeting.start_time)
    const endSlot = timeToSlot(meeting.day, meeting.end_time)

    for (let slot = startSlot; slot < endSlot; slot++) {
      setSlot(mask, slot)
    } // for each meeting, create slots in the mask depending on startSlot and endSlot
  }

  return mask
}

// creates a blocked mask for excluded days
export function buildBlockedMask(filters) {
  const mask = new Array(MASK_WORDS).fill(0)

  // filters out excluded days
  for (const day of filters.excludedDays) {

    let startSlot = DAYS.indexOf(day) * SLOTS_PER_DAY
    let endSlot = (DAYS.indexOf(day) + 1) * SLOTS_PER_DAY

    for (let slot = startSlot; slot < endSlot; slot++) {

      setSlot(mask, slot)
    }
  }

  const validDays = DAYS.filter((day) => !filters.excludedDays.includes(day))

  // filters nothing before
  if (filters.nothingBefore !== "") {

    for (const day of validDays) {

      let startSlot = DAYS.indexOf(day) * SLOTS_PER_DAY
      let endSlot = timeToSlot(day, filters.nothingBefore)

      for (let slot = startSlot; slot < endSlot; slot++) {

        setSlot(mask, slot)
      }
    }
  }

  //filters nothing after
  if (filters.nothingAfter !== "") {

    for (const day of validDays) {

      let startSlot = timeToSlot(day, filters.nothingAfter)
      let endSlot = (DAYS.indexOf(day) + 1) * SLOTS_PER_DAY

      for (let slot = startSlot; slot < endSlot; slot++) {

        setSlot(mask, slot)
      }
    }
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

// checks whether at least one section of A can coexist with at least one section of B
export function sectionsCompatible(sectionsA, sectionsB) {
  return sectionsA.some((secA) => sectionsB.some((secB) => {

    if (!masksConflict(sectionToMask(secA), sectionToMask(secB))) {
      return true
    }
  }))
}

// checks every pair of course section-lists, returns the ones that can't coexist at all
export function findIncompatiblePairs(eligibleLists) {
  const incompatible = []

  for (let i = 0; i < eligibleLists.length; i++) {

    for (let j = 0; j < i; j++) {

      if (!sectionsCompatible(eligibleLists[i], eligibleLists[j])) {
        incompatible.push({ a: eligibleLists[i], b: eligibleLists[j] })
      }
    }
  }

  return incompatible
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
  const schedulableLists = orderedLists.filter(list => list.some(s => s.meetings.length > 0))

  // solves each schedule recursively
  function solve(courseIndex, accumulatedMask, chosenSoFar) {
    if (courseIndex >= schedulableLists.length) {
      results.push(chosenSoFar)
      return results // base case, push schedule result
    }

    for (const section of schedulableLists[courseIndex]) {

      // if masks don't conflict, recurse with new acculumatedMask
      if (!masksConflict(sectionToMask(section), accumulatedMask)) {
        solve(courseIndex + 1, combineMasks(sectionToMask(section), accumulatedMask), [...chosenSoFar, section])
      }
    }
  }

  // initiate schedule generation
  if (schedulableLists.length === 0) return results
  solve(0, new Array(MASK_WORDS).fill(0), [])
  return results
}




