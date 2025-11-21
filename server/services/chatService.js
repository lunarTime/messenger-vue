import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DB_DIR = path.join(__dirname, '..', 'db')
const CHATS_PATH = path.join(DB_DIR, 'chats.json')

if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true })
}

if (!fs.existsSync(CHATS_PATH)) {
    fs.writeFileSync(CHATS_PATH, JSON.stringify([], null, 2))
}

const load = () => JSON.parse(fs.readFileSync(CHATS_PATH, 'utf8'))
const save = data => fs.writeFileSync(CHATS_PATH, JSON.stringify(data, null, 2))

export const ensureChatExists = (participants, chatId) => {
    const chats = load()
    const id = chatId || participants.sort().join(':')
    let chat = chats.find(c => c.id === id)

    if (!chat) {
        chat = {
            id,
            participants,
            lastMessage: '',
            updatedAt: Date.now()
        }

        chats.push(chat)
        save(chats)
    }

    return chat
}

export const getAllChats = userId => {
    const chats = load()

    if (!userId) {
        return chats
    }

    return chats.filter(c => c.participants.includes(userId))
}
