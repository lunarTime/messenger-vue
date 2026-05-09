import { onMounted, onUnmounted, watch } from "vue";
import { useUserStore } from "@/entities/user/store/user.store";
import { setUserOnlineStatus } from "@/shared/api/firebase/firestore";

export function useUserPresence() {
  const userStore = useUserStore();
  let heartbeatInterval: ReturnType<typeof setInterval> | null = null;

  const stopHeartbeat = (userId?: string | null) => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);

      heartbeatInterval = null;
    }
    const id = userId ?? userStore.userId;

    if (id) setUserOnlineStatus(id, false);
  };

  const startHeartbeat = (userId: string) => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);

      heartbeatInterval = null;
    }

    setUserOnlineStatus(userId, true);

    heartbeatInterval = setInterval(() => {
      if (userStore.userId) setUserOnlineStatus(userStore.userId, true);
    }, 30000);
  };

  watch(
    () => userStore.userId,
    (newId, oldId) => {
      if (oldId && !newId) {
        stopHeartbeat(oldId);
      } else if (newId) {
        startHeartbeat(newId);
      }
    },
  );

  const onBeforeUnload = () => {
    if (userStore.userId) setUserOnlineStatus(userStore.userId, false);
  };

  onMounted(() => {
    if (userStore.userId) startHeartbeat(userStore.userId);

    window.addEventListener("beforeunload", onBeforeUnload);
  });

  onUnmounted(() => {
    stopHeartbeat();
    window.removeEventListener("beforeunload", onBeforeUnload);
  });
}
