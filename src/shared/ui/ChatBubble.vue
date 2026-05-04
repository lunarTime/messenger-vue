<script setup lang="ts">
import { computed } from "vue";
import { formatTime } from "@/shared/utils/formatTime";
import { PencilIcon, XCircleIcon } from "@heroicons/vue/24/solid";
import type { MessageStatus } from "@/shared/types/message";
import type { Timestamp } from "firebase/firestore";

const props = defineProps<{
  text: string;
  variant: "incoming" | "outgoing";
  deleted?: boolean;
  createdAt: Timestamp | null;
  edited?: boolean;
  deliveryStatus?: MessageStatus;
  senderName?: string;
  replyToText?: string;
  replyToSenderName?: string;
  forwardedFrom?: string;
}>();

const isOutgoing = computed(() => props.variant === "outgoing");

const bubbleClasses = computed(() => [
  "max-w-full md:px-3 px-2 py-1 rounded-2xl shadow-sm",
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

const deliveryIcon = computed(() => {
  if (!showDeliveryStatus.value) return null;

  if (props.deliveryStatus === "failed") return "failed";
  if (props.deliveryStatus === "read") return "read";
  if (props.deliveryStatus === "delivered") return "delivered";
  return "sent";
});
</script>

<template>
  <div :class="bubbleClasses">
    <template v-if="!deleted">
      <div class="flex flex-col gap-0.5 wrap-break-word whitespace-pre-wrap">
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

        <div v-if="replyToText" :class="replyBarClasses">
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

        <div class="md:text-base text-sm w-full">
          {{ text }}
        </div>

        <div class="flex items-center justify-end gap-1 text-xs opacity-70">
          <PencilIcon v-if="edited" class="size-2.5" title="Отредактировано" />

          <span v-if="timeDisplay" class="md:text-[0.7rem] text-[0.6rem]">
            {{ timeDisplay }}
          </span>

          <div v-if="deliveryIcon" class="flex items-center">
            <XCircleIcon
              v-if="deliveryIcon === 'failed'"
              class="size-4 text-red-500"
              title="Не отправлено"
            />

            <div
              v-else-if="
                deliveryIcon === 'read' || deliveryIcon === 'delivered'
              "
              class="flex space-x-[-4px]"
              title="Прочитано"
            >
              <i class="pi pi-check opacity-70 text-[0.5rem]!" />
              <i class="pi pi-check opacity-70 text-[0.5rem]!" />
            </div>

            <i v-else class="pi pi-check opacity-70 text-[0.5rem]!" />
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
