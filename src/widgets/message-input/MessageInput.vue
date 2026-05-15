<script setup lang="ts">
import {
  ref,
  nextTick,
  defineAsyncComponent,
  watch,
  computed,
  onMounted,
  onUnmounted,
} from "vue";
import { onClickOutside, watchDebounced } from "@vueuse/core";
import { useMessageInput } from "@/features/send-message/model/useMessageInput";
import { useAiRewrite } from "@/features/ai-rewrite/model/useAiRewrite";
import { useTheme } from "@/shared/composables/useTheme";
import { useMessageCompose } from "@/shared/composables/useMessageCompose";
import { formatFileSize } from "@/shared/lib/image/formatFileSize";
import { MAX_FILES_PER_MESSAGE } from "@/shared/api/cloudinary";
import Button from "primevue/button";
import Textarea from "primevue/textarea";
import Message from "primevue/message";
import ProgressBar from "primevue/progressbar";
import "vue3-emoji-picker/css";

const EmojiPicker = defineAsyncComponent(() => import("vue3-emoji-picker"));

const textareaRef = ref<any>(null);

const getTextarea = (): HTMLTextAreaElement | null => {
  const el = textareaRef.value?.$el;

  if (!el) return null;

  return el.tagName === "TEXTAREA" ? el : el.querySelector("textarea");
};

const focusTextarea = () => {
  nextTick(() => getTextarea()?.focus());
};

const resetTextareaHeight = () => {
  nextTick(() => {
    const el = getTextarea();

    if (!el) return;

    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  });
};

const {
  message,
  isSending,
  error,
  charactersRemaining,
  showCharacterCount,
  isNearLimit,
  isAtLimit,
  canSend,
  sendMessage,
  handleKeyDown,
  maxLength,
  fileUpload,
} = useMessageInput(focusTextarea);

const { isRewriting, aiError, handleRewrite } = useAiRewrite(message);
const { isDark } = useTheme();
const messageCompose = useMessageCompose();

const replyPreviewText = computed(() => {
  const ctx = messageCompose.replyContext;

  if (!ctx) return "";

  const count = ctx.attachmentCount ?? 0;

  if (count > 0) {
    const noun = count === 1 ? "вложение" : count < 5 ? "вложения" : "вложений";

    return ctx.text ? `${count} ${noun} · ${ctx.text}` : `${count} ${noun}`;
  }

  return ctx.text;
});

watchDebounced(
  message,
  (val, prevVal) => {
    if (val.length < prevVal.length) resetTextareaHeight();
  },
  { debounce: 150 },
);

const isEmojiOpen = ref(false);
const isFocused = ref(false);
const showAiButton = computed(
  () =>
    !!message.value.trim() && !isSending && message.value.trim().length > 30,
);
const pickerRef = ref<HTMLElement | null>(null);
const pickerKey = ref(0);
const savedCursorPos = ref<number | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const dragCounter = ref(0);
const fileErrors = ref<string[]>([]);

type Emoji = { i: string };

const saveCursorPos = () => {
  const el = getTextarea();

  if (el) savedCursorPos.value = el.selectionStart;
};

const onSelectEmoji = async (emoji: Emoji) => {
  const el = getTextarea();

  if (!el) return;

  const insertAt = savedCursorPos.value ?? message.value.length;

  message.value =
    message.value.slice(0, insertAt) + emoji.i + message.value.slice(insertAt);

  const newPos = insertAt + emoji.i.length;

  savedCursorPos.value = newPos;

  await nextTick();

  el.focus();
  el.setSelectionRange(newPos, newPos);
};

const toggleEmoji = () => {
  saveCursorPos();

  isEmojiOpen.value = !isEmojiOpen.value;
};

onClickOutside(pickerRef, () => {
  isEmojiOpen.value = false;
});

watch(isDark, () => {
  if (isEmojiOpen.value) pickerKey.value++;
});

const showFileErrors = (errors: string[]) => {
  fileErrors.value = errors;

  setTimeout(() => {
    fileErrors.value = [];
  }, 4000);
};

function openFilePicker() {
  fileInputRef.value?.click();
}

function onFileInputChange(event: Event) {
  const input = event.target as HTMLInputElement;

  if (!input.files) return;

  const errors = fileUpload.addFiles(Array.from(input.files));

  if (errors.length) showFileErrors(errors);

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

  const errors = fileUpload.addFiles(files);

  if (errors.length) showFileErrors(errors);
}

function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "pi-image";
  if (mimeType.startsWith("video/")) return "pi-video";
  if (mimeType.startsWith("audio/")) return "pi-volume-up";

  return "pi-file";
}

const canAddMore = computed(
  () => fileUpload.pendingFiles.value.length < MAX_FILES_PER_MESSAGE,
);

const onGlobalKeyDown = (e: KeyboardEvent) => {
  const ta = getTextarea();

  if (!ta) return;
  if (document.activeElement === ta) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key.length !== 1) return;

  const tag = (document.activeElement as HTMLElement)?.tagName;

  if (tag === "INPUT" || tag === "TEXTAREA") return;
  if ((document.activeElement as HTMLElement)?.isContentEditable) return;

  ta.focus();
};

onMounted(() => window.addEventListener("keydown", onGlobalKeyDown));
onUnmounted(() => window.removeEventListener("keydown", onGlobalKeyDown));
</script>

<template>
  <div
    class="sticky bottom-0 z-10 transition-all duration-200"
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
        class="absolute inset-0 z-20 rounded-2xl border-2 border-dashed border-(--p-primary-color) bg-(--p-primary-color)/10 backdrop-blur-sm flex flex-col items-center justify-center gap-2 pointer-events-none"
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
      <div v-if="fileErrors.length" class="mb-2 flex flex-col gap-1">
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
      <Message
        v-if="error || aiError"
        :closable="false"
        severity="error"
        class="mb-3"
      >
        {{ error || aiError }}
      </Message>
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
        v-if="messageCompose.replyContext"
        class="flex items-center gap-2 px-3 py-2 mb-2 rounded-xl bg-(--p-primary-color)/10 border-l-4 border-(--p-primary-color)"
      >
        <div class="flex-1 min-w-0">
          <div class="text-xs font-semibold text-(--p-primary-color) truncate">
            {{ messageCompose.replyContext.senderName }}
          </div>
          <div class="text-xs opacity-60 truncate">
            {{ replyPreviewText }}
          </div>
        </div>
        <Button
          text
          rounded
          icon="pi pi-times"
          class="w-7! h-7! shrink-0"
          severity="secondary"
          @click="messageCompose.clearReply()"
          aria-label="Отменить ответ"
        />
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
        v-if="fileUpload.pendingFiles.value.length"
        class="mb-2 p-2 rounded-xl bg-(--p-primary-color)/20 flex overflow-x-auto items-center gap-2"
      >
        <div
          v-for="pf in fileUpload.pendingFiles.value"
          :key="pf.id"
          class="relative flex flex-col items-center gap-1 group"
        >
          <div
            v-if="pf.previewUrl"
            class="w-22! h-26! rounded-lg overflow-hidden relative group/img"
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
              @click="fileUpload.retryFile(pf.id)"
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
              @click.stop="fileUpload.removeFile(pf.id)"
              aria-label="Удалить файл"
            />
          </div>

          <div
            v-else
            class="flex h-26! w-22! rounded-lg flex-col items-center justify-center gap-1 relative overflow-hidden"
          >
            <i :class="['pi', getFileIcon(pf.file.type), 'text-xl']" />
            <div class="flex justify-between self-start text-xs">
              <span class="line-clamp-2 text-center">{{ pf.file.name }}</span>
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
              @click="fileUpload.retryFile(pf.id)"
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
              @click="fileUpload.removeFile(pf.id)"
              aria-label="Удалить файл"
            />
          </div>
        </div>

        <button
          v-if="canAddMore"
          type="button"
          class="flex-none w-22 h-22 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 text-surface-400 hover:border-(--p-primary-color) hover:text-(--p-primary-color) transition-colors cursor-pointer"
          @click="openFilePicker"
        >
          <i class="pi pi-plus text-lg" />
          <span class="text-[10px]">Ещё</span>
        </button>
      </div>
    </Transition>

    <div class="flex gap-2">
      <Transition
        enter-active-class="transition-all duration-350 ease-out"
        enter-from-class="opacity-0 translate-y-2 scale-75"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition-all duration-350 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0 translate-y-2 scale-75"
      >
        <div
          ref="pickerRef"
          v-if="isEmojiOpen"
          class="absolute bottom-full lg:left-0 md:opacity-75 md:hover:opacity-100 z-10000! transition-opacity"
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
      <div
        class="flex-1 relative overflow-hidden! flex flex-col rounded-sm border transition-all duration-200"
        :class="
          isFocused
            ? 'border-(--p-textarea-focus-border-color)'
            : 'border-(--p-textarea-border-color) hover:border-(--p-textarea-hover-border-color)'
        "
      >
        <div
          class="flex items-center w-full bg-(--p-textarea-background) border-b dark:border-gray-50/10 border-(--p-textarea-border-color) transition-colors duration-200"
          :class="
            isFocused
              ? 'border-(--p-textarea-focus-border-color)'
              : 'border-(--p-textarea-border-color)'
          "
        >
          <Button
            type="button"
            icon="pi pi-paperclip"
            class="w-8! h-8!"
            rounded
            text
            :disabled="!canAddMore || isSending"
            @click="openFilePicker"
            aria-label="Прикрепить файл"
            v-tooltip.top="
              canAddMore
                ? 'Прикрепить файл'
                : `Максимум ${MAX_FILES_PER_MESSAGE} файлов`
            "
          />

          <Button
            type="button"
            icon="pi pi-face-smile"
            class="w-8! h-8!"
            rounded
            text
            @mousedown.prevent="toggleEmoji"
            aria-label="Открыть смайлы"
            v-tooltip.top="'Открыть смайлы'"
          />

          <Button
            type="button"
            :loading="isRewriting"
            @click="handleRewrite"
            icon="pi pi-sparkles"
            class="w-8! h-8! transition-opacity! duration-200"
            :class="
              showAiButton ? 'opacity-100' : 'opacity-0 pointer-events-none'
            "
            rounded
            text
            severity="help"
            aria-label="Переписать в корпоративном стиле"
            v-tooltip.top="'Переписать в корпоративном стиле'"
          />
          <Transition
            enter-active-class="transition-opacity duration-200"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-150"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div
              v-if="showCharacterCount"
              class="text-xs px-2 py-1 ml-auto mr-2 rounded-xl backdrop-blur-sm"
              :class="{
                'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold':
                  isAtLimit,
                'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400':
                  isNearLimit && !isAtLimit,
                'dark:bg-white/10 bg-black/10': !isNearLimit,
              }"
            >
              {{ charactersRemaining }}
            </div>
          </Transition>
        </div>

        <div class="relative flex-1">
          <Textarea
            ref="textareaRef"
            id="chat-textarea"
            name="chat-textarea"
            v-model="message"
            :maxlength="maxLength"
            :auto-resize="true"
            :disabled="isSending || isRewriting"
            @keydown="handleKeyDown"
            @keyup="saveCursorPos"
            @click="saveCursorPos"
            @focus="isFocused = true"
            @blur="
              isFocused = false;
              saveCursorPos();
            "
            class="block w-full md:text-lg! text-sm! md:max-h-80 max-h-50 p-2! pt-1! border-none! shadow-none! rounded-none! outline-none!"
            placeholder="Напишите сообщение..."
            rows="1"
            fluid
          />
        </div>
      </div>

      <Button
        type="button"
        :disabled="!canSend"
        :loading="isSending"
        @click="sendMessage"
        icon="pi pi-send"
        size="large"
        :aria-label="isSending ? 'Отправка...' : 'Отправить сообщение'"
      />
    </div>

    <input
      ref="fileInputRef"
      type="file"
      multiple
      class="hidden"
      accept="*/*"
      @change="onFileInputChange"
    />
  </div>
</template>
