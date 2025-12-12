import { watch } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/entities/user/store/user.store'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'main',
            component: () => import('@/pages/main/MainPage.vue'),
            meta: { requiresAuth: false }
        },
        {
            path: '/auth',
            name: 'auth',
            component: () => import('@/pages/auth/AuthPage.vue'),
            meta: { requiresAuth: false, redirectIfAuth: true }
        },
        {
            path: '/chat',
            name: 'chat',
            component: () => import('@/pages/chat/ChatPage.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/'
        }
    ]
})

router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()

    if (userStore.isLoading) {
        await new Promise<void>(resolve => {
            const unwatch = watch(
                () => userStore.isLoading,
                loading => {
                    if (!loading) {
                        unwatch()
                        resolve()
                    }
                }
            )
        })
    }

    const requiresAuth = to.meta.requiresAuth
    const redirectIfAuth = to.meta.redirectIfAuth
    const isAuthenticated = userStore.isAuthenticated

    if (requiresAuth && !isAuthenticated) {
        next({ name: 'auth', query: { redirect: to.fullPath } })
    } else if (redirectIfAuth && isAuthenticated) {
        next({ name: 'chat' })
    } else {
        next()
    }
})

export default router
