import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    serverTimestamp,
    type Unsubscribe
} from 'firebase/firestore'
import { db } from '@/app/providers/firebase'
import type { Chat } from '@/shared/types/chat'
import type { Message } from '@/shared/types/message'
import type { User } from '@/shared/types/user'

export async function getUserById(userId: string): Promise<User | null> {
    const userDoc = await getDoc(doc(db, 'users', userId))

    return userDoc.exists() ? (userDoc.data() as User) : null
}

export async function updateUserProfile(userId: string, data: Partial<User>) {
    await updateDoc(doc(db, 'users', userId), {
        ...data,
        lastSeen: serverTimestamp()
    })
}

export async function setUserOnlineStatus(userId: string, isOnline: boolean) {
    await updateDoc(doc(db, 'users', userId), {
        isOnline,
        lastSeen: serverTimestamp()
    })
}

export async function getOrCreateDirectChat(userId1: string, userId2: string): Promise<string> {
    const participants = [userId1, userId2].sort()
    const q = query(collection(db, 'chats'), where('type', '==', 'direct'), where('participants', '==', participants))
    const snapshot = await getDocs(q)

    if (!snapshot.empty && snapshot.docs[0]) {
        return snapshot.docs[0].id
    }

    const chatRef = await addDoc(collection(db, 'chats'), {
        type: 'direct',
        participants,
        lastMessage: {
            text: '',
            senderId: '',
            createdAt: serverTimestamp()
        },
        createdBy: userId1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    })

    return chatRef.id
}

export function subscribeToUserChats(userId: string, callback: (chats: Chat[]) => void): Unsubscribe {
    const q = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', userId),
        orderBy('updatedAt', 'desc')
    )

    return onSnapshot(q, snapshot => {
        const chats = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Chat[]

        callback(chats)
    })
}

export async function sendMessage(chatId: string, senderId: string, text: string) {
    const messageData = {
        chatId,
        senderId,
        text,
        createdAt: serverTimestamp()
    }

    await addDoc(collection(db, 'chats', chatId, 'messages'), messageData)

    await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: {
            text,
            senderId,
            createdAt: serverTimestamp()
        },
        updatedAt: serverTimestamp()
    })
}

export async function searchUsers(searchTerm: string): Promise<User[]> {
    if (!searchTerm.trim()) {
        return []
    }

    const normalizedSearch = searchTerm.toLowerCase().trim()
    const usersRef = collection(db, 'users')
    const emailQuery = query(
        usersRef,
        where('email', '>=', normalizedSearch),
        where('email', '<=', normalizedSearch + '\uf8ff'),
        limit(20)
    )

    const nameQuery = query(
        usersRef,
        where('displayName', '>=', normalizedSearch),
        where('displayName', '<=', normalizedSearch + '\uf8ff'),
        limit(20)
    )

    const [emailSnapshot, nameSnapshot] = await Promise.all([getDocs(emailQuery), getDocs(nameQuery)])

    const userMap = new Map<string, User>()

    emailSnapshot.docs.forEach(doc => {
        userMap.set(doc.id, { id: doc.id, ...doc.data() } as User)
    })

    nameSnapshot.docs.forEach(doc => {
        userMap.set(doc.id, { id: doc.id, ...doc.data() } as User)
    })

    return Array.from(userMap.values())
}

export function subscribeToChatMessages(chatId: string, callback: (messages: Message[]) => void): Unsubscribe {
    const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt', 'desc'), limit(100))

    return onSnapshot(q, snapshot => {
        const messages = snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            .reverse() as Message[]

        callback(messages)
    })
}
