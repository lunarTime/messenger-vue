import { ref, onMounted, onUnmounted } from 'vue'

const globalNow = ref(Date.now())
let intervalId: ReturnType<typeof setInterval> | null = null
let subscriberCount = 0

export function useGlobalNow(interval = 10000) {
    onMounted(() => {
        subscriberCount++

        if (subscriberCount === 1 && intervalId === null) {
            intervalId = window.setInterval(() => {
                globalNow.value = Date.now()
            }, interval)
        }
    })

    onUnmounted(() => {
        subscriberCount--

        if (subscriberCount === 0 && intervalId !== null) {
            clearInterval(intervalId)

            intervalId = null
        }
    })

    return globalNow
}
