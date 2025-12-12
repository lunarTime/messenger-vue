import type { Timestamp } from 'firebase/firestore'

export interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    displayName: string
    photoURL: string | null
    bio?: string
    isOnline: boolean
    lastSeen: Timestamp
    createdAt: Timestamp
    updatedAt: Timestamp
    fcmTokens?: string[]
}

export interface UserUpdateData {
    firstName?: string
    lastName?: string
    displayName?: string
    photoURL?: string | null
    bio?: string
}

export interface UserViewModel extends Omit<User, 'lastSeen' | 'createdAt' | 'updatedAt' | 'fcmTokens'> {
    lastSeen: Date
    createdAt: Date
    updatedAt: Date
}

export interface UserBlock {
    id: string
    userId: string
    blockedUserId: string
    createdAt: Timestamp
}

export interface UserSettings {
    userId: string
    notificationsEnabled: boolean
    soundEnabled: boolean
    theme: 'light' | 'dark' | 'auto'
    language: string
}
