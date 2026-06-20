import { ref, computed, watch, onUnmounted } from "vue";
import {
  getUserByIdFromServer,
  subscribeToUser,
} from "@/shared/api/firebase/firestore";
import { useChatStore } from "@/entities/chat/store/chat.store";
import { useUserStore } from "@/entities/user/store/user.store";
import { useGlobalNow } from "@/shared/composables/useGlobalNow";
import type { User } from "@/shared/types/user";
import type { Unsubscribe } from "firebase/firestore";

export function useUserView(userId: () => string | null) {
  const chatStore = useChatStore();
  const userStore = useUserStore();
  const now = useGlobalNow(30000);

  const user = ref<User | null>(null);

  let unsub: Unsubscribe | null = null;

  const subscribe = (id: string | null) => {
    unsub?.();
    unsub = null;

    user.value = null;

    if (!id) return;

    void (async () => {
      try {
        const serverUser = await getUserByIdFromServer(id);

        if (userId() === id) {
          user.value = serverUser;
        }
      } catch {
        console.error(`Failed to load user profile for user ${id}`);
      }

      if (userId() !== id) return;

      unsub = subscribeToUser(id, (u, meta) => {
        if (meta?.fromCache) return;

        user.value = u;
      });
    })();
  };

  watch(userId, subscribe, { immediate: true });
  onUnmounted(() => {
    unsub?.();
  });

  const isOnline = computed(() => {
    if (!user.value?.isOnline) return false;
    if (!user.value.lastSeen) return false;

    return now.value - user.value.lastSeen.toMillis() < 120_000;
  });

  const sharedGroups = computed(() => {
    const id = userId();
    const myId = userStore.userId;

    if (!id || !myId) return [];

    return chatStore.chats.filter(
      (c) =>
        c.type === "group" &&
        c.participants.includes(id) &&
        c.participants.includes(myId),
    );
  });

  return { user, isOnline, sharedGroups };
}
