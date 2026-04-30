import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useUserStore } from "@/entities/user/store/user.store";
import {
  clearChatHistoryForAll,
  clearChatHistoryForMe,
  leaveChat,
  setChatPinned,
} from "@/shared/api/firebase/firestore";

export function useChatActions() {
  const confirm = useConfirm();
  const toast = useToast();
  const userStore = useUserStore();

  const requireMyId = (): string => {
    const myId = userStore.userId;
    if (!myId) throw new Error("Пользователь не авторизован");
    return myId;
  };

  const togglePin = async (chatId: string, isPinned: boolean) => {
    const myId = requireMyId();
    await setChatPinned(chatId, myId, !isPinned);
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
      header: "Очистить историю у всех",
      message:
        "Очистить историю сообщений для всех участников? Это действие нельзя отменить.",
      icon: "pi pi-exclamation-triangle",
      rejectLabel: "Отмена",
      acceptLabel: "Очистить у всех",
      acceptClass: "p-button-danger",
      accept: async () => {
        await clearChatHistoryForAll(chatId, myId);
        toast.add({
          severity: "success",
          summary: "Готово",
          detail: "История очищена для всех",
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
        await leaveChat(chatId, myId);
        toast.add({
          severity: "success",
          summary: "Готово",
          detail: "Вы покинули группу",
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
        const { deleteGroupChat } = await import(
          "@/shared/api/firebase/firestore"
        );
        await deleteGroupChat(chatId);
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
    deleteChat,
    clearHistoryForMe,
    clearHistoryForAll,
    leaveGroup,
    deleteGroup,
  };
}
