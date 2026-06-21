<script setup lang="ts">
import { computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useUserProfile } from "@/features/user-profile/model/useUserProfile";
import { useTheme } from "@/shared/composables/useTheme";
import { getAvatarColor } from "@/shared/utils/avatarColors";
import { formatFileSize } from "@/shared/lib/image/formatFileSize";
import { logout } from "@/shared/api/firebase/auth";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import FileUpload, { type FileUploadSelectEvent } from "primevue/fileupload";

const props = defineProps<{ visible: boolean }>();

const router = useRouter();
const confirm = useConfirm();
const { isDark, toggleTheme } = useTheme();

const {
  user,
  displayName,
  jobTitle,
  photoPreview,
  photoFile,
  isSaving,
  init,
  onPhotoSelect,
  clearPhoto,
  save,
} = useUserProfile();

watch(
  () => props.visible,
  (v) => {
    if (v) init();
  },
  { immediate: true },
);

const onFileSelect = (event: FileUploadSelectEvent) => {
  const file = event.files[0];

  if (file) onPhotoSelect(file);
};

const handleSave = async () => {
  await save();
};

const themeLabel = computed(() =>
  isDark.value ? "Светлая тема" : "Тёмная тема",
);
const themeIcon = computed(() => (isDark.value ? "pi pi-sun" : "pi pi-moon"));

const menuItems = computed(() => [
  {
    key: "theme",
    label: themeLabel.value,
    icon: themeIcon.value,
    action: toggleTheme,
  },
  {
    key: "logout",
    label: "Выйти из аккаунта",
    icon: "pi pi-sign-out",
    danger: true,
    action: handleLogout,
  },
]);

const handleLogout = () => {
  confirm.require({
    header: "Выйти из аккаунта",
    message: "Вы уверены, что хотите выйти?",
    icon: "pi pi-sign-out",
    rejectLabel: "Отмена",
    acceptLabel: "Выйти",
    rejectClass: "p-button-secondary",
    acceptClass: "p-button-danger",
    accept: async () => {
      await logout();
      router.push({ name: "auth" });
    },
  });
};
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden">
    <div class="flex flex-col items-center md:gap-2 gap-1 md:p-8 p-3 pb-1!">
      <div class="relative group">
        <Avatar
          :image="photoPreview ?? undefined"
          :label="
            !photoPreview
              ? (user?.displayName || '?').charAt(0).toUpperCase()
              : undefined
          "
          shape="circle"
          class="md:w-32! md:h-32! w-22! h-22! overflow-hidden shadow-2xl"
          :class="[
            !photoPreview
              ? getAvatarColor(user?.id ?? '') + ' text-white!'
              : '',
          ]"
          :pt="{ image: { class: 'object-cover', alt: user?.displayName } }"
        />
      </div>

      <div class="flex flex-col items-center gap-2 mt-2 w-full">
        <FileUpload
          mode="basic"
          name="avatar[]"
          accept="image/*"
          :max-file-size="5000000"
          choose-label="Изменить фото"
          severity="secondary"
          @select="onFileSelect"
          :pt="{
            basiccontent: { class: 'flex-col' },
          }"
        />
        <div v-if="photoFile" class="flex items-center gap-2">
          <span class="text-xs opacity-60">
            {{ formatFileSize(photoFile.size) }}
          </span>
          <Button
            icon="pi pi-times"
            text
            rounded
            size="small"
            severity="danger"
            aria-label="Сбросить фото"
            @click="clearPhoto"
          />
        </div>
      </div>
    </div>

    <Divider class="md:my-0! my-2!" />

    <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
      <div class="flex flex-col gap-2">
        <label for="profileDisplayName" class="font-medium text-sm">Имя</label>
        <InputText
          id="profileDisplayName"
          v-model="displayName"
          :placeholder="user?.displayName ?? ''"
          fluid
          :maxlength="64"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="profileJobTitle" class="font-medium text-sm">Должность</label>
        <InputText
          id="profileJobTitle"
          v-model="jobTitle"
          placeholder="Например: Frontend-разработчик"
          fluid
          :maxlength="100"
        />
      </div>

      <div class="flex flex-col gap-1">
        <span class="font-medium text-sm">Email</span>
        <span class="text-sm opacity-70 break-all">
          {{ user?.email }}
        </span>
      </div>
    </div>

    <div class="px-4 py-0 pb-2">
      <Button
        label="Сохранить"
        icon="pi pi-check"
        fluid
        :loading="isSaving"
        :disabled="
          !displayName.trim() ||
          (!photoFile &&
            displayName.trim() === (user?.displayName ?? '').trim() &&
            jobTitle.trim() === (user?.jobTitle ?? '').trim())
        "
        @click="handleSave"
      />
    </div>

    <Divider class="md:my-0! my-1!" />

    <nav class="flex flex-col gap-0.5 py-2">
      <button
        v-for="item in menuItems"
        :key="item.key"
        class="flex items-center justify-between gap-2 w-full md:px-4 md:py-3 px-4 py-2 text-left rounded-lg transition-colors cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
        :class="item.danger ? 'text-red-500 dark:text-red-400' : ''"
        @click="item.action"
      >
        <span class="flex-1 min-w-0 truncate text-sm font-bold">
          {{ item.label }}
        </span>
        <i :class="item.icon" class="flex-none text-base opacity-70" />
      </button>
    </nav>
  </div>
</template>
