import { onMounted, onUnmounted } from "vue";

export function useSwipeBack(onSwipeBack: () => void, threshold = 60) {
  let startX = 0;
  let startY = 0;

  const onTouchStart = (e: TouchEvent) => {
    startX = e.touches[0]!.clientX;
    startY = e.touches[0]!.clientY;
  };

  const onTouchEnd = (e: TouchEvent) => {
    const dx = e.changedTouches[0]!.clientX - startX;
    const dy = Math.abs(e.changedTouches[0]!.clientY - startY);

    if (dx > threshold && dy < threshold) {
      onSwipeBack();
    }
  };

  onMounted(() => {
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
  });

  onUnmounted(() => {
    document.removeEventListener("touchstart", onTouchStart);
    document.removeEventListener("touchend", onTouchEnd);
  });
}
