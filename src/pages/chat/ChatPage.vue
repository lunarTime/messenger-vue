<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useChatStore } from "@/entities/chat/store/chat.store";
import { useMessageStore } from "@/entities/message/store/message.store";
import ChatList from "@/widgets/chat-list/ChatList.vue";
import ChatHeader from "@/widgets/chat-header/ChatHeader.vue";
import MessageInput from "@/widgets/message-input/MessageInput.vue";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import ChatMessages from "@/widgets/chat-messages/ChatMessages.vue";

const chatStore = useChatStore();
const messageStore = useMessageStore();

onMounted(() => {
  chatStore.loadChats();
});

onUnmounted(() => {
  chatStore.cleanup();
  messageStore.cleanup();
});
</script>

<template>
  <div class="flex h-screen">
    <Splitter class="w-full">
      <SplitterPanel class="max-w-3xl min-w-fit">
        <ChatList />
      </SplitterPanel>
      <SplitterPanel class="flex min-w-80">
        <div class="flex flex-col flex-1">
          <div
            v-if="!chatStore.activeChat"
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
  </div>
</template>

<style scoped>
:deep(.p-splitter) {
  background: none !important;
  backdrop-filter: blur(100px);
  border: none !important;
  border-radius: 0 !important;
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
