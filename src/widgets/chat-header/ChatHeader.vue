<script setup lang="ts">
    import { computed, ref, onUnmounted, watch } from 'vue'
    import { useChatStore } from '@/entities/chat/store/chat.store'
    import { subscribeToUser } from '@/shared/api/firebase/firestore'
    import type { User } from '@/shared/types/user'
    import { useGlobalNow } from '@/shared/composables/useGlobalNow'
    import Avatar from 'primevue/avatar'

    const chatStore = useChatStore()
    const now = useGlobalNow(30000)

    let unsubscribeUser: (() => void) | null = null
    const otherUser = ref<User | null>(null)

    const chatName = computed(() => {
        const chat = chatStore.activeChat

        if (!chat) {
            return ''
        }

        return chatStore.otherUserName(chat)
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

    const otherUserId = computed(() => {
        const chat = chatStore.activeChat

        if (!chat || chat.type !== 'direct') {
            return null
        }

        return chatStore.getOtherUser(chat)?.id || null
    })

    const setupUserSubscription = () => {
        if (unsubscribeUser) {
            unsubscribeUser()
            unsubscribeUser = null
        }

        if (otherUserId.value) {
            unsubscribeUser = subscribeToUser(otherUserId.value, user => {
                otherUser.value = user
            })
        }
    }

    watch(
        otherUserId,
        () => {
            setupUserSubscription()
        },
        {
            immediate: true
        }
    )

    onUnmounted(() => {
        unsubscribeUser?.()
        unsubscribeUser = null
    })
</script>

<template>
    <div class="sticky top-0 z-10 flex items-center justify-between p-4">
        <div class="flex items-center gap-3">
            <div class="relative">
                <Avatar
                    :image="otherUser?.photoURL ?? undefined"
                    :label="otherUser?.photoURL ? undefined : chatName.charAt(0).toUpperCase()"
                    :class="otherUser?.photoURL ? undefined : 'bg-(--p-primary-color)! text-white!'"
                    shape="circle"
                    size="large"
                />
                <div
                    v-if="isOnline"
                    class="absolute top-0 right-0 w-3 h-3 bg-green-500 border rounded-full"
                    title="Онлайн"
                />
            </div>

            <div>
                <h2 class="text-lg font-semibold">
                    {{ chatName }}
                </h2>
                <p class="text-sm">
                    {{ isOnline ? 'онлайн' : 'не в сети' }}
                </p>
            </div>
        </div>
    </div>
</template>
