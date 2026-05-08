import { ref, computed } from "vue";
import {
  uploadFileToCloudinary,
  validateFile,
  getAttachmentType,
  MAX_FILES_PER_MESSAGE,
} from "@/shared/api/cloudinary";
import type { MessageAttachment } from "@/shared/types/message";

export interface PendingFile {
  id: string;
  file: File;
  previewUrl: string | null;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  error: string | null;
  attachment: MessageAttachment | null;
}

export function useFileUpload(chatId: () => string | null) {
  const pendingFiles = ref<PendingFile[]>([]);

  const isUploading = computed(() =>
    pendingFiles.value.some((f) => f.status === "uploading"),
  );

  const allUploaded = computed(
    () =>
      pendingFiles.value.length > 0 &&
      pendingFiles.value.every(
        (f) => f.status === "done" || f.status === "error",
      ),
  );

  const readyAttachments = computed<MessageAttachment[]>(() =>
    pendingFiles.value
      .filter((f) => f.status === "done" && f.attachment)
      .map((f) => f.attachment!),
  );

  async function uploadSingle(pf: PendingFile): Promise<void> {
    const activeChatId = chatId();

    if (!activeChatId) return;

    pf.status = "uploading";
    pf.error = null;

    try {
      const attachment = await uploadFileToCloudinary(
        pf.file,
        activeChatId,
        pf.id,
        (progress) => {
          pf.progress = progress;
        },
      );
      pf.attachment = attachment;
      pf.progress = 100;
      pf.status = "done";
    } catch (err) {
      pf.status = "error";
      pf.error = err instanceof Error ? err.message : "Ошибка загрузки";
    }
  }

  function addFiles(files: File[]): string[] {
    const errors: string[] = [];
    const remaining = MAX_FILES_PER_MESSAGE - pendingFiles.value.length;

    if (remaining <= 0) {
      errors.push(`Максимум ${MAX_FILES_PER_MESSAGE} файлов за одно сообщение`);

      return errors;
    }

    const toAdd = files.slice(0, remaining);

    if (files.length > remaining) {
      errors.push(
        `Добавлено только ${remaining} из ${files.length} файлов (лимит ${MAX_FILES_PER_MESSAGE})`,
      );
    }

    for (const file of toAdd) {
      const validationError = validateFile(file);

      if (validationError) {
        errors.push(validationError);

        continue;
      }

      const type = getAttachmentType(file.type);
      const previewUrl = type === "image" ? URL.createObjectURL(file) : null;

      const pf: PendingFile = {
        id: crypto.randomUUID(),
        file,
        previewUrl,
        progress: 0,
        status: "pending",
        error: null,
        attachment: null,
      };

      pendingFiles.value.push(pf);

      uploadSingle(pf);
    }

    return errors;
  }

  function removeFile(id: string) {
    const idx = pendingFiles.value.findIndex((f) => f.id === id);

    if (idx === -1) return;

    const pf = pendingFiles.value[idx];

    if (!pf) return;

    if (pf.previewUrl) URL.revokeObjectURL(pf.previewUrl);

    pendingFiles.value.splice(idx, 1);
  }

  function clearAll() {
    for (const pf of pendingFiles.value) {
      if (pf.previewUrl) URL.revokeObjectURL(pf.previewUrl);
    }

    pendingFiles.value = [];
  }

  async function waitForUploads(): Promise<MessageAttachment[]> {
    const uploading = pendingFiles.value.filter(
      (f) => f.status === "uploading" || f.status === "pending",
    );

    if (uploading.length > 0) {
      await new Promise<void>((resolve) => {
        const check = () => {
          const stillActive = pendingFiles.value.some(
            (f) => f.status === "uploading" || f.status === "pending",
          );

          if (!stillActive) resolve();
          else setTimeout(check, 100);
        };

        check();
      });
    }

    return readyAttachments.value;
  }

  async function retryFile(id: string): Promise<void> {
    const pf = pendingFiles.value.find((f) => f.id === id);

    if (!pf || pf.status !== "error") return;

    pf.progress = 0;

    await uploadSingle(pf);
  }

  return {
    pendingFiles,
    isUploading,
    allUploaded,
    readyAttachments,
    addFiles,
    removeFile,
    clearAll,
    waitForUploads,
    retryFile,
  };
}
