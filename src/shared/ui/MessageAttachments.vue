<script setup lang="ts">
import { ref, computed } from "vue";
import Button from "primevue/button";
import MediaViewer from "@/shared/ui/MediaViewer.vue";
import { downloadFile } from "@/shared/lib/download/download";
import { formatFileSize } from "@/shared/lib/image/formatFileSize";
import type { MessageAttachment } from "@/shared/types/message";

const props = defineProps<{
  attachments: MessageAttachment[];
  isOutgoing: boolean;
}>();

const mediaItems = computed(() =>
  props.attachments.filter((a) => a.type === "image" || a.type === "video"),
);

const nonMediaItems = computed(() =>
  props.attachments.filter((a) => a.type !== "image" && a.type !== "video"),
);

const viewerVisible = ref(false);
const viewerStartIndex = ref(0);

function openViewer(attachment: MessageAttachment) {
  const idx = mediaItems.value.findIndex((a) => a.id === attachment.id);

  viewerStartIndex.value = idx >= 0 ? idx : 0;
  viewerVisible.value = true;
}

const fileIcons: Record<string, string> = {
  audio: "pi-volume-up",
  file: "pi-file",
};

function getFileIcon(attachment: MessageAttachment): string {
  return `pi ${fileIcons[attachment.type] ?? "pi-file"}`;
}

const imageGrid = computed(() => {
  const images = props.attachments.filter((a) => a.type === "image");

  return images;
});

const gridClass = computed(() => {
  const count = imageGrid.value.length;

  if (count === 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-2";

  return "grid-cols-3";
});
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full">
    <div
      v-if="imageGrid.length"
      :class="['grid gap-1 rounded-xl overflow-hidden', gridClass]"
    >
      <div
        v-for="img in imageGrid"
        :key="img.id"
        class="relative group cursor-pointer overflow-hidden"
        :class="imageGrid.length === 1 ? 'max-w-xs' : 'aspect-square'"
        @click="openViewer(img)"
      >
        <img
          :src="img.url"
          :alt="img.name"
          class="w-full h-full object-cover"
          :class="imageGrid.length === 1 ? 'max-h-60 object-contain' : ''"
          loading="lazy"
        />
        <div
          class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center"
        >
          <i
            class="pi pi-search-plus text-white opacity-0 group-hover:opacity-100 text-xl transition-opacity drop-shadow"
          />
        </div>
        <Button
          icon="pi pi-download"
          size="small"
          text
          rounded
          class="absolute! top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-(--p-primary-color)/80! md:inline-flex! hidden!"
          @click.stop="downloadFile(img.url, img.name)"
          v-tooltip.top="'Скачать'"
        />
      </div>
    </div>

    <div
      v-for="vid in attachments.filter((a) => a.type === 'video')"
      :key="vid.id"
      class="relative group rounded-xl overflow-hidden max-w-xs"
    >
      <video
        :src="vid.url"
        class="w-full rounded-xl max-h-52 object-cover cursor-pointer"
        preload="metadata"
        @click="openViewer(vid)"
      />
      <div
        class="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div
          class="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center group-hover:bg-black/70 transition-colors"
        >
          <i class="pi pi-play text-white text-lg ml-0.5" />
        </div>
      </div>
      <Button
        icon="pi pi-download"
        size="small"
        text
        rounded
        class="absolute! top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-white! bg-black/40! hover:bg-black/60! pointer-events-auto"
        @click.stop="downloadFile(vid.url, vid.name)"
        v-tooltip.top="'Скачать'"
      />
    </div>

    <div
      v-for="aud in attachments.filter((a) => a.type === 'audio')"
      :key="aud.id"
      class="flex items-center gap-2 px-3 py-2 rounded-xl max-w-xs"
      :class="isOutgoing ? 'bg-white/15' : 'bg-(--p-primary-color)/10'"
    >
      <div class="flex-1 min-w-0">
        <div class="text-xs opacity-60 md:max-w-80 max-w-50 truncate mb-1">
          {{ aud.name }}
        </div>
        <audio :src="aud.url" controls class="w-full h-8" preload="none" />
      </div>
    </div>

    <div
      v-for="file in nonMediaItems.filter((a) => a.type === 'file')"
      :key="file.id"
      class="flex items-center gap-2 px-3 py-2 rounded-xl w-full"
      :class="isOutgoing ? 'bg-white/15' : 'bg-(--p-primary-color)/10'"
    >
      <div
        class="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
        :class="isOutgoing ? 'bg-white/20' : 'bg-(--p-primary-color)/20'"
      >
        <i :class="[getFileIcon(file), 'text-base']" />
      </div>
      <div class="flex-1 min-w-20 truncate w-0">
        <div class="flex-1 min-w-0 text-sm font-medium truncate">
          {{ file.name }}
        </div>
        <div class="text-xs opacity-60">
          {{ file.size ? formatFileSize(file.size) : "" }}
        </div>
      </div>
      <Button
        icon="pi pi-download"
        size="small"
        text
        rounded
        class="shrink-0 dark:text-white! text-black!"
        @click="downloadFile(file.url, file.name)"
        v-tooltip.top="'Скачать'"
      />
    </div>

    <MediaViewer
      :attachments="mediaItems"
      :start-index="viewerStartIndex"
      v-model:visible="viewerVisible"
    />
  </div>
</template>
