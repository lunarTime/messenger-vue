import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from '@/entities/user/store/user.store'
import { subscribeToUserChats, getUserById, subscribeToUser } from '@/shared/api/firebase/firestore'
import type { Unsubscribe } from 'firebase/firestore'
import type { Chat } from '@/shared/types/chat'
import type { User } from '@/shared/types/user'

export const useChatStore = defineStore('chat', () => {
    const userStore = useUserStore()

    const chats = ref<Chat[]>([])
    const activeChatId = ref<string | null>(null)
    const chatParticipants = ref<Map<string, User>>(new Map())
    const isLoading = ref(false)
    const unsubscribeChats = ref<Unsubscribe | null>(null)
    const userSubscriptions = ref<Map<string, Unsubscribe>>(new Map())
    const temporaryChat = ref<Chat | null>(null)

    const myId = computed(() => userStore.userId)

    const activeChat = computed(() => {
        if (temporaryChat.value && activeChatId.value === temporaryChat.value.id) {
            return temporaryChat.value
        }

        return chats.value.find(c => c.id === activeChatId.value) || null
    })

    const visibleChats = computed(() => {
        return chats.value.filter(chat => {
            return chat.lastMessage && chat.lastMessage.text
        })
    })

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
                if (userSubscriptions.value.has(userId)) {
                    continue
                }

                const unsubscribe = subscribeToUser(userId, user => {
                    if (user) {
                        chatParticipants.value.set(userId, user)
                    } else {
                        chatParticipants.value.delete(userId)
                    }
                })

                userSubscriptions.value.set(userId, unsubscribe)
            }

            isLoading.value = false
        })
    }

    const selectChat = (chatId: string) => {
        if (!chatId) {
            return
        }

        activeChatId.value = chatId
    }

    const closeActiveChat = () => {
        activeChatId.value = null
    }

    const openChatWith = async (userId: string): Promise<void> => {
        if (!myId.value) {
            throw new Error('Пользователь не авторизован')
        }

        if (userId === myId.value) {
            throw new Error('Нельзя начать чат с самим собой')
        }

        if (!userId) {
            throw new Error('userId обязателен')
        }

        try {
            const existingChat = chats.value.find(chat => {
                if (chat.type === 'direct' && Array.isArray(chat.participants)) {
                    return chat.participants.includes(userId) && chat.participants.includes(myId.value)
                }

                return false
            })

            if (existingChat) {
                selectChat(existingChat.id)

                temporaryChat.value = null
            } else {
                const tempChatId = `temp_${myId.value}_${userId}_${Date.now()}`
                const user = await getUserById(userId)

                if (user) {
                    chatParticipants.value.set(userId, user)

                    if (!userSubscriptions.value.has(userId)) {
                        const unsubscribe = subscribeToUser(userId, updatedUser => {
                            if (updatedUser) {
                                chatParticipants.value.set(userId, updatedUser)
                            }
                        })

                        userSubscriptions.value.set(userId, unsubscribe)
                    }
                }

                temporaryChat.value = {
                    id: tempChatId,
                    type: 'direct',
                    participants: [myId.value, userId],
                    createdAt: null as any,
                    updatedAt: null as any,
                    createdBy: myId.value,
                    lastMessage: {
                        text: '',
                        senderId: '',
                        createdAt: null as any
                    }
                }

                activeChatId.value = tempChatId
            }
        } catch (error) {
            console.error('Ошибка при открытии чата:', error)

            throw error
        }
    }

    const otherUserName = (chat: Chat): string => {
        if (chat.type === 'group') {
            return chat.name || 'Групповой чат'
        }

        if (chat.type === 'direct' && Array.isArray(chat.participants)) {
            const otherUserId = chat.participants.find(id => id !== myId.value)

            if (otherUserId) {
                const user = chatParticipants.value.get(otherUserId)

                return user?.displayName || user?.email || 'Неизвестный пользователь'
            }
        }
        return 'Чат'
    }

    const getChatDisplayName = (chat: Chat): string => {
        return otherUserName(chat)
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

    const getOtherUser = (chat: Chat): User | null => {
        if (chat.type === 'direct' && Array.isArray(chat.participants)) {
            const otherUserId = chat.participants.find(id => id !== myId.value)

            if (otherUserId) {
                return chatParticipants.value.get(otherUserId) || null
            }
        }
        return null
    }

    const cleanup = () => {
        if (unsubscribeChats.value) {
            unsubscribeChats.value()
            unsubscribeChats.value = null
        }

        userSubscriptions.value.forEach(unsub => unsub())
        userSubscriptions.value.clear()
        chats.value = []
        activeChatId.value = null
        chatParticipants.value.clear()
        temporaryChat.value = null
    }

    return {
        chats,
        activeChatId,
        activeChat,
        chatParticipants,
        isLoading,
        visibleChats,
        temporaryChat,
        loadChats,
        selectChat,
        closeActiveChat,
        openChatWith,
        otherUserName,
        getChatDisplayName,
        getChatPhotoURL,
        getOtherUser,
        cleanup
    }
})
