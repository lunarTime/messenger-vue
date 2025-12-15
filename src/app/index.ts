import type { App } from 'vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import { useUserStore } from '@/entities/user/store/user.store'
import { useChatStore } from '@/entities/chat/store/chat.store'
import { useMessageStore } from '@/entities/message/store/message.store'
import { setupStore } from '@/app/providers/store'
import { setupRouter } from '@/app/providers/router'
import { customTheme } from '@/app/config/theme'

function setupPrimeVue(app: App) {
    app.use(ToastService)
    app.use(PrimeVue, {
        theme: {
            preset: customTheme,
            options: {
                darkModeSelector: '.dark',
                cssLayer: false
            }
        },
        ripple: true
    })
}

async function initializeAuth() {
    const userStore = useUserStore()

    userStore.initAuth()

    await new Promise<void>(resolve => {
        if (!userStore.isLoading) {
            resolve()

            return
        }

        const checkLoading = setInterval(() => {
            if (!userStore.isLoading) {
                clearInterval(checkLoading)
                resolve()
            }
        }, 50)

        setTimeout(() => {
            clearInterval(checkLoading)
            resolve()
        }, 5000)
    })
}

function setupAppLifecycle() {
    const userStore = useUserStore()
    const chatStore = useChatStore()
    const messageStore = useMessageStore()

    window.addEventListener('beforeunload', () => {
        userStore.setOfflineStatus()
        chatStore.cleanup()
        messageStore.cleanup()
    })
}

export async function initializeApp(app: App) {
    setupStore(app)
    setupRouter(app)
    setupPrimeVue(app)
    await initializeAuth()
    setupAppLifecycle()
}
