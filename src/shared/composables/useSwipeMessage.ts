import { ref } from "vue";

interface SwipeMessageOptions {
  onSwipeLeft: () => void;
  threshold?: number;
  maxVertical?: number;
}

export function useSwipeMessage(options: SwipeMessageOptions) {
  const { onSwipeLeft, threshold = 50, maxVertical = 40 } = options;

  const swipeOffset = ref(0);
  const isSwiping = ref(false);

  let startX = 0;
  let startY = 0;
  let isTracking = false;
  let triggered = false;

  const onTouchStart = (e: TouchEvent) => {
    startX = e.touches[0]!.clientX;
    startY = e.touches[0]!.clientY;
    isTracking = true;
    triggered = false;
    isSwiping.value = false;
    swipeOffset.value = 0;
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!isTracking) return;

    const dx = e.touches[0]!.clientX - startX;
    const dy = Math.abs(e.touches[0]!.clientY - startY);

    if (dy > maxVertical) {
      isTracking = false;
      swipeOffset.value = 0;
      isSwiping.value = false;

      return;
    }

    if (dx < 0) {
      isSwiping.value = true;
      swipeOffset.value = Math.max(dx, -threshold * 1.5);

      e.stopPropagation();
    }
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (!isTracking) return;

    const dx = e.changedTouches[0]!.clientX - startX;
    const dy = Math.abs(e.changedTouches[0]!.clientY - startY);

    if (dx < -threshold && dy < maxVertical && !triggered) {
      triggered = true;

      onSwipeLeft();
    }

    isTracking = false;
    isSwiping.value = false;
    swipeOffset.value = 0;
  };

  return {
    swipeOffset,
    isSwiping,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}
