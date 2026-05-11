import { ref, computed } from "vue";
import { useUserStore } from "@/entities/user/store/user.store";
import { uploadToCloudinary } from "@/shared/api/cloudinary";
import { compressImage } from "@/shared/lib/image/compressImage";
import { useToast } from "primevue/usetoast";

export function useUserProfile() {
  const userStore = useUserStore();
  const toast = useToast();

  const displayName = ref("");
  const photoFile = ref<File | null>(null);
  const photoBlobUrl = ref<string | null>(null);
  const isSaving = ref(false);

  const user = computed(() => userStore.currentUser);

  const photoPreview = computed(
    () => photoBlobUrl.value ?? user.value?.photoURL ?? null,
  );

  const init = () => {
    displayName.value = user.value?.displayName ?? "";
    photoBlobUrl.value = null;
    photoFile.value = null;
  };

  const onPhotoSelect = async (file: File) => {
    const compressed = await compressImage(file, 0.8, 320);

    photoFile.value = compressed;
    photoBlobUrl.value = URL.createObjectURL(compressed);
  };

  const clearPhoto = () => {
    photoBlobUrl.value = null;
    photoFile.value = null;
  };

  const save = async (): Promise<boolean> => {
    if (!displayName.value.trim()) return false;

    isSaving.value = true;

    try {
      let photoURL = user.value?.photoURL ?? null;

      if (photoFile.value) {
        photoURL = await uploadToCloudinary(photoFile.value);
      }

      await userStore.updateProfile({
        displayName: displayName.value.trim(),
        photoURL,
      });

      toast.add({
        severity: "success",
        summary: "Готово",
        detail: "Профиль обновлён",
        life: 2500,
      });

      photoFile.value = null;
      photoBlobUrl.value = null;

      return true;
    } catch {
      toast.add({
        severity: "error",
        summary: "Ошибка",
        detail: "Не удалось сохранить профиль",
        life: 3000,
      });

      return false;
    } finally {
      isSaving.value = false;
    }
  };

  return {
    user,
    displayName,
    photoPreview,
    photoFile,
    isSaving,
    init,
    onPhotoSelect,
    clearPhoto,
    save,
  };
}
