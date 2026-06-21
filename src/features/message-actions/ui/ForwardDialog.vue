<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useChatStore } from "@/entities/chat/store/chat.store";
import { useUserStore } from "@/entities/user/store/user.store";
import { useMessageCompose } from "@/shared/composables/useMessageCompose";
import { sendMessagesBatch } from "@/shared/api/firebase/firestore";
import { sanitizeText } from "@/shared/lib/sanitization/sanitizer";
import { VALIDATION_CONFIG } from "@/shared/config/validation.config";
import { getAvatarColor } from "@/shared/utils/avatarColors";
import type { Chat } from "@/shared/types/chat";
import Dialog from "primevue/dialog";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Checkbox from "primevue/checkbox";
import { useToast } from "primevue/usetoast";
import type {
  Message,
  MessageAttachment,
} from "@/shared/types/message";

const chatStore = useChatStore();
const userStore = useUserStore();
const messageCompose = useMessageCompose();
const toast = useToast();

const isForwarding = ref(false);
const searchQuery = ref("");
const selectedChatIds = ref<Set<string>>(new Set());

const isVisible = computed(
  () => !!messageCompose.forwardContext || !!messageCompose.forwardManyContext,
);

const filteredChats = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();

  return chatStore.visibleChats.filter((chat) => {
    const name = getChatName(chat).toLowerCase();

    return !q || name.includes(q);
  });
});

function getChatName(chat: Chat): string {
  if (chat.type === "group") return chat.name || "Группа";

  return chatStore.otherUserName(chat);
}

function getChatPhotoURL(chat: Chat): string | null {
  if (chat.type === "group") return chat.photoURL || null;

  const otherId = chat.participants.find((id) => id !== userStore.userId);

  if (!otherId) return null;

  return chatStore.chatParticipants.get(otherId)?.photoURL || null;
}

function getChatAvatarLabel(chat: Chat): string {
  return getChatName(chat).charAt(0).toUpperCase() || "?";
}

function getChatAvatarColor(chat: Chat): string {
  return getAvatarColor(chat.id);
}

const selectedChats = computed(() => {
  if (!selectedChatIds.value.size) return [];

  return chatStore.visibleChats.filter((chat) =>
    selectedChatIds.value.has(chat.id),
  );
});

const resolveSenderName = (message: Message): string => {
  if (message.forwardedFrom) return message.forwardedFrom;

  if (message.senderId === userStore.userId) {
    return userStore.currentUser?.displayName || "Пользователь";
  }

  return (
    chatStore.chatParticipants.get(message.senderId)?.displayName ||
    "Пользователь"
  );
};

const messagesToForward = computed<
  {
    text: string;
    forwardedFrom?: string;
    attachments?: MessageAttachment[];
  }[]
>(() => {
  const messages = messageCompose.forwardManyContext;

  if (messages) {
    return messages
      .filter((message) => !message.isDeleted)
      .map((message) => ({
        text: sanitizeText(message.text, {
          maxLength: VALIDATION_CONFIG.MESSAGE.MAX_LENGTH,
        }),
        forwardedFrom: resolveSenderName(message),
        attachments: message.attachments,
      }));
  }

  const context = messageCompose.forwardContext;

  if (!context || context.message.isDeleted) return [];

  return [
    {
      text: sanitizeText(context.message.text, {
        maxLength: VALIDATION_CONFIG.MESSAGE.MAX_LENGTH,
      }),
      forwardedFrom: context.message.forwardedFrom || context.senderName,
      attachments: context.message.attachments,
    },
  ];
});

const toggleChat = (chatId: string) => {
  if (isForwarding.value) return;

  const next = new Set(selectedChatIds.value);

  if (next.has(chatId)) next.delete(chatId);
  else next.add(chatId);

  selectedChatIds.value = next;
};

const handleForward = async () => {
  const senderId = userStore.userId;
  const targets = selectedChats.value;
  const messages = messagesToForward.value;

  if (!senderId || !targets.length || !messages.length) return;

  isForwarding.value = true;

  try {
    const results: PromiseSettledResult<void>[] = [];

    for (let index = 0; index < targets.length; index += 4) {
      const chunk = targets.slice(index, index + 4);
      const chunkResults = await Promise.allSettled(
        chunk.map((chat) => sendMessagesBatch(chat.id, senderId, messages)),
      );

      results.push(...chunkResults);
    }

    const failedChats = targets.filter(
      (_, index) => results[index]?.status === "rejected",
    );

    if (failedChats.length) {
      selectedChatIds.value = new Set(failedChats.map((chat) => chat.id));
      const allFailed = failedChats.length === targets.length;

      toast.add({
        severity: allFailed ? "error" : "warn",
        summary: allFailed ? "Ошибка" : "Переслано частично",
        detail: allFailed
          ? "Не удалось переслать сообщения"
          : `Не удалось переслать в ${failedChats.length} из ${targets.length} чатов`,
        life: VALIDATION_CONFIG.TOAST.LIFE_TIME,
      });

      return;
    }

    toast.add({
      severity: "success",
      summary: "Переслано",
      detail:
        targets.length === 1
          ? `Переслано в чат «${getChatName(targets[0] as Chat)}»`
          : `Переслано в ${targets.length} чатов`,
      life: VALIDATION_CONFIG.TOAST.LIFE_TIME,
    });

    close();
  } catch {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Не удалось переслать сообщение",
      life: VALIDATION_CONFIG.TOAST.LIFE_TIME,
    });
  } finally {
    isForwarding.value = false;
  }
};

function pluralAttachments(n: number): string {
  if (n % 10 === 1 && n % 100 !== 11) return `${n} вложение`;
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20))
    return `${n} вложения`;

  return `${n} вложений`;
}

const forwardPreviewText = computed(() => {
  const msg = messageCompose.forwardContext?.message;

  if (!msg) return "";

  const count = msg.attachments?.length ?? 0;

  if (!msg.text && count > 0) return pluralAttachments(count);
  if (msg.text && count > 0) return `${msg.text} (${pluralAttachments(count)})`;

  return msg.text;
});

const close = () => {
  messageCompose.clearForward();
  searchQuery.value = "";
  selectedChatIds.value = new Set();
};

watch(isVisible, (visible) => {
  if (!visible) selectedChatIds.value = new Set();
});

watch(
  () => chatStore.visibleChats.map((chat) => chat.id),
  (chatIds) => {
    const available = new Set(chatIds);
    const next = new Set(
      [...selectedChatIds.value].filter((chatId) => available.has(chatId)),
    );

    if (next.size !== selectedChatIds.value.size) {
      selectedChatIds.value = next;
    }
  },
);
</script>

<template>
  <Dialog
    :visible="isVisible"
    @update:visible="(v) => !v && !isForwarding && close()"
    modal
    :dismissable-mask="!isForwarding"
    :closable="!isForwarding"
    header="Переслать сообщение"
    :style="{ width: '26rem' }"
    :breakpoints="{ '640px': '95vw' }"
  >
    <div class="flex flex-col gap-3">
      <div
        v-if="messageCompose.forwardManyContext"
        class="rounded-xl px-3 py-2 bg-(--p-primary-color)/10 border border-(--p-primary-color)/20 text-sm"
      >
        <div class="font-semibold text-(--p-primary-color) text-xs">
          {{ messageCompose.forwardManyContext.length }}
          {{
            messageCompose.forwardManyContext.length === 1
              ? "сообщение"
              : messageCompose.forwardManyContext.length < 5
                ? "сообщения"
                : "сообщений"
          }}
        </div>
      </div>

      <div
        v-else-if="messageCompose.forwardContext"
        class="rounded-xl px-3 py-2 bg-(--p-primary-color)/10 border border-(--p-primary-color)/20 text-sm"
      >
        <div class="font-semibold text-(--p-primary-color) text-xs mb-0.5">
          {{ messageCompose.forwardContext.senderName }}
        </div>
        <div class="truncate opacity-70">{{ forwardPreviewText }}</div>
      </div>

      <InputText
        v-model="searchQuery"
        placeholder="Поиск чата..."
        class="w-full"
        fluid
      />

      <div class="flex flex-col gap-1 max-h-72 overflow-y-auto">
        <div
          v-for="chat in filteredChats"
          :key="chat.id"
          class="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-(--p-primary-color)/10 transition-colors"
          :class="{
            'opacity-60 pointer-events-none': isForwarding,
            'bg-(--p-primary-color)/10': selectedChatIds.has(chat.id),
          }"
          @click="toggleChat(chat.id)"
        >
          <Checkbox
            :model-value="selectedChatIds.has(chat.id)"
            binary
            :disabled="isForwarding"
            :aria-label="`Выбрать чат ${getChatName(chat)}`"
            @click.stop="toggleChat(chat.id)"
          />
          <Avatar
            :image="getChatPhotoURL(chat) ?? undefined"
            :label="
              getChatPhotoURL(chat) ? undefined : getChatAvatarLabel(chat)
            "
            :icon="
              chat.type === 'group' && !getChatPhotoURL(chat)
                ? 'pi pi-users'
                : undefined
            "
            :class="[
              getChatPhotoURL(chat)
                ? undefined
                : getChatAvatarColor(chat) + ' text-white!',
              chat.type === 'group' ? 'rounded-xl!' : '',
            ]"
            :shape="chat.type === 'group' ? 'square' : 'circle'"
            size="normal"
            class="overflow-hidden shrink-0"
            :pt="{ image: { alt: getChatAvatarLabel(chat) } }"
          />
          <span class="truncate font-medium text-sm">
            {{ getChatName(chat) }}
          </span>
        </div>

        <div
          v-if="filteredChats.length === 0"
          class="text-center text-sm opacity-50 py-4"
        >
          Чаты не найдены
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-between gap-3 w-full">
        <span class="text-sm opacity-60">
          Выбрано: {{ selectedChatIds.size }}
        </span>
        <div class="flex gap-2">
          <Button
            label="Отмена"
            severity="secondary"
            @click="close"
            :disabled="isForwarding"
          />
          <Button
            label="Переслать"
            icon="pi pi-send"
            :loading="isForwarding"
            :disabled="selectedChatIds.size === 0 || messagesToForward.length === 0"
            @click="handleForward"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>
