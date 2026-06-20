import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useUserStore } from "@/entities/user/store/user.store";
import {
  subscribeToUserChats,
  getUserChatsFromServer,
  getChatMemberMetaFromServer,
  getUserByIdFromServer,
  getUserById,
  subscribeToUser,
  subscribeToChatMemberMeta,
  subscribeToChatReadStates,
  setChatPinnedOrder,
} from "@/shared/api/firebase/firestore";
import type { Timestamp, Unsubscribe } from "firebase/firestore";
import type { Chat } from "@/shared/types/chat";
import type { ChatMemberMeta } from "@/shared/api/firebase/firestore";
import type { User } from "@/shared/types/user";
import { playIncomingMessageSound } from "@/shared/composables/useNotificationSound";
import { showMessageNotification } from "@/shared/composables/useBrowserNotifications";

type MillisLike = { toMillis: () => number };

type TemporaryChat = Omit<Chat, "createdAt" | "updatedAt" | "lastMessage"> & {
  createdAt: null;
  updatedAt: null;
  lastMessage: {
    text: string;
    senderId: string;
    createdAt: null;
  };
};

type ChatLike = Pick<Chat, "type" | "participants" | "name" | "photoURL">;

const toMillis = (value: MillisLike | null | undefined): number => {
  if (!value) return 0;
  try {
    return value.toMillis();
  } catch {
    return 0;
  }
};

export const useChatStore = defineStore("chat", () => {
  const userStore = useUserStore();

  const ACTIVE_CHAT_KEY = "messenger_active_chat_id";

  const chats = ref<Chat[]>([]);
  const activeChatId = ref<string | null>(
    sessionStorage.getItem(ACTIVE_CHAT_KEY),
  );
  const chatParticipants = ref<Map<string, User>>(new Map());
  const isLoading = ref(true);
  const isInitialized = ref(false);
  const unsubscribeChats = ref<Unsubscribe | null>(null);
  const userSubscriptions = ref<Map<string, Unsubscribe>>(new Map());
  const temporaryChat = ref<TemporaryChat | null>(null);
  const memberMetaSubscriptions = ref<Map<string, Unsubscribe>>(new Map());
  const lastStatusSubscriptions = ref<Map<string, Unsubscribe>>(new Map());
  const lastMessageStatuses = ref<Map<string, "sent" | "read">>(new Map());
  const chatReadStates = ref<Map<string, Map<string, Timestamp>>>(new Map());
  const unreadCounts = ref<Map<string, number>>(new Map());
  const pinnedMap = ref<Map<string, boolean>>(new Map());
  const pinnedOrderMap = ref<Map<string, number>>(new Map());
  const roleMap = ref<Map<string, string>>(new Map());
  const hiddenAtMap = ref<Map<string, number>>(new Map());
  const isInitialMemberMetaReady = ref(false);
  const isInitialParticipantsReady = ref(false);
  const participantLoadAttempted = ref<Set<string>>(new Set());
  const lastMessageMillisMap = ref<Map<string, number>>(new Map());
  const hasInitialChatsSnapshot = ref(false);
  const loadingForUserId = ref<string | null>(null);
  let loadGeneration = 0;

  const myId = computed(() => userStore.currentUser?.id ?? null);

  const activeChat = computed(() => {
    if (temporaryChat.value && activeChatId.value === temporaryChat.value.id) {
      return temporaryChat.value;
    }

    return chats.value.find((c) => c.id === activeChatId.value) || null;
  });

  const visibleChats = computed(() => {
    const list = chats.value.filter((c) => {
      const hiddenAt = hiddenAtMap.value.get(c.id);

      if (!hiddenAt) return true;

      const updatedAtMs = toMillis(c.updatedAt);

      return updatedAtMs > hiddenAt;
    });

    list.sort((a, b) => {
      const aPinned = pinnedMap.value.get(a.id) ?? false;
      const bPinned = pinnedMap.value.get(b.id) ?? false;

      if (aPinned !== bPinned) return aPinned ? -1 : 1;

      if (aPinned && bPinned) {
        const aOrder =
          pinnedOrderMap.value.get(a.id) ?? Number.MAX_SAFE_INTEGER;
        const bOrder =
          pinnedOrderMap.value.get(b.id) ?? Number.MAX_SAFE_INTEGER;
        if (aOrder !== bOrder) return aOrder - bOrder;
      }

      const aTime = toMillis(a.updatedAt);
      const bTime = toMillis(b.updatedAt);
      return bTime - aTime;
    });

    return list;
  });

  const isMemberMetaReady = computed(() => isInitialMemberMetaReady.value);
  const isParticipantsReady = computed(() => isInitialParticipantsReady.value);

  const isParticipantProfileReady = (userId: string | null | undefined) => {
    if (!userId) return true;

    return (
      chatParticipants.value.has(userId) ||
      participantLoadAttempted.value.has(userId)
    );
  };

  const isDirectChatProfileReady = (chat: Chat) => {
    if (chat.type === "group") return true;

    const otherUserId = chat.participants.find((id) => id !== myId.value);

    return isParticipantProfileReady(otherUserId);
  };

  const _applyMemberMeta = (chatId: string, meta: ChatMemberMeta) => {
    pinnedMap.value.set(chatId, meta.isPinned);

    if (meta.exists) roleMap.value.set(chatId, meta.role);
    else roleMap.value.delete(chatId);

    unreadCounts.value.set(chatId, meta.unreadCount);

    if (typeof meta.pinnedOrder === "number") {
      pinnedOrderMap.value.set(chatId, meta.pinnedOrder);
    } else {
      pinnedOrderMap.value.delete(chatId);
    }

    if (meta.hiddenAt) {
      hiddenAtMap.value.set(chatId, meta.hiddenAt.toMillis());
    } else {
      hiddenAtMap.value.delete(chatId);
    }
  };

  const ensureParticipants = async (userIds: string[]) => {
    const myIdVal = myId.value;
    if (!myIdVal) return;

    const missing = [
      ...new Set(
        userIds.filter(
          (id) => id && id !== myIdVal && !chatParticipants.value.has(id),
        ),
      ),
    ];

    if (!missing.length) return;

    await Promise.all(
      missing.map(async (userId) => {
        try {
          const user = await getUserByIdFromServer(userId);

          if (user) chatParticipants.value.set(userId, user);
        } catch {
          console.error(
            `Failed to load participant profile for user ${userId}`,
          );
        } finally {
          participantLoadAttempted.value = new Set(
            participantLoadAttempted.value,
          ).add(userId);
        }
      }),
    );
  };

  const _setLastStatus = (chatId: string, status: "sent" | "read" | null) => {
    const next = new Map(lastMessageStatuses.value);

    if (status) next.set(chatId, status);
    else next.delete(chatId);

    lastMessageStatuses.value = next;
  };

  const _recomputeLastStatus = (chat: Chat) => {
    const myIdVal = myId.value;
    if (!myIdVal) return;

    const lastMsg = chat.lastMessage;
    const isOutgoing = lastMsg?.senderId === myIdVal;
    const createdAt = lastMsg?.createdAt;

    if (!isOutgoing || !createdAt) {
      _setLastStatus(chat.id, null);

      return;
    }

    const otherIds = chat.participants.filter((id) => id !== myIdVal);

    if (otherIds.length === 0) {
      _setLastStatus(chat.id, null);

      return;
    }

    const states = chatReadStates.value.get(chat.id);
    const createdMillis = createdAt.toMillis();
    const someoneRead =
      !!states &&
      otherIds.some((uid) => {
        const lastRead = states.get(uid);

        return lastRead ? lastRead.toMillis() >= createdMillis : false;
      });
    const allRead =
      !!states &&
      otherIds.every((uid) => {
        const lastRead = states.get(uid);

        return lastRead ? lastRead.toMillis() >= createdMillis : false;
      });

    if (chat.type === "group") {
      _setLastStatus(chat.id, someoneRead ? "read" : "sent");
    } else {
      _setLastStatus(chat.id, allRead ? "read" : "sent");
    }
  };

  const _refreshLastStatusSub = (chat: Chat) => {
    const myIdVal = myId.value;

    if (!myIdVal) return;

    if (!lastStatusSubscriptions.value.has(chat.id)) {
      const unsub = subscribeToChatReadStates(chat.id, (map) => {
        chatReadStates.value = new Map(chatReadStates.value).set(chat.id, map);

        const fresh = chats.value.find((c) => c.id === chat.id);

        if (fresh) _recomputeLastStatus(fresh);
      });

      lastStatusSubscriptions.value.set(chat.id, unsub);
    }

    _recomputeLastStatus(chat);
  };

  const loadChats = async () => {
    const myIdVal = userStore.currentUser?.id;
    if (!myIdVal) {
      return;
    }

    const generation = ++loadGeneration;
    const loadStartedAt = Date.now();

    if (unsubscribeChats.value) {
      unsubscribeChats.value();
      unsubscribeChats.value = null;
    }

    chats.value = [];
    chatParticipants.value.clear();
    participantLoadAttempted.value = new Set();
    isInitialMemberMetaReady.value = false;
    isInitialParticipantsReady.value = false;
    isLoading.value = true;
    isInitialized.value = false;
    hasInitialChatsSnapshot.value = false;
    loadingForUserId.value = myIdVal;

    const isStale = () =>
      generation !== loadGeneration ||
      loadingForUserId.value !== myIdVal ||
      userStore.currentUser?.id !== myIdVal;

    const finalizeInitialLoad = (loadedChats: Chat[]) => {
      if (isStale()) return;

      isLoading.value = false;
      isInitialized.value = true;
      hasInitialChatsSnapshot.value = true;

      const saved = sessionStorage.getItem(ACTIVE_CHAT_KEY);

      if (saved && loadedChats.some((c) => c.id === saved)) {
        activeChatId.value = saved;
      } else if (saved && !loadedChats.some((c) => c.id === saved)) {
        sessionStorage.removeItem(ACTIVE_CHAT_KEY);
      }
    };

    const applyChats = (loadedChats: Chat[]) => {
      if (isStale()) return;

      if (hasInitialChatsSnapshot.value) {
        for (const chat of loadedChats) {
          const lastMsg = chat.lastMessage;
          const createdAt = lastMsg?.createdAt;

          if (!createdAt || !lastMsg?.senderId) continue;

          const newMillis = toMillis(createdAt);

          if (!newMillis) continue;

          const prevMillis = lastMessageMillisMap.value.get(chat.id) ?? 0;

          if (newMillis <= prevMillis) continue;

          const isIncoming =
            lastMsg.senderId !== myIdVal && lastMsg.senderId !== "system";
          const isActive = activeChatId.value === chat.id;
          const isMuted = mutedChats.value.has(chat.id);

          if (!isIncoming || isMuted) continue;

          const tabVisible =
            typeof document !== "undefined" && !document.hidden;
          const tabFocused =
            typeof document !== "undefined" && document.hasFocus();

          if (isActive && tabVisible && tabFocused) continue;

          if (!tabVisible || !tabFocused) {
            const sender = chatParticipants.value.get(lastMsg.senderId);
            const senderName =
              sender?.displayName || sender?.email || "Новое сообщение";
            const chatName =
              chat.type === "group" ? chat.name || "Групповой чат" : senderName;
            const title =
              chat.type === "group" ? `${chatName}: ${senderName}` : senderName;
            const body = lastMsg.text || "Новое сообщение";
            const icon =
              chat.type === "group"
                ? chat.photoURL || undefined
                : sender?.photoURL || undefined;

            showMessageNotification({
              title,
              body,
              chatId: chat.id,
              icon,
              onClick: (id) => selectChat(id),
            });
          }

          playIncomingMessageSound();
        }
      }

      for (const chat of loadedChats) {
        const millis = toMillis(chat.lastMessage?.createdAt);

        if (millis) lastMessageMillisMap.value.set(chat.id, millis);
      }

      chats.value = loadedChats;

      const loadedChatIds = new Set(loadedChats.map((c) => c.id));

      memberMetaSubscriptions.value.forEach((unsub, chatId) => {
        if (!loadedChatIds.has(chatId)) {
          unsub();
          memberMetaSubscriptions.value.delete(chatId);
          pinnedMap.value.delete(chatId);
          pinnedOrderMap.value.delete(chatId);
          roleMap.value.delete(chatId);
          hiddenAtMap.value.delete(chatId);
        }
      });

      for (const [chatId, unsub] of lastStatusSubscriptions.value.entries()) {
        if (!loadedChatIds.has(chatId)) {
          unsub();

          lastStatusSubscriptions.value.delete(chatId);
          lastMessageStatuses.value.delete(chatId);
          chatReadStates.value.delete(chatId);
        }
      }

      for (const chat of loadedChats) {
        if (!memberMetaSubscriptions.value.has(chat.id)) {
          const unsub = subscribeToChatMemberMeta(chat.id, myIdVal, (meta) => {
            if (meta.fromCache) return;

            _applyMemberMeta(chat.id, meta);
          });
          memberMetaSubscriptions.value.set(chat.id, unsub);
        }

        _refreshLastStatusSub(chat);
      }

      const participantIds = new Set<string>();
      loadedChats.forEach((chat) => {
        for (const id of chat.participants) {
          if (id !== myIdVal) participantIds.add(id);
        }
      });

      for (const userId of participantIds) {
        if (userSubscriptions.value.has(userId)) continue;

        const unsub = subscribeToUser(userId, (user, meta) => {
          if (meta?.fromCache) return;

          if (user) chatParticipants.value.set(userId, user);
          else chatParticipants.value.delete(userId);
        });
        userSubscriptions.value.set(userId, unsub);
      }

      for (const [userId, unsub] of userSubscriptions.value.entries()) {
        if (!participantIds.has(userId)) {
          unsub();

          userSubscriptions.value.delete(userId);
          chatParticipants.value.delete(userId);
        }
      }
    };

    const preloadMemberMeta = async (loadedChats: Chat[]) => {
      if (!loadedChats.length) {
        isInitialMemberMetaReady.value = true;

        return;
      }

      await Promise.all(
        loadedChats.map(async (chat) => {
          if (isStale()) return;

          try {
            const meta = await getChatMemberMetaFromServer(chat.id, myIdVal);

            if (isStale()) return;

            _applyMemberMeta(chat.id, meta);
          } catch {
            if (isStale()) return;
          }
        }),
      );

      if (!isStale()) {
        isInitialMemberMetaReady.value = true;
      }
    };

    const collectParticipantIds = (loadedChats: Chat[]) => {
      const ids = new Set<string>();

      for (const chat of loadedChats) {
        for (const id of chat.participants) {
          if (id !== myIdVal) ids.add(id);
        }
      }

      return [...ids];
    };

    const preloadParticipants = async (loadedChats: Chat[]) => {
      const participantIds = collectParticipantIds(loadedChats);

      if (!participantIds.length) {
        isInitialParticipantsReady.value = true;
        return;
      }

      await ensureParticipants(participantIds);

      if (!isStale()) {
        isInitialParticipantsReady.value = true;
      }
    };

    const completeInitialLoad = async (loadedChats: Chat[]) => {
      applyChats(loadedChats);

      await Promise.all([
        preloadMemberMeta(loadedChats),
        preloadParticipants(loadedChats),
      ]);

      if (isStale()) return;

      finalizeInitialLoad(loadedChats);
    };

    let hasServerData = false;

    try {
      const initialChats = await getUserChatsFromServer(myIdVal);

      if (isStale()) return;

      await completeInitialLoad(initialChats);

      hasServerData = true;
    } catch {
      console.error("Failed to load initial chats");
    }

    if (isStale()) return;

    unsubscribeChats.value = subscribeToUserChats(
      myIdVal,
      (loadedChats, meta) => {
        if (isStale()) return;

        if (!isInitialized.value) {
          const canUseCacheFallback =
            !hasServerData &&
            meta.fromCache &&
            Date.now() - loadStartedAt > 3000;

          const canUseSnapshot = !meta.fromCache || canUseCacheFallback;

          if (!canUseSnapshot) return;

          void completeInitialLoad(loadedChats);

          if (!meta.fromCache) hasServerData = true;

          return;
        }

        if (meta.fromCache && hasServerData) return;

        applyChats(loadedChats);

        if (!meta.fromCache) hasServerData = true;
      },
    );
  };

  const selectChat = (chatId: string) => {
    if (!chatId) {
      return;
    }

    activeChatId.value = chatId;
    sessionStorage.setItem(ACTIVE_CHAT_KEY, chatId);
  };

  const closeActiveChat = () => {
    activeChatId.value = null;
    sessionStorage.removeItem(ACTIVE_CHAT_KEY);
  };

  const openChatWith = async (userId: string): Promise<void> => {
    const myIdVal = myId.value;
    if (!myIdVal) {
      throw new Error("Пользователь не авторизован");
    }

    if (userId === myIdVal) {
      throw new Error("Нельзя начать чат с самим собой");
    }

    if (!userId) {
      throw new Error("userId обязателен");
    }

    try {
      const existingChat = chats.value.find((chat) => {
        if (chat.type === "direct") {
          return (
            chat.participants.includes(userId) &&
            chat.participants.includes(myIdVal)
          );
        }

        return false;
      });

      if (existingChat) {
        selectChat(existingChat.id);

        temporaryChat.value = null;
      } else {
        const tempChatId = `temp_${myIdVal}_${userId}_${Date.now()}`;
        const user = await getUserById(userId);

        if (user) {
          chatParticipants.value.set(userId, user);

          if (!userSubscriptions.value.has(userId)) {
            const unsubscribe = subscribeToUser(userId, (updatedUser, meta) => {
              if (meta?.fromCache) return;

              if (updatedUser) {
                chatParticipants.value.set(userId, updatedUser);
              }
            });

            userSubscriptions.value.set(userId, unsubscribe);
          }
        }

        temporaryChat.value = {
          id: tempChatId,
          type: "direct",
          participants: [myIdVal, userId],
          createdAt: null,
          updatedAt: null,
          createdBy: myIdVal,
          lastMessage: {
            text: "",
            senderId: "",
            createdAt: null,
          },
        };

        activeChatId.value = tempChatId;
      }
    } catch (error) {
      console.error("Ошибка при открытии чата:", error);

      throw error;
    }
  };

  const otherUserName = (chat: ChatLike): string => {
    if (chat.type === "group") {
      return chat.name || "Групповой чат";
    }

    if (chat.type === "direct") {
      const otherUserId = chat.participants.find((id) => id !== myId.value);

      if (otherUserId) {
        const user = chatParticipants.value.get(otherUserId);

        return user?.displayName || user?.email || "Неизвестный пользователь";
      }
    }
    return "Чат";
  };

  const getChatDisplayName = (chat: ChatLike): string => {
    return otherUserName(chat);
  };

  const getChatPhotoURL = (chat: ChatLike): string | null => {
    if (chat.type === "group") {
      return chat.photoURL || null;
    }

    if (chat.type === "direct") {
      const otherUserId = chat.participants.find((id) => id !== myId.value);

      if (otherUserId) {
        const user = chatParticipants.value.get(otherUserId);

        return user?.photoURL || null;
      }
    }

    return null;
  };

  const getOtherUser = (chat: ChatLike): User | null => {
    if (chat.type === "direct") {
      const otherUserId = chat.participants.find((id) => id !== myId.value);

      if (otherUserId) {
        return chatParticipants.value.get(otherUserId) || null;
      }
    }
    return null;
  };

  const cleanup = () => {
    loadGeneration++;

    if (unsubscribeChats.value) {
      unsubscribeChats.value();
      unsubscribeChats.value = null;
    }

    userSubscriptions.value.forEach((unsub) => unsub());
    userSubscriptions.value.clear();
    memberMetaSubscriptions.value.forEach((unsub) => unsub());
    memberMetaSubscriptions.value.clear();
    lastStatusSubscriptions.value.forEach((unsub) => unsub());
    lastStatusSubscriptions.value.clear();
    lastMessageStatuses.value.clear();
    chatReadStates.value.clear();
    unreadCounts.value.clear();
    pinnedMap.value.clear();
    pinnedOrderMap.value.clear();
    hiddenAtMap.value.clear();
    isInitialMemberMetaReady.value = false;
    isInitialParticipantsReady.value = false;
    lastMessageMillisMap.value.clear();
    hasInitialChatsSnapshot.value = false;
    chats.value = [];
    activeChatId.value = null;
    sessionStorage.removeItem(ACTIVE_CHAT_KEY);
    chatParticipants.value.clear();
    participantLoadAttempted.value = new Set();
    temporaryChat.value = null;
    loadingForUserId.value = null;
    isLoading.value = true;
    isInitialized.value = false;
  };

  const isChatPinned = (chatId: string): boolean => {
    return pinnedMap.value.get(chatId) ?? false;
  };

  const mutedChats = computed<Set<string>>(() => {
    const list = userStore.currentUser?.mutedChats ?? [];

    return new Set(list);
  });

  const isChatMuted = (chatId: string): boolean => {
    return mutedChats.value.has(chatId);
  };

  const getMyRole = (chatId: string): string => {
    return roleMap.value.get(chatId) || "member";
  };

  const isChatOwner = (chatId: string): boolean => {
    return getMyRole(chatId) === "owner";
  };

  const isChatAdmin = (chatId: string): boolean => {
    const role = getMyRole(chatId);
    return role === "admin" || role === "owner";
  };

  const reorderPinnedChats = async (
    orderedPinnedChatIds: string[],
  ): Promise<void> => {
    const myIdVal = myId.value;
    if (!myIdVal) {
      throw new Error("Пользователь не авторизован");
    }

    const tasks: Array<Promise<void>> = [];

    orderedPinnedChatIds.forEach((chatId, index) => {
      pinnedOrderMap.value.set(chatId, index);
      tasks.push(setChatPinnedOrder(chatId, myIdVal, index));
    });

    await Promise.all(tasks);
  };

  const getParticipantCount = (chatId: string): number => {
    const chat = chats.value.find((c) => c.id === chatId);
    return chat?.participants.length || 0;
  };

  return {
    chats,
    activeChatId,
    activeChat,
    chatParticipants,
    isLoading,
    isInitialized,
    isMemberMetaReady,
    isParticipantsReady,
    isParticipantProfileReady,
    isDirectChatProfileReady,
    visibleChats,
    temporaryChat,
    lastMessageStatuses,
    unreadCounts,
    loadChats,
    selectChat,
    closeActiveChat,
    openChatWith,
    otherUserName,
    getChatDisplayName,
    getChatPhotoURL,
    getOtherUser,
    isChatPinned,
    isChatMuted,
    mutedChats,
    getMyRole,
    isChatOwner,
    isChatAdmin,
    getParticipantCount,
    reorderPinnedChats,
    ensureParticipants,
    cleanup,
  };
});
