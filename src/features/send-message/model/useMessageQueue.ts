import { ref } from "vue";
import { defineStore } from "pinia";
import type { SendMessageOptions } from "@/shared/types/message";

export interface QueuedMessage {
  id: string;
  text: string;
  options: SendMessageOptions;
  status: "pending" | "sending" | "failed";
  createdAt: Date;
}

const MAX_QUEUE_SIZE = 10;

export const useMessageQueue = defineStore("messageQueue", () => {
  const queue = ref<QueuedMessage[]>([]);
  const isProcessing = ref(false);

  let sendFn:
    | ((text: string, options: SendMessageOptions) => Promise<void>)
    | null = null;

  function init(
    fn: (text: string, options: SendMessageOptions) => Promise<void>,
  ) {
    sendFn = fn;
  }

  const isFull = () => queue.value.length >= MAX_QUEUE_SIZE;

  function enqueue(text: string, options: SendMessageOptions): boolean {
    if (isFull()) return false;

    queue.value.push({
      id: crypto.randomUUID(),
      text,
      options,
      status: "pending",
      createdAt: new Date(),
    });

    if (!isProcessing.value) {
      processNext();
    }

    return true;
  }

  async function processNext(): Promise<void> {
    if (!sendFn) return;

    const item = queue.value.find((m) => m.status === "pending");

    if (!item) {
      isProcessing.value = false;

      return;
    }

    isProcessing.value = true;
    item.status = "sending";

    try {
      await sendFn(item.text, item.options);

      queue.value = queue.value.filter((m) => m.id !== item.id);
    } catch {
      item.status = "failed";
    }

    processNext();
  }

  async function retry(id: string): Promise<void> {
    const item = queue.value.find((m) => m.id === id && m.status === "failed");

    if (!item) return;

    item.status = "pending";

    if (!isProcessing.value) {
      processNext();
    }
  }

  function dismiss(id: string): void {
    queue.value = queue.value.filter((m) => m.id !== id);
  }

  function clear(): void {
    queue.value = queue.value.filter((m) => m.status === "sending");
  }

  return {
    queue,
    isProcessing,
    isFull,
    init,
    enqueue,
    retry,
    dismiss,
    clear,
  };
});
