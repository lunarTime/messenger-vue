import { onMounted, onUnmounted, watch, nextTick, type Ref } from "vue";

export function useIntersectionObserver(
  target: Ref<HTMLElement | null>,
  callback: () => void,
  root?: Ref<HTMLElement | null>,
  options: Omit<IntersectionObserverInit, "root"> = { threshold: 0.5 },
) {
  let observer: IntersectionObserver | null = null;

  const stopObserving = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };

  const startObserving = () => {
    stopObserving();
    if (!target.value) return;

    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          callback();
          stopObserving();
        }
      },
      { ...options, root: root?.value ?? null },
    );

    observer.observe(target.value);
  };

  onMounted(async () => {
    await nextTick();
    startObserving();
  });

  watch(
    () => root?.value,
    async () => {
      if (!observer) return;
      await nextTick();
      startObserving();
    },
  );

  onUnmounted(() => {
    stopObserving();
  });

  return { stopObserving, startObserving };
}
