export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 б";

  const k = 1024;
  const sizes = ["б", "кб", "мб", "гб"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
