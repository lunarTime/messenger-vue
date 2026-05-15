import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import { useChatStore } from "@/entities/chat/store/chat.store";
import { useUserStore } from "@/entities/user/store/user.store";
import {
  subscribeToChatMessages,
  subscribeToChatReadStates,
  subscribeToMessageDeletedForUser,
  loadOlderMessages,
  sendMessage as sendFirebaseMessage,
  getOrCreateDirectChat,
  editMessage as editFirebaseMessage,
  deleteMessageForMe as deleteFirebaseMessageForMe,
  deleteMessageForAll as deleteFirebaseMessageForAll,
  markChatAsRead,
  subscribeToChatMemberMeta,
  subscribeToChatMeta,
} from "@/shared/api/firebase/firestore";
import type {
  Message,
  MessageAttachment,
  SendMessageOptions,
} from "@/shared/types/message";
import type {
  DocumentSnapshot,
  Timestamp,
  Unsubscribe,
} from "firebase/firestore";

export const useMessageStore = defineStore("messages", () => {
  const chatStore = useChatStore();
  const userStore = useUserStore();

  const messages = ref<Message[]>([]);
  const isLoading = ref(false);
  const hasMore = ref(false);
  const isLoadingMore = ref(false);
  const isLoadingOlderMessages = ref(false);

  const unsubscribeMessages = ref<Unsubscribe | null>(null);
  const unsubscribeReadStates = ref<Unsubscribe | null>(null);
  const unsubscribeMemberMeta = ref<Unsubscribe | null>(null);
  const unsubscribeChatMeta = ref<Unsubscribe | null>(null);
  const deletedForUnsubscribers = ref<Map<string, Unsubscribe>>(new Map());

  const readStates = ref<Map<string, Timestamp>>(new Map());
  const oldestCursor = ref<DocumentSnapshot | null>(null);
  const effectiveClearedAtMillis = ref<number | null>(null);

  const messageStatuses = computed<Map<string, "sent" | "read">>(() => {
    const result = new Map<string, "sent" | "read">();
    const myId = userStore.userId;
    const chat = chatStore.activeChat;

    if (!myId || !chat) return result;

    const otherIds = chat.participants.filter((id) => id !== myId);

    if (otherIds.length === 0) return result;

    const isGroup = chat.type === "group";

    for (const msg of messages.value) {
      if (msg.senderId !== myId) continue;
      if (!msg.createdAt) continue;

      const createdMillis = msg.createdAt.toMillis();
      const readFn = (uid: string) => {
        const lastRead = readStates.value.get(uid);

        return lastRead ? lastRead.toMillis() >= createdMillis : false;
      };

      const isRead = isGroup ? otherIds.some(readFn) : otherIds.every(readFn);

      result.set(msg.id, isRead ? "read" : "sent");
    }

    return result;
  });

  watch(
    () => chatStore.activeChatId,
    (newChatId, oldChatId) => {
      if (oldChatId && oldChatId !== newChatId) _teardown();

      if (newChatId && !newChatId.startsWith("temp_")) {
        _loadInitial(newChatId);
      }
    },
    { immediate: true },
  );

  watch(
    () => messages.value.length,
    () => _markAllAsReadIfActive(),
  );

  function _markAllAsReadIfActive() {
    const chatId = chatStore.activeChatId;
    const myId = userStore.userId;

    if (!chatId || !myId || messages.value.length === 0) return;

    const last = messages.value[messages.value.length - 1]!;

    if (!last.createdAt) return;

    const myLastRead = readStates.value.get(myId);

    if (myLastRead && myLastRead.toMillis() >= last.createdAt.toMillis()) {
      return;
    }

    void markChatAsRead(chatId, myId, last.id);
  }

  function _teardown() {
    unsubscribeMessages.value?.();
    unsubscribeMessages.value = null;

    unsubscribeReadStates.value?.();
    unsubscribeReadStates.value = null;

    unsubscribeMemberMeta.value?.();
    unsubscribeMemberMeta.value = null;

    unsubscribeChatMeta.value?.();
    unsubscribeChatMeta.value = null;

    deletedForUnsubscribers.value.forEach((u) => u());
    deletedForUnsubscribers.value.clear();

    readStates.value = new Map();
    messages.value = [];
    oldestCursor.value = null;
    hasMore.value = false;
    effectiveClearedAtMillis.value = null;
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
    effectiveClearedAtMillis.value = null;

    unsubscribeReadStates.value = subscribeToChatReadStates(chatId, (map) => {
      readStates.value = map;
    });

    _subscribeMessages(chatId);

    const myId = userStore.userId;

    if (!myId) return;

    let memberClearedMillis: number | null = null;
    let chatClearedForAllMillis: number | null = null;

    const applyClearedAt = () => {
      const next = Math.max(
        memberClearedMillis ?? 0,
        chatClearedForAllMillis ?? 0,
      );

      const normalized = next > 0 ? next : null;

      if (normalized !== effectiveClearedAtMillis.value) {
        effectiveClearedAtMillis.value = normalized;

        _subscribeMessages(chatId);
      }
    };

    unsubscribeMemberMeta.value = subscribeToChatMemberMeta(
      chatId,
      myId,
      (meta) => {
        memberClearedMillis = meta.clearedAt ? meta.clearedAt.toMillis() : null;
        applyClearedAt();
      },
    );

    unsubscribeChatMeta.value = subscribeToChatMeta(chatId, (meta) => {
      chatClearedForAllMillis = meta.clearedAtForAll
        ? meta.clearedAtForAll.toMillis()
        : null;
      applyClearedAt();
    });
  }

  function _subscribeMessages(chatId: string) {
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
        _markAllAsReadIfActive();
      },
      userStore.userId || undefined,
      effectiveClearedAtMillis.value,
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
        effectiveClearedAtMillis.value,
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

    messages.value = messages.value.filter((m) => m.id !== messageId);

    const unsub = deletedForUnsubscribers.value.get(messageId);

    if (unsub) {
      unsub();

      deletedForUnsubscribers.value.delete(messageId);
    }
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
    loadMoreMessages,
    setOldestCursor,
    cleanup,
  };
});
