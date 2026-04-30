<script setup lang="ts">
import { ref, computed } from "vue";
import { useChatStore } from "@/entities/chat/store/chat.store";
import { useUserStore } from "@/entities/user/store/user.store";
import { createGroupChat } from "@/shared/api/firebase/firestore";
import { uploadToCloudinary } from "@/shared/api/cloudinary";
import { useToast } from "primevue/usetoast";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import ScrollPanel from "primevue/scrollpanel";
import Avatar from "primevue/avatar";
import Checkbox from "primevue/checkbox";
import FileUpload, { type FileUploadSelectEvent } from "primevue/fileupload";
import { getAvatarColor } from "@/shared/utils/avatarColors";
import { compressImage } from "@/shared/lib/image/compressImage";
import type { User } from "@/shared/types/user";
import { formatFileSize } from "@/shared/lib/image/formatFileSize";

defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
  created: [chatId: string];
}>();

const chatStore = useChatStore();
const userStore = useUserStore();
const toast = useToast();

const groupName = ref("");
const groupPhotoFile = ref<File | null>(null);
const groupPhotoPreview = ref<string | null>("");
const selectedUsers = ref<string[]>([]);
const isCreating = ref(false);

const fileSizeLabel = computed(() => {
  if (!groupPhotoFile.value) return "";

  return formatFileSize(groupPhotoFile.value.size);
});

const previewBgColor = computed(() => {
  return getAvatarColor(groupName.value || "group_default");
});

const onFileSelect = async (event: FileUploadSelectEvent) => {
  const file = event.files[0];

  if (!file) return;

  const compressedPhoto = await compressImage(file, 0.8, 320);

  clearGroupPhoto();

  groupPhotoFile.value = compressedPhoto;
  groupPhotoPreview.value = URL.createObjectURL(compressedPhoto);
};

const clearGroupPhoto = () => {
  groupPhotoFile.value = null;
  groupPhotoPreview.value = "";
};

const handleCreate = async () => {
  if (!groupName.value || selectedUsers.value.length === 0 || !userStore.userId)
    return;

  isCreating.value = true;
  try {
    let photoURL = "";
    if (groupPhotoFile.value) {
      try {
        photoURL = await uploadToCloudinary(groupPhotoFile.value);
      } catch (uploadError) {
        console.error("Cloudinary upload failed:", uploadError);
        toast.add({
          severity: "warn",
          summary: "Проблема с иконкой",
          detail:
            "Не удалось загрузить файл в Cloudinary. Группа будет создана с дефолтной иконкой.",
          life: 5000,
        });
      }
    }

    const chatId = await createGroupChat(
      userStore.userId,
      groupName.value,
      selectedUsers.value,
      photoURL || undefined,
    );

    toast.add({
      severity: "success",
      summary: "Успех",
      detail: "Группа создана",
      life: 3000,
    });

    emit("created", chatId);
    close();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Не удалось создать группу",
      life: 3000,
    });
  } finally {
    isCreating.value = false;
  }
};

const interlocutors = computed<User[]>(() => {
  const users = Array.from(chatStore.chatParticipants.values()) as User[];

  return users.filter((u) => u.id !== userStore.userId);
});

const toggleUser = (userId: string) => {
  const index = selectedUsers.value.indexOf(userId);

  if (index === -1) {
    selectedUsers.value.push(userId);
  } else {
    selectedUsers.value.splice(index, 1);
  }
};

const close = () => {
  groupName.value = "";
  groupPhotoFile.value = null;
  groupPhotoPreview.value = "";
  selectedUsers.value = [];

  emit("update:visible", false);
};
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="emit('update:visible', $event)"
    header="Создание группы"
    :modal="true"
    :draggable="false"
    class="w-full max-w-md mx-4"
    @hide="close"
  >
    <div class="flex flex-col gap-6 py-2">
      <div class="flex flex-col gap-2 items-center">
        <div class="relative group flex flex-col items-center gap-2">
          <p class="text-sm text-center">Иконка группы</p>
          <Avatar
            :image="groupPhotoPreview || undefined"
            :label="groupPhotoPreview ? undefined : ''"
            :icon="!groupPhotoPreview && !groupName ? 'pi pi-users' : undefined"
            shape="square"
            :class="[
              'w-24! h-24! rounded-2xl! text-3xl! justify-center overflow-hidden',
              groupPhotoPreview ? '' : previewBgColor + ' text-white!',
            ]"
            :pt="{
              image: {
                class: 'object-cover',
              },
            }"
          />
          <FileUpload
            mode="basic"
            name="demo[]"
            accept="image/*"
            :max-file-size="5000000"
            @select="onFileSelect"
            @clear="clearGroupPhoto"
            choose-label="Загрузить"
            cancelLabel="Сбросить"
            severity="contrast"
            file-label="sdfs"
          />
          <div v-if="groupPhotoFile" class="text-sm opacity-70">
            {{ fileSizeLabel }}
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <label for="groupName" class="font-medium text-sm">
          Название группы
        </label>
        <InputText
          id="groupName"
          v-model="groupName"
          placeholder="Например: Команда проекта"
          fluid
          autofocus
        />
      </div>

      <div class="flex flex-col gap-2">
        <div class="flex justify-between items-center">
          <label class="font-medium text-sm">Выберите участников</label>
          <span class="text-xs opacity-60">
            {{ selectedUsers.length }} выбрано
          </span>
        </div>

        <ScrollPanel
          class="h-64 border border-(--p-inputtext-border-color) rounded-xl bg-surface-50 dark:bg-surface-900/50"
        >
          <div
            v-if="interlocutors.length === 0"
            class="p-8 text-center opacity-50"
          >
            <p>У вас еще нет собеседников</p>
          </div>
          <div v-else class="flex flex-col p-2 gap-1">
            <div
              v-for="user in interlocutors"
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
          label="Создать группу"
          :loading="isCreating"
          :disabled="!groupName.trim() || selectedUsers.length === 0"
          @click="handleCreate"
        />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
:deep(.p-fileupload-basic-content) {
  flex-direction: column;
}
</style>
