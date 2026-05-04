<script setup lang="ts">
import { ref, computed } from "vue";
import { useChatStore } from "@/entities/chat/store/chat.store";
import { useUserStore } from "@/entities/user/store/user.store";
import { useMessageCompose } from "@/shared/composables/useMessageCompose";
import {
  getOrCreateDirectChat,
  sendMessage as sendFirebaseMessage,
} from "@/shared/api/firebase/firestore";
import { sanitizeText } from "@/shared/lib/sanitization/sanitizer";
import { VALIDATION_CONFIG } from "@/shared/config/validation.config";
import { getAvatarColor } from "@/shared/utils/avatarColors";
import type { Chat } from "@/shared/types/chat";
import Dialog from "primevue/dialog";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { useToast } from "primevue/usetoast";

const chatStore = useChatStore();
const userStore = useUserStore();
const messageCompose = useMessageCompose();
const toast = useToast();

const isForwarding = ref(false);
const searchQuery = ref("");

const filteredChats = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();

  return chatStore.chats.filter((chat) => {
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

const handleForward = async (targetChat: Chat) => {
  const ctx = messageCompose.forwardContext;

  if (!ctx || !userStore.userId) return;

  isForwarding.value = true;

  try {
    let targetChatId = targetChat.id;

    if (targetChat.type === "direct") {
      const otherId = targetChat.participants.find(
        (id) => id !== userStore.userId,
      );

      if (otherId) {
        targetChatId = await getOrCreateDirectChat(userStore.userId, otherId);
      }
    }

    const forwardedText = sanitizeText(ctx.message.text, {
      maxLength: VALIDATION_CONFIG.MESSAGE.MAX_LENGTH,
    });

    await sendFirebaseMessage(targetChatId, userStore.userId, forwardedText, {
      forwardedFrom: ctx.senderName,
    });

    messageCompose.clearForward();
    searchQuery.value = "";

    toast.add({
      severity: "success",
      summary: "Переслано",
      detail: `Сообщение переслано в чат «${getChatName(targetChat)}»`,
      life: VALIDATION_CONFIG.TOAST.LIFE_TIME,
    });
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

const close = () => {
  messageCompose.clearForward();
  searchQuery.value = "";
};
</script>

<template>
  <Dialog
    :visible="!!messageCompose.forwardContext"
    @update:visible="(v) => !v && close()"
    modal
    header="Переслать сообщение"
    :style="{ width: '26rem' }"
    :breakpoints="{ '640px': '95vw' }"
  >
    <div class="flex flex-col gap-3">
      <div
        v-if="messageCompose.forwardContext"
        class="rounded-xl px-3 py-2 bg-(--p-primary-color)/10 border border-(--p-primary-color)/20 text-sm"
      >
        <div class="font-semibold text-(--p-primary-color) text-xs mb-0.5">
          {{ messageCompose.forwardContext.senderName }}
        </div>
        <div class="truncate opacity-70">
          {{ messageCompose.forwardContext.message.text }}
        </div>
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
          :class="{ 'opacity-60 pointer-events-none': isForwarding }"
          @click="handleForward(chat)"
        >
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
      <Button
        label="Отмена"
        severity="secondary"
        @click="close"
        :disabled="isForwarding"
      />
    </template>
  </Dialog>
</template>
