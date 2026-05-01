<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useChatStore } from "@/entities/chat/store/chat.store";
import { updateGroupInfo } from "@/shared/api/firebase/firestore";
import { uploadToCloudinary } from "@/shared/api/cloudinary";
import { useToast } from "primevue/usetoast";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Avatar from "primevue/avatar";
import FileUpload, { type FileUploadSelectEvent } from "primevue/fileupload";
import { getAvatarColor } from "@/shared/utils/avatarColors";
import { compressImage } from "@/shared/lib/image/compressImage";
import { formatFileSize } from "@/shared/lib/image/formatFileSize";
import { useUserStore } from "@/entities/user/store/user.store";

const props = defineProps<{
  visible: boolean;
  chatId: string;
}>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
  updated: [];
}>();

const chatStore = useChatStore();
const userStore = useUserStore();
const toast = useToast();

const chat = computed(() => chatStore.chats.find(c => c.id === props.chatId));

const groupName = ref("");
const groupPhotoURL = ref<string | null>(null);
const groupPhotoFile = ref<File | null>(null);
const groupPhotoPreview = ref<string | null>("");
const isUpdating = ref(false);

watch(() => props.visible, (newVisible) => {
  if (newVisible && chat.value) {
    groupName.value = chat.value.name || "";
    groupPhotoURL.value = chat.value.photoURL || null;
    groupPhotoPreview.value = chat.value.photoURL || null;
    groupPhotoFile.value = null;
  }
});

const fileSizeLabel = computed(() => {
  if (!groupPhotoFile.value) return "";
  return formatFileSize(groupPhotoFile.value.size);
});

const previewBgColor = computed(() => {
  return getAvatarColor(groupName.value || props.chatId || "group_default");
});

const onFileSelect = async (event: FileUploadSelectEvent) => {
  const file = event.files[0];
  if (!file) return;

  const compressedPhoto = await compressImage(file, 0.8, 320);
  groupPhotoFile.value = compressedPhoto;
  groupPhotoPreview.value = URL.createObjectURL(compressedPhoto);
};

const clearGroupPhoto = () => {
  groupPhotoFile.value = null;
  groupPhotoPreview.value = groupPhotoURL.value;
};

const handleUpdate = async () => {
  if (!groupName.value || !userStore.userId || !props.chatId) return;

  isUpdating.value = true;
  try {
    let photoURL = groupPhotoURL.value || "";
    if (groupPhotoFile.value) {
      photoURL = await uploadToCloudinary(groupPhotoFile.value);
    }

    await updateGroupInfo(props.chatId, userStore.userId, {
      name: groupName.value,
      photoURL: photoURL || undefined,
    });

    toast.add({
      severity: "success",
      summary: "Успех",
      detail: "Информация обновлена",
      life: 3000,
    });

    emit("updated");
    close();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Не удалось обновить информацию",
      life: 3000,
    });
  } finally {
    isUpdating.value = false;
  }
};

const close = () => {
  emit("update:visible", false);
};
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="emit('update:visible', $event)"
    header="Редактировать группу"
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
            :icon="!groupPhotoPreview ? 'pi pi-users' : undefined"
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
            choose-label="Изменить"
            severity="contrast"
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
          placeholder="Название группы"
          fluid
        />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2 pt-2">
        <Button label="Отмена" severity="secondary" text @click="close" />
        <Button
          label="Сохранить"
          :loading="isUpdating"
          :disabled="!groupName.trim()"
          @click="handleUpdate"
        />
      </div>
    </template>
  </Dialog>
</template>
