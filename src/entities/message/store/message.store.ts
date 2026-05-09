import { ref, watch } from "vue";
import { defineStore } from "pinia";
import { useChatStore } from "@/entities/chat/store/chat.store";
import { useUserStore } from "@/entities/user/store/user.store";
import {
  subscribeToChatMessages,
  subscribeToDeliveryStatuses,
  subscribeToMessageDeletedForUser,
  loadOlderMessages,
  sendMessage as sendFirebaseMessage,
  getOrCreateDirectChat,
  editMessage as editFirebaseMessage,
  deleteMessageForMe as deleteFirebaseMessageForMe,
  deleteMessageForAll as deleteFirebaseMessageForAll,
  setMessageDeliveryStatus,
  subscribeToChatMemberMeta,
  subscribeToChatMeta,
} from "@/shared/api/firebase/firestore";
import type {
  Message,
  MessageAttachment,
  MessageStatus,
  SendMessageOptions,
} from "@/shared/types/message";
import type { DocumentSnapshot, Unsubscribe } from "firebase/firestore";

export const useMessageStore = defineStore("messages", () => {
  const chatStore = useChatStore();
  const userStore = useUserStore();

  const messages = ref<Message[]>([]);
  const isLoading = ref(false);
  const hasMore = ref(false);
  const isLoadingMore = ref(false);
  const isLoadingOlderMessages = ref(false);

  const unsubscribeMessages = ref<Unsubscribe | null>(null);
  const unsubscribeStatuses = ref<Unsubscribe | null>(null);
  const unsubscribeMemberMeta = ref<Unsubscribe | null>(null);
  const unsubscribeChatMeta = ref<Unsubscribe | null>(null);
  const deletedForUnsubscribers = ref<Map<string, Unsubscribe>>(new Map());
  const messageStatuses = ref<Map<string, MessageStatus>>(new Map());
  const oldestCursor = ref<DocumentSnapshot | null>(null);
  const pendingReadMessages = new Set<string>();

  watch(
    () => chatStore.activeChatId,
    (newChatId, oldChatId) => {
      if (oldChatId) _teardown();

      if (newChatId && !newChatId.startsWith("temp_")) {
        _loadInitial(newChatId);
      }
    },
  );

  function _teardown() {
    unsubscribeMessages.value?.();
    unsubscribeMessages.value = null;

    unsubscribeStatuses.value?.();
    unsubscribeStatuses.value = null;

    unsubscribeMemberMeta.value?.();
    unsubscribeMemberMeta.value = null;

    unsubscribeChatMeta.value?.();
    unsubscribeChatMeta.value = null;

    deletedForUnsubscribers.value.forEach((u) => u());
    deletedForUnsubscribers.value.clear();

    messageStatuses.value.clear();
    messages.value = [];
    oldestCursor.value = null;
    hasMore.value = false;
    pendingReadMessages.clear();
  }

  function _attachStatusListener(chatId: string) {
    unsubscribeStatuses.value?.();

    const myId = userStore.userId;
    if (!myId) return;

    unsubscribeStatuses.value = subscribeToDeliveryStatuses(
      chatId,
      myId,
      (statuses) => {
        messageStatuses.value = statuses;
      },
    );
  }

  function _attachLegacyDeletedForListeners(chatId: string, msgs: Message[]) {
    const myId = userStore.userId;
    if (!myId) return;

    const currentMsgIds = new Set(msgs.map((m) => m.id));

    for (const [msgId, unsub] of deletedForUnsubscribers.value.entries()) {
      if (!currentMsgIds.has(msgId)) {
        unsub();

        deletedForUnsubscribers.value.delete(msgId);
      }
    }

    msgs.forEach((msg) => {
      if (deletedForUnsubscribers.value.has(msg.id)) return;

      const unsub = subscribeToMessageDeletedForUser(
        chatId,
        msg.id,
        myId,
        (isDeleted) => {
          if (isDeleted) {
            messages.value = messages.value.filter((m) => m.id !== msg.id);
          }
        },
      );

      deletedForUnsubscribers.value.set(msg.id, unsub);
    });
  }

  function _loadInitial(chatId: string) {
    isLoading.value = true;
    messages.value = [];
    oldestCursor.value = null;

    unsubscribeMessages.value = subscribeToChatMessages(
      chatId,
      ({ messages: loaded, oldestCursor: cursor, hasMore: more }) => {
        messages.value = loaded;
        isLoading.value = false;
        oldestCursor.value = cursor;
        hasMore.value = more;

        _attachStatusListener(chatId);
        _attachLegacyDeletedForListeners(chatId, loaded);
      },
      userStore.userId || undefined,
    );

    const myId = userStore.userId;
    if (!myId) return;

    let lastClearedAtMillis: number | null = null;
    let lastClearedForAllMillis: number | null = null;

    unsubscribeMemberMeta.value = subscribeToChatMemberMeta(
      chatId,
      myId,
      (meta) => {
        const millis = meta.clearedAt ? meta.clearedAt.toMillis() : null;

        if (millis !== lastClearedAtMillis) {
          lastClearedAtMillis = millis;
          _reload(chatId);
        }
      },
    );

    unsubscribeChatMeta.value = subscribeToChatMeta(chatId, (meta) => {
      const millis = meta.clearedAtForAll
        ? meta.clearedAtForAll.toMillis()
        : null;

      if (millis !== lastClearedForAllMillis) {
        lastClearedForAllMillis = millis;
        _reload(chatId);
      }
    });
  }

  function _reload(chatId: string) {
    unsubscribeMessages.value?.();
    deletedForUnsubscribers.value.forEach((u) => u());
    deletedForUnsubscribers.value.clear();
    messages.value = [];
    oldestCursor.value = null;
    isLoading.value = true;

    unsubscribeMessages.value = subscribeToChatMessages(
      chatId,
      ({ messages: loaded, oldestCursor: cursor, hasMore: more }) => {
        messages.value = loaded;
        isLoading.value = false;
        oldestCursor.value = cursor;
        hasMore.value = more;
        _attachLegacyDeletedForListeners(chatId, loaded);
      },
      userStore.userId || undefined,
    );
  }

  const loadMoreMessages = async (): Promise<void> => {
    const chatId = chatStore.activeChatId;

    if (!chatId || isLoadingMore.value || !hasMore.value) return;

    if (!oldestCursor.value) {
      hasMore.value = false;

      return;
    }

    isLoadingMore.value = true;
    isLoadingOlderMessages.value = true;

    try {
      const { messages: older, nextCursor } = await loadOlderMessages(
        chatId,
        oldestCursor.value,
        userStore.userId || undefined,
      );

      if (older.length > 0) {
        messages.value = [...older, ...messages.value];

        _attachLegacyDeletedForListeners(chatId, older);
      }

      oldestCursor.value = nextCursor;
      hasMore.value = nextCursor !== null;
    } finally {
      isLoadingMore.value = false;
      isLoadingOlderMessages.value = false;
    }
  };

  const setOldestCursor = (cursor: DocumentSnapshot) => {
    oldestCursor.value = cursor;
  };

  const markMessageAsRead = async (messageId: string): Promise<void> => {
    const chatId = chatStore.activeChatId;
    const myId = userStore.userId;

    if (!chatId || !myId) return;

    const message = messages.value.find((m) => m.id === messageId);
    if (!message || message.senderId === myId || message.isDeleted) return;

    const currentStatus = messageStatuses.value.get(messageId);
    if (currentStatus === "read" || pendingReadMessages.has(messageId)) return;

    pendingReadMessages.add(messageId);
    try {
      await setMessageDeliveryStatus(messageId, chatId, myId, "read");
    } catch (error) {
      console.error("Ошибка при прочтении сообщения:", error);
    } finally {
      pendingReadMessages.delete(messageId);
    }
  };

  const sendMessage = async (
    text: string,
    options: SendMessageOptions = {},
  ): Promise<void> => {
    const chat = chatStore.activeChat;
    const myId = userStore.userId;

    if (!chat || !myId) {
      throw new Error(
        "Невозможно отправить сообщение: нет активного чата или пользователь не авторизован",
      );
    }

    const hasAttachments =
      options.attachments && options.attachments.length > 0;
    if (!text?.trim() && !hasAttachments) return;

    let actualChatId = chat.id;

    if (chatStore.temporaryChat && chat.id === chatStore.temporaryChat.id) {
      const otherUserId = chat.participants.find((id) => id !== myId);
      if (!otherUserId) throw new Error("Не найден получатель сообщения");

      actualChatId = await getOrCreateDirectChat(myId, otherUserId);
      chatStore.temporaryChat = null;
      chatStore.selectChat(actualChatId);
    }

    await sendFirebaseMessage(actualChatId, myId, text, options);
  };

  const editMessage = async (
    messageId: string,
    newText: string,
    attachments?: MessageAttachment[],
  ): Promise<void> => {
    const chatId = chatStore.activeChatId;
    const myId = userStore.userId;

    if (!chatId || !myId) {
      throw new Error(
        "Невозможно отредактировать сообщение: нет активного чата или пользователь не авторизован",
      );
    }

    await editFirebaseMessage(chatId, messageId, newText, myId, attachments);
  };

  const deleteMessageForMe = async (messageId: string): Promise<void> => {
    const chatId = chatStore.activeChatId;
    const myId = userStore.userId;

    if (!chatId || !myId) {
      throw new Error(
        "Невозможно удалить сообщение: нет активного чата или пользователь не авторизован",
      );
    }

    await deleteFirebaseMessageForMe(chatId, messageId, myId);
  };

  const deleteMessageForAll = async (messageId: string): Promise<void> => {
    const chatId = chatStore.activeChatId;
    const myId = userStore.userId;

    if (!chatId || !myId) {
      throw new Error(
        "Невозможно удалить сообщение: нет активного чата или пользователь не авторизован",
      );
    }

    await deleteFirebaseMessageForAll(chatId, messageId, myId);
  };

  const cleanup = () => _teardown();

  return {
    messages,
    isLoading,
    hasMore,
    isLoadingMore,
    isLoadingOlderMessages,
    messageStatuses,
    sendMessage,
    editMessage,
    deleteMessageForMe,
    deleteMessageForAll,
    markMessageAsRead,
    loadMoreMessages,
    setOldestCursor,
    cleanup,
  };
});
