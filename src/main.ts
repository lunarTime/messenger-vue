import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useUserStore } from '@/entities/user/store/user.store'
import { useChatStore } from '@/entities/chat/store/chat.store'
import { useMessageStore } from '@/entities/message/store/message.store'
import { definePreset } from '@primeuix/themes'
import ToastService from 'primevue/toastservice'
import router from '@/app/providers/router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import App from '@/App.vue'
import 'primeicons/primeicons.css'
import '@/app/providers/firebase'
import '@/assets/main.css'

const app = createApp(App)
const pinia = createPinia()
const customTheme = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{orange.50}',
            100: '{orange.100}',
            200: '{orange.200}',
            300: '{orange.300}',
            400: '{orange.400}',
            500: '{orange.500}',
            600: '{orange.600}',
            700: '{orange.700}',
            800: '{orange.800}',
            900: '{orange.900}',
            950: '{orange.950}'
        }
    }
})

app.use(pinia)
app.use(router)
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

const userStore = useUserStore(pinia)
const chatStore = useChatStore(pinia)
const messageStore = useMessageStore(pinia)

userStore.initAuth()

window.addEventListener('beforeunload', () => {
    userStore.setOfflineStatus()
    chatStore.cleanup()
    messageStore.cleanup()
})

app.mount('#app')
