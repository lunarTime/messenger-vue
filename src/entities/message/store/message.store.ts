import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useChatStore } from '@/entities/chat/store/chat.store'
import { useUserStore } from '@/entities/user/store/user.store'
import { ws } from '@/shared/api/ws/wsClient'
import type { Message } from '@/shared/types/message'

export const useMessageStore = defineStore('messages', () => {
    const chatStore = useChatStore()
    const userStore = useUserStore()
    const myId = userStore.userId
    const messages = ref<Message[]>([])

    const setMessages = (batch: { chatId: string; items: Message[] }) => {
        if (chatStore.activeChatId === batch.chatId) {
            messages.value = batch.items
        }
    }

    const addMessage = (msg: Message) => {
        if (msg.chatId === chatStore.activeChatId) {
            messages.value.push(msg)
        }
    }

    const sendMessage = (text: string) => {
        const chat = chatStore.activeChat

        if (!chat) {
            return
        }

        const target = chat.participants.find(p => p !== myId)

        ws.send({
            type: 'send_message',
            payload: {
                chatId: chat.id,
                text,
                userId: myId,
                targetUserId: target
            }
        })
    }

    return {
        messages,
        setMessages,
        addMessage,
        sendMessage
    }
})
