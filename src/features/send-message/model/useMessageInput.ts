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

export function useMessageInput() {
  const messageStore = useMessageStore();
  const chatStore = useChatStore();
  const userStore = useUserStore();
  const draftStore = useChatDraftStore();
  const messageCompose = useMessageCompose();

  const message = ref("");
  const isSending = ref(false);
  const isTyping = ref(false);
  const error = ref<string | null>(null);

  const canSendTypingStatus = computed(() =>
    Boolean(chatStore.activeChatId && userStore.userId),
  );

  const charactersRemaining = computed(
    () => VALIDATION_CONFIG.MESSAGE.MAX_LENGTH - message.value.length,
  );

  const showCharacterCount = computed(() => message.value.length > 0);
  const isNearLimit = computed(() => charactersRemaining.value < 100);
  const isAtLimit = computed(() => charactersRemaining.value <= 0);

  const updateTypingStatus = async (status: boolean): Promise<void> => {
    if (!canSendTypingStatus.value) return;

    try {
      await setTypingStatus(chatStore.activeChatId!, userStore.userId!, status);

      isTyping.value = status;
    } catch {}
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

      if (newChatId) {
        message.value = draftStore.getDraft(newChatId);
      } else {
        message.value = "";
      }
    },
    { immediate: true },
  );

  watch(message, (val) => {
    const id = chatStore.activeChatId;

    if (!id) return;

    draftStore.setDraft(id, val);
  });

  watch(
    () => chatStore.activeChatId,
    (id) => {
      if (!id) return;

      message.value = draftStore.getDraft(id);
    },
    { immediate: true },
  );

  const sendMessage = async (): Promise<void> => {
    const trimmedMessage = message.value.trim();

    if (!trimmedMessage || isSending.value || !chatStore.activeChat) return;

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

    const validation = validateMessage(trimmedMessage);

    if (!validation.success) {
      error.value = validation.error;
      return;
    }

    const sanitized = sanitizeText(validation.data, {
      maxLength: VALIDATION_CONFIG.MESSAGE.MAX_LENGTH,
    });

    if (!sanitized) {
      error.value = "Сообщение пустое после обработки";
      return;
    }

    isSending.value = true;
    error.value = null;

    try {
      if (isTyping.value) {
        await updateTypingStatus(false);
      }

      const replyToMessageId = messageCompose.replyContext?.messageId;

      await messageStore.sendMessage(
        sanitized,
        replyToMessageId ? { replyToMessageId } : {},
      );

      messageCompose.clearReply();

      const id = chatStore.activeChatId;

      message.value = "";

      if (id) {
        draftStore.clearDraft(id);
      }
    } catch {
      error.value = "Не удалось отправить сообщение. Попробуйте ещё раз.";
    } finally {
      isSending.value = false;
    }
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
  });

  return {
    message,
    isSending,
    error,
    charactersRemaining,
    showCharacterCount,
    isNearLimit,
    isAtLimit,
    sendMessage,
    handleKeyDown,
    maxLength: VALIDATION_CONFIG.MESSAGE.MAX_LENGTH,
  };
}
