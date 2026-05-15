<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from "vue";
import { useChatStore } from "@/entities/chat/store/chat.store";
import { useUserStore } from "@/entities/user/store/user.store";
import { useUnreadCounts } from "@/shared/composables/useUnreadCounts";
import { useIsMobile } from "@/shared/composables/useIsMobile";
import { subscribeToTyping } from "@/shared/api/firebase/firestore";
import type { Chat } from "@/shared/types/chat";
import type { Unsubscribe } from "firebase/firestore";
import ChatListItem from "@/widgets/chat-list/ui/ChatListItem.vue";
import UserSearch from "@/widgets/chat-list/ui/ChatSearch.vue";
import CurrentUser from "@/widgets/ui/CurrentUser.vue";
import ScrollPanel from "primevue/scrollpanel";
import Divider from "primevue/divider";
import Skeleton from "primevue/skeleton";

const chatStore = useChatStore();
const userStore = useUserStore();
const { isMobile } = useIsMobile();

const chatFilterQuery = ref("");

const { unreadCounts } = useUnreadCounts(
  computed(() => chatStore.visibleChats),
);

const activeChatTypingUsers = ref<string[]>([]);

let unsubTyping: Unsubscribe | null = null;

watch(
  () => chatStore.activeChatId,
  (chatId) => {
    unsubTyping?.();
    unsubTyping = null;

    activeChatTypingUsers.value = [];

    if (!chatId) return;

    unsubTyping = subscribeToTyping(chatId, (users) => {
      activeChatTypingUsers.value = users.filter(
        (id) => id !== userStore.userId,
      );
    });
  },
  { immediate: true },
);

onUnmounted(() => {
  unsubTyping?.();
});

const getOtherUserId = (chat: Chat): string => {
  if (!userStore.userId) {
    return "";
  }

  return chat.participants.find((id) => id !== userStore.userId) || "";
};

const normalizeLastMessage = (message?: Chat["lastMessage"] | null) => {
  if (!message) return undefined;

  const text = message.text ?? "";

  return {
    ...message,
    text: text.length > 500 ? text.slice(0, 500) : text,
  };
};

const filteredVisibleChats = computed(() => {
  const q = chatFilterQuery.value.trim().toLowerCase();

  if (!q) return chatStore.visibleChats;

  return chatStore.visibleChats.filter((chat) => {
    const name = chatStore.otherUserName(chat).toLowerCase();
    const lastMsg = chat.lastMessage?.text?.toLowerCase() ?? "";

    return name.includes(q) || lastMsg.includes(q);
  });
});

const pinnedChats = computed(() =>
  filteredVisibleChats.value.filter((c) => chatStore.isChatPinned(c.id)),
);
const unpinnedChats = computed(() =>
  filteredVisibleChats.value.filter((c) => !chatStore.isChatPinned(c.id)),
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
    class="flex flex-col h-full bg-(--p-primary-color)/20 md:gap-4 md:p-4 p-2 gap-2 md:rounded-xl dark:bg-white/10"
  >
    <UserSearch @filter-change="chatFilterQuery = $event" />

    <ScrollPanel
      class="flex-1 h-0 w-full min-w-0"
      :class="{ 'pr-[16px]': !isMobile }"
    >
      <div
        v-if="chatStore.isLoading && !chatStore.isInitialized"
        class="flex flex-col md:gap-2 gap-0 w-full"
      >
        <div
          v-for="i in 6"
          :key="i"
          class="flex items-center md:gap-3 gap-1.5 p-2 rounded-xl"
        >
          <Skeleton shape="circle" size="3rem" />

          <div class="flex flex-col flex-1">
            <Skeleton width="55%" height="1.5rem" class="mb-[4px]" />
            <Skeleton width="80%" height="1.313rem" />
          </div>

          <div class="flex flex-col gap-1">
            <Skeleton width="2rem" height="1rem" class="self-start" />
            <Skeleton width="1rem" height="0.85rem" class="self-end" />
          </div>
        </div>
      </div>

      <div
        v-else-if="chatStore.isInitialized && filteredVisibleChats.length === 0"
        class="p-8 text-center"
      >
        <i class="pi pi-comments text-4xl mb-4"></i>
        <template v-if="chatFilterQuery">
          <p>Ничего не найдено</p>
          <p class="text-sm mt-2">Попробуйте другой запрос</p>
        </template>
        <template v-else>
          <p>Нет активных чатов</p>
          <p class="text-sm mt-2">
            Используйте поиск выше, чтобы начать общение
          </p>
        </template>
      </div>

      <div
        v-else
        class="w-full min-w-0 overflow-hidden flex flex-col md:gap-2 gap-0 md:p-0 pr-3"
      >
        <div v-if="pinnedChats.length" class="flex flex-col md:gap-2 gap-0">
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
            :typing-users="
              chat.id === chatStore.activeChatId
                ? activeChatTypingUsers
                : undefined
            "
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
          class="md:my-0! my-2!"
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
          :typing-users="
            chat.id === chatStore.activeChatId
              ? activeChatTypingUsers
              : undefined
          "
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
