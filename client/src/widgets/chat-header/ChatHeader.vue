<script setup lang="ts">
    import { computed } from 'vue'
    import { useChatStore } from '@/entities/chat/store/chat.store'
    import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
    import AppButton from '@/widgets/ui/AppButton.vue'

    const chatStore = useChatStore()

    const title = computed(() => {
        const chat = chatStore.activeChat

        if (!chat) {
            return 'Select chat'
        }

        return chatStore.otherUserName(chat)
    })

    const isOnline = computed(() => chatStore.onlineUsers.includes(title.value))

    const closeActiveChat = () => chatStore.closeActiveChat()
</script>

<template>
    <div class="flex items-center gap-4 p-2 border-b border-gray bg-white">
        <AppButton @click="closeActiveChat">
            <ArrowLeftIcon class="size-4" />
        </AppButton>
        <div class="flex flex-col">
            <p class="font-medium">
                {{ title }}
            </p>
            <p
                class="text-xs"
                :class="{
                    'text-success': isOnline,
                    'text-error': !isOnline
                }"
            >
                {{ isOnline ? 'online' : 'offline' }}
            </p>
        </div>
    </div>
</template>
