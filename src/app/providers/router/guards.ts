import type { Router } from "vue-router";
import { watch } from "vue";
import { useUserStore } from "@/entities/user/store/user.store";

export function setupRouterGuards(router: Router) {
  router.beforeEach((to, _from, next) => {
    const userStore = useUserStore();

    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const requiresGuest = to.matched.some(
      (record) => record.meta.requiresGuest,
    );

    if (userStore.isLoading) {
      const hasCache = !!userStore.cachedUserId;

      if (requiresAuth && !hasCache) return next({ name: "auth" });
      if (requiresGuest && hasCache) return next({ name: "chat" });

      return next();
    }

    if (requiresAuth && !userStore.isAuthenticated) {
      next({ name: "auth" });
    } else if (requiresGuest && userStore.isAuthenticated) {
      next({ name: "chat" });
    } else {
      next();
    }
  });

  const userStore = useUserStore();
  const stop = watch(
    () => userStore.isLoading,
    (loading) => {
      if (loading) return;
      stop();

      const route = router.currentRoute.value;
      const requiresAuth = route.matched.some((r) => r.meta.requiresAuth);
      const requiresGuest = route.matched.some((r) => r.meta.requiresGuest);

      if (requiresAuth && !userStore.isAuthenticated) {
        router.replace({ name: "auth" });
      } else if (requiresGuest && userStore.isAuthenticated) {
        router.replace({ name: "chat" });
      }
    },
  );
}
