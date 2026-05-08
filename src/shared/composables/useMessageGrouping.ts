import { computed, type Ref } from "vue";
import type { Message } from "@/shared/types/message";

export interface MessageGroup {
  type: "user" | "system";
  senderId?: string;
  messages: Message[];
}

export interface DateGroup {
  date: string;
  groups: MessageGroup[];
}

const formatDateLabel = (date: Date) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);

  yesterday.setDate(yesterday.getDate() - 1);

  const messageDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  if (messageDate.getTime() === today.getTime()) return "Сегодня";
  if (messageDate.getTime() === yesterday.getTime()) return "Вчера";

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
  };

  if (date.getFullYear() !== now.getFullYear()) {
    options.year = "numeric";
  }

  return date.toLocaleDateString("ru-RU", options);
};

export function useMessageGrouping(messages: Ref<Message[]>) {
  const groupedMessages = computed(() => {
    const dateMap = new Map<string, DateGroup>();
    const dateOrder: string[] = [];

    for (const message of messages.value) {
      if (!message.createdAt) continue;

      const date = message.createdAt.toDate();
      const dateLabel = formatDateLabel(date);

      let dateGroup = dateMap.get(dateLabel);

      if (!dateGroup) {
        dateGroup = { date: dateLabel, groups: [] };
        dateMap.set(dateLabel, dateGroup);
        dateOrder.push(dateLabel);
      }

      const groups = dateGroup.groups;
      const last = groups.length > 0 ? groups[groups.length - 1] : null;

      if (message.type === "system") {
        groups.push({ type: "system", messages: [message] });
      } else if (last?.type === "user" && last.senderId === message.senderId) {
        last.messages.push(message);
      } else {
        groups.push({
          type: "user",
          senderId: message.senderId,
          messages: [message],
        });
      }
    }

    return dateOrder.map((label) => dateMap.get(label)!);
  });

  return { groupedMessages };
}
