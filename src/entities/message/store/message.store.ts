import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Unsubscribe } from 'firebase/firestore'
import { useChatStore } from '@/entities/chat/store/chat.store'
import { useUserStore } from '@/entities/user/store/user.store'
import { subscribeToChatMessages, sendMessage as sendFirebaseMessage } from '@/shared/api/firebase/firestore'
import type { Message } from '@/shared/types/message'

export const useMessageStore = defineStore('messages', () => {
    const chatStore = useChatStore()
    const userStore = useUserStore()

    const messages = ref<Message[]>([])
    const isLoading = ref(false)
    const unsubscribeMessages = ref<Unsubscribe | null>(null)

    watch(
        () => chatStore.activeChatId,
        (newChatId, oldChatId) => {
            if (oldChatId && unsubscribeMessages.value) {
                unsubscribeMessages.value()
                unsubscribeMessages.value = null
            }

            messages.value = []

            if (newChatId) {
                loadMessages(newChatId)
            }
        }
    )

    const loadMessages = (chatId: string) => {
        if (unsubscribeMessages.value) {
            unsubscribeMessages.value()
        }

        isLoading.value = true

        unsubscribeMessages.value = subscribeToChatMessages(chatId, loadedMessages => {
            messages.value = loadedMessages
            isLoading.value = false
        })
    }

    const sendMessage = async (text: string) => {
        const chat = chatStore.activeChat
        const myId = userStore.userId

        if (!chat || !myId) {
            console.error('Невозможно начать чат: нет активного чата или пользователь не авторизован')

            return
        }

        if (!text.trim()) {
            return
        }

        try {
            await sendFirebaseMessage(chat.id, myId, text.trim())
        } catch (error) {
            console.error('Ошибка отправки сообщения:', error)
        }
    }

    const cleanup = () => {
        if (unsubscribeMessages.value) {
            unsubscribeMessages.value()
            unsubscribeMessages.value = null
        }

        messages.value = []
    }

    return {
        messages,
        isLoading,
        sendMessage,
        cleanup
    }
})
