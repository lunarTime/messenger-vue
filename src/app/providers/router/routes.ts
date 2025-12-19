import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'main',
        component: () => import('@/pages/main/MainPage.vue'),
        meta: { requiresGuest: true }
    },
    {
        path: '/auth',
        name: 'auth',
        component: () => import('@/pages/auth/AuthPage.vue'),
        meta: { requiresGuest: true }
    },
    {
        path: '/chat',
        name: 'chat',
        component: () => import('@/pages/chat/ChatPage.vue'),
        meta: { requiresAuth: true }
    }
]
