import type { MessageAttachment } from "@/shared/types/message";

export function attachmentPreviewText(
  attachments: MessageAttachment[],
): string {
  const n = attachments.length;

  if (n === 0) return "";
  if (n % 10 === 1 && n % 100 !== 11) return `${n} вложение`;
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20))
    return `${n} вложения`;

  return `${n} вложений`;
}

export function lastMessageText(
  text: string,
  attachments?: MessageAttachment[],
): string {
  if (text) return text;
  if (attachments?.length) return attachmentPreviewText(attachments);

  return "";
}
