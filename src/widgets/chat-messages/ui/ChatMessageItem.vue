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
}>();

const messageStore = useMessageStore();
const chatStore = useChatStore();
const messageRef = ref<HTMLElement | null>(null);
const actionsMenuRef = ref<InstanceType<typeof MessageActionsMenu> | null>(
  null,
);
const scrollContainer = inject<Ref<HTMLElement | null>>("chatScrollContainer");
const registerOpenMenu = inject<(hide: () => void) => void>("registerOpenMenu");

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
  onSwipeLeft: () => {
    if (!props.message.isDeleted) {
      emit("reply", props.message.id);
    }
  },
});

const {
  onTouchStart: lpTouchStart,
  onTouchMove: lpTouchMove,
  onTouchEnd: lpTouchEnd,
} = useLongPress({
  onLongPress: (pageX: number, pageY: number) => {
    if (!isSwiping.value) {
      registerOpenMenu?.(actionsMenuRef.value!.hide);
      actionsMenuRef.value?.showAt(pageX, pageY);
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
    class="flex gap-2 group relative w-full overflow-hidden"
    :class="isOutgoing ? 'self-end flex-row-reverse' : 'self-start flex-row'"
    @touchstart="onTouchStart"
    @touchmove.passive="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="lpTouchEnd"
  >
    <div
      class="flex gap-2 items-start lg:max-w-[80%] max-w-[90%] min-w-0 transition-transform"
      :class="[
        isOutgoing ? 'flex-row-reverse' : 'flex-row',
        isSwiping ? 'duration-0' : 'duration-200 ease-out',
      ]"
      :style="isSwiping ? { transform: `translateX(${swipeOffset}px)` } : {}"
    >
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
      />

      <MessageActionsMenu
        v-if="!isOutgoing"
        ref="actionsMenuRef"
        :is-outgoing="false"
        :is-deleted="message.isDeleted"
        @reply="emit('reply', message.id)"
        @forward="emit('forward', message.id)"
        @delete-for-me="emit('deleteForMe', message.id)"
        class="opacity-0 group-hover:opacity-100 transition-opacity"
      />

      <MessageActionsMenu
        v-else
        ref="actionsMenuRef"
        :is-outgoing="true"
        :is-deleted="message.isDeleted"
        @reply="emit('reply', message.id)"
        @forward="emit('forward', message.id)"
        @edit="emit('edit', message.id)"
        @delete-for-me="emit('deleteForMe', message.id)"
        @delete-for-all="emit('deleteForAll', message.id)"
        class="opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>

    <div
      class="absolute top-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-150"
      :class="[
        isOutgoing ? 'left-2' : 'right-2',
        isSwiping && !message.isDeleted ? 'opacity-60' : 'opacity-0',
      ]"
    >
      <i class="pi pi-reply text-surface-400 dark:text-surface-500 text-sm" />
    </div>
  </div>
</template>
