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
import { getAvatarColor } from "@/shared/utils/avatarColors";

const chatStore = useChatStore();
const userStore = useUserStore();
const now = useGlobalNow(30000);

let unsubscribeUser: (() => void) | null = null;
let unsubscribeTyping: (() => void) | null = null;
const otherUser = ref<User | null>(null);
const typingUsers = ref<string[]>([]);

const chat = computed(() => chatStore.activeChat);
const isGroup = computed(() => chat.value?.type === "group");

const avatarBgColor = computed(() => {
  if (isGroup.value) {
    return getAvatarColor(chat.value?.id || "");
  }

  return getAvatarColor(otherUserId.value || "");
});

const chatName = computed(() => {
  if (!chat.value) {
    return "";
  }

  return chatStore.otherUserName(chat.value);
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

const participantCount = computed(() => {
  if (!chat.value) return 0;

  return chatStore.getParticipantCount(chat.value.id);
});

const otherUserId = computed(() => {
  if (!chat.value || chat.value.type !== "direct") {
    return null;
  }

  return chatStore.getOtherUser(chat.value)?.id || null;
});

const isTyping = computed(() => {
  if (isGroup.value) return typingUsers.value.length > 0;
  const otherId = otherUserId.value;
  if (!otherId) return false;
  return typingUsers.value.includes(otherId);
});

const typingText = computed(() => {
  if (!isTyping.value) return "";

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

const subtitleText = computed(() => {
  if (isTyping.value) return typingText.value;

  if (isGroup.value) {
    const count = participantCount.value;

    return `${count} ${count === 1 ? "участник" : count < 5 ? "участника" : "участников"}`;
  }

  return isOnline.value ? "онлайн" : "не в сети";
});

const getChatPhotoURL = computed(() => {
  if (isGroup.value) return chat.value?.photoURL || null;

  return otherUser.value?.photoURL || null;
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
        />
        <Avatar
          :image="getChatPhotoURL ?? undefined"
          :label="
            getChatPhotoURL || isGroup
              ? undefined
              : chatName.charAt(0).toUpperCase()
          "
          :icon="!getChatPhotoURL && isGroup ? 'pi pi-users' : undefined"
          :class="[
            getChatPhotoURL ? undefined : avatarBgColor + ' text-white!',
            isGroup ? 'rounded-xl!' : '',
          ]"
          :shape="isGroup ? 'square' : 'circle'"
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
        </div>
        <p
          class="text-sm opacity-70"
          :class="{ 'text-(--p-primary-color) animate-pulse': isTyping }"
        >
          {{ subtitleText }}
        </p>
      </div>
    </div>
  </div>
</template>
