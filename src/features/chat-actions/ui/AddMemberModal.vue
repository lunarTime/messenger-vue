<script setup lang="ts">
import { ref, computed } from "vue";
import { useChatStore } from "@/entities/chat/store/chat.store";
import { useUserStore } from "@/entities/user/store/user.store";
import { addGroupMembers } from "@/shared/api/firebase/firestore";
import { useToast } from "primevue/usetoast";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import ScrollPanel from "primevue/scrollpanel";
import Avatar from "primevue/avatar";
import Checkbox from "primevue/checkbox";
import { getAvatarColor } from "@/shared/utils/avatarColors";
import type { User } from "@/shared/types/user";

const props = defineProps<{
  visible: boolean;
  chatId: string;
  existingParticipantIds: string[];
}>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
  added: [];
}>();

const chatStore = useChatStore();
const userStore = useUserStore();
const toast = useToast();

const selectedUsers = ref<string[]>([]);
const isAdding = ref(false);

const availableUsers = computed<User[]>(() => {
  const users = Array.from(chatStore.chatParticipants.values()) as User[];

  return users.filter(
    (u) =>
      u.id !== userStore.userId && !props.existingParticipantIds.includes(u.id),
  );
});

const toggleUser = (userId: string) => {
  const index = selectedUsers.value.indexOf(userId);

  if (index === -1) {
    selectedUsers.value.push(userId);
  } else {
    selectedUsers.value.splice(index, 1);
  }
};

const handleAdd = async () => {
  if (selectedUsers.value.length === 0 || !userStore.userId || !props.chatId)
    return;

  isAdding.value = true;
  try {
    await addGroupMembers(props.chatId, selectedUsers.value, userStore.userId);

    toast.add({
      severity: "success",
      summary: "Успех",
      detail: "Участники добавлены",
      life: 3000,
    });

    emit("added");
    close();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Не удалось добавить участников",
      life: 3000,
    });
  } finally {
    isAdding.value = false;
  }
};

const close = () => {
  selectedUsers.value = [];
  emit("update:visible", false);
};
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="emit('update:visible', $event)"
    header="Добавить участников"
    :modal="true"
    :draggable="false"
    class="w-full max-w-md mx-4"
    @hide="close"
  >
    <div class="flex flex-col gap-4 py-2">
      <div class="flex flex-col gap-2">
        <div class="flex justify-between items-center px-1">
          <label class="font-medium text-sm">Выберите пользователей</label>
          <span class="text-xs opacity-60">
            {{ selectedUsers.length }} выбрано
          </span>
        </div>

        <ScrollPanel
          class="h-80 border border-(--p-inputtext-border-color) rounded-xl bg-surface-50 dark:bg-surface-900/50"
        >
          <div
            v-if="availableUsers.length === 0"
            class="p-8 text-center opacity-50"
          >
            <p>Нет доступных пользователей для добавления</p>
          </div>
          <div v-else class="flex flex-col p-2 gap-1">
            <div
              v-for="user in availableUsers"
              :key="user.id"
              class="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              @click="toggleUser(user.id)"
            >
              <Checkbox
                :model-value="selectedUsers.includes(user.id)"
                :binary="true"
                @click.stop="toggleUser(user.id)"
              />
              <Avatar
                :image="user.photoURL ?? undefined"
                :label="
                  user.photoURL
                    ? undefined
                    : user.displayName?.charAt(0).toUpperCase()
                "
                :class="
                  user.photoURL
                    ? undefined
                    : getAvatarColor(user.id) + ' text-white!'
                "
                shape="circle"
              />
              <div class="flex-1 min-w-0">
                <div class="font-medium truncate">{{ user.displayName }}</div>
                <div class="text-xs opacity-60 truncate">{{ user.email }}</div>
              </div>
            </div>
          </div>
        </ScrollPanel>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2 pt-2">
        <Button label="Отмена" severity="secondary" text @click="close" />
        <Button
          label="Добавить"
          :loading="isAdding"
          :disabled="selectedUsers.length === 0"
          @click="handleAdd"
        />
      </div>
    </template>
  </Dialog>
</template>
