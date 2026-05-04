import { ref } from "vue";
import { defineStore } from "pinia";
import type { ReplyContext, ForwardContext } from "@/shared/types/message";

export type { ReplyContext, ForwardContext };

export const useMessageCompose = defineStore("messageCompose", () => {
  const replyContext = ref<ReplyContext | null>(null);
  const forwardContext = ref<ForwardContext | null>(null);

  const setReply = (ctx: ReplyContext) => {
    replyContext.value = ctx;
    forwardContext.value = null;
  };

  const setForward = (ctx: ForwardContext) => {
    forwardContext.value = ctx;
    replyContext.value = null;
  };

  const clearReply = () => {
    replyContext.value = null;
  };

  const clearForward = () => {
    forwardContext.value = null;
  };

  return {
    replyContext,
    forwardContext,
    setReply,
    setForward,
    clearReply,
    clearForward,
  };
});
