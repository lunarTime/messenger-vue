export function formatTimeAgo(input: string | number | Date, nowValue: number = Date.now()): string {
    const date = input instanceof Date ? input : new Date(input)

    if (isNaN(date.getTime())) {
        return ''
    }

    const diff = (nowValue - date.getTime()) / 1000

    const ranges = [
        { limit: 60, divisor: 1, unit: 'second' },
        { limit: 3600, divisor: 60, unit: 'minute' },
        { limit: 86400, divisor: 3600, unit: 'hour' },
        { limit: 2592000, divisor: 86400, unit: 'day' },
        { limit: 31536000, divisor: 2592000, unit: 'month' },
        { limit: Infinity, divisor: 31536000, unit: 'year' }
    ]

    for (const r of ranges) {
        if (diff < r.limit) {
            const value = Math.floor(diff / r.divisor)

            return `${value} ${r.unit}${value !== 1 ? 's' : ''} ago`
        }
    }

    return ''
}
