import { createRouter, createWebHistory } from 'vue-router'
import type { App } from 'vue'
import { routes } from '@/app/providers/router/routes'
import { setupRouterGuards } from '@/app/providers/router/guards'

export function setupRouter(app: App) {
    const router = createRouter({
        history: createWebHistory(import.meta.env.BASE_URL),
        routes
    })

    setupRouterGuards(router)

    app.use(router)

    return router
}

export { routes }
