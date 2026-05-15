import messageSoundUrl from "@/shared/assets/sounds/message_sound.mp3";

let permissionRequested = false;
let activeNotifications: Notification[] = [];

export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export async function ensureNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) return "denied";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  if (permissionRequested) return Notification.permission;

  permissionRequested = true;

  try {
    return await Notification.requestPermission();
  } catch {
    return "denied";
  }
}

export interface ShowMessageNotificationOptions {
  title: string;
  body: string;
  chatId: string;
  icon?: string | null;
  onClick?: (chatId: string) => void;
}

export function showMessageNotification(
  options: ShowMessageNotificationOptions,
): void {
  if (!isNotificationSupported()) return;
  if (Notification.permission !== "granted") return;

  try {
    const notification = new Notification(options.title, {
      body: options.body,
      icon: options.icon || undefined,
      tag: `chat-${options.chatId}`,
      renotify: false,
      silent: false,
    } as NotificationOptions);

    notification.onclick = () => {
      window.focus();
      options.onClick?.(options.chatId);
      notification.close();
    };

    activeNotifications.push(notification);
    notification.onclose = () => {
      activeNotifications = activeNotifications.filter(
        (n) => n !== notification,
      );
    };
  } catch {
    console.log("Notification creation failed");
  }
}

export function clearAllNotifications(): void {
  for (const n of activeNotifications) {
    try {
      n.close();
    } catch {
      console.log("notifications already closed");
    }
  }

  activeNotifications = [];
}

export const NOTIFICATION_SOUND_URL = messageSoundUrl;
