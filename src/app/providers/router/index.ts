import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'main',
        component: () => import('@/pages/main/MainPage.vue')
    },
    {
        path: '/chat',
        name: 'chat',
        component: () => import('@/pages/chat/ChatPage.vue')
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router
