interface LongPressOptions {
  onLongPress: (pageX: number, pageY: number) => void;
  delay?: number;
}

export function useLongPress({ onLongPress, delay = 500 }: LongPressOptions) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let startX = 0;
  let startY = 0;
  let cancelled = false;

  const onTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0]!;

    startX = touch.clientX;
    startY = touch.clientY;

    const pageX = touch.pageX;
    const pageY = touch.pageY;

    cancelled = false;

    timer = setTimeout(() => {
      if (!cancelled) {
        onLongPress(pageX, pageY);
      }
    }, delay);
  };

  const onTouchMove = (e: TouchEvent) => {
    const dx = Math.abs(e.touches[0]!.clientX - startX);
    const dy = Math.abs(e.touches[0]!.clientY - startY);

    if (dx > 10 || dy > 10) {
      cancel();
    }
  };

  const cancel = () => {
    cancelled = true;

    if (timer !== null) {
      clearTimeout(timer);

      timer = null;
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd: cancel,
    onTouchCancel: cancel,
  };
}
