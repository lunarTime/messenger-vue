<script setup lang="ts">
import { computed, ref } from "vue";
import type { Message } from "@/shared/types/message";
import ChatBubble from "@/shared/ui/ChatBubble.vue";
import MessageActionsMenu from "@/features/message-actions/ui/MessageActionsMenu.vue";
import { useMessageStore } from "@/entities/message/store/message.store";
import { useIntersectionObserver } from "@/shared/composables/useIntersectionObserver";

const props = defineProps<{
  message: Message;
  currentUserId: string;
}>();

const emit = defineEmits<{
  edit: [messageId: string];
  deleteForMe: [messageId: string];
  deleteForAll: [messageId: string];
}>();

const messageStore = useMessageStore();
const messageRef = ref<HTMLElement | null>(null);

const isOutgoing = computed(
  () => props.message.senderId === props.currentUserId,
);
const bubbleClasses = computed(() =>
  isOutgoing.value ? "self-end" : "self-start",
);

const deliveryStatus = computed(() => {
  if (!isOutgoing.value) return undefined;
  return messageStore.messageStatuses.get(props.message.id);
});

useIntersectionObserver(messageRef, () => {
  if (!isOutgoing.value && !props.message.isDeleted) {
    messageStore.markMessageAsRead(props.message.id);
  }
});
</script>

<template>
  <div
    ref="messageRef"
    class="flex gap-2 group relative w-fit"
    :class="bubbleClasses"
  >
    <MessageActionsMenu
      v-if="!isOutgoing"
      :is-outgoing="false"
      :is-deleted="message.isDeleted"
      @delete-for-me="emit('deleteForMe', message.id)"
      class="order-last"
    />

    <MessageActionsMenu
      v-else="isOutgoing"
      :is-outgoing="true"
      :is-deleted="message.isDeleted"
      @edit="emit('edit', message.id)"
      @delete-for-me="emit('deleteForMe', message.id)"
      @delete-for-all="emit('deleteForAll', message.id)"
      class="order-first"
    />

    <ChatBubble
      :text="message.text"
      :variant="isOutgoing ? 'outgoing' : 'incoming'"
      :created-at="message.createdAt"
      :edited="message.isEdited"
      :deleted="message.isDeleted"
      :delivery-status="deliveryStatus"
    />
  </div>
</template>
