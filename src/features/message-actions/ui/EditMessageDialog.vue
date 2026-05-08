<script setup lang="ts">
import { ref, computed, watch, defineAsyncComponent } from "vue";
import { onClickOutside } from "@vueuse/core";
import { useAiRewrite } from "@/features/ai-rewrite/model/useAiRewrite";
import { useTheme } from "@/shared/composables/useTheme";
import { useEditInput } from "@/features/message-actions/model/useEditInput";
import { formatFileSize } from "@/shared/lib/image/formatFileSize";
import { MAX_FILES_PER_MESSAGE } from "@/shared/api/cloudinary";
import type { MessageAttachment } from "@/shared/types/message";
import Dialog from "primevue/dialog";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Message from "primevue/message";
import ProgressBar from "primevue/progressbar";

const EmojiPicker = defineAsyncComponent(() => import("vue3-emoji-picker"));

const props = defineProps<{
  visible: boolean;
  initialText: string;
  initialAttachments: MessageAttachment[];
}>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
  confirm: [text: string, attachments: MessageAttachment[]];
}>();

const editInput = useEditInput();
const { isDark } = useTheme();

const text = ref("");
const existingAttachments = ref<MessageAttachment[]>([]);
const { isRewriting, aiError, handleRewrite } = useAiRewrite(text);

const textareaRef = ref<any>(null);
const pickerRef = ref<HTMLElement | null>(null);
const pickerKey = ref(0);
const fileInputRef = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const dragCounter = ref(0);
const fileErrors = ref<string[]>([]);

watch(
  () => props.visible,
  (val) => {
    if (val) {
      text.value = props.initialText;
      existingAttachments.value = [...props.initialAttachments];

      editInput.reset();
    }
  },
);

watch(isDark, () => {
  if (editInput.isEmojiOpen.value) pickerKey.value++;
});

onClickOutside(pickerRef, () => editInput.closeEmoji());

const getTextarea = (): HTMLTextAreaElement | null => {
  const el = textareaRef.value?.$el;

  if (!el) return null;

  return el.tagName === "TEXTAREA" ? el : el.querySelector("textarea");
};

type Emoji = { i: string };

async function onSelectEmoji(emoji: Emoji) {
  text.value = await editInput.insertEmoji(emoji, text.value, getTextarea());
}

function toggleEmoji() {
  editInput.toggleEmoji(getTextarea());
}

function openFilePicker() {
  fileInputRef.value?.click();
}

function onFileInputChange(event: Event) {
  const input = event.target as HTMLInputElement;

  if (!input.files) return;

  const errors = editInput.addFiles(Array.from(input.files));

  if (errors.length) {
    fileErrors.value = errors;

    setTimeout(() => {
      fileErrors.value = [];
    }, 4000);
  }

  input.value = "";
}

function onDragEnter(event: DragEvent) {
  event.preventDefault();

  dragCounter.value++;
  isDragging.value = true;
}

function onDragLeave(event: DragEvent) {
  event.preventDefault();

  dragCounter.value--;

  if (dragCounter.value <= 0) {
    dragCounter.value = 0;
    isDragging.value = false;
  }
}

function onDragOver(event: DragEvent) {
  event.preventDefault();
}

function onDrop(event: DragEvent) {
  event.preventDefault();

  isDragging.value = false;
  dragCounter.value = 0;

  const files = Array.from(event.dataTransfer?.files ?? []);

  if (!files.length) return;

  const errors = editInput.addFiles(files);

  if (errors.length) {
    fileErrors.value = errors;

    setTimeout(() => {
      fileErrors.value = [];
    }, 4000);
  }
}

function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "pi-image";
  if (mimeType.startsWith("video/")) return "pi-video";
  if (mimeType.startsWith("audio/")) return "pi-volume-up";

  return "pi-file";
}

function removeExistingAttachment(id: string) {
  existingAttachments.value = existingAttachments.value.filter(
    (a) => a.id !== id,
  );
}

const canAddMore = computed(
  () =>
    editInput.canAddMore() &&
    editInput.fileUpload.pendingFiles.value.length +
      existingAttachments.value.length <
      MAX_FILES_PER_MESSAGE,
);

const canSave = computed(() => {
  const hasText = text.value.trim().length > 0;
  const hasExisting = existingAttachments.value.length > 0;
  const hasPending = editInput.fileUpload.pendingFiles.value.length > 0;

  return (hasText || hasExisting || hasPending) && !isRewriting.value;
});

async function onConfirm() {
  if (!canSave.value) return;

  let newAttachments: MessageAttachment[] = [];

  if (editInput.fileUpload.pendingFiles.value.length > 0) {
    newAttachments = await editInput.fileUpload.waitForUploads();
  }

  emit("confirm", text.value.trim(), [
    ...existingAttachments.value,
    ...newAttachments,
  ]);
  emit("update:visible", false);
}

function onCancel() {
  emit("update:visible", false);
}
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="emit('update:visible', $event)"
    modal
    header="Редактировать сообщение"
    :style="{ width: '30rem' }"
    :breakpoints="{ '1199px': '75vw', '769px': '90vw' }"
    :pt="{
      content: { class: 'overflow-visible!' },
    }"
  >
    <div
      class="flex flex-col gap-3 relative"
      @dragenter="onDragEnter"
      @dragleave="onDragLeave"
      @dragover="onDragOver"
      @drop="onDrop"
    >
      <Transition
        enter-active-class="transition-all duration-150 ease-out"
        enter-from-class="opacity-0 scale-98"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isDragging"
          class="absolute inset-0 z-20 rounded-xl border-2 border-dashed border-(--p-primary-color) bg-(--p-primary-color)/10 backdrop-blur-sm flex flex-col items-center justify-center gap-2 pointer-events-none"
        >
          <i class="pi pi-cloud-upload text-3xl text-(--p-primary-color)" />
          <span class="text-sm font-medium text-(--p-primary-color)">
            Перетащите файлы сюда (до {{ MAX_FILES_PER_MESSAGE }} файлов)
          </span>
        </div>
      </Transition>

      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="fileErrors.length" class="flex flex-col gap-1">
          <Message
            v-for="(err, i) in fileErrors"
            :key="i"
            :closable="false"
            severity="warn"
            class="py-1!"
          >
            {{ err }}
          </Message>
        </div>
      </Transition>

      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <Message v-if="aiError" :closable="false" severity="error">
          {{ aiError }}
        </Message>
      </Transition>

      <div class="relative">
        <Textarea
          ref="textareaRef"
          v-model="text"
          rows="5"
          auto-resize
          placeholder="Введите текст сообщения"
          class="w-full pl-8! pr-16!"
          :disabled="isRewriting"
          @keyup="editInput.saveCursorPos(getTextarea())"
          @click="editInput.saveCursorPos(getTextarea())"
          @blur="editInput.saveCursorPos(getTextarea())"
        />

        <Button
          type="button"
          icon="pi pi-paperclip"
          class="absolute! top-0 left-0 w-8! h-8!"
          rounded
          text
          :disabled="!canAddMore || isRewriting"
          @click="openFilePicker"
          v-tooltip.top="
            canAddMore
              ? 'Прикрепить файл'
              : `Максимум ${MAX_FILES_PER_MESSAGE} файлов`
          "
        />

        <div class="absolute flex items-center top-0 right-0 w-fit">
          <Transition
            enter-active-class="transition-opacity duration-200"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-150"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <Button
              v-if="text.trim() && !isRewriting"
              type="button"
              :loading="isRewriting"
              @click="handleRewrite"
              icon="pi pi-sparkles"
              class="w-8! h-8!"
              rounded
              text
              severity="help"
              v-tooltip.top="'Переписать в корпоративном стиле'"
            />
          </Transition>

          <Button
            type="button"
            icon="pi pi-face-smile"
            class="w-8! h-8!"
            rounded
            text
            @mousedown.prevent="toggleEmoji"
            v-tooltip.top="'Открыть смайлы'"
          />
        </div>

        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-2 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0 translate-y-2 scale-95"
        >
          <div
            ref="pickerRef"
            v-if="editInput.isEmojiOpen.value"
            class="absolute top-0 opacity-90 right-0 z-30"
          >
            <EmojiPicker
              :key="pickerKey"
              @select="onSelectEmoji"
              :theme="isDark ? 'dark' : 'light'"
              :static-texts="{ placeholder: 'Поиск эмодзи' }"
              :disabled-groups="['flags']"
              :disable-skin-tones="true"
              :display-recent="true"
              :native="true"
              :group-names="{
                smileys_people: 'Лиц и люди',
                animals_nature: 'Животные и природа',
                food_drink: 'Еда и напитки',
                activities: 'Активности',
                travel_places: 'Путешествие',
                objects: 'Объекты',
                symbols: 'Символы',
                recent: 'Недавние',
              }"
            />
          </div>
        </Transition>
      </div>

      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="existingAttachments.length" class="flex flex-wrap gap-2">
          <div
            v-for="attachment in existingAttachments"
            :key="attachment.id"
            class="relative group/att flex items-center gap-1 px-2 py-1 rounded-lg bg-(--p-primary-color)/10 text-sm max-w-full"
          >
            <i
              :class="[
                'pi shrink-0',
                attachment.type === 'image'
                  ? 'pi-image'
                  : attachment.type === 'video'
                    ? 'pi-video'
                    : attachment.type === 'audio'
                      ? 'pi-volume-up'
                      : 'pi-file',
              ]"
            />
            <span class="truncate max-w-40">{{ attachment.name }}</span>
            <Button
              icon="pi pi-times"
              rounded
              text
              size="small"
              severity="danger"
              class="w-5! h-5! shrink-0"
              @click="removeExistingAttachment(attachment.id)"
              aria-label="Удалить вложение"
            />
          </div>
        </div>
      </Transition>

      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="editInput.fileUpload.pendingFiles.value.length"
          class="p-2 rounded-xl bg-(--p-primary-color)/20 flex overflow-x-auto items-center gap-2"
        >
          <div
            v-for="pf in editInput.fileUpload.pendingFiles.value"
            :key="pf.id"
            class="relative flex flex-col items-center gap-1 group"
          >
            <div
              v-if="pf.previewUrl"
              class="w-22! h-22! rounded-lg overflow-hidden relative group/img"
            >
              <img
                :src="pf.previewUrl"
                class="w-full h-full object-cover"
                alt="Превью файла"
              />
              <div
                v-if="pf.status === 'uploading'"
                class="absolute inset-0 bg-black/50 flex items-end"
              >
                <ProgressBar
                  :value="pf.progress"
                  class="w-full! h-1! rounded-none!"
                  :show-value="false"
                />
              </div>
              <div
                v-if="pf.status === 'done'"
                class="absolute top-1 left-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center"
              >
                <i class="pi pi-check text-white text-[8px]" />
              </div>
              <div
                v-if="pf.status === 'error'"
                class="absolute inset-0 bg-red-500/30 flex items-center justify-center cursor-pointer"
                @click="editInput.fileUpload.retryFile(pf.id)"
                title="Нажмите для повтора"
              >
                <i class="pi pi-refresh text-white text-sm" />
              </div>
              <Button
                v-if="pf.status !== 'uploading'"
                icon="pi pi-times"
                rounded
                text
                size="small"
                severity="danger"
                class="absolute! top-0 right-0 scale-80 opacity-0 group-hover/img:opacity-100 transition-opacity"
                @click.stop="editInput.fileUpload.removeFile(pf.id)"
                aria-label="Удалить файл"
              />
            </div>

            <div
              v-else
              class="flex h-22! w-22! rounded-lg flex-col items-center justify-center gap-1 relative overflow-hidden"
            >
              <i
                :class="[
                  'pi',
                  getFileIcon(pf.file.type),
                  'text-xl text-surface-500',
                ]"
              />
              <div class="flex justify-between self-start text-[0.7rem]">
                <span class="line-clamp-2 text-center">
                  {{ pf.file.name }}
                </span>
              </div>
              <div
                v-if="pf.status === 'uploading'"
                class="absolute inset-0 bg-black/30 flex items-end rounded-lg overflow-hidden"
              >
                <ProgressBar
                  :value="pf.progress"
                  class="w-full! h-1! rounded-none!"
                  :show-value="false"
                />
              </div>
              <div
                v-if="pf.status === 'done'"
                class="absolute top-1 left-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center"
              >
                <i class="pi pi-check text-white text-sm" />
              </div>
              <div
                v-if="pf.status === 'error'"
                class="absolute inset-0 rounded-lg bg-red-500/30 flex items-center justify-center cursor-pointer"
                @click="editInput.fileUpload.retryFile(pf.id)"
                title="Нажмите для повтора"
              >
                <i class="pi pi-refresh text-white text-sm" />
              </div>
              <span class="text-xs max-w-16 truncate">{{
                formatFileSize(pf.file.size)
              }}</span>
              <Button
                v-if="pf.status !== 'uploading'"
                icon="pi pi-times"
                rounded
                text
                size="small"
                severity="danger"
                class="absolute! top-0 right-0 scale-80 opacity-100 group-hover:opacity-100 transition-opacity"
                @click="editInput.fileUpload.removeFile(pf.id)"
                aria-label="Удалить файл"
              />
            </div>
          </div>

          <button
            v-if="canAddMore"
            type="button"
            class="flex-none w-22 h-22 rounded-lg border-2 border-dashed border-surface-300 dark:border-surface-600 flex flex-col items-center justify-center gap-1 text-surface-400 hover:border-(--p-primary-color) hover:text-(--p-primary-color) transition-colors cursor-pointer"
            @click="openFilePicker"
          >
            <i class="pi pi-plus text-lg" />
            <span class="text-[10px]">Ещё</span>
          </button>
        </div>
      </Transition>
    </div>

    <template #footer>
      <Button
        label="Отмена"
        severity="secondary"
        @click="onCancel"
        :disabled="isRewriting"
      />
      <Button
        label="Сохранить"
        @click="onConfirm"
        :disabled="!canSave"
        :loading="editInput.fileUpload.isUploading.value"
      />
    </template>

    <input
      ref="fileInputRef"
      type="file"
      multiple
      class="hidden"
      accept="*/*"
      @change="onFileInputChange"
    />
  </Dialog>
</template>
