<script setup lang="ts">
import { computed, ref } from "vue";
import { useChatStore } from "@/entities/chat/store/chat.store";
import { useUserStore } from "@/entities/user/store/user.store";
import { useUnreadCounts } from "@/shared/composables/useUnreadCounts";
import type { Chat } from "@/shared/types/chat";
import ChatListItem from "@/widgets/chat-list/ui/ChatListItem.vue";
import UserSearch from "@/widgets/chat-list/ui/ChatSearch.vue";
import CurrentUser from "@/widgets/ui/CurrentUser.vue";
import ScrollPanel from "primevue/scrollpanel";
import Divider from "primevue/divider";

const chatStore = useChatStore();
const userStore = useUserStore();

const { unreadCounts } = useUnreadCounts(
  computed(() => chatStore.visibleChats),
  computed(() => userStore.userId),
);

const getOtherUserId = (chat: Chat): string => {
  if (!userStore.userId) {
    return "";
  }

  return chat.participants.find((id) => id !== userStore.userId) || "";
};

const normalizeLastMessage = (message?: Chat["lastMessage"]) => {
  if (!message?.text) return undefined;

  return {
    ...message,
    text: message.text.length > 500 ? message.text.slice(0, 500) : message.text,
  };
};

const pinnedChats = computed(() =>
  chatStore.visibleChats.filter((c) => chatStore.isChatPinned(c.id)),
);
const unpinnedChats = computed(() =>
  chatStore.visibleChats.filter((c) => !chatStore.isChatPinned(c.id)),
);

const openContextChatId = ref<string | null>(null);

const draggingPinnedChatId = ref<string | null>(null);
const dragOverPinnedChatId = ref<string | null>(null);

const onPinnedDragStart = (chatId: string, event: DragEvent) => {
  draggingPinnedChatId.value = chatId;
  dragOverPinnedChatId.value = null;
  try {
    event.dataTransfer?.setData("text/plain", chatId);
    event.dataTransfer?.setDragImage(new Image(), 0, 0);
  } catch {}
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
  }
};

const onPinnedDrop = async (targetChatId: string) => {
  const sourceChatId = draggingPinnedChatId.value;
  draggingPinnedChatId.value = null;
  dragOverPinnedChatId.value = null;
  if (!sourceChatId) return;
  if (sourceChatId === targetChatId) return;

  const ids = pinnedChats.value.map((c) => c.id);
  const from = ids.indexOf(sourceChatId);
  const to = ids.indexOf(targetChatId);
  if (from === -1 || to === -1) return;

  ids.splice(from, 1);
  ids.splice(to, 0, sourceChatId);

  await chatStore.reorderPinnedChats(ids);
};

const onPinnedDragEnd = () => {
  draggingPinnedChatId.value = null;
  dragOverPinnedChatId.value = null;
};

const onPinnedDragOver = (chatId: string) => {
  if (!draggingPinnedChatId.value) return;
  if (draggingPinnedChatId.value === chatId) {
    dragOverPinnedChatId.value = null;
    return;
  }
  dragOverPinnedChatId.value = chatId;
};
</script>

<template>
  <div
    class="flex flex-col h-[-webkit-fill-available] gap-4 m-4 mr-0 p-4 pr-2 bg-(--p-primary-color)/20 dark:bg-white/10 rounded-xl"
  >
    <UserSearch />

    <ScrollPanel class="flex-1 h-0 w-full min-w-0 pr-[16px]">
      <div v-if="chatStore.visibleChats.length === 0" class="p-8 text-center">
        <i class="pi pi-comments text-4xl mb-4"></i>
        <p>Нет активных чатов</p>
        <p class="text-sm mt-2">Используйте поиск выше, чтобы начать общение</p>
      </div>

      <div v-else class="w-full min-w-0 overflow-hidden flex flex-col gap-2">
        <div v-if="pinnedChats.length" class="flex flex-col gap-2">
          <ChatListItem
            v-for="chat in pinnedChats"
            :key="chat.id"
            :chat-id="chat.id"
            :other-user-id="getOtherUserId(chat)"
            :active="chat.id === chatStore.activeChatId"
            :name="chatStore.otherUserName(chat)"
            :last-message="normalizeLastMessage(chat.lastMessage)"
            :date="chat.updatedAt ?? chat.lastMessage?.createdAt"
            :unread-count="unreadCounts[chat.id]"
            :open-context-chat-id="openContextChatId"
            @context-open="openContextChatId = $event"
            @click="
              openContextChatId = null;
              chatStore.selectChat(chat.id);
            "
            draggable="true"
            @dragstart="onPinnedDragStart(chat.id, $event)"
            @dragend="onPinnedDragEnd"
            @dragover.prevent="onPinnedDragOver(chat.id)"
            @dragenter.prevent="onPinnedDragOver(chat.id)"
            @drop.prevent="onPinnedDrop(chat.id)"
            :class="[
              draggingPinnedChatId === chat.id ? 'opacity-60 scale-95!' : '',
              dragOverPinnedChatId === chat.id
                ? 'border-(--p-primary-color)!'
                : '',
            ]"
          />
        </div>

        <Divider
          v-if="pinnedChats.length && unpinnedChats.length"
          class="my-0!"
        >
        </Divider>

        <ChatListItem
          v-for="chat in unpinnedChats"
          :key="chat.id"
          :chat-id="chat.id"
          :other-user-id="getOtherUserId(chat)"
          :active="chat.id === chatStore.activeChatId"
          :name="chatStore.otherUserName(chat)"
          :last-message="normalizeLastMessage(chat.lastMessage)"
          :date="chat.updatedAt ?? chat.lastMessage?.createdAt"
          :unread-count="unreadCounts[chat.id]"
          :open-context-chat-id="openContextChatId"
          @context-open="openContextChatId = $event"
          @click="
            openContextChatId = null;
            chatStore.selectChat(chat.id);
          "
        />
      </div>
    </ScrollPanel>

    <CurrentUser />
  </div>
</template>

<style scoped>
:deep(.p-divider-solid.p-divider-horizontal:before) {
  border-block-start-color: color-mix(
    in oklab,
    var(--p-primary-color) 30%,
    transparent
  );
}

:deep(.p-scrollpanel-content) {
  width: 100%;
  min-width: 0;
  padding: 0;
  height: inherit;
}
</style>
