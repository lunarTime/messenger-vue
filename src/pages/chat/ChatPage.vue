<script setup lang="ts">
import { computed, watch, onUnmounted } from "vue";
import { useChatStore } from "@/entities/chat/store/chat.store";
import { useMessageStore } from "@/entities/message/store/message.store";
import { useUserStore } from "@/entities/user/store/user.store";
import { useIsMobile } from "@/shared/composables/useIsMobile";
import { useSwipeBack } from "@/shared/composables/useSwipeBack";
import ChatList from "@/widgets/chat-list/ChatList.vue";
import ChatHeader from "@/widgets/chat-header/ChatHeader.vue";
import MessageInput from "@/widgets/message-input/MessageInput.vue";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import ChatMessages from "@/widgets/chat-messages/ChatMessages.vue";

const chatStore = useChatStore();
const messageStore = useMessageStore();
const userStore = useUserStore();
const { isMobile } = useIsMobile();

const isChatPanelVisible = computed(() => !!chatStore.activeChat);

useSwipeBack(() => {
  if (isMobile.value && chatStore.activeChat) {
    chatStore.closeActiveChat();
  }
});

watch(
  () => ({
    userId: userStore.currentUser?.id ?? null,
    isAuthLoading: userStore.isLoading,
  }),
  ({ userId, isAuthLoading }, prev) => {
    if (isAuthLoading) return;

    if (!userId) {
      chatStore.cleanup();
      return;
    }

    const authJustReady = !!prev?.isAuthLoading;
    const userChanged = userId !== prev?.userId;

    if (userChanged || authJustReady) {
      chatStore.loadChats();
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  chatStore.cleanup();
  messageStore.cleanup();
});
</script>

<template>
  <main class="flex h-full overflow-hidden">
    <template v-if="!isMobile">
      <Splitter class="w-full">
        <SplitterPanel class="max-w-130 min-w-90 w-1/2! h-full p-4 pr-0">
          <ChatList />
        </SplitterPanel>
        <SplitterPanel class="flex md:min-w-100 min-w-80">
          <div class="flex flex-col flex-1 min-w-0">
            <div
              v-if="!isChatPanelVisible"
              class="flex items-center justify-center flex-1 gap-4 m-4 ml-0 p-4 text-muted bg-(--p-primary-color)/20 dark:bg-white/10 rounded-xl"
            >
              <p class="lg:text-xl text-lg">Выберите чат для начала общения</p>
            </div>

            <template v-else>
              <div
                class="flex flex-col h-[-webkit-fill-available] max-h-screen gap-4 m-4 ml-0 p-4 bg-(--p-primary-color)/20 dark:bg-white/10 rounded-xl"
              >
                <ChatHeader />
                <ChatMessages />
                <MessageInput />
              </div>
            </template>
          </div>
        </SplitterPanel>
      </Splitter>
    </template>

    <template v-else>
      <div class="relative w-full h-full overflow-hidden">
        <div
          class="absolute inset-0 w-full h-full transition-transform duration-300 ease-in-out"
          :class="isChatPanelVisible ? '-translate-x-full' : 'translate-x-0'"
        >
          <ChatList />
        </div>

        <div
          class="absolute inset-0 w-full h-full transition-transform duration-300 ease-in-out"
          :class="isChatPanelVisible ? 'translate-x-0' : 'translate-x-full'"
        >
          <div
            class="flex flex-col h-full md:gap-3 gap-2 md:p-3 p-1 bg-(--p-primary-color)/20 dark:bg-white/10"
          >
            <ChatHeader :mobile="true" />
            <ChatMessages />
            <MessageInput />
          </div>
        </div>
      </div>
    </template>
  </main>
</template>

<style scoped>
:deep(.p-splitter) {
  background: none !important;
  backdrop-filter: blur(100px);
  border: none !important;
  border-radius: 0 !important;
}

:deep(.p-splitterpanel) {
  outline: none !important;
}

:deep(.p-splitter-gutter) {
  position: relative;
  width: 1.5rem;
  background-color: transparent;
  outline: none !important;
  user-select: none;
}

:deep(.p-splitter-gutter-handle) {
  background-color: var(--p-primary-color);
  opacity: 0.2;
  transition: opacity 0.2s;
}

:deep(.p-splitter-gutter:hover .p-splitter-gutter-handle) {
  opacity: 0.5;
}

:deep(.p-splitter-gutter:active .p-splitter-gutter-handle) {
  opacity: 1;
}
</style>
