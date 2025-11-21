import { computed } from 'vue'
import { useGlobalNow } from '@/shared/composables/useGlobalNow'
import { formatTimeAgo } from '@/shared/utils/formatTimeAgo'

export function useTimeAgo(date: string | number | Date) {
    const now = useGlobalNow()

    return computed(() => formatTimeAgo(date, now.value))
}
