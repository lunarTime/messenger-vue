<script setup lang="ts">
    import { ref } from 'vue'
    import { useChatStore } from '@/entities/chat/store/chat.store'
    import { useUserStore } from '@/entities/user/store/user.store'
    import ChatListItem from '@/widgets/chat-list/ui/ChatListItem.vue'
    import AppButton from '@/widgets/ui/AppButton.vue'

    const chatStore = useChatStore()
    const userStore = useUserStore()

    const search = ref('')
    const error = ref('')
    const copyText = ref('Copy')
    const isOpen = ref(false)
    const isCopyDisabled = ref(false)

    const onSearch = () => {
        const id = search.value.trim()

        if (id.length < 12) {
            error.value = 'ID must be 12 characters'

            return
        }

        if (id === userStore.userId) {
            error.value = 'Cannot chat with yourself'

            return
        }

        error.value = ''
        chatStore.openChatWith(id)
        search.value = ''
        isOpen.value = false
    }

    const copyId = () => {
        window.navigator.clipboard.writeText(userStore.userId)
        copyText.value = 'Copied!'
        isCopyDisabled.value = true

        setTimeout(() => {
            copyText.value = 'Copy'
            isCopyDisabled.value = false
        }, 1000)
    }
</script>

<template>
    <div class="flex flex-col min-w-58 h-full border-r border-gray">
        <div class="p-4 space-y-3 border-b border-gray">
            <div class="flex flex-col gap-1">
                <p class="mb-1 text-xs text-dark uppercase">Your ID</p>

                <div class="flex items-center gap-2">
                    <span class="px-2 py-1 font-mono bg-lightgray rounded">
                        {{ userStore.userId }}
                    </span>

                    <AppButton
                        @click="copyId"
                        class="disabled:cursor-default! disabled:opacity-60"
                        :disabled="isCopyDisabled"
                    >
                        {{ copyText }}
                    </AppButton>
                </div>
            </div>

            <div class="space-y-2">
                <input
                    v-model="search"
                    type="text"
                    placeholder="Enter user ID"
                    class="w-full px-3 py-2 text-sm rounded border border-gray"
                    @keydown.enter.prevent="onSearch"
                />

                <p
                    v-if="error"
                    class="text-xs text-error"
                >
                    {{ error }}
                </p>

                <AppButton @click="onSearch"> Start chat </AppButton>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto">
            <ChatListItem
                v-for="chat in chatStore.visibleChats"
                :key="chat.id"
                :active="chat.id === chatStore.activeChatId"
                :name="chatStore.otherUserName(chat)"
                :lastMessage="chat.lastMessage"
                @click="chatStore.selectChat(chat.id)"
            />
        </div>
    </div>
</template>
