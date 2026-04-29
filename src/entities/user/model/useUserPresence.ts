import { onMounted, onUnmounted, watch } from 'vue'
import { useUserStore } from '@/entities/user/store/user.store'
import { setUserOnlineStatus } from '@/shared/api/firebase/firestore'

export function useUserPresence() {
    const userStore = useUserStore()
    let heartbeatInterval: ReturnType<typeof setInterval> | null = null

    const startHeartbeat = () => {
        if (!userStore.userId) return
        
        setUserOnlineStatus(userStore.userId, true)

        heartbeatInterval = setInterval(() => {
            if (userStore.userId) {
                setUserOnlineStatus(userStore.userId, true)
            }
        }, 30000)
    }

    const stopHeartbeat = () => {
        if (heartbeatInterval) {
            clearInterval(heartbeatInterval)
            heartbeatInterval = null
        }
        if (userStore.userId) {
            setUserOnlineStatus(userStore.userId, false)
        }
    }

    watch(() => userStore.userId, (newId) => {
        if (newId) {
            startHeartbeat()
        } else {
            stopHeartbeat()
        }
    })

    onMounted(() => {
        if (userStore.userId) {
            startHeartbeat()
        }
    })

    onUnmounted(() => {
        stopHeartbeat()
    })

    window.addEventListener('beforeunload', () => {
        if (userStore.userId) {
            setUserOnlineStatus(userStore.userId, false)
        }
    })
}
