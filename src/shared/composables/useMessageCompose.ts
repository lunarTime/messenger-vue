import { ref } from "vue";
import { defineStore } from "pinia";
import type { ReplyContext, ForwardContext, Message } from "@/shared/types/message";

export type { ReplyContext, ForwardContext };

export const useMessageCompose = defineStore("messageCompose", () => {
  const replyContext = ref<ReplyContext | null>(null);
  const forwardContext = ref<ForwardContext | null>(null);
  const forwardManyContext = ref<Message[] | null>(null);

  const setReply = (ctx: ReplyContext) => {
    replyContext.value = ctx;
    forwardContext.value = null;
    forwardManyContext.value = null;
  };

  const setForward = (ctx: ForwardContext) => {
    forwardContext.value = ctx;
    forwardManyContext.value = null;
    replyContext.value = null;
  };

  const setForwardMany = (messages: Message[]) => {
    forwardManyContext.value = messages;
    forwardContext.value = null;
    replyContext.value = null;
  };

  const clearReply = () => {
    replyContext.value = null;
  };

  const clearForward = () => {
    forwardContext.value = null;
    forwardManyContext.value = null;
  };

  return {
    replyContext,
    forwardContext,
    forwardManyContext,
    setReply,
    setForward,
    setForwardMany,
    clearReply,
    clearForward,
  };
});
