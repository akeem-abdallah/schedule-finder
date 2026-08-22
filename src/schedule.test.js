import { describe, it, expect } from "vitest"
import { timeToMinutes, masksConflict, sectionToMask, generateSchedules, buildBlockedMask, findIncompatiblePairs, timeToSlot, longestGapMinutes, combinedScheduleMask, to12Hour, SLOTS_PER_DAY } from "./schedule"

const withMask = (section) => ({ ...section, mask: sectionToMask(section) })
const noFilters = { excludedDays: [], nothingBefore: "", nothingAfter: "", busyBlocks: [] }

describe("timeToMinutes", () => {
  it("converts 13:00 to 780 minutes", () => {
    expect(timeToMinutes("13:00")).toBe(780)
  })
})

describe("masksConflict", () => {
  it("flags two sections that meet at the same day/time as conflicting", () => {
    const a = { meetings: [{ day: "Mon", start_time: "09:00", end_time: "10:15" }] }
    const b = { meetings: [{ day: "Mon", start_time: "09:30", end_time: "10:30" }] }
    expect(masksConflict(sectionToMask(a), sectionToMask(b))).toBe(true)
  })

  it("does not flag two sections on different days as conflicting", () => {
    const a = { meetings: [{ day: "Mon", start_time: "09:00", end_time: "10:15" }] }
    const b = { meetings: [{ day: "Tue", start_time: "09:00", end_time: "10:15" }] }
    expect(masksConflict(sectionToMask(a), sectionToMask(b))).toBe(false)
  })
})

describe("generateSchedules", () => {
  it("finds the one valid combination when two courses' sections don't conflict", () => {
    const sectionA = { meetings: [{ day: "Mon", start_time: "09:00", end_time: "10:15" }] }
    sectionA.mask = sectionToMask(sectionA)
    const sectionB = { meetings: [{ day: "Tue", start_time: "09:00", end_time: "10:15" }] }
    sectionB.mask = sectionToMask(sectionB)
    const results = generateSchedules([[sectionA], [sectionB]])
    expect(results.length).toBe(1)
  })

  it("finds zero combinations when a course's only section always conflicts", () => {
    const sectionA = { meetings: [{ day: "Mon", start_time: "09:00", end_time: "10:15" }] }
    sectionA.mask = sectionToMask(sectionA)
    const sectionB = { meetings: [{ day: "Mon", start_time: "09:30", end_time: "10:30" }] }
    sectionB.mask = sectionToMask(sectionB)
    const results = generateSchedules([[sectionA], [sectionB]])
    expect(results.length).toBe(0)
  })

  it("returns nothing when one course has no sections left, instead of dropping the course", () => {
    const sectionA = withMask({ meetings: [{ day: "Mon", start_time: "09:00", end_time: "10:15" }] })
    expect(generateSchedules([[], [sectionA]])).toEqual([])
  })

  it("leaves a course whose sections have no meeting times out of the schedule", () => {
    const online = withMask({ courseCode: "494", meetings: [] })
    const inPerson = withMask({ courseCode: "101", meetings: [{ day: "Mon", start_time: "09:00", end_time: "10:15" }] })
    const results = generateSchedules([[online], [inPerson]])
    expect(results.length).toBe(1)
    expect(results[0].map((s) => s.courseCode)).toEqual(["101"])
  })

  it("does not multiply the schedule count by meeting-less sections", () => {
    const untimed = Array.from({ length: 13 }, (_, i) => withMask({ courseCode: "492", section_number: String(i), meetings: [] }))
    const timed = [
      withMask({ courseCode: "101", meetings: [{ day: "Mon", start_time: "09:00", end_time: "10:15" }] }),
      withMask({ courseCode: "101", meetings: [{ day: "Tue", start_time: "09:00", end_time: "10:15" }] }),
    ]
    expect(generateSchedules([untimed, timed]).length).toBe(2)
  })

  it("returns nothing when no course has any meeting time", () => {
    const online = withMask({ courseCode: "494", meetings: [] })
    expect(generateSchedules([[online]])).toEqual([])
  })
})

describe("timeToSlot", () => {
  it("clamps a time before the window to the start of its own day", () => {
    expect(timeToSlot("Tue", "05:00")).toBe(SLOTS_PER_DAY)
  })

  it("clamps a time after the window to the end of its own day", () => {
    expect(timeToSlot("Mon", "23:30")).toBe(SLOTS_PER_DAY)
  })

  it("maps an evening class inside the window instead of clamping it", () => {
    expect(timeToSlot("Mon", "21:30")).toBe((21 * 60 + 30 - 420) / 5)
    expect(timeToSlot("Mon", "21:30")).toBeLessThan(SLOTS_PER_DAY)
  })

  it("masks a late class without losing its tail", () => {
    const late = { meetings: [{ day: "Mon", start_time: "20:00", end_time: "22:30" }] }
    const overlapping = { meetings: [{ day: "Mon", start_time: "22:00", end_time: "22:20" }] }
    expect(masksConflict(sectionToMask(late), sectionToMask(overlapping))).toBe(true)
  })
})

describe("buildBlockedMask out-of-range busy times", () => {
  it("does not let a late Monday busy block bleed into Tuesday", () => {
    const tuesday = { meetings: [{ day: "Tue", start_time: "09:00", end_time: "10:00" }] }
    const mask = buildBlockedMask({ ...noFilters, busyBlocks: [{ id: 1, day: "Mon", start_time: "22:00", end_time: "23:00" }] })
    expect(masksConflict(sectionToMask(tuesday), mask)).toBe(false)
  })

  it("does not let an early Tuesday busy block bleed into Monday", () => {
    const monday = { meetings: [{ day: "Mon", start_time: "19:00", end_time: "20:00" }] }
    const mask = buildBlockedMask({ ...noFilters, busyBlocks: [{ id: 1, day: "Tue", start_time: "06:00", end_time: "07:00" }] })
    expect(masksConflict(sectionToMask(monday), mask)).toBe(false)
  })

  it("still blocks the in-range part of a busy block that starts too early", () => {
    const tuesday = { meetings: [{ day: "Tue", start_time: "08:00", end_time: "09:00" }] }
    const mask = buildBlockedMask({ ...noFilters, busyBlocks: [{ id: 1, day: "Tue", start_time: "06:00", end_time: "09:00" }] })
    expect(masksConflict(sectionToMask(tuesday), mask)).toBe(true)
  })
})

describe("findIncompatiblePairs", () => {
  it("ignores empty section lists instead of reporting them as incompatible", () => {
    const real = [withMask({ meetings: [{ day: "Mon", start_time: "09:00", end_time: "10:15" }] })]
    expect(findIncompatiblePairs([[], []])).toEqual([])
    expect(findIncompatiblePairs([[], real])).toEqual([])
  })
})

describe("buildBlockedMask", () => {
  it("conflicts with a section that meets on an excluded day", () => {
    const monday = { meetings: [{ day: "Mon", start_time: "09:00", end_time: "10:00" }] }
    expect(masksConflict(sectionToMask(monday), buildBlockedMask({ excludedDays: ["Mon"], nothingBefore: "", nothingAfter: "", busyBlocks: [] }))).toBe(true)
  })

  it("does not conflict with a section on a day that isn't excluded", () => {
    const tuesday = { meetings: [{ day: "Tue", start_time: "09:00", end_time: "10:00" }] }
    expect(masksConflict(sectionToMask(tuesday), buildBlockedMask({ excludedDays: ["Mon"], nothingBefore: "", nothingAfter: "", busyBlocks: [] }))).toBe(false)
  })

  it("conflicts with a section that starts before nothingBefore", () => {
    const early = { meetings: [{ day: "Mon", start_time: "09:00", end_time: "10:00" }] }
    expect(masksConflict(sectionToMask(early), buildBlockedMask({ excludedDays: [], nothingBefore: "10:00", nothingAfter: "", busyBlocks: [] }))).toBe(true)
  })

  it("does not conflict with a section that starts after nothingBefore", () => {
    const late = { meetings: [{ day: "Mon", start_time: "10:30", end_time: "11:45" }] }
    expect(masksConflict(sectionToMask(late), buildBlockedMask({ excludedDays: [], nothingBefore: "10:00", nothingAfter: "", busyBlocks: [] }))).toBe(false)
  })

  it("conflicts with a section that ends after nothingAfter", () => {
    const late = { meetings: [{ day: "Mon", start_time: "15:00", end_time: "16:15" }] }
    expect(masksConflict(sectionToMask(late), buildBlockedMask({ excludedDays: [], nothingBefore: "", nothingAfter: "15:00", busyBlocks: [] }))).toBe(true)
  })

  it("does not conflict with a section that ends before nothingAfter", () => {
    const early = { meetings: [{ day: "Mon", start_time: "09:00", end_time: "10:15" }] }
    expect(masksConflict(sectionToMask(early), buildBlockedMask({ excludedDays: [], nothingBefore: "", nothingAfter: "15:00", busyBlocks: [] }))).toBe(false)
  })
})

describe("to12Hour", () => {
  it("renders midnight as 12:00 AM, not 0:00 AM", () => {
    expect(to12Hour("00:00")).toBe("12:00 AM")
  })

  it("renders noon as 12:00 PM", () => {
    expect(to12Hour("12:00")).toBe("12:00 PM")
  })

  it("renders a normal morning time unchanged", () => {
    expect(to12Hour("09:30")).toBe("9:30 AM")
  })
})

describe("longestGapMinutes", () => {
  it("reports the longest single break, not the total idle time", () => {
    // 9-10, 11-12, 13-14 => two separate 60-minute breaks, never a 120 one
    const schedule = [
      { mask: sectionToMask({ meetings: [{ day: "Mon", start_time: "09:00", end_time: "10:00" }] }) },
      { mask: sectionToMask({ meetings: [{ day: "Mon", start_time: "11:00", end_time: "12:00" }] }) },
      { mask: sectionToMask({ meetings: [{ day: "Mon", start_time: "13:00", end_time: "14:00" }] }) },
    ]
    expect(longestGapMinutes(combinedScheduleMask(schedule))).toBe(60)
  })

  it("is zero for back-to-back classes", () => {
    const schedule = [
      { mask: sectionToMask({ meetings: [{ day: "Tue", start_time: "09:00", end_time: "10:00" }] }) },
      { mask: sectionToMask({ meetings: [{ day: "Tue", start_time: "10:00", end_time: "11:00" }] }) },
    ]
    expect(longestGapMinutes(combinedScheduleMask(schedule))).toBe(0)
  })

  it("measures each day separately rather than across days", () => {
    const schedule = [
      { mask: sectionToMask({ meetings: [{ day: "Mon", start_time: "09:00", end_time: "10:00" }] }) },
      { mask: sectionToMask({ meetings: [{ day: "Wed", start_time: "16:00", end_time: "17:00" }] }) },
    ]
    expect(longestGapMinutes(combinedScheduleMask(schedule))).toBe(0)
  })
})
