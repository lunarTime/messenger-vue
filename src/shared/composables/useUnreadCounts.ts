import { reactive, watch, onUnmounted, type Ref } from 'vue'
import { subscribeToUnreadCount } from '@/shared/api/firebase/firestore'
import type { Chat } from '@/shared/types/chat'

export function useUnreadCounts(chats: Ref<Chat[]>, userId: Ref<string | null>) {
    const unreadCounts = reactive<Record<string, number>>({})
    const unsubscribers = new Map<string, () => void>()

    const updateSubscriptions = () => {
        const myId = userId.value
        if (!myId) {
            unsubscribers.forEach(unsub => unsub())
            unsubscribers.clear()
            Object.keys(unreadCounts).forEach(key => delete unreadCounts[key])
            return
        }

        const currentChatIds = new Set(chats.value.map(c => c.id))

        for (const [chatId, unsub] of unsubscribers.entries()) {
            if (!currentChatIds.has(chatId)) {
                unsub()
                unsubscribers.delete(chatId)
                delete unreadCounts[chatId]
            }
        }

        chats.value.forEach(chat => {
            if (unreadCounts[chat.id] === undefined) {
                unreadCounts[chat.id] = 0
            }

            if (!unsubscribers.has(chat.id)) {
                unsubscribers.set(chat.id, subscribeToUnreadCount(chat.id, myId, count => {
                    unreadCounts[chat.id] = count
                }))
            }
        })
    }

    watch(
        [() => chats.value.map(c => c.id).sort().join(','), userId],
        () => updateSubscriptions(),
        { immediate: true }
    )

    onUnmounted(() => {
        unsubscribers.forEach(unsub => unsub())
        unsubscribers.clear()
    })

    return { unreadCounts }
}
