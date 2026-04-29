<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from "vue";
import { useChatStore } from "@/entities/chat/store/chat.store";
import { useUserStore } from "@/entities/user/store/user.store";
import { useTimeAgo } from "@/shared/composables/useTimeAgo";
import { useGlobalNow } from "@/shared/composables/useGlobalNow";
import {
  subscribeToMessageDeliveryStatus,
  subscribeToTyping,
} from "@/shared/api/firebase/firestore";
import type { Timestamp } from "firebase/firestore";
import type { MessageStatus } from "@/shared/types/message";
import ChatContextMenu from "@/features/chat-actions/ui/ChatContextMenu.vue";
import Avatar from "primevue/avatar";
import Badge from "primevue/badge";

const props = defineProps<{
  chatId: string;
  otherUserId: string;
  name: string;
  lastMessage?: {
    id?: string;
    text: string;
    senderId: string;
    createdAt: Timestamp;
  };
  date?: Timestamp;
  active?: boolean;
  unreadCount?: number;
  openContextChatId?: string | null;
}>();

const emit = defineEmits<{
  contextOpen: [chatId: string];
}>();

const chatStore = useChatStore();
const userStore = useUserStore();
const now = useGlobalNow(30000);
const contextMenuRef = ref<InstanceType<typeof ChatContextMenu> | null>(null);

let unsubscribeTyping: (() => void) | null = null;
const typingUsers = ref<string[]>([]);
let unsubscribeLastStatus: (() => void) | null = null;
const lastMessageStatus = ref<MessageStatus | null>(null);

const otherUser = computed(() => {
  return chatStore.chatParticipants.get(props.otherUserId) || null;
});

const isOnline = computed(() => {
  if (!otherUser.value) return false;
  if (!otherUser.value.isOnline) return false;

  if (otherUser.value.lastSeen) {
    const lastSeenMillis = otherUser.value.lastSeen.toMillis();
    const diff = now.value - lastSeenMillis;
    return diff < 120000;
  }

  return false;
});
const isTyping = computed(() => typingUsers.value.includes(props.otherUserId));
const displayDate = useTimeAgo(props.date ?? null);
const isPinned = computed(() => chatStore.isChatPinned(props.chatId));
const isLastOutgoing = computed(() => {
  const myId = userStore.userId;
  if (!myId) return false;
  if (!props.lastMessage) return false;
  return props.lastMessage.senderId === myId;
});
const displayMessage = computed(() => {
  if (isTyping.value) {
    return "печатает...";
  }

  if (props.lastMessage?.text) {
    const { text } = props.lastMessage;

    return text.length <= 25 ? text : text.slice(0, 25) + "...";
  }

  return "Нет сообщений";
});

watch(
  () => props.chatId,
  (chatId) => {
    unsubscribeTyping?.();
    unsubscribeTyping = null;
    unsubscribeLastStatus?.();
    unsubscribeLastStatus = null;
    lastMessageStatus.value = null;

    if (!chatId) {
      return;
    }

    unsubscribeTyping = subscribeToTyping(chatId, (users) => {
      typingUsers.value = users.filter((id) => id !== userStore.userId);
    });
  },
  {
    immediate: true,
  },
);

watch(
  () =>
    [
      props.chatId,
      props.lastMessage?.id,
      props.otherUserId,
      isLastOutgoing.value,
    ] as const,
  ([chatId, lastMessageId, otherUserId, outgoing]) => {
    unsubscribeLastStatus?.();
    unsubscribeLastStatus = null;
    lastMessageStatus.value = null;

    if (!outgoing) return;
    if (!chatId || !lastMessageId || !otherUserId) return;

    unsubscribeLastStatus = subscribeToMessageDeliveryStatus(
      lastMessageId,
      chatId,
      otherUserId,
      (status) => {
        lastMessageStatus.value = status;
      },
    );
  },
  { immediate: true },
);

watch(
  () => props.openContextChatId,
  (openId) => {
    if (openId && openId !== props.chatId) {
      contextMenuRef.value?.hide();
    }
  },
);

onUnmounted(() => {
  unsubscribeTyping?.();
  unsubscribeLastStatus?.();
});

const onContextMenu = (event: MouseEvent) => {
  emit("contextOpen", props.chatId);
  contextMenuRef.value?.show(event);
};
</script>

<template>
  <div
    v-ripple
    class="relative flex items-center gap-3 p-4 cursor-pointer transition-all scale-100 duration-200 hover:bg-(--p-primary-color)/20 rounded-2xl border-2 border-dashed border-transparent"
    :class="{ 'bg-(--p-primary-color)/30': active }"
    @contextmenu.prevent.stop="onContextMenu"
  >
    <ChatContextMenu
      ref="contextMenuRef"
      :chat-id="chatId"
      :is-pinned="isPinned"
    />
    <div class="relative shrink-0">
      <Avatar
        :image="otherUser?.photoURL ?? undefined"
        :label="otherUser?.photoURL ? undefined : name.charAt(0).toUpperCase()"
        :class="
          otherUser?.photoURL
            ? undefined
            : 'bg-(--p-primary-color)! text-white!'
        "
        shape="circle"
        size="large"
      />
      <div
        v-if="isOnline"
        class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full"
        title="Онлайн"
      />
    </div>

    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between mb-1">
        <div class="flex items-center gap-2 min-w-0">
          <i
            v-if="isPinned"
            class="pi pi-bookmark-fill text-xs shrink-0 text-(--p-primary-color)"
            title="Закреплено"
          />
          <h3 class="font-semibold truncate min-w-0">
            {{ name }}
          </h3>
        </div>
        <span v-if="displayDate" class="text-xs shrink-0 ml-2">
          {{ displayDate }}
        </span>
      </div>

      <div class="flex items-center justify-between gap-2">
        <p class="text-sm truncate" :class="isTyping ? 'italic' : ''">
          {{ displayMessage }}
        </p>

        <div class="shrink-0">
          <template v-if="isLastOutgoing">
            <i
              v-if="lastMessageStatus === 'failed'"
              class="pi pi-times-circle text-red-500"
              title="Ошибка"
            />

            <div
              v-else-if="
                lastMessageStatus === 'read' ||
                lastMessageStatus === 'delivered'
              "
              class="flex -space-x-3.5"
              title="Прочитано"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
                class="size-5"
              >
                <path
                  fill-rule="evenodd"
                  d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
                class="size-5"
              >
                <path
                  fill-rule="evenodd"
                  d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <i
              v-else-if="lastMessageStatus === 'sending'"
              class="pi pi-clock opacity-50"
              title="Отправка..."
            />
            <i v-else class="pi pi-check opacity-70" title="Отправлено" />
          </template>

          <Badge
            v-else-if="unreadCount && unreadCount > 0"
            :value="unreadCount"
            severity="contrast"
            size="small"
          />
        </div>
      </div>
    </div>
  </div>
</template>
