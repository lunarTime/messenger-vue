<script setup lang="ts">
import { computed, ref } from "vue";
import { useMessageSelection } from "@/features/message-actions/model/useMessageSelection";
import { useMessageStore } from "@/entities/message/store/message.store";
import { useMessageCompose } from "@/shared/composables/useMessageCompose";
import { useUserStore } from "@/entities/user/store/user.store";
import { useChatStore } from "@/entities/chat/store/chat.store";
import { useIsMobile } from "@/shared/composables/useIsMobile";
import { useToast } from "primevue/usetoast";
import { VALIDATION_CONFIG } from "@/shared/config/validation.config";
import Button from "primevue/button";
import Dialog from "primevue/dialog";

const { isMobile } = useIsMobile();
const selection = useMessageSelection();
const messageStore = useMessageStore();
const messageCompose = useMessageCompose();
const userStore = useUserStore();
const chatStore = useChatStore();
const toast = useToast();

const deleteDialogVisible = ref(false);
const pendingDeleteIds = ref<string[]>([]);

const selectedMessages = computed(() =>
  selection.getSelectedMessages(messageStore.messages),
);

const canReply = computed(() => selection.count === 1);
const iconSize = computed(() => (isMobile.value ? "large" : "small"));

const handleReply = () => {
  const msg = selectedMessages.value[0];

  if (!msg || msg.isDeleted) return;

  let senderName = "Вы";

  if (msg.senderId !== userStore.userId) {
    const participant = chatStore.chatParticipants.get(msg.senderId);

    senderName = participant?.displayName || "Пользователь";
  }

  messageCompose.setReply({ messageId: msg.id, senderName, text: msg.text });
  selection.exit();
};

const handleForward = () => {
  const msgs = selectedMessages.value.filter((m) => !m.isDeleted);

  if (!msgs.length) return;

  if (msgs.length === 1) {
    const msg = msgs[0]!;

    let senderName = "Вы";

    if (msg.senderId !== userStore.userId) {
      const participant = chatStore.chatParticipants.get(msg.senderId);

      senderName = participant?.displayName || "Пользователь";
    }
    messageCompose.setForward({ message: msg, senderName });
  } else {
    messageCompose.setForwardMany(msgs);
  }

  selection.exit();
};

const handleDeleteClick = () => {
  pendingDeleteIds.value = selectedMessages.value.map((m) => m.id);
  deleteDialogVisible.value = true;
};

const confirmDeleteForMe = async () => {
  deleteDialogVisible.value = false;

  try {
    await Promise.all(
      pendingDeleteIds.value.map((id) => messageStore.deleteMessageForMe(id)),
    );

    toast.add({
      severity: "success",
      summary: "Удалено",
      detail: "Сообщения удалены для Вас",
      life: VALIDATION_CONFIG.TOAST.LIFE_TIME,
    });
  } catch {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Не удалось удалить сообщения",
      life: VALIDATION_CONFIG.TOAST.LIFE_TIME,
    });
  } finally {
    pendingDeleteIds.value = [];
    selection.exit();
  }
};

const confirmDeleteForAll = async () => {
  deleteDialogVisible.value = false;

  try {
    await Promise.all(
      pendingDeleteIds.value.map((id) => messageStore.deleteMessageForAll(id)),
    );

    toast.add({
      severity: "success",
      summary: "Удалено",
      detail: "Сообщения удалены для всех",
      life: VALIDATION_CONFIG.TOAST.LIFE_TIME,
    });
  } catch {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Не удалось удалить сообщения",
      life: VALIDATION_CONFIG.TOAST.LIFE_TIME,
    });
  } finally {
    pendingDeleteIds.value = [];
    selection.exit();
  }
};
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-200 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div
      v-if="selection.isActive"
      class="absolute top-full right-6 w-fit flex items-center justify-between gap-2 px-2 py-1 md:mt-5 mt-12 dark:bg-black/70 bg-(--p-primary-color)/20 rounded-2xl"
    >
      <div class="flex items-center gap-2">
        <Button
          icon="pi pi-times"
          text
          rounded
          :size="iconSize"
          aria-label="Отменить выделение"
          @click="selection.exit()"
        />
        <span class="md:text-sm text-base font-medium leading-none">
          {{ selection.count }}
          {{
            selection.count === 1
              ? "сообщение"
              : selection.count < 5
                ? "сообщения"
                : "сообщений"
          }}
        </span>
      </div>

      <div class="flex items-center gap-1">
        <Button
          icon="pi pi-reply"
          text
          rounded
          :size="iconSize"
          :disabled="!canReply"
          aria-label="Ответить"
          v-tooltip.bottom="'Ответить'"
          @click="handleReply"
        />
        <Button
          icon="pi pi-share-alt"
          text
          rounded
          :size="iconSize"
          aria-label="Переслать"
          v-tooltip.bottom="'Переслать'"
          @click="handleForward"
        />
        <Button
          icon="pi pi-trash"
          text
          rounded
          :size="iconSize"
          severity="danger"
          aria-label="Удалить"
          v-tooltip.bottom="'Удалить'"
          @click="handleDeleteClick"
        />
      </div>
    </div>
  </Transition>

  <Dialog
    v-model:visible="deleteDialogVisible"
    modal
    header="Удалить сообщения"
    :style="{ width: '26rem' }"
    :breakpoints="{ '640px': '95vw' }"
  >
    <p class="text-sm opacity-70 mb-2">
      Выбрано {{ pendingDeleteIds.length }}
      {{
        pendingDeleteIds.length === 1
          ? "сообщение"
          : pendingDeleteIds.length < 5
            ? "сообщения"
            : "сообщений"
      }}
    </p>
    <p>Как удалить выбранные сообщения?</p>

    <template #footer>
      <Button
        label="Отмена"
        severity="secondary"
        @click="deleteDialogVisible = false"
      />
      <Button
        label="У меня"
        severity="secondary"
        icon="pi pi-trash"
        @click="confirmDeleteForMe"
      />
      <Button
        label="У всех"
        severity="danger"
        icon="pi pi-trash"
        @click="confirmDeleteForAll"
      />
    </template>
  </Dialog>
</template>
