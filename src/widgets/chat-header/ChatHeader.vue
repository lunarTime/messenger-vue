<script setup lang="ts">
import { computed, ref, onUnmounted, watch } from "vue";
import { useChatStore } from "@/entities/chat/store/chat.store";
import {
  subscribeToTyping,
  subscribeToUser,
} from "@/shared/api/firebase/firestore";
import type { User } from "@/shared/types/user";
import { useGlobalNow } from "@/shared/composables/useGlobalNow";
import { useUserStore } from "@/entities/user/store/user.store";
import Avatar from "primevue/avatar";

const chatStore = useChatStore();
const userStore = useUserStore();
const now = useGlobalNow(30000);

let unsubscribeUser: (() => void) | null = null;
let unsubscribeTyping: (() => void) | null = null;
const otherUser = ref<User | null>(null);
const typingUsers = ref<string[]>([]);

const chatName = computed(() => {
  const chat = chatStore.activeChat;

  if (!chat) {
    return "";
  }

  return chatStore.otherUserName(chat);
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

const otherUserId = computed(() => {
  const chat = chatStore.activeChat;

  if (!chat || chat.type !== "direct") {
    return null;
  }

  return chatStore.getOtherUser(chat)?.id || null;
});

const isTyping = computed(() => {
  const otherId = otherUserId.value;
  if (!otherId) return false;
  return typingUsers.value.includes(otherId);
});

const setupUserSubscription = () => {
  if (unsubscribeUser) {
    unsubscribeUser();
    unsubscribeUser = null;
  }

  if (otherUserId.value) {
    unsubscribeUser = subscribeToUser(otherUserId.value, (user) => {
      otherUser.value = user;
    });
  }
};

watch(
  otherUserId,
  () => {
    setupUserSubscription();
  },
  {
    immediate: true,
  },
);

watch(
  () => chatStore.activeChatId,
  (chatId) => {
    unsubscribeTyping?.();
    unsubscribeTyping = null;
    typingUsers.value = [];

    if (!chatId) return;

    unsubscribeTyping = subscribeToTyping(chatId, (users) => {
      typingUsers.value = users.filter((id) => id !== userStore.userId);
    });
  },
  { immediate: true },
);

onUnmounted(() => {
  unsubscribeUser?.();
  unsubscribeUser = null;
  unsubscribeTyping?.();
  unsubscribeTyping = null;
});
</script>

<template>
  <div class="sticky top-0 z-10 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="relative flex items-center gap-2">
        <Button
          @click="chatStore.closeActiveChat"
          icon="pi pi-arrow-left"
          size="small"
          title="Закрыть чат"
          class="text-white!"
        />
        <Avatar
          :image="otherUser?.photoURL ?? undefined"
          :label="
            otherUser?.photoURL ? undefined : chatName.charAt(0).toUpperCase()
          "
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
          class="absolute top-0 right-0 w-3 h-3 bg-green-500 border rounded-full"
          title="Онлайн"
        />
      </div>

      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-lg font-semibold">
            {{ chatName }}
          </h2>
          <span
            v-if="isTyping"
            class="text-xs font-normal text-(--p-primary-color) animate-pulse"
          >
            печатает...
          </span>
        </div>
        <p class="text-sm opacity-70">
          {{ isTyping ? "печатает..." : isOnline ? "онлайн" : "не в сети" }}
        </p>
      </div>
    </div>
  </div>
</template>
