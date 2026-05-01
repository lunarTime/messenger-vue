<script setup lang="ts">
import { useMessageInput } from "@/features/send-message/model/useMessageInput";
import { useAiRewrite } from "@/features/ai-rewrite/model/useAiRewrite";
import Button from "primevue/button";
import Textarea from "primevue/textarea";
import Message from "primevue/message";

const {
  message,
  isSending,
  error,
  charactersRemaining,
  showCharacterCount,
  isNearLimit,
  isAtLimit,
  maxLength,
  sendMessage,
  handleKeyDown,
} = useMessageInput();

const { isRewriting, aiError, handleRewrite } = useAiRewrite(message);
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

    <div class="flex gap-2">
      <div class="flex-1 relative">
        <Textarea
          v-model="message"
          :maxlength="maxLength"
          :auto-resize="true"
          :disabled="isSending || isRewriting"
          @keydown="handleKeyDown"
          class="block w-full max-h-80 pr-12!"
          placeholder="Напишите сообщение..."
          rows="3"
          fluid
        />

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
            class="absolute! top-2 right-2 w-8! h-8!"
            rounded
            text
            severity="help"
            v-tooltip.top="'Переписать в корпоративном стиле'"
          />
        </Transition>

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
