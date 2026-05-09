import { onMounted, onUnmounted, watch, nextTick, type Ref } from "vue";

const registry = new WeakMap<
  Element | Document,
  { observer: IntersectionObserver; callbacks: Map<Element, () => void> }
>();

function getSharedObserver(
  root: Element | null,
  options: Omit<IntersectionObserverInit, "root">,
) {
  const key = root ?? document;

  if (registry.has(key)) return registry.get(key)!;

  const callbacks = new Map<Element, () => void>();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const cb = callbacks.get(entry.target);

          if (cb) {
            cb();

            observer.unobserve(entry.target);
            callbacks.delete(entry.target);
          }
        }
      });
    },
    { ...options, root },
  );

  registry.set(key, { observer, callbacks });

  return { observer, callbacks };
}

export function useIntersectionObserver(
  target: Ref<HTMLElement | null>,
  callback: () => void,
  root?: Ref<HTMLElement | null>,
  options: Omit<IntersectionObserverInit, "root"> = { threshold: 0.5 },
) {
  let registeredRoot: Element | null | undefined = undefined;
  let registeredTarget: Element | null = null;

  const stopObserving = () => {
    if (!registeredTarget || registeredRoot === undefined) return;

    const key = registeredRoot ?? document;
    const entry = registry.get(key);

    if (entry) {
      entry.observer.unobserve(registeredTarget);
      entry.callbacks.delete(registeredTarget);
    }

    registeredTarget = null;
    registeredRoot = undefined;
  };

  const startObserving = () => {
    stopObserving();

    if (!target.value) return;

    registeredRoot = root?.value ?? null;
    registeredTarget = target.value;

    const { observer, callbacks } = getSharedObserver(registeredRoot, options);

    callbacks.set(registeredTarget, callback);
    observer.observe(registeredTarget);
  };

  onMounted(async () => {
    await nextTick();

    startObserving();
  });

  watch(
    () => root?.value,
    async () => {
      await nextTick();

      startObserving();
    },
  );

  onUnmounted(() => {
    stopObserving();
  });

  return { stopObserving, startObserving };
}
