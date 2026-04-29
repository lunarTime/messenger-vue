<script setup lang="ts">
import { computed, ref } from "vue";
import type { MenuItem } from "primevue/menuitem";
import ContextMenu from "primevue/contextmenu";
import { useChatActions } from "@/features/chat-actions/model/useChatActions";

const props = defineProps<{
  chatId: string;
  isPinned: boolean;
}>();

const menuRef = ref();
const { togglePin, deleteChat, clearHistoryForMe, clearHistoryForAll } =
  useChatActions();

const items = computed<MenuItem[]>(() => [
  {
    label: props.isPinned ? "Открепить" : "Закрепить сверху",
    icon: props.isPinned ? "pi pi-bookmark-fill" : "pi pi-bookmark",
    command: () => togglePin(props.chatId, props.isPinned),
  },
  { separator: true },
  {
    label: "Очистить историю у меня",
    icon: "pi pi-eraser",
    command: () => clearHistoryForMe(props.chatId),
  },
  {
    label: "Очистить историю у всех",
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
]);

const show = (event: Event) => {
  menuRef.value?.show(event);
};

const hide = () => {
  menuRef.value?.hide();
};

defineExpose({ show, hide });
</script>

<template>
  <ContextMenu ref="menuRef" :model="items" />
</template>
