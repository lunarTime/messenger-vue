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
import { getAvatarColor } from "@/shared/utils/avatarColors";

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
let unsubscribeLastStatus: (() => void) | null = null;
const typingUsers = ref<string[]>([]);
const lastMessageStatus = ref<MessageStatus | null>(null);

const chat = computed(() =>
  chatStore.chats.find((c: any) => c.id === props.chatId),
);

const isGroup = computed(() => chat.value?.type === "group");

const avatarBgColor = computed(() => {
  if (isGroup.value) return getAvatarColor(props.chatId);

  return getAvatarColor(props.otherUserId);
});

const otherUser = computed(() => {
  if (isGroup.value) return null;

  return chatStore.chatParticipants.get(props.otherUserId) || null;
});

const photoURL = computed(() => {
  if (isGroup.value) return chat.value?.photoURL || null;

  return otherUser.value?.photoURL || null;
});

const isOnline = computed(() => {
  if (isGroup.value) return false;
  if (!otherUser.value) return false;
  if (!otherUser.value.isOnline) return false;

  if (otherUser.value.lastSeen) {
    const lastSeenMillis = otherUser.value.lastSeen.toMillis();
    const diff = now.value - lastSeenMillis;

    return diff < 120000;
  }

  return false;
});

const isTyping = computed(() => {
  if (isGroup.value) return typingUsers.value.length > 0;

  return typingUsers.value.includes(props.otherUserId);
});

const typingText = computed(() => {
  if (!isTyping.value || typingUsers.value.length === 0) return "";

  if (isGroup.value) {
    if (typingUsers.value.length === 1) {
      const userId = typingUsers.value[0] as string;
      const user = chatStore.chatParticipants.get(userId);

      return `${user?.displayName || "Кто-то"} печатает...`;
    }

    return "Несколько человек печатают...";
  }

  return "печатает...";
});

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
    return typingText.value;
  }

  if (props.lastMessage?.text) {
    return props.lastMessage.text;
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
    class="relative flex items-center gap-3 p-2 cursor-pointer transition-all scale-100 duration-200 hover:bg-(--p-primary-color)/20 rounded-2xl border-2 border-dashed border-transparent"
    :class="{ 'bg-(--p-primary-color)/30': active }"
    @contextmenu.prevent.stop="onContextMenu"
  >
    <ChatContextMenu
      ref="contextMenuRef"
      :chat-id="chatId"
      :is-pinned="isPinned"
    />
    <div class="relative flex shrink-0">
      <Avatar
        :image="photoURL ?? undefined"
        :label="
          photoURL || isGroup
            ? undefined
            : (name?.charAt(0) || '?').toUpperCase()
        "
        :icon="!photoURL && isGroup ? 'pi pi-users' : undefined"
        class="overflow-hidden"
        :class="[
          photoURL ? undefined : avatarBgColor + ' text-white!',
          isGroup ? 'rounded-xl!' : '',
        ]"
        :shape="isGroup ? 'square' : 'circle'"
        size="large"
        :pt="{
          image: {
            class: 'object-cover',
          },
        }"
      />

      <div
        v-if="isOnline"
        class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full"
        title="Онлайн"
      />
    </div>

    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
      <div class="flex items-center justify-between mb-1 min-w-0">
        <div class="flex items-center gap-2">
          <i
            v-if="isPinned"
            class="pi pi-bookmark-fill text-xs shrink-0 text-(--p-primary-color)"
            title="Закреплено"
          />
          <h3 class="font-semibold truncate wrap-break-word">
            {{ name }}
          </h3>
        </div>
        <time v-if="displayDate" class="text-xs shrink-0 ml-2">
          {{ displayDate }}
        </time>
      </div>

      <div class="flex items-center gap-2 w-full min-w-0">
        <div class="flex-1 min-w-0 flex">
          <p class="flex-1 min-w-0 truncate" :class="isTyping ? 'italic' : ''">
            {{ displayMessage }}
          </p>
        </div>

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
