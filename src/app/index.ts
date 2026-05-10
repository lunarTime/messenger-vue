import type { App } from 'vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import { useUserStore } from '@/entities/user/store/user.store'
import { setupStore } from '@/app/providers/store'
import { setupRouter } from '@/app/providers/router'
import { customTheme } from '@/app/config/theme'

function setupPrimeVue(app: App) {
    app.use(ConfirmationService)
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

export function initializeApp(app: App) {
    setupStore(app)
    setupRouter(app)
    setupPrimeVue(app)

    app.runWithContext(() => {
        const userStore = useUserStore()
        userStore.initAuth()
        window.addEventListener('beforeunload', () => userStore.setOfflineStatus())
    })
}
