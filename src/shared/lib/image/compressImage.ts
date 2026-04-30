export const compressImage = (
  file: File,
  quality = 0.8,
  maxWidth = 1024,
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.src = reader.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, maxWidth / img.width);

      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");

      if (!ctx) return reject();

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject();

          const compressedFile = new File([blob], file.name, {
            type: blob.type,
          });

          resolve(compressedFile);
        },
        file.type === "image/png" ? "image/jpeg" : file.type,
        quality,
      );
    };

    reader.onerror = reject;
    img.onerror = reject;

    reader.readAsDataURL(file);
  });
};
