import { watch, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useChatStore } from "@/entities/chat/store/chat.store";

const BLINK_INTERVAL_MS = 1500;

let baseTitle = "";
let blinkTimer: number | null = null;
let blinkState = false;
let isHidden = false;
let activeInstance = 0;

function pluralizeMessages(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;

  if (mod10 === 1 && mod100 !== 11) return `${n} новое сообщение`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20))
    return `${n} новых сообщения`;

  return `${n} новых сообщений`;
}

function stopBlinking(): void {
  if (blinkTimer !== null) {
    clearInterval(blinkTimer);

    blinkTimer = null;
  }

  blinkState = false;

  if (baseTitle) document.title = baseTitle;
}

function startBlinking(totalUnread: number): void {
  if (!baseTitle) baseTitle = document.title;

  const unreadLabel = pluralizeMessages(totalUnread);

  if (blinkTimer !== null) clearInterval(blinkTimer);

  document.title = unreadLabel;
  blinkState = true;

  blinkTimer = window.setInterval(() => {
    blinkState = !blinkState;
    document.title = blinkState ? unreadLabel : baseTitle;
  }, BLINK_INTERVAL_MS);
}

export function useTitleNotifier(): void {
  const instanceId = ++activeInstance;
  const chatStore = useChatStore();
  const { unreadCounts } = storeToRefs(chatStore);

  const totalUnread = (): number => {
    let sum = 0;
    for (const count of unreadCounts.value.values()) sum += count;
    return sum;
  };

  const update = (): void => {
    if (instanceId !== activeInstance) return;

    const total = totalUnread();

    if (total > 0 && isHidden) {
      startBlinking(total);
    } else {
      stopBlinking();
    }
  };

  const handleVisibility = (): void => {
    isHidden = document.hidden;

    update();
  };

  onMounted(() => {
    baseTitle = document.title;
    isHidden = document.hidden;
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleVisibility);
    window.addEventListener("blur", handleVisibility);

    update();
  });

  watch(unreadCounts, () => update(), { deep: true });

  onUnmounted(() => {
    document.removeEventListener("visibilitychange", handleVisibility);
    window.removeEventListener("focus", handleVisibility);
    window.removeEventListener("blur", handleVisibility);

    stopBlinking();
  });
}
