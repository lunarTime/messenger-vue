<script setup lang="ts">
    import { computed } from 'vue'
    import { useChatStore } from '@/entities/chat/store/chat.store'
    import { useUserStore } from '@/entities/user/store/user.store'
    import { useUnreadCounts } from '@/shared/composables/useUnreadCounts'
    import type { Chat } from '@/shared/types/chat'
    import ChatListItem from '@/widgets/chat-list/ui/ChatListItem.vue'
    import UserSearch from '@/widgets/chat-list/ui/ChatSearch.vue'
    import CurrentUser from '@/widgets/ui/CurrentUser.vue'
    import ScrollPanel from 'primevue/scrollpanel'

    const chatStore = useChatStore()
    const userStore = useUserStore()

    const { unreadCounts } = useUnreadCounts(
        computed(() => chatStore.visibleChats),
        computed(() => userStore.userId)
    )

    const getOtherUserId = (chat: Chat): string => {
        if (!userStore.userId) {
            return ''
        }

        return chat.participants.find(id => id !== userStore.userId) || ''
    }
</script>

<template>
    <div class="flex flex-col h-full">
        <UserSearch />

        <ScrollPanel class="flex-1">
            <div
                v-if="chatStore.visibleChats.length === 0"
                class="p-8 text-center"
            >
                <i class="pi pi-comments text-4xl mb-4"></i>
                <p> Нет активных чатов </p>
                <p class="text-sm mt-2"> Используйте поиск выше, чтобы начать общение </p>
            </div>

            <ChatListItem
                v-for="chat in chatStore.visibleChats"
                :key="chat.id"
                :chat-id="chat.id"
                :other-user-id="getOtherUserId(chat)"
                :active="chat.id === chatStore.activeChatId"
                :name="chatStore.otherUserName(chat)"
                :last-message="chat.lastMessage"
                :date="chat.updatedAt"
                :unread-count="unreadCounts[chat.id]"
                @click="chatStore.selectChat(chat.id)"
            />
        </ScrollPanel>

        <CurrentUser />
    </div>
</template>
