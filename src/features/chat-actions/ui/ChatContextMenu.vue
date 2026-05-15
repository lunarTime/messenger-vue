<script setup lang="ts">
import { computed, ref } from "vue";
import type { MenuItem } from "primevue/menuitem";
import ContextMenu from "primevue/contextmenu";
import { useChatActions } from "@/features/chat-actions/model/useChatActions";
import { useChatStore } from "@/entities/chat/store/chat.store";

const props = defineProps<{
  chatId: string;
  isPinned: boolean;
}>();

const menuRef = ref();
const chatStore = useChatStore();
const {
  togglePin,
  toggleMute,
  deleteChat,
  clearHistoryForMe,
  clearHistoryForAll,
  leaveGroup,
  deleteGroup,
} = useChatActions();

const chat = computed(() => chatStore.chats.find((c) => c.id === props.chatId));

const isOwner = computed(() => chatStore.isChatOwner(props.chatId));

const isMuted = computed(() => chatStore.isChatMuted(props.chatId));

const items = computed<MenuItem[]>(() => {
  const common: MenuItem[] = [
    {
      label: props.isPinned ? "Открепить" : "Закрепить сверху",
      icon: props.isPinned ? "pi pi-bookmark-fill" : "pi pi-bookmark",
      command: () => togglePin(props.chatId, props.isPinned),
    },
    {
      label: isMuted.value ? "Включить уведомления" : "Отключить уведомления",
      icon: isMuted.value ? "pi pi-bell" : "pi pi-bell-slash",
      command: () => toggleMute(props.chatId),
    },
    { separator: true },
  ];

  if (chat.value?.type === "group") {
    const groupItems: MenuItem[] = [
      {
        label: "Выйти из группы",
        icon: "pi pi-sign-out",
        severity: "danger",
        command: () => leaveGroup(props.chatId),
      },
    ];

    if (isOwner.value) {
      groupItems.push({
        label: "Удалить группу",
        icon: "pi pi-trash",
        severity: "danger",
        command: () => deleteGroup(props.chatId),
      });
    }

    return [...common, ...groupItems];
  }

  return [
    ...common,
    {
      label: "Очистить историю у меня",
      icon: "pi pi-eraser",
      command: () => clearHistoryForMe(props.chatId),
    },
    {
      label: "Удалить мои сообщения у всех",
      icon: "pi pi-eraser",
      severity: "danger",
      command: () => clearHistoryForAll(props.chatId),
    },
    { separator: true },
    {
      label: "Удалить чат",
      icon: "pi pi-trash",
      severity: "danger",
      command: () => deleteChat(props.chatId),
    },
  ];
});

type ShowEvent = Event | { pageX: number; pageY: number; stopPropagation: () => void; preventDefault: () => void }

const show = (event: ShowEvent) => {
  menuRef.value?.show(event)
};

const hide = () => {
  menuRef.value?.hide();
};

defineExpose({ show, hide });
</script>

<template>
  <ContextMenu ref="menuRef" :model="items" />
</template>
