import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Unsubscribe } from 'firebase/firestore'
import { useUserStore } from '@/entities/user/store/user.store'
import { subscribeToUserChats, getOrCreateDirectChat, getUserById } from '@/shared/api/firebase/firestore'
import type { Chat } from '@/shared/types/chat'
import type { User } from '@/shared/types/user'

export const useChatStore = defineStore('chat', () => {
    const userStore = useUserStore()

    const chats = ref<Chat[]>([])
    const activeChatId = ref<string | null>(null)
    const chatParticipants = ref<Map<string, User>>(new Map())
    const isLoading = ref(false)
    const unsubscribeChats = ref<Unsubscribe | null>(null)

    const myId = computed(() => userStore.userId)
    const activeChat = computed(() => chats.value.find(c => c.id === activeChatId.value) || null)

    const loadChats = () => {
        if (!myId.value) {
            console.error('ID пользователя недоступен')

            return
        }

        if (unsubscribeChats.value) {
            unsubscribeChats.value()
        }

        isLoading.value = true

        unsubscribeChats.value = subscribeToUserChats(myId.value, async loadedChats => {
            chats.value = loadedChats

            const participantIds = new Set<string>()

            loadedChats.forEach(chat => {
                if (chat.type === 'direct' && Array.isArray(chat.participants)) {
                    chat.participants.forEach(id => {
                        if (id !== myId.value) {
                            participantIds.add(id)
                        }
                    })
                }
            })

            for (const userId of participantIds) {
                if (!chatParticipants.value.has(userId)) {
                    try {
                        const user = await getUserById(userId)

                        if (user) {
                            chatParticipants.value.set(userId, user)
                        }
                    } catch (error) {
                        console.error(`Ошибка загрузки пользователя ${userId}:`, error)
                    }
                }
            }

            isLoading.value = false
        })
    }

    const selectChat = (chatId: string) => {
        activeChatId.value = chatId
    }

    const closeActiveChat = () => {
        activeChatId.value = null
    }

    const openChatWithUser = async (userId: string) => {
        if (!myId.value) {
            console.error('Пользователь не авторизован')

            return
        }

        if (userId === myId.value) {
            console.error('Нельзя начать чат с самим собой')

            return
        }

        try {
            const chatId = await getOrCreateDirectChat(myId.value, userId)

            selectChat(chatId)

            if (!chatParticipants.value.has(userId)) {
                const user = await getUserById(userId)

                if (user) {
                    chatParticipants.value.set(userId, user)
                }
            }
        } catch (error) {
            console.error('Ошибка при открытии чата:', error)
        }
    }

    const getChatDisplayName = (chat: Chat): string => {
        if (chat.type === 'group') {
            return chat.name || 'Групповой чат'
        }

        if (chat.type === 'direct' && Array.isArray(chat.participants)) {
            const otherUserId = chat.participants.find(id => id !== myId.value)

            if (otherUserId) {
                const user = chatParticipants.value.get(otherUserId)

                return user?.displayName || user?.email || 'Unknown User'
            }
        }

        return 'Чат'
    }

    const getChatPhotoURL = (chat: Chat): string | null => {
        if (chat.type === 'group') {
            return chat.photoURL || null
        }

        if (chat.type === 'direct' && Array.isArray(chat.participants)) {
            const otherUserId = chat.participants.find(id => id !== myId.value)

            if (otherUserId) {
                const user = chatParticipants.value.get(otherUserId)

                return user?.photoURL || null
            }
        }

        return null
    }

    const cleanup = () => {
        if (unsubscribeChats.value) {
            unsubscribeChats.value()
            unsubscribeChats.value = null
        }

        chats.value = []
        activeChatId.value = null
        chatParticipants.value.clear()
    }

    return {
        chats,
        activeChatId,
        activeChat,
        chatParticipants,
        isLoading,
        loadChats,
        selectChat,
        closeActiveChat,
        openChatWithUser,
        getChatDisplayName,
        getChatPhotoURL,
        cleanup
    }
})
