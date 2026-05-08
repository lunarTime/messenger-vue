import { ref, watch, nextTick, type Ref } from "vue";
import { useThrottleFn } from "@vueuse/core";

interface UseVirtualScrollOptions {
  onLoadMore?: () => Promise<void>;
  loadMoreThreshold?: number;
}

export function useVirtualScroll(
  containerRef: Ref<HTMLElement | null>,
  options: UseVirtualScrollOptions = {},
) {
  const { onLoadMore, loadMoreThreshold = 150 } = options;

  const isUserScrolling = ref(false);
  const isLoadingMore = ref(false);

  const scrollToBottom = useThrottleFn(async (smooth = true) => {
    await nextTick();

    if (!containerRef.value) {
      return;
    }

    containerRef.value.scrollTo({
      top: containerRef.value.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });

    isUserScrolling.value = false;
  }, 100);

  const handleScroll = useThrottleFn(async () => {
    if (!containerRef.value || !onLoadMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.value;

    isUserScrolling.value = scrollTop + clientHeight < scrollHeight - 100;

    const distanceFromTop = scrollTop;

    if (distanceFromTop < loadMoreThreshold && !isLoadingMore.value) {
      isLoadingMore.value = true;

      try {
        await onLoadMore();
      } finally {
        isLoadingMore.value = false;
      }
    }
  }, 100);

  const setupScrollListener = () => {
    if (!containerRef.value) return;

    containerRef.value.addEventListener("scroll", handleScroll);
  };

  const removeScrollListener = () => {
    if (!containerRef.value) return;

    containerRef.value.removeEventListener("scroll", handleScroll);
  };

  watch(
    () => containerRef.value,
    (newContainer, oldContainer) => {
      if (oldContainer) removeScrollListener();
      if (newContainer) setupScrollListener();
    },
  );

  return {
    isUserScrolling,
    isLoadingMore,
    scrollToBottom,
    setupScrollListener,
    removeScrollListener,
  };
}
