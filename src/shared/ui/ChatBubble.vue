<script setup lang="ts">
import { computed } from "vue";
import { formatTime } from "@/shared/utils/formatTime";
import { PencilIcon, CheckIcon, XCircleIcon } from "@heroicons/vue/24/solid";
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
}>();

const isOutgoing = computed(() => props.variant === "outgoing");

const bubbleClasses = computed(() => [
  "lg:max-w-140 max-w-full w-fit px-3 py-1 rounded-2xl shadow-sm",
  isOutgoing.value
    ? "bg-(--p-primary-color)/70 rounded-br-sm"
    : "bg-(--p-primary-color)/20 rounded-bl-sm",
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
      <div class="flex flex-col gap-0.5">
        <div
          v-if="senderName && !isOutgoing"
          class="text-xs font-bold text-(--p-primary-color) mb-0.5"
        >
          {{ senderName }}
        </div>
        <div class="text-sm md:text-base wrap-break-word">
          {{ text }}
        </div>

        <div class="flex items-center justify-end gap-1 text-xs opacity-70">
          <PencilIcon v-if="edited" class="size-2.5" title="Отредактировано" />

          <span v-if="timeDisplay" class="text-[0.7rem]">
            {{ timeDisplay }}
          </span>

          <div v-if="deliveryIcon" class="flex items-center">
            <XCircleIcon
              v-if="deliveryIcon === 'failed'"
              class="size-4 text-red-500"
              title="Не отправлено"
            />

            <div
              v-else-if="deliveryIcon === 'read'"
              class="flex -space-x-2"
              title="Прочитано"
            >
              <CheckIcon class="size-3" />
              <CheckIcon class="size-3" />
            </div>

            <div
              v-else-if="deliveryIcon === 'delivered'"
              class="flex -space-x-2"
              title="Доставлено"
            >
              <CheckIcon class="size-3" />
              <CheckIcon class="size-3" />
            </div>

            <CheckIcon v-else class="size-3" title="Отправлено" />
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
