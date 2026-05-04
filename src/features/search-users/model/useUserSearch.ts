import { ref } from "vue";
import { watchDebounced } from "@vueuse/core";
import { searchUsers } from "@/shared/api/firebase/firestore";
import { useChatStore } from "@/entities/chat/store/chat.store";
import { useUserStore } from "@/entities/user/store/user.store";
import { validateSearchQuery } from "@/shared/lib/validation";
import { sanitizeText } from "@/shared/lib/sanitization/sanitizer";
import { rateLimiter } from "@/shared/lib/security/rateLimiter";
import { VALIDATION_CONFIG } from "@/shared/config/validation.config";
import { useGlobalNow } from "@/shared/composables/useGlobalNow";
import type { User } from "@/shared/types/user";

export function useUserSearch() {
  const chatStore = useChatStore();
  const userStore = useUserStore();
  const now = useGlobalNow(30000);

  const searchQuery = ref("");
  const users = ref<User[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  watchDebounced(
    searchQuery,
    async (query) => {
      error.value = null;

      if (typeof query !== "string" || !query.trim()) {
        users.value = [];

        return;
      }

      const rateLimitKey = `search-users:${userStore.userId}`;
      const { MAX_REQUESTS, WINDOW_MS } = VALIDATION_CONFIG.SEARCH.RATE_LIMIT;

      if (
        !rateLimiter.check(rateLimitKey, {
          maxRequests: MAX_REQUESTS,
          windowMs: WINDOW_MS,
        })
      ) {
        error.value = "Слишком много запросов. Подождите немного.";

        return;
      }

      const validation = validateSearchQuery(String(query));

      if (!validation.success) {
        error.value = validation.error;
        users.value = [];

        return;
      }

      const sanitized = sanitizeText(validation.data, {
        maxLength: VALIDATION_CONFIG.SEARCH.MAX_LENGTH,
        stripNewlines: true,
      });

      if (!sanitized) {
        users.value = [];

        return;
      }

      isLoading.value = true;

      try {
        const results = await searchUsers(sanitized, 50);

        users.value = results.filter((user) => user.id !== userStore.userId);
      } catch (e) {
        error.value = `Ошибка поиска. Попробуйте позже. Ошибка: ${e}`;
        users.value = [];
      } finally {
        isLoading.value = false;
      }
    },
    {
      debounce: VALIDATION_CONFIG.SEARCH.DEBOUNCE_MS,
    },
  );

  const handleSelectUser = async (user: User): Promise<void> => {
    if (!user?.id) {
      return;
    }

    try {
      await chatStore.openChatWith(user.id);

      searchQuery.value = "";
      users.value = [];
      error.value = null;
    } catch (e) {
      error.value = `Не удалось открыть чат. Попробуйте ещё раз. Ошибка: ${e}`;
    }
  };

  const getUserOnlineStatus = (user: User): boolean => {
    const cachedUser = chatStore.chatParticipants.get(user.id);
    const targetUser = cachedUser || user;

    if (!targetUser.isOnline) return false;

    if (targetUser.lastSeen) {
      const lastSeenMillis = targetUser.lastSeen.toMillis();
      const diff = now.value - lastSeenMillis;
      return diff < 120000; // 2 минуты
    }

    return false;
  };

  return {
    searchQuery,
    users,
    isLoading,
    error,
    handleSelectUser,
    getUserOnlineStatus,
  };
}
