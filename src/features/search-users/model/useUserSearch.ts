import { ref } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { searchUsers } from '@/shared/api/firebase/firestore'
import { useChatStore } from '@/entities/chat/store/chat.store'
import { useUserStore } from '@/entities/user/store/user.store'
import { validateSearchQuery } from '@/shared/lib/validation'
import { sanitizeText } from '@/shared/lib/sanitization/sanitizer'
import { rateLimiter } from '@/shared/lib/security/rateLimiter'
import { VALIDATION_CONFIG } from '@/shared/config/validation.config'
import type { User } from '@/shared/types/user'

export function useUserSearch() {
    const chatStore = useChatStore()
    const userStore = useUserStore()

    const searchQuery = ref('')
    const users = ref<User[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    watchDebounced(
        searchQuery,
        async query => {
            error.value = null

            if (!query.trim()) {
                users.value = []

                return
            }

            const rateLimitKey = `search-users:${userStore.userId}`
            const { MAX_REQUESTS, WINDOW_MS } = VALIDATION_CONFIG.SEARCH.RATE_LIMIT

            if (
                !rateLimiter.check(rateLimitKey, {
                    maxRequests: MAX_REQUESTS,
                    windowMs: WINDOW_MS
                })
            ) {
                error.value = 'Слишком много запросов. Подождите немного.'

                return
            }

            const validation = validateSearchQuery(query)

            if (!validation.success) {
                error.value = validation.error
                users.value = []

                return
            }

            const sanitized = sanitizeText(validation.data, {
                maxLength: VALIDATION_CONFIG.SEARCH.MAX_LENGTH,
                stripNewlines: true
            })

            if (!sanitized) {
                users.value = []

                return
            }

            isLoading.value = true

            try {
                const results = await searchUsers(sanitized)

                users.value = results
                    .filter(user => user.id !== userStore.userId)
                    .slice(0, VALIDATION_CONFIG.SEARCH.MAX_RESULTS)
            } catch (e) {
                error.value = 'Ошибка поиска. Попробуйте позже.'
                users.value = []
            } finally {
                isLoading.value = false
            }
        },
        {
            debounce: VALIDATION_CONFIG.SEARCH.DEBOUNCE_MS
        }
    )

    const handleSelectUser = async (user: User): Promise<void> => {
        if (!user?.id) {
            return
        }

        try {
            await chatStore.openChatWith(user.id)

            searchQuery.value = ''
            users.value = []
            error.value = null
        } catch (err) {
            error.value = 'Не удалось открыть чат. Попробуйте ещё раз.'
        }
    }

    const getUserOnlineStatus = (user: User): boolean => {
        const cachedUser = chatStore.chatParticipants.get(user.id)

        return cachedUser?.isOnline ?? user.isOnline ?? false
    }

    return {
        searchQuery,
        users,
        isLoading,
        error,
        handleSelectUser,
        getUserOnlineStatus
    }
}
