const OBJECT_URL_LIFETIME_MS = 1_000;

export async function downloadFile(url: string, name: string): Promise<void> {
  const response = await fetch(url);

  if (!response.ok) {
    const providerError = response.headers.get("x-cld-error");

    throw new Error(
      providerError
        ? `Cloudinary: ${providerError}`
        : `Failed to download file: HTTP ${response.status}`,
    );
  }

  const blob = await response.blob();

  if (blob.size === 0) {
    throw new Error("Failed to download file: server returned an empty file");
  }

  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = name;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(blobUrl), OBJECT_URL_LIFETIME_MS);
}
