import { ref } from "vue";

export const isSwipingMessage = ref(false);

interface SwipeMessageOptions {
  onSwipe: () => void;
  direction?: "left" | "right";
  threshold?: number;
  maxOffset?: number;
  maxVertical?: number;
}

export function useSwipeMessage(options: SwipeMessageOptions) {
  const {
    onSwipe,
    direction = "left",
    threshold = 20,
    maxOffset = 20,
    maxVertical = 20,
  } = options;

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

    const isCorrectDirection = direction === "left" ? dx < 0 : dx > 0;

    if (isCorrectDirection) {
      isSwiping.value = true;
      isSwipingMessage.value = true;
      const clamped =
        direction === "left"
          ? Math.max(dx, -maxOffset)
          : Math.min(dx, maxOffset);
      swipeOffset.value = clamped;
      e.stopPropagation();
    }
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (!isTracking) return;

    const dx = e.changedTouches[0]!.clientX - startX;
    const dy = Math.abs(e.changedTouches[0]!.clientY - startY);

    const passed = direction === "left" ? dx < -threshold : dx > threshold;

    if (passed && dy < maxVertical && !triggered) {
      triggered = true;
      onSwipe();
    }

    isTracking = false;
    isSwiping.value = false;
    swipeOffset.value = 0;
    requestAnimationFrame(() => {
      isSwipingMessage.value = false;
    });
  };

  return {
    swipeOffset,
    isSwiping,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}
