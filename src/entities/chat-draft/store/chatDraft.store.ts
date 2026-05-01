import { ref } from "vue";
import { defineStore } from "pinia";
import { watchDebounced } from "@vueuse/core";

const STORAGE_KEY = "chat-drafts";

const loadFromStorage = (): Record<string, string> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const useChatDraftStore = defineStore("chat-draft", () => {
  const drafts = ref<Record<string, string>>(loadFromStorage());

  const getDraft = (chatId: string) => {
    return drafts.value[chatId] ?? "";
  };

  const setDraft = (chatId: string, value: string) => {
    drafts.value[chatId] = value;
  };

  const clearDraft = (chatId: string) => {
    delete drafts.value[chatId];
  };

  watchDebounced(
    drafts,
    (val) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
    },
    { debounce: 300, deep: true },
  );

  return { drafts, getDraft, setDraft, clearDraft };
});
