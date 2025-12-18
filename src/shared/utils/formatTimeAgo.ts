export function formatTimeAgo(date: Date, now: number = Date.now()): string {
    if (isNaN(date.getTime())) {
        return ''
    }

    const diff = now - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)

    if (seconds < 60) {
        return 'сейчас'
    }

    if (minutes < 60) {
        return `${minutes} м.`
    }

    if (hours < 24) {
        return `${hours} ч.`
    }

    if (days < 7) {
        return `${days} д.`
    }

    if (weeks < 4) {
        return `${weeks} нед.`
    }

    if (months < 12) {
        return `${months} мес.`
    }

    return `${years} г.`
}
