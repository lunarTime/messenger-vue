export function formatTime(input: Date | string | number): string {
    let date: Date

    if (input instanceof Date) {
        date = input
    } else {
        date = new Date(input)
    }

    if (isNaN(date.getTime())) {
        return ''
    }

    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return `${hours}:${minutes}`
}
