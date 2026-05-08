import type { Router } from 'vue-router'
import { watch } from 'vue'
import { useUserStore } from '@/entities/user/store/user.store'

export function setupRouterGuards(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    const userStore = useUserStore()

    if (userStore.isLoading) {
      await new Promise<void>((resolve) => {
        let isResolved = false;

        const stop = watch(
          () => userStore.isLoading,
          (loading) => {
            if (!loading && !isResolved) {
              isResolved = true;
              stop();
              resolve();
            }
          },
        );

        setTimeout(() => {
          if (!isResolved) {
            isResolved = true;
            stop();
            resolve();
          }
        }, 10000);
      })
    }

    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
    const requiresGuest = to.matched.some((record) => record.meta.requiresGuest)

    if (requiresAuth && !userStore.isAuthenticated) {
      next({ name: 'auth' })
    } else if (requiresGuest && userStore.isAuthenticated) {
      next({ name: 'chat' })
    } else {
      next()
    }
  })
}
