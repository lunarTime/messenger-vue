<script setup lang="ts">
import { computed, ref, inject } from "vue";
import type { Message } from "@/shared/types/message";
import ChatBubble from "@/shared/ui/ChatBubble.vue";
import MessageActionsMenu from "@/features/message-actions/ui/MessageActionsMenu.vue";
import { useMessageStore } from "@/entities/message/store/message.store";
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
  copy: [messageId: string];
}>();

const messageStore = useMessageStore();
const chatStore = useChatStore();
const selection = useMessageSelection();
const messageRef = ref<HTMLElement | null>(null);
const scrollToMessage = inject<(id: string) => void>("scrollToMessage");
const actionsMenuRef = ref<InstanceType<typeof MessageActionsMenu> | null>(
  null,
);
const isContextMenuOpen = ref(false);
const registerOpenMenu = inject<(hide: () => void) => void>("registerOpenMenu");

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

const replyToDisplayText = computed(() => {
  const msg = replyToMessage.value;

  if (!msg) return undefined;
  if (msg.isDeleted) return "Сообщение удалено";

  const count = msg.attachments?.length ?? 0;

  if (count > 0 && msg.text) {
    const noun = count === 1 ? "вложение" : count < 5 ? "вложения" : "вложений";

    return `${count} ${noun} · ${msg.text}`;
  }

  if (count > 0) {
    const noun = count === 1 ? "вложение" : count < 5 ? "вложения" : "вложений";

    return `${count} ${noun}`;
  }

  return msg.text || undefined;
});

const handleReplyClick = () => {
  if (props.message.replyToMessageId) {
    scrollToMessage?.(props.message.replyToMessageId);
  }
};

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
        const rect = messageRef.value?.getBoundingClientRect();

        if (!rect) return;

        const spaceBelow = window.innerHeight - rect.bottom;
        const menuHeight = 280;
        const pageY =
          spaceBelow >= menuHeight
            ? rect.bottom + window.scrollY
            : rect.top + window.scrollY - menuHeight;

        actionsMenuRef.value?.showAt(rect.left + window.scrollX, pageY);
      }
    }
  },
});

const onTouchStart = (e: TouchEvent) => {
  if ((e.target as Element).closest("[data-message-gesture-ignore]")) return;

  swipeTouchStart(e);
  lpTouchStart(e);
};

const onTouchMove = (e: TouchEvent) => {
  if ((e.target as Element).closest("[data-message-gesture-ignore]")) return;

  swipeTouchMove(e);
  lpTouchMove(e);
};

const onTouchEnd = (e: TouchEvent) => {
  if ((e.target as Element).closest("[data-message-gesture-ignore]")) return;

  swipeTouchEnd(e);
  lpTouchEnd();
};

const onMenuOpen = () => {
  registerOpenMenu?.(() => {
    isContextMenuOpen.value = false;
    actionsMenuRef.value?.hide();
  });

  isContextMenuOpen.value = true;
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
              : 'border-black/20 dark:border-white/40'
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
        :reply-to-text="replyToDisplayText"
        :reply-to-sender-name="replyToSenderName ?? undefined"
        :on-reply-click="
          message.replyToMessageId ? handleReplyClick : undefined
        "
        :forwarded-from="message.forwardedFrom"
        :attachments="message.attachments"
        class="transition-all duration-200"
        :class="{ 'border-(--p-primary-color)! border-4': isContextMenuOpen }"
      />

      <MessageActionsMenu
        v-if="!isOutgoing && !selection.isActive"
        ref="actionsMenuRef"
        :is-outgoing="false"
        :is-deleted="message.isDeleted"
        :is-forwarded="!!message.forwardedFrom"
        :has-text="!!message.text"
        @reply="emit('reply', message.id)"
        @forward="emit('forward', message.id)"
        @delete-for-me="emit('deleteForMe', message.id)"
        @select="selection.enter(message.id)"
        @copy="emit('copy', message.id)"
        @menu-open="onMenuOpen"
        @menu-close="isContextMenuOpen = false"
      />

      <MessageActionsMenu
        v-else-if="!selection.isActive"
        ref="actionsMenuRef"
        :is-outgoing="true"
        :is-deleted="message.isDeleted"
        :is-forwarded="!!message.forwardedFrom"
        :has-text="!!message.text"
        @reply="emit('reply', message.id)"
        @forward="emit('forward', message.id)"
        @edit="emit('edit', message.id)"
        @delete-for-me="emit('deleteForMe', message.id)"
        @delete-for-all="emit('deleteForAll', message.id)"
        @select="selection.enter(message.id)"
        @copy="emit('copy', message.id)"
        @menu-open="onMenuOpen"
        @menu-close="isContextMenuOpen = false"
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
