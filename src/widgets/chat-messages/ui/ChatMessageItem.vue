<script setup lang="ts">
import { computed, ref, inject, type Ref } from "vue";
import type { Message } from "@/shared/types/message";
import ChatBubble from "@/shared/ui/ChatBubble.vue";
import MessageActionsMenu from "@/features/message-actions/ui/MessageActionsMenu.vue";
import { useMessageStore } from "@/entities/message/store/message.store";
import { useIntersectionObserver } from "@/shared/composables/useIntersectionObserver";
import { useChatStore } from "@/entities/chat/store/chat.store";
import { useSwipeMessage } from "@/shared/composables/useSwipeMessage";
import { useLongPress } from "@/shared/composables/useLongPress";
import { useMessageSelection } from "@/features/message-actions/model/useMessageSelection";

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
  reply: [messageId: string];
  forward: [messageId: string];
  select: [messageId: string];
}>();

const messageStore = useMessageStore();
const chatStore = useChatStore();
const selection = useMessageSelection();
const messageRef = ref<HTMLElement | null>(null);
const scrollContainer = inject<Ref<HTMLElement | null>>("chatScrollContainer");

const isOutgoing = computed(
  () => props.message.senderId === props.currentUserId,
);

const isSelected = computed(() => selection.isSelected(props.message.id));

const sender = computed(() => {
  if (isOutgoing.value) return null;

  return chatStore.chatParticipants.get(props.message.senderId) || null;
});

const deliveryStatus = computed(() => {
  if (!isOutgoing.value) return undefined;

  return messageStore.messageStatuses.get(props.message.id);
});

const replyToMessage = computed(() => {
  if (!props.message.replyToMessageId) return null;

  return (
    messageStore.messages.find(
      (m) => m.id === props.message.replyToMessageId,
    ) || null
  );
});

const replyToSenderName = computed(() => {
  if (!replyToMessage.value) return null;

  if (replyToMessage.value.senderId === props.currentUserId) return "Вы";

  const participant = chatStore.chatParticipants.get(
    replyToMessage.value.senderId,
  );

  return participant?.displayName || "Пользователь";
});

const {
  swipeOffset,
  isSwiping,
  onTouchStart: swipeTouchStart,
  onTouchMove: swipeTouchMove,
  onTouchEnd: swipeTouchEnd,
} = useSwipeMessage({
  direction: isOutgoing.value ? "left" : "right",
  onSwipe: () => {
    if (!props.message.isDeleted && !selection.isActive) {
      emit("reply", props.message.id);
    }
  },
});

const {
  onTouchStart: lpTouchStart,
  onTouchMove: lpTouchMove,
  onTouchEnd: lpTouchEnd,
} = useLongPress({
  onLongPress: () => {
    if (!isSwiping.value && !props.message.isDeleted) {
      if (selection.isActive) {
        selection.toggle(props.message.id);
      } else {
        selection.enter(props.message.id);
      }
    }
  },
});

const onTouchStart = (e: TouchEvent) => {
  swipeTouchStart(e);
  lpTouchStart(e);
};

const onTouchMove = (e: TouchEvent) => {
  swipeTouchMove(e);
  lpTouchMove(e);
};

const onTouchEnd = (e: TouchEvent) => {
  swipeTouchEnd(e);
  lpTouchEnd();
};

const handleClick = () => {
  if (selection.isActive && !props.message.isDeleted) {
    selection.toggle(props.message.id);
  }
};

const handleDblClick = () => {
  if (!props.message.isDeleted) {
    if (selection.isActive) {
      selection.toggle(props.message.id);
    } else {
      selection.enter(props.message.id);
    }
  }
};

useIntersectionObserver(
  messageRef,
  () => {
    if (!isOutgoing.value && !props.message.isDeleted) {
      messageStore.markMessageAsRead(props.message.id);
    }
  },
  scrollContainer,
  { threshold: 0.5 },
);
</script>

<template>
  <div
    ref="messageRef"
    :data-message-id="message.id"
    class="flex gap-2 group relative w-full rounded-md overflow-hidden transition-colors duration-150"
    :class="[
      isOutgoing ? 'self-end flex-row-reverse' : 'self-start flex-row',
      isSelected ? 'bg-(--p-primary-color)/20' : '',
      selection.isActive && !props.message.isDeleted ? 'cursor-pointer' : '',
    ]"
    @touchstart="onTouchStart"
    @touchmove.passive="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="lpTouchEnd"
    @click="handleClick"
    @dblclick="handleDblClick"
  >
    <div
      class="flex gap-2 items-start w-full min-w-0 transition-transform"
      :class="[
        isOutgoing ? 'flex-row-reverse' : 'flex-row',
        isSwiping ? 'duration-0' : 'duration-200 ease-out',
      ]"
      :style="
        isSwiping && !selection.isActive
          ? { transform: `translateX(${swipeOffset}px)` }
          : {}
      "
    >
      <div
        v-if="selection.isActive"
        class="flex items-center self-center shrink-0 mr-1"
        :class="isOutgoing ? 'order-last ml-1 mr-0' : ''"
      >
        <div
          v-if="!props.message.isDeleted"
          class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-150"
          :class="
            isSelected
              ? 'bg-(--p-primary-color) border-(--p-primary-color)'
              : 'border-surface-400 dark:border-surface-500'
          "
        >
          <i v-if="isSelected" class="pi pi-check text-white text-[10px]" />
        </div>
      </div>

      <ChatBubble
        :text="message.text"
        :variant="isOutgoing ? 'outgoing' : 'incoming'"
        :created-at="message.createdAt"
        :edited="message.isEdited"
        :deleted="message.isDeleted"
        :delivery-status="deliveryStatus"
        :sender-name="showSenderName ? sender?.displayName : undefined"
        :reply-to-text="
          replyToMessage?.isDeleted ? 'Сообщение удалено' : replyToMessage?.text
        "
        :reply-to-sender-name="replyToSenderName ?? undefined"
        :forwarded-from="message.forwardedFrom"
        :attachments="message.attachments"
      />

      <MessageActionsMenu
        v-if="!isOutgoing && !selection.isActive"
        ref="actionsMenuRef"
        :is-outgoing="false"
        :is-deleted="message.isDeleted"
        :is-forwarded="!!message.forwardedFrom"
        @reply="emit('reply', message.id)"
        @forward="emit('forward', message.id)"
        @delete-for-me="emit('deleteForMe', message.id)"
        @select="selection.enter(message.id)"
        class="opacity-0 group-hover:opacity-100 transition-opacity"
      />

      <MessageActionsMenu
        v-else-if="!selection.isActive"
        ref="actionsMenuRef"
        :is-outgoing="true"
        :is-deleted="message.isDeleted"
        :is-forwarded="!!message.forwardedFrom"
        @reply="emit('reply', message.id)"
        @forward="emit('forward', message.id)"
        @edit="emit('edit', message.id)"
        @delete-for-me="emit('deleteForMe', message.id)"
        @delete-for-all="emit('deleteForAll', message.id)"
        @select="selection.enter(message.id)"
        class="opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>

    <div
      class="absolute top-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-150"
      :class="[
        isOutgoing ? 'left-2' : 'right-2',
        isSwiping && !message.isDeleted && !selection.isActive
          ? 'opacity-60'
          : 'opacity-0',
      ]"
    >
      <i class="pi pi-reply text-surface-400 dark:text-surface-500 text-sm" />
    </div>
  </div>
</template>
