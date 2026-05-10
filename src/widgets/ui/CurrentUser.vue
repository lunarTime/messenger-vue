<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/entities/user/store/user.store";
import { useChatStore } from "@/entities/chat/store/chat.store";
import { useIsMobile } from "@/shared/composables/useIsMobile";
import { logout } from "@/shared/api/firebase/auth";
import ThemeSwitcher from "@/shared/ui/ThemeSwitcher.vue";
import { Skeleton } from "primevue";

const router = useRouter();
const userStore = useUserStore();
const chatStore = useChatStore();
const { isMobile } = useIsMobile();

const user = computed(() => userStore.currentUser);

const handleLogout = async () => {
  await logout();

  router.push({ name: "auth" });
};
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
    <div v-else class="flex items-center gap-2 min-w-0">
      <Avatar
        :image="user?.photoURL ?? undefined"
        :label="
          user?.photoURL ? undefined : user.displayName.charAt(0).toUpperCase()
        "
        :class="
          user?.photoURL ? undefined : 'bg-(--p-primary-color)! text-white!'
        "
        class="flex-none"
        shape="circle"
        :size="isMobile ? 'medium' : 'large'"
        :pt="{ image: { alt: user?.displayName } }"
      />

      <div class="flex flex-col gap-1">
        <span class="md:text-base text-sm leading-none min-w-0 truncate">
          {{ user?.displayName }}
        </span>
        <span class="md:text-base text-xs opacity-70 leading-none">
          {{ user?.email }}
        </span>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <div
        v-if="chatStore.isLoading"
        class="w-4 h-4 rounded-full border-2 border-(--p-primary-color)/30 border-t-(--p-primary-color) animate-spin"
        v-tooltip.top="{ value: 'Загрузка чатов...', showDelay: 300 }"
      />
      <ThemeSwitcher />
      <Button
        @click="handleLogout"
        icon="pi pi-sign-out"
        severity="danger"
        aria-label="Выйти из аккаунта"
        v-tooltip.top="{
          value: 'Выйти из аккаунта',
          showDelay: 800,
          hideDelay: 300,
          pt: {
            text: { class: 'text-center' },
          },
        }"
      />
    </div>
  </div>
</template>
