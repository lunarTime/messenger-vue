import { ref, type Ref } from "vue";
import { rewriteText } from "@/shared/api/gigachat";

export function useAiRewrite(messageRef: Ref<string>) {
  const isRewriting = ref(false);
  const aiError = ref<string | null>(null);

  const handleRewrite = async () => {
    const textToRewrite = messageRef.value.trim();

    if (!textToRewrite) return;

    isRewriting.value = true;
    aiError.value = null;

    try {
      const rewritten = await rewriteText(textToRewrite);

      if (rewritten) {
        messageRef.value = rewritten;
      }
    } catch (error) {
      aiError.value = `Ошибка ИИ. Попробуйте позже. Ошибка: ${error}`;

      setTimeout(() => {
        aiError.value = null;
      }, 3000);
    } finally {
      isRewriting.value = false;
    }
  };

  return {
    isRewriting,
    aiError,
    handleRewrite,
  };
}
