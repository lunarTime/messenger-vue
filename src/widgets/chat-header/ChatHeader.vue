<script setup lang="ts">
import { computed, ref, onUnmounted, watch } from "vue";
import { useChatStore } from "@/entities/chat/store/chat.store";
import { subscribeToTyping } from "@/shared/api/firebase/firestore";
import { useGlobalNow } from "@/shared/composables/useGlobalNow";
import { useIsMobile } from "@/shared/composables/useIsMobile";
import { useUserStore } from "@/entities/user/store/user.store";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import Skeleton from "primevue/skeleton";
import { getAvatarColor } from "@/shared/utils/avatarColors";
import Drawer from "primevue/drawer";
import GroupChatInfo from "@/features/chat-actions/ui/GroupChatInfo.vue";
import UserViewPanel from "@/features/user-profile/ui/UserViewPanel.vue";
import SelectionPanel from "@/features/message-actions/ui/SelectionPanel.vue";

defineProps<{ mobile?: boolean }>();

const chatStore = useChatStore();
const userStore = useUserStore();
const { isMobile } = useIsMobile();
const now = useGlobalNow(30000);

let unsubscribeTyping: (() => void) | null = null;
const typingUsers = ref<string[]>([]);
const isInfoVisible = ref(false);
const isUserViewVisible = ref(false);

const chat = computed(() => chatStore.activeChat);
const isGroup = computed(() => chat.value?.type === "group");

const otherUserId = computed(() => {
  if (!chat.value || chat.value.type !== "direct") {
    return null;
  }

  return (
    chat.value.participants.find((id) => id !== userStore.userId) || null
  );
});

const otherUser = computed(() => {
  if (!otherUserId.value) return null;

  return chatStore.chatParticipants.get(otherUserId.value) || null;
});

const isHeaderProfileReady = computed(() => {
  if (!chat.value) return false;
  if (isGroup.value) return true;

  return chatStore.isParticipantProfileReady(otherUserId.value);
});

const openChatInformation = () => {
  if (isGroup.value) {
    isInfoVisible.value = true;
  } else if (otherUserId.value) {
    isUserViewVisible.value = true;
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

  if (isGroup.value) {
    return chatStore.otherUserName(chat.value);
  }

  return (
    otherUser.value?.displayName ||
    otherUser.value?.email ||
    chatStore.otherUserName(chat.value)
  );
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

watch(
  () => chatStore.activeChatId,
  (chatId) => {
    unsubscribeTyping?.();
    unsubscribeTyping = null;

    typingUsers.value = [];

    if (!chatId) return;

    const activeChat = chatStore.activeChat;

    if (activeChat) {
      void chatStore.ensureParticipants(activeChat.participants);
    }

    unsubscribeTyping = subscribeToTyping(chatId, (users) => {
      typingUsers.value = users.filter((id) => id !== userStore.userId);
    });
  },
  { immediate: true },
);

onUnmounted(() => {
  unsubscribeTyping?.();
  unsubscribeTyping = null;
});
</script>

<template>
  <div class="sticky top-0 z-10 flex flex-col">
    <div class="relative flex flex-col">
      <div
        class="flex items-center justify-between dark:bg-black/20 bg-white/40 rounded-md md:py-2 md:pr-2 p-1"
      >
        <div class="flex items-center gap-2 min-w-0">
          <Button
            @click="chatStore.closeActiveChat"
            icon="pi pi-arrow-left"
            size="small"
            title="Назад"
            text
          />
          <div
            v-if="!isHeaderProfileReady"
            class="flex items-center gap-2 flex-1 min-w-0 md:py-1 py-0.5"
          >
            <Skeleton
              shape="circle"
              :size="isMobile ? '2.5rem' : '3rem'"
            />
            <div class="flex flex-col gap-1 flex-1 min-w-0">
              <Skeleton height="1.25rem" width="45%" />
              <Skeleton height="0.875rem" width="30%" />
            </div>
          </div>
          <div
            v-else
            class="flex items-center gap-2 flex-1 min-w-0"
            :class="{
              'cursor-pointer hover:opacity-80 transition-opacity':
                isGroup || !!otherUserId,
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
                    alt: chatName,
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
              <h2
                class="truncate md:text-lg text-sm font-semibold leading-none"
              >
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

      <SelectionPanel />
    </div>
  </div>

  <Drawer
    v-model:visible="isInfoVisible"
    position="right"
    header="Информация о чате"
    class="w-full! max-w-md! border-none! dark:bg-black/70! md:rounded-l-xl bg-white/70! backdrop-blur-xs"
    :pt="{
      header: { class: 'md:p-[1.25rem]! p-3! pb-0!' },
      title: { class: 'md:text-2xl! text-lg! leading-none!' },
    }"
  >
    <GroupChatInfo
      v-if="chat?.id"
      :chat-id="chat.id"
      @close="isInfoVisible = false"
    />
  </Drawer>

  <Drawer
    v-model:visible="isUserViewVisible"
    position="right"
    header="Профиль"
    class="w-full! max-w-md! border-none! dark:bg-black/70! md:rounded-l-xl bg-white/70! backdrop-blur-xs"
    :pt="{
      header: { class: 'md:p-[1.25rem]! p-3! pb-0!' },
      title: { class: 'md:text-2xl! text-lg! leading-none!' },
    }"
  >
    <UserViewPanel
      :user-id="otherUserId"
      @open-chat="
        chatStore.selectChat($event);
        isUserViewVisible = false;
      "
      @write-directly="
        otherUserId && chatStore.openChatWith(otherUserId);
        isUserViewVisible = false;
        isInfoVisible = false;
      "
    />
  </Drawer>
</template>
