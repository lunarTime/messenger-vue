import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from '@/entities/user/store/user.store'
import { ws } from '@/shared/api/ws/wsClient'

export type ChatPreview = {
    id: string
    participants: string[]
    lastMessage: string
    updatedAt: number
}

export const useChatStore = defineStore('chat', () => {
    const userStore = useUserStore()

    const chats = ref<ChatPreview[]>([])
    const activeChatId = ref<string | null>(null)
    const onlineUsers = ref<string[]>([])
    const myId = computed(() => userStore.userId)
    const activeChat = computed(() => chats.value.find(c => c.id === activeChatId.value) || null)
    const visibleChats = computed(() =>
        chats.value.filter(c => c.participants.includes(myId.value)).sort((a, b) => b.updatedAt - a.updatedAt)
    )

    const loadChats = () => {
        ws.send({
            type: 'get_chats',
            payload: { userId: myId.value }
        })
    }

    const setChats = (list: ChatPreview[]) => {
        chats.value = list
    }

    const setOnline = (list: string[]) => {
        onlineUsers.value = list
    }

    const closeActiveChat = () => {
        activeChatId.value = null
    }

    const selectChat = (id: string) => {
        activeChatId.value = id

        ws.send({
            type: 'load_messages',
            payload: { chatId: id }
        })
    }

    const openChatWith = (otherUserId: string) => {
        otherUserId = otherUserId.trim()

        if (otherUserId.length < 12) {
            return
        }

        const id = [myId.value, otherUserId].sort().join(':')

        if (!chats.value.find(c => c.id === id)) {
            chats.value.unshift({
                id,
                participants: [myId.value, otherUserId],
                lastMessage: '',
                updatedAt: Date.now()
            })
        }

        selectChat(id)
    }

    const otherUserName = (chat: ChatPreview) => {
        return chat.participants.find(p => p !== myId.value) || 'Unknown'
    }

    return {
        chats,
        activeChatId,
        activeChat,
        visibleChats,
        onlineUsers,
        loadChats,
        setChats,
        selectChat,
        setOnline,
        openChatWith,
        closeActiveChat,
        otherUserName
    }
})
