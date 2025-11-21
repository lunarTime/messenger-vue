import { ref } from 'vue'

const now = ref(Date.now())
let started = false

export function useGlobalNow(interval = 3000) {
    if (!started) {
        started = true

        setInterval(() => {
            now.value = Date.now()
        }, interval)
    }

    return now
}
