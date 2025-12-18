import type { Timestamp } from 'firebase/firestore'

export function formatTime(timestamp: Timestamp | Date | number | null | undefined): string {
    if (!timestamp) {
        return ''
    }

    let date: Date

    if (timestamp instanceof Date) {
        date = timestamp
    } else if (typeof timestamp === 'number') {
        date = new Date(timestamp)
    } else if (timestamp && 'toDate' in timestamp) {
        date = timestamp.toDate()
    } else {
        return ''
    }

    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return `${hours}:${minutes}`
}
