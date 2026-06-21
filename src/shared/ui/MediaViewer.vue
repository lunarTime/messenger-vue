<script setup lang="ts">
import { ref, computed, watch } from "vue";
import Galleria from "primevue/galleria";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import { downloadFile } from "@/shared/lib/download/download";
import type { MessageAttachment } from "@/shared/types/message";

const props = defineProps<{
  attachments: MessageAttachment[];
  startIndex?: number;
  visible: boolean;
}>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
}>();

const toast = useToast();

const mediaItems = computed(() =>
  props.attachments.filter((a) => a.type === "image" || a.type === "video"),
);

const activeIndex = ref(props.startIndex ?? 0);

watch(
  () => props.startIndex,
  (val) => {
    if (val !== undefined) activeIndex.value = val;
  },
);

watch(
  () => props.visible,
  (val) => {
    if (val && props.startIndex !== undefined) {
      activeIndex.value = props.startIndex;
    }
  },
);

function close() {
  emit("update:visible", false);
}

function closeOnBackdrop(event: MouseEvent) {
  if (event.target === event.currentTarget) close();
}

async function downloadCurrent() {
  const item = mediaItems.value[activeIndex.value];

  if (!item) return;

  try {
    await downloadFile(item.url, item.name);
  } catch (error) {
    console.error("Ошибка загрузки файла:", error);
    toast.add({
      severity: "error",
      summary: "Загрузка не удалась",
      detail: error instanceof Error ? error.message : "File is unavailable",
      life: 5000,
    });
  }
}
</script>

<template>
  <Galleria
    v-model:activeIndex="activeIndex"
    :value="mediaItems"
    :visible="visible"
    :fullScreen="true"
    :showItemNavigators="mediaItems.length > 1"
    :showThumbnails="mediaItems.length > 1"
    :showIndicators="false"
    :circular="true"
    :pt="{
      root: {
        class:
          'md:w-[80%]! md:h-[97%]! h-dvh w-full flex flex-col bg-black/50 border-none!',
      },
      content: { class: 'justify-between h-full' },
      prevbutton: { class: 'z-9999' },
      closebutton: { class: 'md:flex! hidden!' },
      nextbutton: { class: 'z-9999' },
      itemscontainer: { class: 'flex-1' },
      thumbnails: { class: 'z-1000' },
      thumbnailcontent: { class: 'bg-black/40!' },
      items: { class: 'flex-1 overflow-hidden' },
      closeButton: { class: 'hidden' },
      mask: { class: 'backdrop-blur-xs', onClick: closeOnBackdrop },
    }"
    @update:visible="emit('update:visible', $event)"
  >
    <template #item="{ item }">
      <div
        class="relative flex items-center justify-center max-h-[80dvh] h-full overflow-hidden"
        @click.self="close"
      >
        <img
          v-if="item.type === 'image'"
          :src="item.url"
          :alt="item.name"
          class="block object-contain rounded-lg select-none h-[stretch]"
        />
        <video
          v-else-if="item.type === 'video'"
          :src="item.url"
          controls
          class="rounded-lg h-[stretch]"
          preload="metadata"
        />
      </div>
    </template>

    <template #thumbnail="{ item }">
      <img
        v-if="item.type === 'image'"
        :src="item.url"
        :alt="item.name"
        class="w-14 h-14 object-cover rounded opacity-70 hover:opacity-100 transition-opacity"
      />
      <div
        v-else
        class="w-14 h-14 flex items-center justify-center rounded opacity-70 hover:opacity-100 transition-opacity"
      >
        <i class="pi pi-video text-xl" />
      </div>
    </template>

    <template #header>
      <div class="flex items-center justify-between px-4 py-2">
        <span class="text-sm truncate max-w-[85%]">
          {{ mediaItems[activeIndex]?.name }}
        </span>

        <div class="flex items-center gap-2">
          <Button
            icon="pi pi-download"
            text
            rounded
            size="small"
            aria-label="Скачать"
            v-tooltip.bottom="'Скачать'"
            @click="downloadCurrent"
          />
          <Button
            icon="pi pi-times"
            text
            rounded
            size="small"
            aria-label="Закрыть"
            v-tooltip.bottom="'Закрыть'"
            @click="close"
          />
        </div>
      </div>
    </template>
  </Galleria>
</template>
