import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useUserStore } from "@/entities/user/store/user.store";
import { useChatStore } from "@/entities/chat/store/chat.store";
import {
  clearChatHistoryForAll,
  clearChatHistoryForMe,
  leaveChat,
  setChatPinned,
  setChatMuted,
  removeGroupMember,
  setMemberRole,
} from "@/shared/api/firebase/firestore";

export function useChatActions() {
  const confirm = useConfirm();
  const toast = useToast();
  const userStore = useUserStore();
  const chatStore = useChatStore();

  const requireMyId = (): string => {
    const myId = userStore.userId;
    if (!myId) throw new Error("Пользователь не авторизован");
    return myId;
  };

  const togglePin = async (chatId: string, isPinned: boolean) => {
    const myId = requireMyId();
    await setChatPinned(chatId, myId, !isPinned);
  };

  const toggleMute = async (chatId: string) => {
    const myId = requireMyId();
    const wasMuted = chatStore.isChatMuted(chatId);

    await setChatMuted(myId, chatId, !wasMuted);

    toast.add({
      severity: "success",
      summary: wasMuted ? "Уведомления включены" : "Уведомления отключены",
      life: 2000,
    });
  };

  const deleteChat = async (chatId: string) => {
    const myId = requireMyId();

    confirm.require({
      header: "Удалить чат",
      message: "Удалить чат у себя? Сообщения у собеседника останутся.",
      icon: "pi pi-exclamation-triangle",
      rejectLabel: "Отмена",
      acceptLabel: "Удалить",
      acceptClass: "p-button-danger",
      accept: async () => {
        await leaveChat(chatId, myId);
        chatStore.closeActiveChat();
        toast.add({
          severity: "success",
          summary: "Готово",
          detail: "Чат удалён у вас",
          life: 2500,
        });
      },
    });
  };

  const clearHistoryForMe = async (chatId: string) => {
    const myId = requireMyId();

    confirm.require({
      header: "Очистить историю",
      message: "Очистить историю сообщений только у себя?",
      icon: "pi pi-exclamation-triangle",
      rejectLabel: "Отмена",
      acceptLabel: "Очистить",
      acceptClass: "p-button-danger",
      accept: async () => {
        await clearChatHistoryForMe(chatId, myId);
        toast.add({
          severity: "success",
          summary: "Готово",
          detail: "История очищена у вас",
          life: 2500,
        });
      },
    });
  };

  const clearHistoryForAll = async (chatId: string) => {
    const myId = requireMyId();

    confirm.require({
      header: "Удалить мои сообщения у всех",
      message:
        "Удалить все ваши сообщения в этом чате у всех участников? Сообщения собеседника останутся. Это действие нельзя отменить.",
      icon: "pi pi-exclamation-triangle",
      rejectLabel: "Отмена",
      acceptLabel: "Удалить у всех",
      acceptClass: "p-button-danger",
      accept: async () => {
        await clearChatHistoryForAll(chatId, myId);
        toast.add({
          severity: "success",
          summary: "Готово",
          detail: "Ваши сообщения удалены у всех",
          life: 2500,
        });
      },
    });
  };

  const leaveGroup = async (chatId: string) => {
    const myId = requireMyId();

    confirm.require({
      header: "Выйти из группы",
      message: "Вы уверены, что хотите выйти из этой группы?",
      icon: "pi pi-exclamation-triangle",
      rejectLabel: "Отмена",
      acceptLabel: "Выйти",
      acceptClass: "p-button-danger",
      accept: async () => {
        await leaveChat(chatId, myId, true);
        chatStore.closeActiveChat();
        toast.add({
          severity: "success",
          summary: "Готово",
          detail: "Вы покинули группу",
          life: 2500,
        });
      },
    });
  };

  const removeMember = async (chatId: string, userId: string) => {
    const myId = requireMyId();

    confirm.require({
      header: "Исключить участника",
      message: "Вы уверены, что хотите исключить этого участника из группы?",
      icon: "pi pi-exclamation-triangle",
      rejectLabel: "Отмена",
      acceptLabel: "Исключить",
      acceptClass: "p-button-danger",
      accept: async () => {
        await removeGroupMember(chatId, userId, myId);
        toast.add({
          severity: "success",
          summary: "Готово",
          detail: "Участник исключен",
          life: 2500,
        });
      },
    });
  };

  const promoteMember = async (chatId: string, userId: string) => {
    const myId = requireMyId();

    confirm.require({
      header: "Назначить администратором",
      message: "Назначить этого участника администратором группы?",
      icon: "pi pi-shield",
      rejectLabel: "Отмена",
      acceptLabel: "Назначить",
      accept: async () => {
        await setMemberRole(chatId, userId, "admin", myId);

        toast.add({
          severity: "success",
          summary: "Готово",
          detail: "Участник назначен администратором",
          life: 2500,
        });
      },
    });
  };

  const demoteMember = async (chatId: string, userId: string) => {
    const myId = requireMyId();

    confirm.require({
      header: "Снять права администратора",
      message: "Снять права администратора у этого участника?",
      icon: "pi pi-shield",
      rejectLabel: "Отмена",
      acceptLabel: "Снять",
      acceptClass: "p-button-danger",
      accept: async () => {
        await setMemberRole(chatId, userId, "member", myId);

        toast.add({
          severity: "success",
          summary: "Готово",
          detail: "Права администратора сняты",
          life: 2500,
        });
      },
    });
  };

  const deleteGroup = async (chatId: string) => {
    requireMyId();

    confirm.require({
      header: "Удалить группу",
      message: "Вы уверены, что хотите удалить группу для всех участников?",
      icon: "pi pi-exclamation-triangle",
      rejectLabel: "Отмена",
      acceptLabel: "Удалить",
      acceptClass: "p-button-danger",
      accept: async () => {
        const { deleteGroupChat } =
          await import("@/shared/api/firebase/firestore");
        await deleteGroupChat(chatId);

        chatStore.closeActiveChat();

        toast.add({
          severity: "success",
          summary: "Готово",
          detail: "Группа удалена",
          life: 2500,
        });
      },
    });
  };

  return {
    togglePin,
    toggleMute,
    deleteChat,
    clearHistoryForMe,
    clearHistoryForAll,
    leaveGroup,
    removeMember,
    promoteMember,
    demoteMember,
    deleteGroup,
  };
}
