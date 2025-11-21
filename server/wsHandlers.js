import { v4 as uuid } from 'uuid'
import { ensureChatExists, getAllChats } from './services/chatService.js'
import { saveMessage, getMessages } from './services/messageService.js'
import { sendToClientId, broadcastToAll } from './connectionManager.js'

const clientToUser = new Map()
const userToClients = new Map()

const registerUser = (clientId, userId) => {
    clientToUser.set(clientId, userId)

    if (!userToClients.has(userId)) {
        userToClients.set(userId, new Set())
    }

    userToClients.get(userId).add(clientId)

    broadcastUsers()
}

const broadcastUsers = () => {
    broadcastToAll({
        type: 'users_online',
        payload: Array.from(userToClients.keys())
    })
}

export const handleClientDisconnect = clientId => {
    const userId = clientToUser.get(clientId)

    if (!userId) {
        return
    }

    clientToUser.delete(clientId)

    const set = userToClients.get(userId)

    if (set) {
        set.delete(clientId)

        if (!set.size) {
            userToClients.delete(userId)
        }
    }

    broadcastUsers()
}

export const handleIncomingMessage = (clientId, data) => {
    const { type, payload } = data

    switch (type) {
        case 'register_user':
            registerUser(clientId, payload.userId)

            break

        case 'get_chats': {
            const chats = getAllChats(payload.userId)

            sendToClientId(clientId, { type: 'chats', payload: chats })

            break
        }

        case 'load_messages': {
            const items = getMessages(payload.chatId)

            sendToClientId(clientId, {
                type: 'messages',
                payload: { chatId: payload.chatId, items }
            })

            break
        }

        case 'send_message': {
            const { userId, text, chatId, targetUserId } = payload
            const chat = ensureChatExists([userId, targetUserId], chatId)
            const msg = {
                id: uuid(),
                chatId: chat.id,
                userId,
                text,
                createdAt: Date.now()
            }

            saveMessage(msg)

            for (const participant of chat.participants) {
                const set = userToClients.get(participant)

                if (!set) {
                    continue
                }

                for (const cid of set) {
                    sendToClientId(cid, {
                        type: 'message',
                        payload: msg
                    })
                }

                const chats = getAllChats(participant)

                for (const cid of set) {
                    sendToClientId(cid, {
                        type: 'chats',
                        payload: chats
                    })
                }
            }

            break
        }
    }
}
