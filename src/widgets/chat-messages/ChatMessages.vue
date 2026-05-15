<script setup lang="ts">
import {
  ref,
  watch,
  nextTick,
  onMounted,
  onUnmounted,
  computed,
  provide,
} from "vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useMessageStore } from "@/entities/message/store/message.store";
import { useChatStore } from "@/entities/chat/store/chat.store";
import { useUserStore } from "@/entities/user/store/user.store";
import { useMessageActions } from "@/features/message-actions/model/useMessageActions";
import { useMessageCompose } from "@/shared/composables/useMessageCompose";
import { useMessageSelection } from "@/features/message-actions/model/useMessageSelection";
import { useMessageGrouping } from "@/shared/composables/useMessageGrouping";
import { sanitizeText } from "@/shared/lib/sanitization/sanitizer";
import { VALIDATION_CONFIG } from "@/shared/config/validation.config";
import ChatMessageItem from "@/widgets/chat-messages/ui/ChatMessageItem.vue";
import SystemMessageItem from "@/widgets/chat-messages/ui/SystemMessageItem.vue";
import ForwardDialog from "@/features/message-actions/ui/ForwardDialog.vue";
import EditMessageDialog from "@/features/message-actions/ui/EditMessageDialog.vue";
import Skeleton from "primevue/skeleton";
import Button from "primevue/button";
import Avatar from "primevue/avatar";
import { getAvatarColor } from "@/shared/utils/avatarColors";
import { useMessageQueue } from "@/features/send-message/model/useMessageQueue";

const confirm = useConfirm();
const toast = useToast();
const messageStore = useMessageStore();
const chatStore = useChatStore();
const userStore = useUserStore();
const selection = useMessageSelection();
const messageQueue = useMessageQueue();

const { editMessage, deleteMessageForMe, deleteMessageForAll } =
  useMessageActions();

const messageCompose = useMessageCompose();

const handleReply = (messageId: string) => {
  const msg = messageStore.messages.find((m) => m.id === messageId);

  if (!msg) return;

  let senderName = "Вы";

  if (msg.senderId !== userStore.userId) {
    const participant = chatStore.chatParticipants.get(msg.senderId);

    senderName = participant?.displayName || "Пользователь";
  }

  messageCompose.setReply({
    messageId,
    senderName,
    text: msg.isDeleted ? "" : msg.text,
    attachmentCount: msg.attachments?.length || 0,
  });
};

const handleCopy = async (messageId: string) => {
  const msg = messageStore.messages.find((m) => m.id === messageId);

  if (!msg || !msg.text) return;

  await navigator.clipboard.writeText(msg.text);

  toast.add({
    severity: "success",
    summary: "Скопировано",
    life: 1500,
  });
};

const handleForward = (messageId: string) => {
  const msg = messageStore.messages.find((m) => m.id === messageId);

  if (!msg || msg.isDeleted) return;

  let senderName: string;

  if (msg.senderId === userStore.userId) {
    senderName = userStore.currentUser?.displayName || "Пользователь";
  } else {
    const participant = chatStore.chatParticipants.get(msg.senderId);

    senderName = participant?.displayName || "Пользователь";
  }

  messageCompose.setForward({ message: msg, senderName });
};

const skeletonPattern = [
  { id: 1, outgoing: false, width: "58%", height: "4rem" },
  { id: 2, outgoing: false, width: "40%", height: "3.5rem" },
  { id: 3, outgoing: true, width: "52%", height: "3.5rem" },
  { id: 4, outgoing: false, width: "70%", height: "6.5rem" },
  { id: 5, outgoing: true, width: "35%", height: "4rem" },
  { id: 6, outgoing: true, width: "60%", height: "3.5rem" },
  { id: 7, outgoing: false, width: "45%", height: "4.2rem" },
  { id: 8, outgoing: true, width: "48%", height: "5.5rem" },
  { id: 9, outgoing: false, width: "65%", height: "7rem" },
  { id: 10, outgoing: true, width: "30%", height: "3.5rem" },
];

const { groupedMessages } = useMessageGrouping(
  computed(() => messageStore.messages),
);

const containerRef = ref<HTMLElement | null>(null);
const messagesContentRef = ref<HTMLElement | null>(null);
const loadMoreSentinelRef = ref<HTMLElement | null>(null);

provide("chatScrollContainer", containerRef);

const scrollToMessage = (messageId: string) => {
  const el = containerRef.value?.querySelector(
    `[data-message-id="${messageId}"]`,
  );

  if (!el) return;

  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add("bg-(--p-primary-color)/30");

  setTimeout(() => el.classList.remove("bg-(--p-primary-color)/30"), 1500);
};

provide("scrollToMessage", scrollToMessage);

let closeCurrentMenu: (() => void) | null = null;

provide("registerOpenMenu", (hide: () => void) => {
  closeCurrentMenu?.();
  closeCurrentMenu = hide;
});

const isDragSelecting = ref(false);

let isTextSelection = false;
let dragStartMessageId: string | null = null;
let dragStartX = 0;
let dragStartY = 0;

const DRAG_THRESHOLD = 30;

const getMessageIdFromElement = (el: Element | null): string | null => {
  const item = el?.closest("[data-message-id]");
  return item?.getAttribute("data-message-id") ?? null;
};

const getMessageIdsBetween = (idA: string, idB: string): string[] => {
  const ids = messageStore.messages
    .filter((m) => m.type !== "system" && !m.isDeleted)
    .map((m) => m.id);
  const idxA = ids.indexOf(idA);
  const idxB = ids.indexOf(idB);

  if (idxA === -1 || idxB === -1) return [];

  const [from, to] = idxA < idxB ? [idxA, idxB] : [idxB, idxA];

  return ids.slice(from, to + 1);
};

const onMouseDown = (e: MouseEvent) => {
  if (e.button !== 0) return;

  isTextSelection = false;

  const target = e.target as Element;

  if (target.closest(".chat-bubble-text")) {
    isTextSelection = true;

    return;
  }

  const msgId = getMessageIdFromElement(target);

  if (!msgId) return;

  if (selection.isActive) return;

  const msg = messageStore.messages.find((m) => m.id === msgId);

  if (msg?.isDeleted) return;

  isDragSelecting.value = false;
  dragStartMessageId = msgId;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
};

const onMouseMove = (e: MouseEvent) => {
  if (isTextSelection) return;

  if (!dragStartMessageId || e.buttons !== 1) return;

  const dx = Math.abs(e.clientX - dragStartX);
  const dy = Math.abs(e.clientY - dragStartY);

  if (
    !isDragSelecting.value &&
    dx * dx + dy * dy < DRAG_THRESHOLD * DRAG_THRESHOLD
  )
    return;

  const msgId = getMessageIdFromElement(e.target as Element);

  if (!msgId) return;

  if (!isDragSelecting.value) {
    isDragSelecting.value = true;

    window.getSelection()?.removeAllRanges();
    selection.enter(dragStartMessageId);
  }

  if (isDragSelecting.value) {
    const range = getMessageIdsBetween(dragStartMessageId, msgId);

    selection.addRange(range);
  }
};

const onMouseUp = () => {
  isDragSelecting.value = false;
  isTextSelection = false;
  dragStartMessageId = null;
};

const isUserScrolling = ref(false);
const editDialogVisible = ref(false);
const editingMessageId = ref<string | null>(null);
const editingText = ref("");
const editingAttachments = ref<
  import("@/shared/types/message").MessageAttachment[]
>([]);
const hasMessages = computed(
  () => messageStore.messages.length > 0 || messageQueue.queue.length > 0,
);
const showContent = computed(
  () => !messageStore.isLoading && hasMessages.value,
);

const showEmptyState = computed(
  () => !messageStore.isLoading && !hasMessages.value,
);

const FAR_FROM_BOTTOM = 700;

const getDistanceFromBottom = (): number => {
  if (!containerRef.value) return 0;

  const { scrollTop, scrollHeight, clientHeight } = containerRef.value;

  return scrollHeight - scrollTop - clientHeight;
};

const scrollToBottom = () => {
  const el = containerRef.value;

  if (!el) return;

  el.scrollTop = el.scrollHeight;
  isUserScrolling.value = false;
};

let lastKnownDistanceFromBottom = 0;

const onContainerScroll = () => {
  lastKnownDistanceFromBottom = getDistanceFromBottom();
  isUserScrolling.value = lastKnownDistanceFromBottom > 50;
};

watch(containerRef, (el, oldEl) => {
  oldEl?.removeEventListener("scroll", onContainerScroll);
  el?.addEventListener("scroll", onContainerScroll);
});

let shouldScrollToBottom = false;
let resizeObserver: ResizeObserver | null = null;

const setupResizeObserver = (contentEl: HTMLElement) => {
  resizeObserver?.disconnect();

  let lastContentHeight = contentEl.offsetHeight;

  resizeObserver = new ResizeObserver(() => {
    const newHeight = contentEl.offsetHeight;
    const grew = newHeight > lastContentHeight;

    lastContentHeight = newHeight;

    if (!shouldScrollToBottom || !grew) return;

    shouldScrollToBottom = false;

    const el = containerRef.value;

    if (!el) return;

    el.scrollTop = el.scrollHeight;
  });

  resizeObserver.observe(contentEl);
};

watch(messagesContentRef, (el, oldEl) => {
  if (oldEl) resizeObserver?.disconnect();
  if (el) setupResizeObserver(el);
});

watch(
  () => {
    const msgs = messageStore.messages;

    return msgs.length > 0 ? msgs[msgs.length - 1]!.id : null;
  },
  (newLastId, oldLastId) => {
    if (!newLastId) return;
    if (messageStore.isLoadingOlderMessages) return;
    if (newLastId === oldLastId) return;

    const isInitialLoad = oldLastId === null;
    const shouldScroll =
      isInitialLoad || lastKnownDistanceFromBottom <= FAR_FROM_BOTTOM;

    if (shouldScroll) {
      shouldScrollToBottom = true;
    }
  },
);

watch(
  () => chatStore.activeChatId,
  (newChatId, oldChatId) => {
    if (!newChatId || newChatId === oldChatId) return;

    selection.exit();

    isUserScrolling.value = false;
    shouldScrollToBottom = true;
  },
  { immediate: true },
);

let sentinelObserver: IntersectionObserver | null = null;

const setupSentinelObserver = () => {
  sentinelObserver?.disconnect();
  sentinelObserver = null;

  if (!loadMoreSentinelRef.value || !containerRef.value) return;

  sentinelObserver = new IntersectionObserver(
    async (entries) => {
      if (!entries[0]?.isIntersecting) return;
      if (messageStore.isLoadingMore || !messageStore.hasMore) return;

      const container = containerRef.value!;
      const prevScrollHeight = container.scrollHeight;

      await messageStore.loadMoreMessages();
      await nextTick();

      container.scrollTop += container.scrollHeight - prevScrollHeight;
    },
    { root: containerRef.value, threshold: 0.1 },
  );

  sentinelObserver.observe(loadMoreSentinelRef.value);
};

watch(showContent, async (val) => {
  if (!val) return;

  await nextTick();

  setupSentinelObserver();
});

const handleEdit = (messageId: string) => {
  const message = messageStore.messages.find((m) => m.id === messageId);

  if (!message) return;

  editingMessageId.value = messageId;
  editingText.value = sanitizeText(message.text);
  editingAttachments.value = message.attachments
    ? [...message.attachments]
    : [];
  editDialogVisible.value = true;
};

const confirmEdit = async (
  text: string,
  attachments: import("@/shared/types/message").MessageAttachment[],
) => {
  if (!editingMessageId.value) return;

  try {
    await editMessage(editingMessageId.value, text, attachments);

    editingMessageId.value = null;
    editingText.value = "";
    editingAttachments.value = [];

    toast.add({
      severity: "success",
      summary: "Успешно",
      detail: "Сообщение успешно отредактировано",
      life: VALIDATION_CONFIG.TOAST.LIFE_TIME,
    });
  } catch {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Ошибка при редактировании сообщения",
      life: VALIDATION_CONFIG.TOAST.LIFE_TIME,
    });
  }
};

const handleDeleteForMe = (messageId: string) => {
  confirm.require({
    message: "Удалить сообщение у себя?",
    header: "Подтверждение",
    icon: "pi pi-exclamation-triangle",
    rejectLabel: "Отмена",
    acceptLabel: "Удалить",
    accept: async () => {
      try {
        await deleteMessageForMe(messageId);

        toast.add({
          severity: "success",
          summary: "Успешно!",
          detail: "Сообщение успешно удалено для Вас",
          life: VALIDATION_CONFIG.TOAST.LIFE_TIME,
        });
      } catch (error: any) {
        toast.add({
          severity: "error",
          summary: "Ошибка",
          detail: "Ошибка при удалении сообщения для Вас",
          life: VALIDATION_CONFIG.TOAST.LIFE_TIME,
        });
      }
    },
  });
};

const handleDeleteForAll = (messageId: string) => {
  confirm.require({
    message: "Удалить сообщение у всех? Это действие нельзя отменить.",
    header: "Подтверждение удаления",
    icon: "pi pi-exclamation-triangle",
    rejectLabel: "Отмена",
    acceptLabel: "Удалить у всех",
    rejectClass: "p-button-secondary",
    acceptClass: "p-button-danger",
    accept: async () => {
      try {
        await deleteMessageForAll(messageId);

        toast.add({
          severity: "success",
          summary: "Успешно!",
          detail: "Сообщение успешно удалено для всех",
          life: VALIDATION_CONFIG.TOAST.LIFE_TIME,
        });
      } catch (error: any) {
        toast.add({
          severity: "error",
          summary: "Ошибка",
          detail: "Ошибка при удалении сообщения для всех",
          life: VALIDATION_CONFIG.TOAST.LIFE_TIME,
        });
      }
    },
  });
};

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && selection.isActive) {
    selection.exit();
  }
};

onMounted(() => {
  window.addEventListener("keydown", onKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeyDown);
  sentinelObserver?.disconnect();
  resizeObserver?.disconnect();
});
</script>

<template>
  <div class="flex-1 min-h-0 relative">
    <div
      v-if="messageStore.isLoading"
      class="h-full overflow-hidden flex flex-col justify-end gap-1.5 pb-2 pr-2"
    >
      <template v-for="item in skeletonPattern" :key="item.id">
        <div
          class="flex gap-2 w-full"
          :class="item.outgoing ? 'flex-row-reverse' : 'flex-row'"
        >
          <div
            class="flex flex-1 flex-col gap-1"
            :class="item.outgoing ? 'items-end' : 'items-start'"
          >
            <Skeleton
              :width="item.width"
              :height="item.height"
              :class="item.outgoing ? 'rounded-br-sm!' : 'rounded-bl-sm!'"
              border-radius="1rem"
            />
          </div>
        </div>
      </template>
    </div>

    <div
      v-if="showEmptyState"
      class="flex items-center justify-center h-full text-center p-8"
    >
      <div>
        <i class="pi pi-inbox text-6xl mb-4 block"></i>
        <p class="text-lg font-medium">Нет сообщений</p>
        <p class="text-sm mt-2">Начните общение первым</p>
      </div>
    </div>

    <div
      v-if="showContent"
      ref="containerRef"
      class="h-full overflow-y-auto overflow-x-hidden pr-2"
      :class="{ 'select-none': selection.isActive || isDragSelecting }"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mouseleave="onMouseUp"
    >
      <div ref="messagesContentRef" class="flex flex-col gap-2">
        <div ref="loadMoreSentinelRef" class="flex justify-center">
          <div
            v-if="messageStore.isLoadingMore"
            class="w-8 h-8 my-2 rounded-full border-2 border-(--p-primary-color)/30 border-t-(--p-primary-color) animate-spin"
          />
        </div>

        <template v-for="dateGroup in groupedMessages" :key="dateGroup.date">
          <div class="flex flex-col gap-1">
            <div
              class="sticky top-2 z-1 flex justify-center pointer-events-none"
            >
              <div
                class="px-2 py-1 rounded-2xl bg-(--p-primary-color)/40 backdrop-blur-md shadow-sm pointer-events-auto"
              >
                <span class="block text-sm font-normal">
                  {{ dateGroup.date }}
                </span>
              </div>
            </div>

            <div
              v-for="(group, groupIndex) in dateGroup.groups"
              :key="(group.senderId || 'system') + groupIndex"
              class="flex flex-col gap-1"
            >
              <template v-if="group.type === 'system'">
                <SystemMessageItem
                  v-for="message in group.messages"
                  :key="message.id"
                  :message="message"
                />
              </template>

              <div
                v-else
                class="flex gap-2 w-full"
                :class="
                  group.senderId === userStore.userId
                    ? 'flex-row-reverse'
                    : 'flex-row'
                "
              >
                <div
                  v-if="
                    chatStore.activeChat?.type === 'group' &&
                    group.senderId !== userStore.userId
                  "
                  class="w-fit shrink-0 relative"
                >
                  <div class="sticky bottom-0 top-0 h-8">
                    <Avatar
                      :image="
                        chatStore.chatParticipants.get(group.senderId!)
                          ?.photoURL ?? undefined
                      "
                      :label="
                        chatStore.chatParticipants.get(group.senderId!)
                          ?.photoURL
                          ? undefined
                          : (
                              chatStore.chatParticipants
                                .get(group.senderId!)
                                ?.displayName?.charAt(0) || '?'
                            ).toUpperCase()
                      "
                      :class="[
                        chatStore.chatParticipants.get(group.senderId!)
                          ?.photoURL
                          ? undefined
                          : getAvatarColor(group.senderId!) + ' text-white!',
                      ]"
                      shape="circle"
                      size="normal"
                      :pt="{
                        image: {
                          alt: chatStore.chatParticipants.get(group.senderId!)
                            ?.displayName,
                        },
                      }"
                    />
                  </div>
                </div>

                <div
                  class="flex flex-col gap-1 flex-1 min-w-0"
                  :class="
                    group.senderId === userStore.userId
                      ? 'items-end'
                      : 'items-start'
                  "
                >
                  <ChatMessageItem
                    v-for="(message, index) in group.messages"
                    :key="message.id"
                    :message="message"
                    :current-user-id="userStore.userId!"
                    :is-group="chatStore.activeChat?.type === 'group'"
                    :show-sender-name="
                      chatStore.activeChat?.type === 'group' &&
                      group.senderId !== userStore.userId &&
                      index === 0
                    "
                    @edit="handleEdit"
                    @delete-for-me="handleDeleteForMe"
                    @delete-for-all="handleDeleteForAll"
                    @reply="handleReply"
                    @forward="handleForward"
                    @copy="handleCopy"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 scale-0 translate-y-8"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-8"
      leave-to-class="opacity-0 scale-0 translate-y-2"
    >
      <Button
        v-if="isUserScrolling && hasMessages"
        @click="scrollToBottom()"
        class="absolute bottom-8 left-1/2 md:w-20! w-fit! rounded-2xl! -translate-x-1/2 z-1 opacity-45! active:opacity-100! transition-all!"
        icon="pi pi-arrow-down"
        severity="contrast"
        size="small"
        aria-label="Прокрутить вниз"
      />
    </Transition>

    <EditMessageDialog
      v-model:visible="editDialogVisible"
      :initial-text="editingText"
      :initial-attachments="editingAttachments"
      @confirm="confirmEdit"
    />

    <ForwardDialog />
  </div>
</template>
