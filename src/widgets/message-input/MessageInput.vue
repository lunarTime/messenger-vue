<script setup lang="ts">
import { ref, nextTick, defineAsyncComponent, watch } from "vue";
import { onClickOutside } from "@vueuse/core";
import { useMessageInput } from "@/features/send-message/model/useMessageInput";
import { useAiRewrite } from "@/features/ai-rewrite/model/useAiRewrite";
import { useTheme } from "@/shared/composables/useTheme";
import { useIsMobile } from "@/shared/composables/useIsMobile";
import { useMessageCompose } from "@/shared/composables/useMessageCompose";
import Button from "primevue/button";
import Textarea from "primevue/textarea";
import Message from "primevue/message";
import "vue3-emoji-picker/css";

const EmojiPicker = defineAsyncComponent(() => import("vue3-emoji-picker"));

const {
  message,
  isSending,
  error,
  charactersRemaining,
  showCharacterCount,
  isNearLimit,
  isAtLimit,
  sendMessage,
  handleKeyDown,
  maxLength,
} = useMessageInput();
const { isMobile } = useIsMobile();

const { isRewriting, aiError, handleRewrite } = useAiRewrite(message);
const { isDark } = useTheme();
const messageCompose = useMessageCompose();

const textareaRef = ref<any>(null);
const isEmojiOpen = ref(false);
const pickerRef = ref<HTMLElement | null>(null);
const pickerKey = ref(0);
const savedCursorPos = ref<number | null>(null);

type Emoji = { i: string };

const getTextarea = (): HTMLTextAreaElement | null => {
  const el = textareaRef.value?.$el;

  if (!el) return null;

  return el.tagName === "TEXTAREA" ? el : el.querySelector("textarea");
};

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
</script>

<template>
  <div class="sticky bottom-0 z-10">
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
            {{ messageCompose.replyContext.text }}
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

    <div class="flex gap-2">
      <div class="flex-1 relative">
        <Textarea
          ref="textareaRef"
          v-model="message"
          :maxlength="maxLength"
          :auto-resize="true"
          :disabled="isSending || isRewriting"
          @keydown="handleKeyDown"
          @keyup="saveCursorPos"
          @click="saveCursorPos"
          @blur="saveCursorPos"
          class="block w-full md:text-sm! text-xs! md:max-h-80 max-h-30 pr-15!"
          placeholder="Напишите сообщение..."
          :rows="isMobile ? '3' : '4'"
          fluid
        />

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
            v-if="isEmojiOpen"
            class="absolute bottom-16 lg:right-0 -right-10 z-2"
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
              v-if="message.trim() && !isSending"
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
          enter-active-class="transition-opacity duration-200"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-150"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="showCharacterCount"
            class="absolute! bottom-2 right-2 text-xs px-2 py-1 rounded-md backdrop-blur-sm"
            :class="{
              'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold':
                isAtLimit,
              'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400':
                isNearLimit && !isAtLimit,
              'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400':
                !isNearLimit,
            }"
          >
            {{ charactersRemaining }}
          </div>
        </Transition>
      </div>

      <Button
        type="button"
        :disabled="!message.trim() || isSending"
        :loading="isSending"
        @click="sendMessage"
        icon="pi pi-send"
        size="large"
        :aria-label="isSending ? 'Отправка...' : 'Отправить сообщение'"
      />
    </div>
  </div>
</template>
