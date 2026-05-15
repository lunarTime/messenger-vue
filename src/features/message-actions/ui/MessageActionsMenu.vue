<script setup lang="ts">
import { ref, computed } from "vue";
import { EllipsisVerticalIcon } from "@heroicons/vue/24/solid";
import type { MenuItem } from "primevue/menuitem";
import Button from "primevue/button";
import ContextMenu from "primevue/contextmenu";

const props = defineProps<{
  isOutgoing: boolean;
  isDeleted: boolean;
  isForwarded: boolean;
  hasText?: boolean;
}>();

const emit = defineEmits<{
  edit: [];
  deleteForMe: [];
  deleteForAll: [];
  reply: [];
  forward: [];
  select: [];
  copy: [];
  menuOpen: [];
  menuClose: [];
}>();

const menuRef = ref();
const isMenuVisible = ref(false);

const closeAndEmit = (action: () => void) => {
  emit("menuClose");

  action();
};

const menuItems = computed<MenuItem[]>(() => {
  const items: MenuItem[] = [];

  if (!props.isDeleted) {
    items.push({
      label: "Ответить",
      icon: "pi pi-reply",
      command: () => closeAndEmit(() => emit("reply")),
    });

    items.push({
      label: "Переслать",
      icon: "pi pi-share-alt",
      command: () => closeAndEmit(() => emit("forward")),
    });

    if (props.isOutgoing && !props.isForwarded) {
      items.push({
        label: "Редактировать",
        icon: "pi pi-pencil",
        command: () => closeAndEmit(() => emit("edit")),
      });
    }

    if (props.hasText) {
      items.push({
        label: "Скопировать",
        icon: "pi pi-copy",
        command: () => closeAndEmit(() => emit("copy")),
      });
    }

    items.push({
      label: "Выбрать",
      icon: "pi pi-check-circle",
      command: () => closeAndEmit(() => emit("select")),
    });

    items.push({
      label: "Удалить у меня",
      icon: "pi pi-trash",
      command: () => closeAndEmit(() => emit("deleteForMe")),
    });

    if (props.isOutgoing) {
      items.push({
        label: "Удалить у всех",
        icon: "pi pi-trash",
        severity: "danger",
        command: () => closeAndEmit(() => emit("deleteForAll")),
      });
    }
  } else {
    items.push({
      label: "Удалить у меня",
      icon: "pi pi-trash",
      command: () => closeAndEmit(() => emit("deleteForMe")),
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

  emit("menuOpen");
};

const hide = () => {
  menuRef.value?.hide();
  isMenuVisible.value = false;
};

const onMenuHide = () => {
  isMenuVisible.value = false;

  emit("menuClose");
};

defineExpose({ showAt, hide });
</script>

<template>
  <template v-if="hasActions">
    <div class="hidden md:block">
      <Button
        text
        rounded
        class="flex opacity-0 group-hover:opacity-100 transition-opacity"
        :class="{ 'opacity-100!': isMenuVisible }"
        @click="toggleMenu"
        aria-label="Меню сообщения"
      >
        <template #icon>
          <EllipsisVerticalIcon class="size-4" />
        </template>
      </Button>
    </div>

    <ContextMenu
      ref="menuRef"
      :model="menuItems"
      :popup="true"
      @hide="onMenuHide"
    />
  </template>
</template>
