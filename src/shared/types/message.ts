import type { Timestamp } from 'firebase/firestore'
export type MessageType = 'text' | 'system'
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed'
type MessageAttachmentTypes = 'image' | 'file' | 'video' | 'audio'

export interface Message {
    id: string
    chatId: string
    senderId: string
    type: MessageType
    text: string
    createdAt: Timestamp
    updatedAt?: Timestamp
    isEdited: boolean
    isDeleted: boolean
    deletedAt?: Timestamp
    deletedBy?: string
    replyToMessageId?: string
    attachments?: MessageAttachment[]
    systemData?: SystemMessageData
}

export interface MessageDeliveryStatus {
    id: string
    messageId: string
    userId: string
    chatId: string
    status: MessageStatus
    deliveredAt?: Timestamp
    readAt?: Timestamp
}

export interface MessageAttachment {
    id: string
    type: MessageAttachmentTypes
    url: string
    name: string
    size?: number
    mimeType?: string
    thumbnailUrl?: string
    width?: number
    height?: number
    duration?: number
}

export interface MessageViewModel extends Omit<Message, 'createdAt' | 'updatedAt' | 'deletedAt'> {
    createdAt: Date
    updatedAt?: Date
    deletedAt?: Date
    senderName: string
    senderPhoto: string | null
    myDeliveryStatus?: MessageStatus
    replyToMessage?: {
        id: string
        text: string
        senderName: string
        senderId: string
        hasAttachments: boolean
    }

    readByCount?: number
    totalRecipients?: number
}

export type SystemMessageEventType =
    | 'chat_created'
    | 'user_added'
    | 'user_removed'
    | 'user_left'
    | 'user_joined'
    | 'chat_name_changed'
    | 'chat_photo_changed'
    | 'chat_description_changed'
    | 'user_promoted_to_admin'
    | 'user_demoted_from_admin'

export interface SystemMessageData {
    eventType: SystemMessageEventType
    actorId: string
    targetUserIds?: string[]
    oldValue?: string
    newValue?: string
    metadata?: Record<string, any>
}
