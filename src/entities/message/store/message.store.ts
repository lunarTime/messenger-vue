import { ref, watch } from "vue";
import { defineStore } from "pinia";
import { useChatStore } from "@/entities/chat/store/chat.store";
import { useUserStore } from "@/entities/user/store/user.store";
import {
  subscribeToChatMessages,
  sendMessage as sendFirebaseMessage,
  getOrCreateDirectChat,
  editMessage as editFirebaseMessage,
  deleteMessageForMe as deleteFirebaseMessageForMe,
  deleteMessageForAll as deleteFirebaseMessageForAll,
  subscribeToMessageDeletedForUser,
  setMessageDeliveryStatus,
  markChatAsRead,
  subscribeToMessageDeliveryStatus,
} from "@/shared/api/firebase/firestore";
import type { Message, MessageStatus } from "@/shared/types/message";
import type { Unsubscribe } from "firebase/firestore";

export const useMessageStore = defineStore("messages", () => {
  const chatStore = useChatStore();
  const userStore = useUserStore();

  const messages = ref<Message[]>([]);
  const isLoading = ref(false);
  const unsubscribeMessages = ref<Unsubscribe | null>(null);
  const messageStatuses = ref<Map<string, MessageStatus>>(new Map());
  const statusUnsubscribers = ref<Map<string, Unsubscribe>>(new Map());
  const deletedForUnsubscribers = ref<Map<string, Unsubscribe>>(new Map());

  watch(
    () => chatStore.activeChatId,
    (newChatId, oldChatId) => {
      if (oldChatId && unsubscribeMessages.value) {
        unsubscribeMessages.value();
        unsubscribeMessages.value = null;
      }

      statusUnsubscribers.value.forEach((unsub) => unsub());
      statusUnsubscribers.value.clear();
      messageStatuses.value.clear();
      messages.value = [];

      if (newChatId && !newChatId.startsWith("temp_")) {
        loadMessages(newChatId);
      }
    },
  );

  const loadMessages = (chatId: string) => {
    if (!chatId || chatId.startsWith("temp_")) {
      return;
    }

    if (unsubscribeMessages.value) {
      unsubscribeMessages.value();
    }

    statusUnsubscribers.value.forEach((unsub) => unsub());
    statusUnsubscribers.value.clear();
    messageStatuses.value.clear();
    isLoading.value = true;

    unsubscribeMessages.value = subscribeToChatMessages(
      chatId,
      (loadedMessages) => {
        messages.value = loadedMessages;
        isLoading.value = false;

        loadedMessages.forEach((msg) => {
          if (msg.senderId === userStore.userId) {
            const chatMembers =
              chatStore.activeChat?.participants.filter(
                (id) => id !== userStore.userId,
              ) || [];

            if (chatMembers.length > 0) {
              const otherUserId = chatMembers[0];

              if (!statusUnsubscribers.value.has(msg.id)) {
                const unsub = subscribeToMessageDeliveryStatus(
                  msg.id,
                  chatId,
                  otherUserId,
                  (status) => {
                    if (status) {
                      messageStatuses.value.set(msg.id, status);
                    }
                  },
                );

                statusUnsubscribers.value.set(msg.id, unsub);
              }
            }
          }
        });

        loadedMessages.forEach((msg) => {
          if (!deletedForUnsubscribers.value.has(msg.id)) {
            const unsub = subscribeToMessageDeletedForUser(
              chatId,
              msg.id,
              userStore.userId!,
              (isDeleted) => {
                if (isDeleted) {
                  messages.value = messages.value.filter(
                    (m) => m.id !== msg.id,
                  );
                }
              },
            );

            deletedForUnsubscribers.value.set(msg.id, unsub);
          }
        });
      },
      userStore.userId || undefined,
    );
  };

  const markMessageAsRead = async (messageId: string): Promise<void> => {
    const chatId = chatStore.activeChatId;
    const myId = userStore.userId;

    if (!chatId || !myId) return;

    const message = messages.value.find((m) => m.id === messageId);
    if (!message || message.senderId === myId || message.isDeleted) return;

    try {
      await setMessageDeliveryStatus(messageId, chatId, myId, "read");
      await markChatAsRead(chatId, myId, messageId);
    } catch (error) {
      console.error("Ошибка при прочтении сообщения:", error);
    }
  };

  const sendMessage = async (text: string): Promise<void> => {
    const chat = chatStore.activeChat;
    const myId = userStore.userId;

    if (!chat || !myId) {
      throw new Error(
        "Невозможно отправить сообщение: нет активного чата или пользователь не авторизован",
      );
    }

    if (!text?.trim()) {
      return;
    }

    try {
      let actualChatId = chat.id;

      if (chatStore.temporaryChat && chat.id === chatStore.temporaryChat.id) {
        const otherUserId = chat.participants.find((id) => id !== myId);

        if (!otherUserId) {
          throw new Error("Не найден получатель сообщения");
        }

        actualChatId = await getOrCreateDirectChat(myId, otherUserId);

        chatStore.temporaryChat = null;
        chatStore.selectChat(actualChatId);
      }

      await sendFirebaseMessage(actualChatId, myId, text);
    } catch (error) {
      throw error;
    }
  };

  const editMessage = async (
    messageId: string,
    newText: string,
  ): Promise<void> => {
    const chatId = chatStore.activeChatId;
    const myId = userStore.userId;

    if (!chatId || !myId) {
      throw new Error(
        "Невозможно отредактировать сообщение: нет активного чата или пользователь не авторизован",
      );
    }

    if (!newText?.trim()) {
      throw new Error("Текст сообщения не может быть пустым");
    }

    try {
      await editFirebaseMessage(chatId, messageId, newText, myId);
    } catch (error) {
      throw error;
    }
  };

  const deleteMessageForMe = async (messageId: string): Promise<void> => {
    const chatId = chatStore.activeChatId;
    const myId = userStore.userId;

    if (!chatId || !myId) {
      throw new Error(
        "Невозможно удалить сообщение: нет активного чата или пользователь не авторизован",
      );
    }

    try {
      await deleteFirebaseMessageForMe(chatId, messageId, myId);
    } catch (error) {
      throw error;
    }
  };

  const deleteMessageForAll = async (messageId: string): Promise<void> => {
    const chatId = chatStore.activeChatId;
    const myId = userStore.userId;

    if (!chatId || !myId) {
      throw new Error(
        "Невозможно удалить сообщение: нет активного чата или пользователь не авторизован",
      );
    }

    try {
      await deleteFirebaseMessageForAll(chatId, messageId, myId);
    } catch (error) {
      throw error;
    }
  };

  const cleanup = () => {
    if (unsubscribeMessages.value) {
      unsubscribeMessages.value();
      unsubscribeMessages.value = null;
    }

    statusUnsubscribers.value.forEach((unsub) => unsub());
    deletedForUnsubscribers.value.forEach((unsub) => unsub());
    statusUnsubscribers.value.clear();
    deletedForUnsubscribers.value.clear();
    messageStatuses.value.clear();
    messages.value = [];
  };

  return {
    messages,
    isLoading,
    messageStatuses,
    sendMessage,
    editMessage,
    deleteMessageForMe,
    deleteMessageForAll,
    markMessageAsRead,
    cleanup,
  };
});
