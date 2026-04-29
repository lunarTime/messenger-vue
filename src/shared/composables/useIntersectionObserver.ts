import { onMounted, onUnmounted, type Ref } from "vue";

export function useIntersectionObserver(
  target: Ref<HTMLElement | null>,
  callback: () => void,
  options: IntersectionObserverInit = { threshold: 0.5 },
) {
  let observer: IntersectionObserver | null = null;

  const startObserving = () => {
    if (!target.value) return;

    observer = new IntersectionObserver((entries) => {
      const entry = entries[0];

      if (entry?.isIntersecting) {
        callback();
        stopObserving();
      }
    }, options);

    observer.observe(target.value);
  };

  const stopObserving = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };

  onMounted(() => {
    startObserving();
  });

  onUnmounted(() => {
    stopObserving();
  });

  return {
    stopObserving,
    startObserving,
  };
}
