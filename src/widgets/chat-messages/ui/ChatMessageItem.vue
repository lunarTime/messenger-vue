<script setup lang="ts">
    import { computed } from 'vue'
    import type { Message } from '@/shared/types/message'
    import ChatBubble from '@/shared/ui/ChatBubble.vue'
    import MessageActionsMenu from '@/features/message-actions/ui/MessageActionsMenu.vue'

    const props = defineProps<{
        message: Message
        currentUserId: string
    }>()

    const emit = defineEmits<{
        edit: [messageId: string]
        deleteForMe: [messageId: string]
        deleteForAll: [messageId: string]
    }>()

    const isOutgoing = computed(() => props.message.senderId === props.currentUserId)
    const bubbleClasses = computed(() => (isOutgoing.value ? 'self-end' : 'self-start'))
</script>

<template>
    <div
        class="flex gap-2 group relative w-fit"
        :class="bubbleClasses"
    >
        <MessageActionsMenu
            v-if="!isOutgoing"
            :is-outgoing="false"
            :is-deleted="message.isDeleted"
            @delete-for-me="emit('deleteForMe', message.id)"
            class="order-last"
        />

        <MessageActionsMenu
            v-else="isOutgoing"
            :is-outgoing="true"
            :is-deleted="message.isDeleted"
            @edit="emit('edit', message.id)"
            @delete-for-me="emit('deleteForMe', message.id)"
            @delete-for-all="emit('deleteForAll', message.id)"
            class="order-first"
        />

        <ChatBubble
            :text="message.text"
            :variant="isOutgoing ? 'outgoing' : 'incoming'"
            :created-at="message.createdAt"
            :edited="message.isEdited"
            :deleted="message.isDeleted"
        />
    </div>
</template>
