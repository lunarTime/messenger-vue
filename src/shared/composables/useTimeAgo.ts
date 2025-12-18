import { computed } from 'vue'
import { useGlobalNow } from '@/shared/composables/useGlobalNow'
import { formatTimeAgo } from '@/shared/utils/formatTimeAgo'
import type { Timestamp } from 'firebase/firestore'

export function useTimeAgo(timestamp: Timestamp | Date | number | null | undefined) {
    const now = useGlobalNow()

    return computed(() => {
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

        return formatTimeAgo(date, now.value)
    })
}
