import { onMounted, onUnmounted } from "vue";
import { isSwipingMessage } from "./useSwipeMessage";

const EDGE_ZONE = 40;

export function useSwipeBack(onSwipeBack: () => void, threshold = 60) {
  let startX = 0;
  let startY = 0;
  let fromEdge = false;

  const onTouchStart = (e: TouchEvent) => {
    startX = e.touches[0]!.clientX;
    startY = e.touches[0]!.clientY;
    fromEdge = startX <= EDGE_ZONE;
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (!fromEdge || isSwipingMessage.value) return;

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
