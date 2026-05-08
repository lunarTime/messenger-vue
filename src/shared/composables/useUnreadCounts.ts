import { computed, type Ref } from "vue";
import { useChatStore } from "@/entities/chat/store/chat.store";
import type { Chat } from "@/shared/types/chat";

export function useUnreadCounts(chats: Ref<Chat[]>) {
  const chatStore = useChatStore();

  const unreadCounts = computed(() => {
    const result: Record<string, number> = {};

    for (const chat of chats.value) {
      result[chat.id] = chatStore.unreadCounts.get(chat.id) ?? 0;
    }

    return result;
  });

  return { unreadCounts };
}
