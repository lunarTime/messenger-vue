<script setup lang="ts">
import { computed } from "vue";
import { useUserView } from "@/features/user-profile/model/useUserView";
import { useChatStore } from "@/entities/chat/store/chat.store";
import { getAvatarColor } from "@/shared/utils/avatarColors";
import Avatar from "primevue/avatar";

const props = defineProps<{ userId: string | null }>();

const emit = defineEmits<{ "open-chat": [chatId: string] }>();

const chatStore = useChatStore();
const { user, isOnline, sharedGroups } = useUserView(() => props.userId);

const avatarBgColor = computed(() => getAvatarColor(props.userId ?? ""));

const getChatName = (chatId: string) => {
  const chat = chatStore.chats.find((c) => c.id === chatId);

  return chat?.name || "Групповой чат";
};

const getChatPhoto = (chatId: string) => {
  const chat = chatStore.chats.find((c) => c.id === chatId);

  return chat?.photoURL ?? null;
};
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden">
    <div v-if="!user" class="flex flex-col items-center gap-4 p-8">
      <Skeleton class="md:w-32! md:h-32! w-22! h-22!" shape="circle" />
      <Skeleton class="h-5! w-36!" />
      <Skeleton class="h-4! w-16!" />
    </div>

    <template v-else>
      <div class="flex flex-col items-center md:gap-2 gap-1 md:p-8 p-3">
        <div class="relative">
          <Avatar
            :image="user.photoURL ?? undefined"
            :label="
              !user.photoURL
                ? user.displayName.charAt(0).toUpperCase()
                : undefined
            "
            shape="circle"
            class="md:w-32! md:h-32! w-22! h-22! overflow-hidden shadow-lg"
            :class="[!user.photoURL ? avatarBgColor + ' text-white!' : '']"
            :pt="{ image: { class: 'object-cover', alt: user.displayName } }"
          />
          <div
            v-if="isOnline"
            class="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"
          />
        </div>

        <div class="text-center mt-1">
          <h2 class="md:text-2xl text-lg font-bold leading-none mb-2">
            {{ user.displayName }}
          </h2>
          <p class="md:text-sm text-xs opacity-60 mt-0.5">
            {{ isOnline ? "в сети" : "не в сети" }}
          </p>
        </div>
      </div>

      <Divider class="md:my-0! md:mb-6! my-2! mb-4!" />

      <div class="flex-1 overflow-y-auto p-0 flex flex-col gap-6">
        <div class="flex flex-col gap-1">
          <span class="text-sm font-semibold opacity-50">Email</span>
          <span class="text-sm break-all">{{ user.email }}</span>
        </div>

        <div v-if="sharedGroups.length" class="flex flex-col gap-3">
          <span class="text-sm font-semibold opacity-50">
            Общие группы ({{ sharedGroups.length }})
          </span>
          <div class="flex flex-col md:gap-2 gap-1">
            <button
              v-for="group in sharedGroups"
              :key="group.id"
              class="flex items-center md:gap-3 gap-2 rounded-xl md:p-2 py-1 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left cursor-pointer w-full"
              @click="emit('open-chat', group.id)"
            >
              <Avatar
                :image="getChatPhoto(group.id) ?? undefined"
                :icon="!getChatPhoto(group.id) ? 'pi pi-users' : undefined"
                shape="square"
                class="w-10! h-10! rounded-lg! overflow-hidden flex-none"
                :class="[
                  !getChatPhoto(group.id)
                    ? getAvatarColor(group.id) + ' text-white!'
                    : '',
                ]"
                :pt="{
                  image: { class: 'object-cover', alt: getChatName(group.id) },
                }"
              />
              <span class="text-sm font-medium truncate">{{
                getChatName(group.id)
              }}</span>
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
