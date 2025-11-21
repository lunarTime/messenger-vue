<script setup lang="ts">
    import { computed } from 'vue'
    import { useChatStore } from '@/entities/chat/store/chat.store'
    import ChatHeader from '@widgets/chat-header/ChatHeader.vue'
    import ChatList from '@widgets/chat-list/ChatList.vue'
    import ChatMessageList from '@widgets/chat-messages/ChatMessageList.vue'
    import MessageInput from '@widgets/message-input/MessageInput.vue'

    const chatStore = useChatStore()
    const selectedChat = computed(() => chatStore.activeChatId)
</script>

<template>
    <div class="flex h-screen w-full">
        <ChatList />

        <template v-if="selectedChat">
            <div class="flex flex-col flex-1">
                <ChatHeader class="border-b border-gray" />
                <ChatMessageList class="flex-1 overflow-y-auto" />
                <MessageInput class="border-t bg-white border-gray" />
            </div>
        </template>

        <div
            v-else
            class="flex flex-1 items-center justify-center bg-white text-dark"
        >
            No chat selected - choose one
        </div>
    </div>
</template>
