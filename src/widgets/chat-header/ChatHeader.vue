<script setup lang="ts">
import { computed, ref, onUnmounted, watch } from "vue";
import { useChatStore } from "@/entities/chat/store/chat.store";
import {
  subscribeToTyping,
  subscribeToUser,
} from "@/shared/api/firebase/firestore";
import type { User } from "@/shared/types/user";
import { useGlobalNow } from "@/shared/composables/useGlobalNow";
import { useIsMobile } from "@/shared/composables/useIsMobile";
import { useUserStore } from "@/entities/user/store/user.store";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import { getAvatarColor } from "@/shared/utils/avatarColors";
import Drawer from "primevue/drawer";
import GroupChatInfo from "@/features/chat-actions/ui/GroupChatInfo.vue";

defineProps<{ mobile?: boolean }>();

const chatStore = useChatStore();
const userStore = useUserStore();
const { isMobile } = useIsMobile();
const now = useGlobalNow(30000);

let unsubscribeUser: (() => void) | null = null;
let unsubscribeTyping: (() => void) | null = null;
const otherUser = ref<User | null>(null);
const typingUsers = ref<string[]>([]);
const isInfoVisible = ref(false);

const chat = computed(() => chatStore.activeChat);
const isGroup = computed(() => chat.value?.type === "group");

const openChatInformation = () => {
  if (isGroup.value) {
    isInfoVisible.value = true;
  }
};

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
    <div class="flex items-center gap-2 min-w-0">
      <Button
        v-if="mobile"
        @click="chatStore.closeActiveChat"
        icon="pi pi-arrow-left"
        size="small"
        title="Назад"
        text
      />
      <div
        class="flex items-center gap-2 flex-1 min-w-0"
        :class="{
          'cursor-pointer hover:opacity-80 transition-opacity': isGroup,
        }"
        @click="openChatInformation"
      >
        <div class="flex relative flex-none">
          <Avatar
            :image="getChatPhotoURL ?? undefined"
            :label="
              getChatPhotoURL || isGroup
                ? undefined
                : chatName.charAt(0).toUpperCase()
            "
            :icon="!getChatPhotoURL && isGroup ? 'pi pi-users' : undefined"
            class="overflow-hidden"
            :class="[
              getChatPhotoURL ? undefined : avatarBgColor + ' text-white!',
              isGroup ? 'rounded-xl!' : '',
            ]"
            :shape="isGroup ? 'square' : 'circle'"
            :size="isMobile ? 'medium' : 'large'"
            :pt="{
              image: {
                class: 'object-cover',
              },
            }"
          />
          <div
            v-if="isOnline"
            class="absolute top-0 right-0 md:w-3 md:h-3 w-2 h-2 bg-green-500 border rounded-full"
            title="Онлайн"
          />
        </div>
        <div class="flex flex-col flex-1 min-w-0">
          <h2 class="truncate md:text-lg text-sm font-semibold leading-none">
            {{ chatName }}
          </h2>

          <p
            class="truncate md:text-sm text-xs opacity-70"
            :class="{ 'text-(--p-primary-color) animate-pulse': isTyping }"
          >
            {{ subtitleText }}
          </p>
        </div>
      </div>
    </div>
  </div>

  <Drawer
    v-model:visible="isInfoVisible"
    position="right"
    header="Информация"
    class="w-full! max-w-md! border-l border-surface-200 dark:border-surface-800"
    :pt="{
      root: { class: 'bg-surface-50 dark:bg-surface-950' },
      header: { class: 'hidden' },
      content: { class: 'p-0 h-full' },
    }"
  >
    <GroupChatInfo v-if="chat?.id" :chat-id="chat.id" />
  </Drawer>
</template>
