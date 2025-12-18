<script setup lang="ts">
    import { onMounted, onUnmounted } from 'vue'
    import { useChatStore } from '@/entities/chat/store/chat.store'
    import { useMessageStore } from '@/entities/message/store/message.store'
    import ChatList from '@/widgets/chat-list/ChatList.vue'
    import ChatHeader from '@/widgets/chat-header/ChatHeader.vue'
    import ChatMessageList from '@/widgets/chat-messages/ChatMessageList.vue'
    import MessageInput from '@/widgets/message-input/MessageInput.vue'
    import Splitter from 'primevue/splitter'
    import SplitterPanel from 'primevue/splitterpanel'

    const chatStore = useChatStore()
    const messageStore = useMessageStore()

    onMounted(() => {
        chatStore.loadChats()
    })

    onUnmounted(() => {
        chatStore.cleanup()
        messageStore.cleanup()
    })
</script>

<template>
    <div class="flex h-screen">
        <Splitter class="w-full">
            <SplitterPanel class="max-w-3xl min-w-fit">
                <ChatList />
            </SplitterPanel>
            <SplitterPanel class="flex min-w-fit">
                <div class="flex flex-col flex-1">
                    <div
                        v-if="!chatStore.activeChat"
                        class="flex items-center justify-center flex-1 text-muted"
                    >
                        <p class="lg:text-xl text-lg">Выберите чат для начала общения</p>
                    </div>

                    <template v-else>
                        <div class="flex flex-col h-full max-h-screen">
                            <ChatHeader />
                            <ChatMessageList />
                            <MessageInput />
                        </div>
                    </template>
                </div>
            </SplitterPanel>
        </Splitter>
    </div>
</template>

<style scoped>
    :deep(.p-splitter) {
        background: none !important;
        backdrop-filter: blur(100px);
        border: none !important;
        border-radius: 0 !important;
    }
</style>
