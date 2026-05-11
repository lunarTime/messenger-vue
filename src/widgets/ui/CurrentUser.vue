<script setup lang="ts">
import { computed, ref } from "vue";
import { useUserStore } from "@/entities/user/store/user.store";
import { useChatStore } from "@/entities/chat/store/chat.store";
import { useIsMobile } from "@/shared/composables/useIsMobile";
import UserProfilePanel from "@/features/user-profile/ui/UserProfilePanel.vue";
import { Skeleton } from "primevue";
import Drawer from "primevue/drawer";

const userStore = useUserStore();
const chatStore = useChatStore();
const { isMobile } = useIsMobile();

const user = computed(() => userStore.currentUser);
const isProfileOpen = ref(false);
</script>

<template>
  <div
    class="flex items-center justify-between gap-2 dark:bg-black/20 bg-white/40 rounded-md md:p-2 py-0.5 px-1"
  >
    <div v-if="!user" class="flex items-center gap-2 min-w-0">
      <Skeleton
        class="flex-none"
        :height="isMobile ? '2rem' : '3rem'"
        :width="isMobile ? '2rem' : '3rem'"
        shape="circle"
      />
      <div class="flex flex-col gap-1">
        <Skeleton height="1rem" width="6rem" />
        <Skeleton height="1rem" width="10rem" />
      </div>
    </div>

    <button
      v-else
      class="flex flex-1 items-center gap-2 min-w-0 cursor-pointer rounded-md px-2 py-1 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
      aria-label="Редактировать профиль"
      v-tooltip.top="{ value: 'Редактировать профиль', showDelay: 600 }"
      @click="isProfileOpen = true"
    >
      <Avatar
        :image="user.photoURL ?? undefined"
        :label="
          user.photoURL ? undefined : user.displayName.charAt(0).toUpperCase()
        "
        :class="
          user.photoURL ? undefined : 'bg-(--p-primary-color)! text-white!'
        "
        class="flex-none"
        shape="circle"
        :size="isMobile ? 'medium' : 'large'"
        :pt="{
          image: {
            alt: user.displayName,
            class: 'object-cover',
          },
        }"
      />
      <div class="flex flex-col gap-1 min-w-0">
        <span class="md:text-base text-sm leading-none truncate">
          {{ user.displayName }}
        </span>
        <span class="md:text-base text-xs opacity-70 leading-6 truncate">
          {{ user.email }}
        </span>
      </div>
    </button>

    <div v-if="chatStore.isLoading" class="flex items-center gap-2 flex-none">
      <div
        class="w-4 h-4 rounded-full border-2 border-(--p-primary-color)/30 border-t-(--p-primary-color) animate-spin"
        v-tooltip.top="{ value: 'Загрузка чатов...', showDelay: 300 }"
      />
    </div>
  </div>

  <Drawer
    v-model:visible="isProfileOpen"
    position="left"
    header="Мой профиль"
    class="w-full! max-w-md! border-none! dark:bg-black/70! md:rounded-r-xl bg-white/70! backdrop-blur-xs"
    :pt="{
      header: { class: 'md:p-[1.25rem]! p-3! pb-0!' },
      title: { class: 'md:text-2xl! text-lg! leading-none!' },
      content: { class: 'md:p-4! p-1!' },
    }"
  >
    <UserProfilePanel :visible="isProfileOpen" />
  </Drawer>
</template>
