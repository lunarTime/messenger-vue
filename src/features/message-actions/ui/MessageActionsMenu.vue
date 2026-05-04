<script setup lang="ts">
import { ref, computed } from "vue";
import { EllipsisVerticalIcon } from "@heroicons/vue/24/solid";
import type { MenuItem } from "primevue/menuitem";
import Button from "primevue/button";
import ContextMenu from "primevue/contextmenu";

const props = defineProps<{
  isOutgoing: boolean;
  isDeleted: boolean;
}>();

const emit = defineEmits<{
  edit: [];
  deleteForMe: [];
  deleteForAll: [];
  reply: [];
  forward: [];
}>();

const menuRef = ref();
const isMenuVisible = ref(false);

const menuItems = computed<MenuItem[]>(() => {
  const items: MenuItem[] = [];

  if (!props.isDeleted) {
    items.push({
      label: "Ответить",
      icon: "pi pi-reply",
      command: () => emit("reply"),
    });

    items.push({
      label: "Переслать",
      icon: "pi pi-share-alt",
      command: () => emit("forward"),
    });

    if (props.isOutgoing) {
      items.push({
        label: "Редактировать",
        icon: "pi pi-pencil",
        command: () => emit("edit"),
      });
    }

    items.push({
      label: "Удалить у меня",
      icon: "pi pi-trash",
      command: () => emit("deleteForMe"),
    });

    if (props.isOutgoing) {
      items.push({
        label: "Удалить у всех",
        icon: "pi pi-trash",
        severity: "danger",
        command: () => emit("deleteForAll"),
      });
    }
  } else {
    items.push({
      label: "Удалить у меня",
      icon: "pi pi-trash",
      command: () => emit("deleteForMe"),
    });
  }

  return items;
});

const hasActions = computed(() => menuItems.value.length > 0);

const toggleMenu = (event: Event) => {
  menuRef.value?.show(event);
  isMenuVisible.value = !isMenuVisible.value;
};

const showAt = (pageX: number, pageY: number) => {
  menuRef.value?.show({
    pageX,
    pageY,
    stopPropagation: () => {},
    preventDefault: () => {},
  });
  isMenuVisible.value = true;
};

const hide = () => {
  menuRef.value?.hide();
  isMenuVisible.value = false;
};

defineExpose({ showAt, hide });
</script>

<template>
  <div v-if="hasActions">
    <Button
      text
      rounded
      class="hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity"
      :class="{ 'opacity-100!': isMenuVisible }"
      @click="toggleMenu"
      aria-label="Меню сообщения"
    >
      <template #icon>
        <EllipsisVerticalIcon class="size-4" />
      </template>
    </Button>

    <ContextMenu ref="menuRef" :model="menuItems" :popup="true" />
  </div>
</template>
