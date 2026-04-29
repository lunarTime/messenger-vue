import { createApp } from 'vue'
import { initializeApp } from '@/app/index'
import App from '@/App.vue'

import 'primeicons/primeicons.css'
import '@/shared/api/firebase'
import '@/assets/main.css'

async function bootstrap() {
    const app = createApp(App)

    await initializeApp(app)

    app.mount('#app')
}

bootstrap()
