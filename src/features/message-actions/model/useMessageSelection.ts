import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { Message } from "@/shared/types/message";

export const useMessageSelection = defineStore("messageSelection", () => {
  const selectedIds = ref<Set<string>>(new Set());
  const isActive = ref(false);

  const count = computed(() => selectedIds.value.size);
  const hasSelection = computed(() => selectedIds.value.size > 0);

  const enter = (messageId: string) => {
    isActive.value = true;
    selectedIds.value = new Set([messageId]);
  };

  const toggle = (messageId: string) => {
    const next = new Set(selectedIds.value);

    if (next.has(messageId)) {
      next.delete(messageId);
    } else {
      next.add(messageId);
    }

    selectedIds.value = next;

    if (next.size === 0) {
      isActive.value = false;
    }
  };

  const addRange = (messageIds: string[]) => {
    const next = new Set(selectedIds.value);

    for (const id of messageIds) next.add(id);

    selectedIds.value = next;
  };

  const isSelected = (messageId: string) => selectedIds.value.has(messageId);

  const exit = () => {
    selectedIds.value = new Set();
    isActive.value = false;
  };

  const getSelectedMessages = (messages: Message[]) =>
    messages.filter((m) => selectedIds.value.has(m.id));

  return {
    selectedIds,
    isActive,
    count,
    hasSelection,
    enter,
    toggle,
    addRange,
    isSelected,
    exit,
    getSelectedMessages,
  };
});
