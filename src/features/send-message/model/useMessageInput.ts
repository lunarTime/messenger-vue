import { ref, computed, watch, onUnmounted } from "vue";
import { watchDebounced } from "@vueuse/core";
import { useMessageStore } from "@/entities/message/store/message.store";
import { useChatStore } from "@/entities/chat/store/chat.store";
import { useChatDraftStore } from "@/entities/chat-draft/store/chatDraft.store";
import { useUserStore } from "@/entities/user/store/user.store";
import { useMessageCompose } from "@/shared/composables/useMessageCompose";
import { setTypingStatus } from "@/shared/api/firebase/firestore";
import { validateMessage } from "@/shared/lib/validation";
import { sanitizeText } from "@/shared/lib/sanitization/sanitizer";
import { rateLimiter } from "@/shared/lib/security/rateLimiter";
import { VALIDATION_CONFIG } from "@/shared/config/validation.config";
import { useFileUpload } from "@/features/send-message/model/useFileUpload";
import { useMessageQueue } from "@/features/send-message/model/useMessageQueue";

export function useMessageInput(focusFn?: () => void) {
  const messageStore = useMessageStore();
  const chatStore = useChatStore();
  const userStore = useUserStore();
  const draftStore = useChatDraftStore();
  const messageCompose = useMessageCompose();

  const message = ref("");
  const isTyping = ref(false);
  const error = ref<string | null>(null);

  const fileUpload = useFileUpload(() => chatStore.activeChatId);

  const messageQueue = useMessageQueue();

  messageQueue.init((text, options) => messageStore.sendMessage(text, options));

  const canSendTypingStatus = computed(() =>
    Boolean(chatStore.activeChatId && userStore.userId),
  );

  const charactersRemaining = computed(
    () => VALIDATION_CONFIG.MESSAGE.MAX_LENGTH - message.value.length,
  );

  const showCharacterCount = computed(() => message.value.length > 0);
  const isNearLimit = computed(() => charactersRemaining.value < 100);
  const isAtLimit = computed(() => charactersRemaining.value <= 0);

  const canSend = computed(
    () =>
      (message.value.trim().length > 0 ||
        fileUpload.pendingFiles.value.length > 0) &&
      !messageQueue.isFull(),
  );

  const updateTypingStatus = async (status: boolean): Promise<void> => {
    if (!canSendTypingStatus.value) return;
    try {
      await setTypingStatus(chatStore.activeChatId!, userStore.userId!, status);
      isTyping.value = status;
    } catch {
      isTyping.value = false;
    }
  };

  watch(message, (newValue) => {
    error.value = null;

    if (newValue.length > VALIDATION_CONFIG.MESSAGE.MAX_LENGTH) {
      message.value = newValue.slice(0, VALIDATION_CONFIG.MESSAGE.MAX_LENGTH);
      error.value = "Достигнут максимальный размер сообщения";
      return;
    }

    if (!canSendTypingStatus.value) return;

    const hasText = newValue.trim().length > 0;

    if (hasText && !isTyping.value) {
      updateTypingStatus(true);
    } else if (!hasText && isTyping.value) {
      updateTypingStatus(false);
    }
  });

  watchDebounced(
    message,
    () => {
      if (isTyping.value && message.value.trim()) {
        updateTypingStatus(false);
      }
    },
    { debounce: VALIDATION_CONFIG.TYPING.DEBOUNCE_MS },
  );

  watch(
    () => chatStore.activeChatId,
    (newChatId, oldChatId) => {
      if (oldChatId && isTyping.value && userStore.userId) {
        setTypingStatus(oldChatId, userStore.userId, false).catch(() => {});
      }

      isTyping.value = false;
      error.value = null;
      messageCompose.clearReply();
      messageCompose.clearForward();
      fileUpload.clearAll();
      messageQueue.clear();

      message.value = newChatId ? draftStore.getDraft(newChatId) : "";

      if (newChatId) setTimeout(() => focusFn?.(), 320);
    },
    { immediate: true },
  );

  watch(message, (val) => {
    const id = chatStore.activeChatId;
    if (!id) return;
    draftStore.setDraft(id, val);
  });

  const sendMessage = async (): Promise<void> => {
    const trimmedMessage = message.value.trim();
    const hasPendingFiles = fileUpload.pendingFiles.value.length > 0;

    if (!trimmedMessage && !hasPendingFiles) return;
    if (!chatStore.activeChat) return;

    if (messageQueue.isFull()) {
      error.value = "Очередь сообщений заполнена. Подождите.";

      return;
    }

    if (trimmedMessage) {
      const rateLimitKey = `send-message:${userStore.userId}`;
      const { MAX_REQUESTS, WINDOW_MS } = VALIDATION_CONFIG.MESSAGE.RATE_LIMIT;

      if (
        !rateLimiter.check(rateLimitKey, {
          maxRequests: MAX_REQUESTS,
          windowMs: WINDOW_MS,
        })
      ) {
        error.value = "Слишком много сообщений. Подождите немного.";
        return;
      }
    }

    let sanitized = "";

    if (trimmedMessage) {
      const validation = validateMessage(trimmedMessage);

      if (!validation.success) {
        error.value = validation.error;
        return;
      }

      sanitized = sanitizeText(validation.data, {
        maxLength: VALIDATION_CONFIG.MESSAGE.MAX_LENGTH,
      });
    }

    error.value = null;

    if (isTyping.value) {
      updateTypingStatus(false).catch(() => {});
    }

    let attachments:
      | import("@/shared/types/message").MessageAttachment[]
      | undefined;

    if (hasPendingFiles) {
      attachments = await fileUpload.waitForUploads();

      if (attachments.length === 0 && !sanitized) {
        error.value = "Не удалось загрузить ни один файл";
        return;
      }
    }

    const replyToMessageId = messageCompose.replyContext?.messageId;

    messageQueue.enqueue(sanitized, {
      ...(replyToMessageId ? { replyToMessageId } : {}),
      ...(attachments?.length ? { attachments } : {}),
    });

    messageCompose.clearReply();
    fileUpload.clearAll();

    const id = chatStore.activeChatId;
    message.value = "";

    if (id) draftStore.clearDraft(id);

    focusFn?.();
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  onUnmounted(() => {
    if (isTyping.value && canSendTypingStatus.value) {
      setTypingStatus(chatStore.activeChatId!, userStore.userId!, false).catch(
        () => {},
      );
    }
    fileUpload.clearAll();
  });

  return {
    message,
    isSending: messageQueue.isProcessing,
    error,
    charactersRemaining,
    showCharacterCount,
    isNearLimit,
    isAtLimit,
    canSend,
    sendMessage,
    handleKeyDown,
    maxLength: VALIDATION_CONFIG.MESSAGE.MAX_LENGTH,
    fileUpload,
    messageQueue,
  };
}
