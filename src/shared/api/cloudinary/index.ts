import type { MessageAttachment } from "@/shared/types/message";

const CLOUDINARY_RESOURCE_TYPES: Record<string, "image" | "video" | "raw"> = {
  "image/jpeg": "image",
  "image/png": "image",
  "image/gif": "image",
  "image/webp": "image",
  "image/svg+xml": "image",
  "image/bmp": "image",
  "video/mp4": "video",
  "video/webm": "video",
  "video/ogg": "video",
  "video/quicktime": "video",
  "video/x-msvideo": "video",
};

const ATTACHMENT_TYPES: Record<string, "image" | "video" | "audio" | "file"> = {
  "image/jpeg": "image",
  "image/png": "image",
  "image/gif": "image",
  "image/webp": "image",
  "image/svg+xml": "image",
  "image/bmp": "image",
  "video/mp4": "video",
  "video/webm": "video",
  "video/ogg": "video",
  "video/quicktime": "video",
  "video/x-msvideo": "video",
  "audio/mpeg": "audio",
  "audio/ogg": "audio",
  "audio/wav": "audio",
  "audio/webm": "audio",
  "audio/mp4": "audio",
};

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const MAX_VIDEO_SIZE = 2 * 1024 * 1024 * 1024;
export const MAX_OTHER_SIZE = 100 * 1024 * 1024;
export const MAX_FILES_PER_MESSAGE = 10;

export function getAttachmentType(
  mimeType: string,
): "image" | "video" | "audio" | "file" {
  return ATTACHMENT_TYPES[mimeType] ?? "file";
}

function getCloudinaryResourceType(
  mimeType: string,
): "image" | "video" | "raw" {
  return CLOUDINARY_RESOURCE_TYPES[mimeType] ?? "raw";
}

export function validateFile(file: File): string | null {
  const type = getAttachmentType(file.type);

  if (type === "image" && file.size > MAX_IMAGE_SIZE) {
    return `Изображение "${file.name}" превышает 5 МБ`;
  }
  if (type === "video" && file.size > MAX_VIDEO_SIZE) {
    return `Видео "${file.name}" превышает 2 ГБ`;
  }
  if (type !== "image" && type !== "video" && file.size > MAX_OTHER_SIZE) {
    return `Файл "${file.name}" превышает 100 МБ`;
  }

  return null;
}

export function uploadFileToCloudinary(
  file: File,
  chatId: string,
  fileId: string,
  onProgress?: (progress: number) => void,
): Promise<MessageAttachment> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    return Promise.reject(new Error("Cloudinary configuration is missing"));
  }

  const resourceType = getCloudinaryResourceType(file.type);
  const attachmentType = getAttachmentType(file.type);
  const folder = `chats/${chatId}`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);
  formData.append("public_id", `${fileId}_${Date.now()}`);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        onProgress?.(Math.round((event.loaded / event.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          const attachment: MessageAttachment = {
            id: crypto.randomUUID(),
            type: attachmentType,
            url: data.secure_url as string,
            name: file.name,
            size: file.size,
            mimeType: file.type,
            ...(data.width ? { width: data.width as number } : {}),
            ...(data.height ? { height: data.height as number } : {}),
            ...(data.duration ? { duration: data.duration as number } : {}),
          };
          resolve(attachment);
        } catch {
          reject(new Error("Failed to parse Cloudinary response"));
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);
          reject(new Error(errorData.error?.message ?? "Upload failed"));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    });

    xhr.addEventListener("error", () =>
      reject(new Error("Network error during upload")),
    );
    xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    );
    xhr.send(formData);
  });
}

export async function uploadToCloudinary(file: File): Promise<string> {
  const result = await uploadFileToCloudinary(
    file,
    "general",
    crypto.randomUUID(),
  );

  return result.url;
}
