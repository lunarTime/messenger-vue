<script setup lang="ts">
import { computed } from "vue";
import { formatTime } from "@/shared/utils/formatTime";
import { PencilIcon } from "@heroicons/vue/24/solid";
import type { MessageAttachment } from "@/shared/types/message";
import type { Timestamp } from "firebase/firestore";
import MessageAttachments from "@/shared/ui/MessageAttachments.vue";

const props = defineProps<{
  text: string;
  variant: "incoming" | "outgoing";
  deleted?: boolean;
  createdAt: Timestamp | null;
  edited?: boolean;
  deliveryStatus?: "sent" | "read";
  senderName?: string;
  replyToText?: string;
  replyToSenderName?: string;
  forwardedFrom?: string;
  attachments?: MessageAttachment[];
  onReplyClick?: () => void;
}>();

const isOutgoing = computed(() => props.variant === "outgoing");

const bubbleClasses = computed(() => [
  "md:px-3 px-2 pb-1 pt-3 md:max-w-140 max-w-[85%] rounded-2xl shadow-sm",
  isOutgoing.value
    ? "bg-(--p-primary-color)/70 rounded-br-sm"
    : "bg-(--p-primary-color)/20 rounded-bl-sm",
]);

const replyBarClasses = computed(() => [
  "rounded-lg px-2 py-1 mb-1 border-l-2 cursor-default",
  isOutgoing.value
    ? "border-white/60 bg-white/10"
    : "border-(--p-primary-color) bg-(--p-primary-color)/10",
]);

const timeDisplay = computed(() => {
  if (!props.createdAt) return "";
  return formatTime(props.createdAt);
});

const showDeliveryStatus = computed(() => isOutgoing.value && !props.deleted);

const deliveryIcon = computed<"read" | "sent" | null>(() => {
  if (!showDeliveryStatus.value) return null;
  return props.deliveryStatus === "read" ? "read" : "sent";
});
</script>

<template>
  <div :class="bubbleClasses">
    <template v-if="!deleted">
      <div
        class="flex flex-col gap-0.5 whitespace-pre-wrap min-w-0 md:select-auto select-none"
      >
        <div
          v-if="senderName && !isOutgoing"
          class="text-xs font-bold text-(--p-primary-color) mb-0.5"
        >
          {{ senderName }}
        </div>

        <div
          v-if="forwardedFrom"
          class="flex items-center gap-1 mb-1 text-white/70"
        >
          <i class="pi pi-share-alt text-xs!" />
          <span class="text-xs">
            Переслано от
            <span class="font-semibold">
              {{ forwardedFrom }}
            </span>
          </span>
        </div>

        <div
          v-if="replyToText"
          :class="[
            replyBarClasses,
            onReplyClick
              ? 'cursor-pointer hover:opacity-80 transition-opacity'
              : 'cursor-default',
          ]"
          @click.stop="onReplyClick?.()"
        >
          <div
            v-if="replyToSenderName"
            class="text-xs font-semibold truncate"
            :class="isOutgoing ? 'text-white/80' : 'text-(--p-primary-color)'"
          >
            {{ replyToSenderName }}
          </div>
          <div class="text-xs truncate opacity-70 max-w-[200px]">
            {{ replyToText }}
          </div>
        </div>

        <MessageAttachments
          v-if="attachments && attachments.length"
          :attachments="attachments"
          :is-outgoing="isOutgoing"
          class="mb-1"
        />

        <div
          v-if="text"
          class="chat-bubble-text md:text-base text-sm w-full hyphens-auto wrap-anywhere"
        >
          {{ text }}
        </div>

        <div class="flex items-center justify-end gap-1 text-xs opacity-70">
          <PencilIcon v-if="edited" class="size-2.5" title="Отредактировано" />

          <span v-if="timeDisplay" class="md:text-[0.7rem] text-[0.6rem]">
            {{ timeDisplay }}
          </span>

          <div v-if="deliveryIcon" class="flex items-center">
            <div
              v-if="deliveryIcon === 'read'"
              class="flex space-x-[-4px]"
              title="Прочитано"
            >
              <i class="pi pi-check text-[0.5rem]!" />
              <i class="pi pi-check text-[0.5rem]!" />
            </div>

            <i
              v-else
              class="pi pi-check opacity-70 text-[0.5rem]!"
              title="Отправлено"
            />
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="flex flex-col gap-1">
        <span class="md:text-base text-sm italic opacity-60">
          Сообщение удалено
        </span>

        <span v-if="timeDisplay" class="text-[0.7rem] opacity-70 text-right">
          {{ timeDisplay }}
        </span>
      </div>
    </template>
  </div>
</template>
