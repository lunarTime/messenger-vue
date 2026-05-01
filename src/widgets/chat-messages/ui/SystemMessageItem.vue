<script setup lang="ts">
import { computed } from "vue";
import type { Message } from "@/shared/types/message";
import { useChatStore } from "@/entities/chat/store/chat.store";
import { useUserStore } from "@/entities/user/store/user.store";
import { formatTime } from "@/shared/utils/formatTime";

const props = defineProps<{
  message: Message;
}>();

const chatStore = useChatStore();
const userStore = useUserStore();

const systemText = computed(() => {
  const data = props.message.systemData;
  if (!data) return "";

  const isMe = data.actorId === userStore.userId;
  const actor = chatStore.chatParticipants.get(data.actorId);
  const actorName = isMe ? "Вы" : actor?.displayName || "Кто-то";

  const getTargetNames = () => {
    if (!data.targetUserIds || data.targetUserIds.length === 0)
      return "участника";
    return data.targetUserIds
      .map((id) => {
        if (id === userStore.userId) return "вас";
        return chatStore.chatParticipants.get(id)?.displayName || "Участника";
      })
      .join(", ");
  };

  switch (data.eventType) {
    case "chat_created":
      return isMe
        ? `Вы создали группу${data.newValue ? ` "${data.newValue}"` : ""}`
        : `${actorName} создал(а) группу${data.newValue ? ` "${data.newValue}"` : ""}`;
    case "user_added":
      return isMe
        ? `Вы добавили участника ${getTargetNames()}`
        : `${actorName} добавил(а) участника ${getTargetNames()}`;
    case "user_joined":
      return isMe
        ? `Вы присоединились к группе`
        : `${actorName} присоединился(ась) к группе`;
    case "user_left":
      return isMe ? `Вы покинули группу` : `${actorName} покинул(а) группу`;
    case "user_removed":
      return isMe
        ? `Вы исключили участника ${getTargetNames()}`
        : `${actorName} исключил(а) участника ${getTargetNames()}`;
    case "chat_name_changed":
      return isMe
        ? `Вы изменили название группы на "${data.newValue}"`
        : `${actorName} изменил(а) название группы на "${data.newValue}"`;
    case "chat_photo_changed":
      return isMe
        ? `Вы изменили фото группы`
        : `${actorName} изменил(а) фото группы`;
    default:
      return "Системное сообщение";
  }
});

const time = computed(() => {
  if (!props.message.createdAt) return "";
  return formatTime(props.message.createdAt);
});
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div
      class="flex items-start gap-2 px-2 py-1 rounded-xl backdrop-blur-sm leading-0"
    >
      <span class="text-sm font-medium text-center">
        {{ systemText }}
      </span>
      <span v-if="time" class="ml-2 text-xs opacity-80 pt-0.5">
        {{ time }}
      </span>
    </div>
  </div>
</template>
