import type { Timestamp } from 'firebase/firestore'
export type ChatType = 'direct' | 'group'
export type ChatMemberRole = 'admin' | 'member'

export interface Chat {
    id: string
    type: ChatType
    participants: string[]
    createdAt: Timestamp
    updatedAt: Timestamp
    createdBy: string
    name?: string
    photoURL?: string
    description?: string
    lastMessage?: {
        text: string
        senderId: string
        createdAt: Timestamp
    }
}

export interface ChatMember {
    id: string
    chatId: string
    userId: string
    role: ChatMemberRole
    joinedAt: Timestamp
    addedBy?: string
    leftAt?: Timestamp
    lastReadMessageId?: string
    lastReadAt?: Timestamp
    notificationsEnabled: boolean
    isPinned: boolean
    isMuted: boolean
    mutedUntil?: Timestamp
    unreadCount: number
}

export interface ChatPreviewViewModel {
    id: string
    type: ChatType
    name?: string
    photoURL?: string
    description?: string
    lastMessage?: {
        id: string
        text: string
        senderId: string
        senderName: string
        createdAt: Date
        hasAttachments: boolean
    }
    otherParticipants?: Array<{
        id: string
        name: string
        photo: string | null
        isOnline: boolean
        lastSeen: Date
    }>
    myRole: ChatMemberRole
    unreadCount: number
    isPinned: boolean
    isMuted: boolean
    mutedUntil?: Date
    lastReadAt?: Date

    createdAt: Date
    updatedAt: Date
}

export interface ChatTyping {
    id: string
    chatId: string
    userId: string
    startedAt: Timestamp
}

export interface ChatTypingViewModel {
    chatId: string
    users: Array<{
        id: string
        name: string
        photo: string | null
    }>
}
