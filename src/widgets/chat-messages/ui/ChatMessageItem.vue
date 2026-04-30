<script setup lang="ts">
import { computed, ref } from "vue";
import type { Message } from "@/shared/types/message";
import ChatBubble from "@/shared/ui/ChatBubble.vue";
import MessageActionsMenu from "@/features/message-actions/ui/MessageActionsMenu.vue";
import { useMessageStore } from "@/entities/message/store/message.store";
import { useIntersectionObserver } from "@/shared/composables/useIntersectionObserver";
import { useChatStore } from "@/entities/chat/store/chat.store";

const props = defineProps<{
  message: Message;
  currentUserId: string;
  isGroup?: boolean;
  showSenderName?: boolean;
}>();

const emit = defineEmits<{
  edit: [messageId: string];
  deleteForMe: [messageId: string];
  deleteForAll: [messageId: string];
}>();

const messageStore = useMessageStore();
const chatStore = useChatStore();
const messageRef = ref<HTMLElement | null>(null);

const isOutgoing = computed(
  () => props.message.senderId === props.currentUserId,
);

const sender = computed(() => {
  if (isOutgoing.value) return null;
  return chatStore.chatParticipants.get(props.message.senderId) || null;
});

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
    :class="isOutgoing ? 'self-end flex-row-reverse' : 'self-start flex-row'"
  >
    <div
      class="flex gap-2 items-start"
      :class="isOutgoing ? 'flex-row-reverse' : 'flex-row'"
    >
      <ChatBubble
        :text="message.text"
        :variant="isOutgoing ? 'outgoing' : 'incoming'"
        :created-at="message.createdAt"
        :edited="message.isEdited"
        :deleted="message.isDeleted"
        :delivery-status="deliveryStatus"
        :sender-name="showSenderName ? sender?.displayName : undefined"
      />

      <MessageActionsMenu
        v-if="!isOutgoing"
        :is-outgoing="false"
        :is-deleted="message.isDeleted"
        @delete-for-me="emit('deleteForMe', message.id)"
        class="opacity-0 group-hover:opacity-100 transition-opacity"
      />

      <MessageActionsMenu
        v-else
        :is-outgoing="true"
        :is-deleted="message.isDeleted"
        @edit="emit('edit', message.id)"
        @delete-for-me="emit('deleteForMe', message.id)"
        @delete-for-all="emit('deleteForAll', message.id)"
        class="opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  </div>
</template>
