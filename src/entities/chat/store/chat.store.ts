import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useUserStore } from "@/entities/user/store/user.store";
import {
  subscribeToUserChats,
  getUserById,
  subscribeToUser,
  subscribeToChatMemberMeta,
  setChatPinnedOrder,
} from "@/shared/api/firebase/firestore";
import type { Unsubscribe } from "firebase/firestore";
import type { Chat } from "@/shared/types/chat";
import type { User } from "@/shared/types/user";

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

  const chats = ref<Chat[]>([]);
  const activeChatId = ref<string | null>(null);
  const chatParticipants = ref<Map<string, User>>(new Map());
  const isLoading = ref(false);
  const unsubscribeChats = ref<Unsubscribe | null>(null);
  const userSubscriptions = ref<Map<string, Unsubscribe>>(new Map());
  const temporaryChat = ref<TemporaryChat | null>(null);
  const memberMetaSubscriptions = ref<Map<string, Unsubscribe>>(new Map());
  const pinnedMap = ref<Map<string, boolean>>(new Map());
  const pinnedOrderMap = ref<Map<string, number>>(new Map());

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

  const loadChats = () => {
    const myIdVal = myId.value;
    if (!myIdVal) {
      return;
    }

    if (unsubscribeChats.value) {
      unsubscribeChats.value();
    }

    isLoading.value = true;

    unsubscribeChats.value = subscribeToUserChats(
      myIdVal,
      async (loadedChats) => {
        chats.value = loadedChats;

        const loadedChatIds = new Set(loadedChats.map((c) => c.id));

        memberMetaSubscriptions.value.forEach((unsub, chatId) => {
          if (!loadedChatIds.has(chatId)) {
            unsub();
            memberMetaSubscriptions.value.delete(chatId);
            pinnedMap.value.delete(chatId);
            pinnedOrderMap.value.delete(chatId);
          }
        });

        for (const chat of loadedChats) {
          if (memberMetaSubscriptions.value.has(chat.id)) continue;

          const unsub = subscribeToChatMemberMeta(chat.id, myIdVal, (meta) => {
            pinnedMap.value.set(chat.id, meta.isPinned);
            if (typeof meta.pinnedOrder === "number") {
              pinnedOrderMap.value.set(chat.id, meta.pinnedOrder);
            } else {
              pinnedOrderMap.value.delete(chat.id);
            }
          });

          memberMetaSubscriptions.value.set(chat.id, unsub);
        }

        const participantIds = new Set<string>();

        loadedChats.forEach((chat) => {
          if (chat.type !== "direct") return;

          for (const id of chat.participants) {
            if (id !== myIdVal) {
              participantIds.add(id);
            }
          }
        });

        for (const userId of participantIds) {
          if (userSubscriptions.value.has(userId)) {
            continue;
          }

          const unsubscribe = subscribeToUser(userId, (user) => {
            if (user) {
              chatParticipants.value.set(userId, user);
            } else {
              chatParticipants.value.delete(userId);
            }
          });

          userSubscriptions.value.set(userId, unsubscribe);
        }

        isLoading.value = false;
      },
    );
  };

  const selectChat = (chatId: string) => {
    if (!chatId) {
      return;
    }

    activeChatId.value = chatId;
  };

  const closeActiveChat = () => {
    activeChatId.value = null;
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
    pinnedMap.value.clear();
    pinnedOrderMap.value.clear();
    chats.value = [];
    activeChatId.value = null;
    chatParticipants.value.clear();
    temporaryChat.value = null;
  };

  const isChatPinned = (chatId: string): boolean => {
    return pinnedMap.value.get(chatId) ?? false;
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

  return {
    chats,
    activeChatId,
    activeChat,
    chatParticipants,
    isLoading,
    visibleChats,
    temporaryChat,
    loadChats,
    selectChat,
    closeActiveChat,
    openChatWith,
    otherUserName,
    getChatDisplayName,
    getChatPhotoURL,
    getOtherUser,
    isChatPinned,
    reorderPinnedChats,
    cleanup,
  };
});
