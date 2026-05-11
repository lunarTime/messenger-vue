import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useUserStore } from "@/entities/user/store/user.store";
import {
  subscribeToUserChats,
  getUserById,
  subscribeToUser,
  subscribeToChatMemberMeta,
  subscribeToMessageDeliveryStatus,
  setChatPinnedOrder,
} from "@/shared/api/firebase/firestore";
import type { Unsubscribe } from "firebase/firestore";
import type { Chat } from "@/shared/types/chat";
import type { User } from "@/shared/types/user";
import type { MessageStatus } from "@/shared/types/message";

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
  const lastMessageStatuses = ref<Map<string, MessageStatus>>(new Map());
  const unreadCounts = ref<Map<string, number>>(new Map());
  const pinnedMap = ref<Map<string, boolean>>(new Map());
  const pinnedOrderMap = ref<Map<string, number>>(new Map());
  const roleMap = ref<Map<string, string>>(new Map());

  const myId = computed(() => userStore.userId);

  const activeChat = computed(() => {
    if (temporaryChat.value && activeChatId.value === temporaryChat.value.id) {
      return temporaryChat.value;
    }

    return chats.value.find((c) => c.id === activeChatId.value) || null;
  });

  const visibleChats = computed(() => {
    const list = [...chats.value];

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

  const _refreshLastStatusSub = (chat: Chat) => {
    const myIdVal = myId.value;

    if (!myIdVal) return;

    const lastMsg = chat.lastMessage;
    const isOutgoing = lastMsg?.senderId === myIdVal;

    if (!isOutgoing || !lastMsg?.id) {
      lastStatusSubscriptions.value.get(chat.id)?.();
      lastStatusSubscriptions.value.delete(chat.id);
      lastMessageStatuses.value.delete(chat.id);

      return;
    }

    const otherUserId = chat.participants.find((id) => id !== myIdVal);

    if (!otherUserId) return;

    const key = `${chat.id}:${lastMsg.id}`;

    if (lastStatusSubscriptions.value.has(key)) return;

    for (const [k, unsub] of lastStatusSubscriptions.value.entries()) {
      if (k.startsWith(`${chat.id}:`)) {
        unsub();

        lastStatusSubscriptions.value.delete(k);
      }
    }

    const unsub = subscribeToMessageDeliveryStatus(
      lastMsg.id,
      chat.id,
      otherUserId,
      (status) => {
        if (status) lastMessageStatuses.value.set(chat.id, status);
        else lastMessageStatuses.value.delete(chat.id);
      },
    );
    lastStatusSubscriptions.value.set(key, unsub);
  };

  const loadChats = () => {
    const myIdVal = myId.value;
    if (!myIdVal) {
      return;
    }

    if (unsubscribeChats.value) {
      unsubscribeChats.value();
    }

    isLoading.value = true;

    unsubscribeChats.value = subscribeToUserChats(myIdVal, (loadedChats) => {
      chats.value = loadedChats;

      const loadedChatIds = new Set(loadedChats.map((c) => c.id));

      memberMetaSubscriptions.value.forEach((unsub, chatId) => {
        if (!loadedChatIds.has(chatId)) {
          unsub();
          memberMetaSubscriptions.value.delete(chatId);
          pinnedMap.value.delete(chatId);
          pinnedOrderMap.value.delete(chatId);
          roleMap.value.delete(chatId);
        }
      });

      for (const [key, unsub] of lastStatusSubscriptions.value.entries()) {
        const chatId = key.split(":")[0]!;

        if (!loadedChatIds.has(chatId)) {
          unsub();
          lastStatusSubscriptions.value.delete(key);
          lastMessageStatuses.value.delete(chatId);
        }
      }

      for (const chat of loadedChats) {
        if (!memberMetaSubscriptions.value.has(chat.id)) {
          const unsub = subscribeToChatMemberMeta(chat.id, myIdVal, (meta) => {
            pinnedMap.value.set(chat.id, meta.isPinned);
            roleMap.value.set(chat.id, meta.role);
            unreadCounts.value.set(chat.id, meta.unreadCount);

            if (typeof meta.pinnedOrder === "number") {
              pinnedOrderMap.value.set(chat.id, meta.pinnedOrder);
            } else {
              pinnedOrderMap.value.delete(chat.id);
            }
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

        const unsub = subscribeToUser(userId, (user) => {
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

      isLoading.value = false;
      isInitialized.value = true;

      const saved = sessionStorage.getItem(ACTIVE_CHAT_KEY);

      if (saved && loadedChats.some((c) => c.id === saved)) {
        activeChatId.value = saved;
      } else if (saved && !loadedChats.some((c) => c.id === saved)) {
        sessionStorage.removeItem(ACTIVE_CHAT_KEY);
      }
    });
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
            const unsubscribe = subscribeToUser(userId, (updatedUser) => {
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
    unreadCounts.value.clear();
    pinnedMap.value.clear();
    pinnedOrderMap.value.clear();
    chats.value = [];
    activeChatId.value = null;
    sessionStorage.removeItem(ACTIVE_CHAT_KEY);
    chatParticipants.value.clear();
    temporaryChat.value = null;
    isInitialized.value = false;
  };

  const isChatPinned = (chatId: string): boolean => {
    return pinnedMap.value.get(chatId) ?? false;
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
    getMyRole,
    isChatOwner,
    isChatAdmin,
    getParticipantCount,
    reorderPinnedChats,
    cleanup,
  };
});
