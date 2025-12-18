import { ref, watch, onUnmounted, type Ref } from 'vue'
import { subscribeToChatMember } from '@/shared/api/firebase/firestore'
import type { Chat } from '@/shared/types/chat'

export function useUnreadCounts(chats: Ref<Chat[]>, userId: Ref<string | null>) {
    const unreadCounts = ref<Record<string, number>>({})
    const unsubscribers = ref<Record<string, () => void>>({})

    const resubscribe = () => {
        Object.values(unsubscribers.value).forEach(unsub => unsub())

        unsubscribers.value = {}
        unreadCounts.value = {}

        if (!userId.value) {
            return
        }

        chats.value.forEach(chat => {
            unsubscribers.value[chat.id] = subscribeToChatMember(chat.id, userId.value!, count => {
                unreadCounts.value[chat.id] = count
            })
        })
    }

    watch(
        [chats, userId],
        () => {
            resubscribe()
        },
        {
            immediate: true,
            deep: true
        }
    )

    onUnmounted(() => {
        Object.values(unsubscribers.value).forEach(unsub => unsub())
    })

    return { unreadCounts }
}
