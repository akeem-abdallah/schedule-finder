import { describe, it, expect } from "vitest"
import { timeToMinutes, masksConflict, sectionToMask, generateSchedules, buildBlockedMask } from "./schedule"

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
    const courseA = [{ meetings: [{ day: "Mon", start_time: "09:00", end_time: "10:15" }] }]
    const courseB = [{ meetings: [{ day: "Tue", start_time: "09:00", end_time: "10:15" }] }]
    const results = generateSchedules([courseA, courseB])
    expect(results.length).toBe(1)
  })

  it("finds zero combinations when a course's only section always conflicts", () => {
    const courseA = [{ meetings: [{ day: "Mon", start_time: "09:00", end_time: "10:15" }] }]
    const courseB = [{ meetings: [{ day: "Mon", start_time: "09:30", end_time: "10:30" }] }]
    const results = generateSchedules([courseA, courseB])
    expect(results.length).toBe(0)
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
