import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ws } from '@/shared/api/ws/wsClient'

const generateId = () => {
    return Math.floor(Math.random() * 1_000_000_000_000).toString()
}

const sanitizeId = (value: unknown): string => {
    if (typeof value === 'string' && /^[0-9]+$/.test(value)) {
        return value
    }

    return generateId()
}

export const useUserStore = defineStore('user', () => {
    const stored = localStorage.getItem('userId')
    const safeId = sanitizeId(stored)
    const userId = ref<string>(safeId)

    localStorage.setItem('userId', safeId)

    const register = () => {
        ws.send({
            type: 'register_user',
            payload: { userId: userId.value }
        })
    }

    return {
        userId,
        register
    }
})
