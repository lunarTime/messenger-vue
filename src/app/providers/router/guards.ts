import type { Router } from 'vue-router'
import { useUserStore } from '@/entities/user/store/user.store'

export function setupRouterGuards(router: Router) {
    router.beforeEach(async (to, _from, next) => {
        const userStore = useUserStore()

        if (userStore.isLoading) {
            await new Promise<void>(resolve => {
                const interval = setInterval(() => {
                    if (!userStore.isLoading) {
                        clearInterval(interval)
                        resolve()
                    }
                }, 50)
            })
        }

        const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
        const requiresGuest = to.matched.some(record => record.meta.requiresGuest)

        if (requiresAuth && !userStore.isAuthenticated) {
            next({ name: 'auth' })
        } else if (requiresGuest && userStore.isAuthenticated) {
            next({ name: 'chat' })
        } else {
            next()
        }
    })
}
