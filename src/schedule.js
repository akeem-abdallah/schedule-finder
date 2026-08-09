export function timeToMinutes(time) {
    const parts = time.split(":")
    return (Number(parts[0]) * 60) + Number(parts[1])
}

export function meetingsConflict(meetingA, meetingB) {
    // TODO(you): return true if meetingA and meetingB are on the same day
    // AND their time ranges overlap.
    // Use timeToMinutes() to convert start/end strings into numbers first,
    // then the check we just derived: startA < endB AND startB < endA

    const startA = timeToMinutes(meetingA.start)
    const startB = timeToMinutes(meetingB.start)
    const endA = timeToMinutes(meetingA.end)
    const endB = timeToMinutes(meetingB.end)

    if ((meetingA.day === meetingB.day) && (startA < endB && startB < endA)) {

        return true

    }

    return false
}
