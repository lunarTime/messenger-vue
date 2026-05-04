import { ref, onMounted, onUnmounted } from "vue";

const MOBILE_BREAKPOINT = 767;

export function useIsMobile() {
  const isMobile = ref(false);

  const update = () => {
    isMobile.value = window.innerWidth <= MOBILE_BREAKPOINT;
  };

  onMounted(() => {
    update();
    window.addEventListener("resize", update);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", update);
  });

  return { isMobile };
}
