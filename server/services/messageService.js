import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DB_DIR = path.join(__dirname, '..', 'db')
const MSG_PATH = path.join(DB_DIR, 'messages.json')
const CHATS_PATH = path.join(DB_DIR, 'chats.json')

if (!fs.existsSync(MSG_PATH)) {
    fs.writeFileSync(MSG_PATH, JSON.stringify({}, null, 2))
}

const loadMessages = () => JSON.parse(fs.readFileSync(MSG_PATH, 'utf8'))
const saveMessages = data => fs.writeFileSync(MSG_PATH, JSON.stringify(data, null, 2))

export const getMessages = chatId => {
    const messages = loadMessages()

    return messages[chatId] || []
}

export const saveMessage = msg => {
    const messages = loadMessages()

    if (!messages[msg.chatId]) {
        messages[msg.chatId] = []
    }

    messages[msg.chatId].push(msg)
    saveMessages(messages)

    const chats = JSON.parse(fs.readFileSync(CHATS_PATH, 'utf8'))

    if (!Array.isArray(chats)) {
        console.error('[saveMessage] ERROR: chats.json is not an array!')
        console.error('chats.json content:', chats)

        return
    }

    const chat = chats.find(c => String(c.id) === String(msg.chatId))

    if (!chat) {
        console.error('[saveMessage] ERROR: chat NOT FOUND in chats.json')
        console.error('chatId:', msg.chatId)
        console.error('chats:', chats)

        return
    }

    chat.lastMessage = msg.text
    chat.updatedAt = msg.createdAt

    fs.writeFileSync(CHATS_PATH, JSON.stringify(chats, null, 2))
}
