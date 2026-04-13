<script setup lang="ts">
    import { computed, ref, watch, onUnmounted } from 'vue'
    import { useChatStore } from '@/entities/chat/store/chat.store'
    import { useUserStore } from '@/entities/user/store/user.store'
    import { useTimeAgo } from '@/shared/composables/useTimeAgo'
    import { useGlobalNow } from '@/shared/composables/useGlobalNow'
    import { subscribeToTyping } from '@/shared/api/firebase/firestore'
    import type { Timestamp } from 'firebase/firestore'
    import Avatar from 'primevue/avatar'
    import Badge from 'primevue/badge'

    const props = defineProps<{
        chatId: string
        otherUserId: string
        name: string
        lastMessage?: {
            text: string
            senderId: string
            createdAt: Timestamp
        }
        date?: Timestamp
        active?: boolean
        unreadCount?: number
    }>()

    const chatStore = useChatStore()
    const userStore = useUserStore()
    const now = useGlobalNow(30000)

    let unsubscribeTyping: (() => void) | null = null
    const typingUsers = ref<string[]>([])

    const otherUser = computed(() => {
        return chatStore.chatParticipants.get(props.otherUserId) || null
    })

    const isOnline = computed(() => {
        if (!otherUser.value) return false
        if (!otherUser.value.isOnline) return false

        if (otherUser.value.lastSeen) {
            const lastSeenMillis = otherUser.value.lastSeen.toMillis()
            const diff = now.value - lastSeenMillis
            return diff < 120000
        }
        
        return false
    })
    const isTyping = computed(() => typingUsers.value.includes(props.otherUserId))
    const displayDate = useTimeAgo(props.date ?? null)
    const displayMessage = computed(() => {
        if (isTyping.value) {
            return 'печатает...'
        }

        if (props.lastMessage?.text) {
            const { text } = props.lastMessage

            return text.length <= 25 ? text : text.slice(0, 25) + '...'
        }

        return 'Нет сообщений'
    })

    watch(
        () => props.chatId,
        chatId => {
            unsubscribeTyping?.()
            unsubscribeTyping = null

            if (!chatId) {
                return
            }

            unsubscribeTyping = subscribeToTyping(chatId, users => {
                typingUsers.value = users.filter(id => id !== userStore.userId)
            })
        },
        {
            immediate: true
        }
    )

    onUnmounted(() => {
        unsubscribeTyping?.()
    })
</script>

<template>
    <div
        v-ripple
        class="relative flex items-center gap-3 p-4 cursor-pointer transition-colors duration-200 hover:bg-(--p-primary-color)/20"
        :class="{ 'bg-(--p-primary-color)/30': active }"
    >
        <div class="relative shrink-0">
            <Avatar
                :image="otherUser?.photoURL ?? undefined"
                :label="otherUser?.photoURL ? undefined : name.charAt(0).toUpperCase()"
                :class="otherUser?.photoURL ? undefined : 'bg-(--p-primary-color)! text-white!'"
                shape="circle"
                size="large"
            />
            <div
                v-if="isOnline"
                class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full"
                title="Онлайн"
            />
        </div>

        <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
                <h3 class="font-semibold truncate">
                    {{ name }}
                </h3>
                <span
                    v-if="displayDate"
                    class="text-xs shrink-0 ml-2"
                >
                    {{ displayDate }}
                </span>
            </div>

            <div class="flex items-center justify-between gap-2">
                <p
                    class="text-sm truncate"
                    :class="isTyping ? 'italic' : ''"
                >
                    {{ displayMessage }}
                </p>

                <Badge
                    v-if="unreadCount && unreadCount > 0"
                    :value="unreadCount"
                    severity="contrast"
                    size="small"
                />
            </div>
        </div>
    </div>
</template>
