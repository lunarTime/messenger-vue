<script setup lang="ts">
    import { watch, nextTick } from 'vue'
    import { useMessageStore } from '@/entities/message/store/message.store'
    import ChatBubble from '@/widgets/chat-messages/ui/ChatBubble.vue'

    const store = useMessageStore()

    const userId = window.localStorage.getItem('userId') || ''

    const scrollToBottom = () => {
        nextTick(() => {
            const el = document.getElementById('messages')

            if (el) {
                el.scrollTop = el.scrollHeight
            }
        })
    }

    watch(() => store.messages, scrollToBottom, { deep: true })
</script>

<template>
    <div
        id="messages"
        class="flex flex-col flex-1 gap-2 p-4 overflow-y-auto"
    >
        <ChatBubble
            v-for="m in store.messages"
            :key="m.id"
            :text="m.text"
            :created-ad="m.createdAt"
            :variant="m.userId === userId ? 'outgoing' : 'incoming'"
        />
    </div>
</template>
