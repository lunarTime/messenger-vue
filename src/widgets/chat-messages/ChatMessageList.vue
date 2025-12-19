<script setup lang="ts">
    import { ref, watch, nextTick, onMounted, computed } from 'vue'
    import { useScroll, useThrottleFn } from '@vueuse/core'
    import { useMessageStore } from '@/entities/message/store/message.store'
    import { useChatStore } from '@/entities/chat/store/chat.store'
    import { useUserStore } from '@/entities/user/store/user.store'
    import { markChatAsRead } from '@/shared/api/firebase/firestore'
    import ChatBubble from '@/widgets/chat-messages/ui/ChatBubble.vue'
    import ProgressSpinner from 'primevue/progressspinner'
    import Button from 'primevue/button'

    const messageStore = useMessageStore()
    const chatStore = useChatStore()
    const userStore = useUserStore()

    const containerRef = ref<HTMLElement | null>(null)
    const isUserScrolling = ref(false)

    const hasMessages = computed(() => messageStore.messages.length > 0)
    const showContent = computed(() => !messageStore.isLoading && hasMessages.value)
    const showEmptyState = computed(() => !messageStore.isLoading && !hasMessages.value)

    const { arrivedState } = useScroll(containerRef, {
        throttle: 100,
        offset: { bottom: 150 }
    })

    const scrollToBottom = useThrottleFn(async (smooth = true) => {
        await nextTick()

        if (!containerRef.value) {
            return
        }

        containerRef.value.scrollTo({
            top: containerRef.value.scrollHeight,
            behavior: smooth ? 'smooth' : 'auto'
        })

        isUserScrolling.value = false
    }, 100)

    watch(arrivedState, state => {
        isUserScrolling.value = !state.bottom
    })

    const markAsRead = async (): Promise<void> => {
        if (!chatStore.activeChatId || !userStore.userId) {
            return
        }

        const messages = messageStore.messages

        if (messages.length === 0) {
            return
        }

        const lastMessage = messages[messages.length - 1]

        if (lastMessage && lastMessage.senderId !== userStore.userId) {
            await markChatAsRead(chatStore.activeChatId, userStore.userId, lastMessage.id)
        }
    }

    watch(
        () => arrivedState.bottom,
        atBottom => {
            if (atBottom) {
                markAsRead()
            }
        }
    )

    watch(
        () => messageStore.messages.length,
        async (newLength, oldLength) => {
            if (newLength === 0) {
                return
            }

            if (newLength > oldLength) {
                const lastMessage = messageStore.messages[newLength - 1]

                if (lastMessage?.senderId === userStore.userId || arrivedState.bottom) {
                    await scrollToBottom(lastMessage?.senderId === userStore.userId)
                }
            }
        }
    )

    watch(
        () => chatStore.activeChatId,
        async (newChatId, oldChatId) => {
            if (!newChatId || newChatId === oldChatId) {
                return
            }

            isUserScrolling.value = false

            await nextTick()
            await new Promise(resolve => setTimeout(resolve, 100))
            await scrollToBottom(false)
            await markAsRead()
        },
        { immediate: true }
    )

    onMounted(async () => {
        await nextTick()
        await scrollToBottom(false)
    })
</script>

<template>
    <div class="flex-1 min-h-0 relative overflow-hidden w-full">
        <Transition
            enter-active-class="transition-opacity duration-200"
            enter-from-class="opacity-0"
            leave-active-class="transition-opacity duration-200"
            leave-to-class="opacity-0"
        >
            <div
                v-if="messageStore.isLoading"
                class="flex items-center justify-center h-full absolute inset-0 z-10 backdrop-blur-sm"
            >
                <ProgressSpinner />
            </div>
        </Transition>

        <div
            v-if="showEmptyState"
            class="flex items-center justify-center h-full text-center p-8"
        >
            <div>
                <i class="pi pi-inbox text-3xl! mb-4 block"></i>
                <p class="text-lg font-medium"> Нет сообщений </p>
                <p class="text-sm mt-2"> Начните общение первым </p>
            </div>
        </div>

        <div
            v-if="showContent"
            ref="containerRef"
            class="h-full overflow-y-auto overflow-x-hidden px-4 py-2"
        >
            <div class="flex flex-col gap-2">
                <ChatBubble
                    v-for="message in messageStore.messages"
                    :key="message.id"
                    :text="message.text"
                    :created-at="message.createdAt"
                    :edited="message.isEdited"
                    :deleted="message.isDeleted"
                    :variant="message.senderId === userStore.userId ? 'outgoing' : 'incoming'"
                    :delivery-status="
                        message.senderId === userStore.userId ? messageStore.messageStatuses.get(message.id) : undefined
                    "
                />
            </div>
        </div>

        <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 scale-0 translate-y-0"
            enter-to-class="opacity-100 scale-1 translate-y-8"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 scale-1 translate-y-0"
            leave-to-class="opacity-0 scale-0 translate-y-8"
        >
            <Button
                v-show="isUserScrolling && hasMessages"
                @click="scrollToBottom(true)"
                class="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 transition-all!"
                icon="pi pi-arrow-down"
                rounded
                size="small"
                aria-label="Прокрутить вниз"
            />
        </Transition>
    </div>
</template>
