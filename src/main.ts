import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { ws } from '@/shared/api/ws/wsClient'
import { useChatStore } from '@/entities/chat/store/chat.store'
import { useMessageStore } from '@/entities/message/store/message.store'
import { useUserStore } from '@/entities/user/store/user.store'
import { router } from '@/app/providers/router'
import App from '@/App.vue'
import '@/assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const userStore = useUserStore(pinia)
const chatStore = useChatStore(pinia)
const messageStore = useMessageStore(pinia)

ws.on('open', () => {
    userStore.register()
    chatStore.loadChats()
})
ws.on('users_online', chatStore.setOnline)
ws.on('chats', chatStore.setChats)
ws.on('messages', messageStore.setMessages)
ws.on('message', messageStore.addMessage)

app.mount('#app')
