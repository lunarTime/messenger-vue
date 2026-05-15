<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { useTheme } from "@/shared/composables/useTheme";
import { useUserPresence } from "@/entities/user/model/useUserPresence";
import { useTitleNotifier } from "@/shared/composables/useTitleNotifier";
import { ensureNotificationPermission } from "@/shared/composables/useBrowserNotifications";
import AnimateBG from "@/shared/ui/AnimateBG.vue";
import ConfirmPopup from "primevue/confirmpopup";
import Toast from "primevue/toast";

useTheme();
useUserPresence();
useTitleNotifier();

onMounted(() => {
  void ensureNotificationPermission();

  const requestOnGesture = () => {
    void ensureNotificationPermission();

    window.removeEventListener("pointerdown", requestOnGesture);
    window.removeEventListener("keydown", requestOnGesture);
  };

  window.addEventListener("pointerdown", requestOnGesture, { once: true });
  window.addEventListener("keydown", requestOnGesture, { once: true });
});
</script>

<template>
  <AnimateBG />
  <RouterView v-slot="{ Component }">
    <transition name="fade" mode="out-in" appear>
      <component :is="Component" />
    </transition>
  </RouterView>
  <ConfirmPopup />
  <Toast
    :pt="{
      root: { class: 'md:w-100! w-fit!' },
    }"
  />
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  @apply transition-opacity duration-400;
}

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
}
</style>
