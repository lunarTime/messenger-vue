import { ref, nextTick } from "vue";
import { useFileUpload } from "@/features/send-message/model/useFileUpload";
import { useChatStore } from "@/entities/chat/store/chat.store";
import { MAX_FILES_PER_MESSAGE } from "@/shared/api/cloudinary";

type Emoji = { i: string };

export function useEditInput() {
  const chatStore = useChatStore();
  const fileUpload = useFileUpload(() => chatStore.activeChatId);

  const savedCursorPos = ref<number | null>(null);
  const isEmojiOpen = ref(false);

  const canAddMore = () =>
    fileUpload.pendingFiles.value.length < MAX_FILES_PER_MESSAGE;

  function saveCursorPos(el: HTMLTextAreaElement | null) {
    if (el) savedCursorPos.value = el.selectionStart;
  }

  async function insertEmoji(
    emoji: Emoji,
    text: string,
    el: HTMLTextAreaElement | null,
  ): Promise<string> {
    const insertAt = savedCursorPos.value ?? text.length;
    const newText = text.slice(0, insertAt) + emoji.i + text.slice(insertAt);
    const newPos = insertAt + emoji.i.length;

    savedCursorPos.value = newPos;

    await nextTick();

    if (el) {
      el.focus();
      el.setSelectionRange(newPos, newPos);
    }

    return newText;
  }

  function toggleEmoji(el: HTMLTextAreaElement | null) {
    saveCursorPos(el);

    isEmojiOpen.value = !isEmojiOpen.value;
  }

  function closeEmoji() {
    isEmojiOpen.value = false;
  }

  function addFiles(files: File[]): string[] {
    return fileUpload.addFiles(files);
  }

  function reset() {
    fileUpload.clearAll();
    isEmojiOpen.value = false;
    savedCursorPos.value = null;
  }

  return {
    fileUpload,
    isEmojiOpen,
    canAddMore,
    saveCursorPos,
    insertEmoji,
    toggleEmoji,
    closeEmoji,
    addFiles,
    reset,
  };
}
