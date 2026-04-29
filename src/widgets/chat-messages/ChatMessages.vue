<script setup lang="ts">
import { ref, watch, nextTick, onMounted, computed } from "vue";
import { useScroll, useThrottleFn } from "@vueuse/core";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useMessageStore } from "@/entities/message/store/message.store";
import { useChatStore } from "@/entities/chat/store/chat.store";
import { useUserStore } from "@/entities/user/store/user.store";
import { useMessageActions } from "@/features/message-actions/model/useMessageActions";
import { sanitizeText } from "@/shared/lib/sanitization/sanitizer";
import { VALIDATION_CONFIG } from "@/shared/config/validation.config";
import ChatMessageItem from "@/widgets/chat-messages/ui/ChatMessageItem.vue";
import ProgressSpinner from "primevue/progressspinner";
import Textarea from "primevue/textarea";
import Dialog from "primevue/dialog";
import Button from "primevue/button";

const confirm = useConfirm();
const toast = useToast();
const messageStore = useMessageStore();
const chatStore = useChatStore();
const userStore = useUserStore();

const { editMessage, deleteMessageForMe, deleteMessageForAll } =
  useMessageActions();

const containerRef = ref<HTMLElement | null>(null);
const isUserScrolling = ref(false);
const editDialogVisible = ref(false);
const editingMessageId = ref<string | null>(null);
const editingText = ref("");

const hasMessages = computed(() => messageStore.messages.length > 0);
const showContent = computed(
  () => !messageStore.isLoading && hasMessages.value,
);
const showEmptyState = computed(
  () => !messageStore.isLoading && !hasMessages.value,
);

const { arrivedState } = useScroll(containerRef, {
  throttle: 100,
  offset: { bottom: 150 },
});

const scrollToBottom = useThrottleFn(async (smooth = true) => {
  await nextTick();

  if (!containerRef.value) {
    return;
  }

  containerRef.value.scrollTo({
    top: containerRef.value.scrollHeight,
    behavior: smooth ? "smooth" : "auto",
  });

  isUserScrolling.value = false;
}, 100);

watch(arrivedState, (state) => {
  isUserScrolling.value = !state.bottom;
});

watch(
  () => messageStore.messages.length,
  async (newLength, oldLength) => {
    if (newLength === 0) return;

    if (newLength > oldLength) {
      const lastMessage = messageStore.messages[newLength - 1];

      if (lastMessage?.senderId === userStore.userId || arrivedState.bottom) {
        await scrollToBottom(lastMessage?.senderId === userStore.userId);
      }
    }
  },
);

watch(
  () => chatStore.activeChatId,
  async (newChatId, oldChatId) => {
    if (!newChatId || newChatId === oldChatId) return;

    isUserScrolling.value = false;

    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));

    await scrollToBottom(false);
  },
  { immediate: true },
);

onMounted(async () => {
  await nextTick();
  await scrollToBottom(false);
});

const handleEdit = (messageId: string) => {
  const message = messageStore.messages.find((m) => m.id === messageId);

  if (!message) {
    return;
  }

  editingMessageId.value = messageId;
  editingText.value = sanitizeText(message.text);
  editDialogVisible.value = true;
};

const confirmEdit = async () => {
  if (!editingMessageId.value || !editingText.value.trim()) {
    return;
  }

  try {
    await editMessage(editingMessageId.value, editingText.value.trim());

    editDialogVisible.value = false;
    editingMessageId.value = null;
    editingText.value = "";

    toast.add({
      severity: "success",
      summary: "Успешно",
      detail: "Сообщение успешно отредактировано",
      life: VALIDATION_CONFIG.TOAST.LIFE_TIME,
    });
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Ошибка при редактировании сообщения",
      life: VALIDATION_CONFIG.TOAST.LIFE_TIME,
    });
  }
};

const cancelEdit = () => {
  editDialogVisible.value = false;
  editingMessageId.value = null;
  editingText.value = "";
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
</script>

<template>
  <div class="flex-1 min-h-0 relative">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-200"
      leave-to-class="opacity-0"
    >
      <div
        v-if="messageStore.isLoading"
        class="flex items-center justify-center h-full absolute inset-0 z-10 bg-surface-0/90 dark:bg-surface-900/90 backdrop-blur-sm"
      >
        <ProgressSpinner />
      </div>
    </Transition>

    <div
      v-if="showEmptyState"
      class="flex items-center justify-center h-full text-center p-8"
    >
      <div>
        <i
          class="pi pi-inbox text-6xl text-surface-400 dark:text-surface-600 mb-4 block"
        ></i>
        <p class="text-lg font-medium text-surface-700 dark:text-surface-300">
          Нет сообщений
        </p>
        <p class="text-sm text-surface-500 dark:text-surface-400 mt-2">
          Начните общение первым
        </p>
      </div>
    </div>

    <div
      v-if="showContent"
      ref="containerRef"
      class="h-full overflow-y-auto overflow-x-hidden px-4 py-2"
    >
      <div class="flex flex-col gap-2">
        <ChatMessageItem
          v-for="message in messageStore.messages"
          :key="message.id"
          :message="message"
          :current-user-id="userStore.userId!"
          @edit="handleEdit"
          @delete-for-me="handleDeleteForMe"
          @delete-for-all="handleDeleteForAll"
        />
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
        @click="scrollToBottom(true)"
        class="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 transition-all!"
        icon="pi pi-arrow-down"
        severity="contrast"
        rounded
        size="large"
        aria-label="Прокрутить вниз"
      />
    </Transition>

    <Dialog
      v-model:visible="editDialogVisible"
      modal
      header="Редактировать сообщение"
      :style="{ width: '30rem' }"
      :breakpoints="{ '1199px': '75vw', '769px': '90vw' }"
    >
      <div class="flex flex-col gap-4">
        <Textarea
          v-model="editingText"
          rows="5"
          auto-resize
          placeholder="Введите текст сообщения"
          class="w-full"
        />
      </div>

      <template #footer>
        <Button label="Отмена" severity="secondary" @click="cancelEdit" />
        <Button
          label="Сохранить"
          @click="confirmEdit"
          :disabled="!editingText.trim()"
        />
      </template>
    </Dialog>
  </div>
</template>
