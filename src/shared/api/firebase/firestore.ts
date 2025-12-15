import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    setDoc,
    deleteDoc,
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
import type { Message, MessageStatus } from '@/shared/types/message'
import type { User } from '@/shared/types/user'

export async function getUserById(userId: string): Promise<User | null> {
    if (!userId) return null

    try {
        const userDoc = await getDoc(doc(db, 'users', userId))

        return userDoc.exists() ? ({ id: userDoc.id, ...userDoc.data() } as User) : null
    } catch (error) {
        return null
    }
}

export async function updateUserProfile(userId: string, data: Partial<User>): Promise<void> {
    if (!userId) {
        throw new Error('userId необходим')
    }

    try {
        await updateDoc(doc(db, 'users', userId), {
            ...data,
            lastSeen: serverTimestamp()
        })
    } catch (error) {
        throw error
    }
}

export async function setUserOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    if (!userId) return

    try {
        await updateDoc(doc(db, 'users', userId), {
            isOnline,
            lastSeen: serverTimestamp()
        })
    } catch (error) {}
}

export async function getOrCreateDirectChat(userId1: string, userId2: string): Promise<string> {
    if (!userId1 || !userId2) {
        throw new Error('Необходимы ID обоих пользователей')
    }

    if (userId1 === userId2) {
        throw new Error('Нельзя создать чат с самим собой')
    }

    try {
        const participants = [userId1, userId2].sort()
        const q = query(
            collection(db, 'chats'),
            where('type', '==', 'direct'),
            where('participants', '==', participants)
        )
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

        await Promise.all([
            setDoc(doc(db, 'chats', chatRef.id, 'members', userId1), {
                userId: userId1,
                unreadCount: 0,
                joinedAt: serverTimestamp()
            }),
            setDoc(doc(db, 'chats', chatRef.id, 'members', userId2), {
                userId: userId2,
                unreadCount: 0,
                joinedAt: serverTimestamp()
            })
        ])

        return chatRef.id
    } catch (error) {
        throw error
    }
}

export function subscribeToUserChats(userId: string, callback: (chats: Chat[]) => void): Unsubscribe {
    if (!userId) {
        callback([])

        return () => {}
    }

    const q = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', userId),
        orderBy('updatedAt', 'desc')
    )

    return onSnapshot(
        q,
        snapshot => {
            const chats = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Chat[]
            callback(chats)
        },
        error => {
            callback([])
        }
    )
}

export async function sendMessage(chatId: string, senderId: string, text: string): Promise<string> {
    if (!chatId || !senderId || !text?.trim()) {
        throw new Error('Неверные параметры сообщения')
    }

    const trimmedText = text.trim()

    if (trimmedText.length === 0) {
        throw new Error('Сообщение не может быть пустым')
    }

    if (trimmedText.length > 10000) {
        throw new Error('Слишком длинное сообщение (максимум 10000 символов)')
    }

    try {
        const messageData = {
            chatId,
            senderId,
            type: 'text' as const,
            text: trimmedText,
            isEdited: false,
            isDeleted: false,
            createdAt: serverTimestamp()
        }
        const messageRef = await addDoc(collection(db, 'chats', chatId, 'messages'), messageData)
        const messageId = messageRef.id
        const chatDoc = await getDoc(doc(db, 'chats', chatId))

        if (chatDoc.exists()) {
            const chatData = chatDoc.data() as Chat
            const participants = chatData.participants || []
            const tasks = participants
                .filter(participantId => participantId !== senderId)
                .map(async participantId => {
                    try {
                        await setMessageDeliveryStatus(messageId, chatId, participantId, 'sent')
                        await incrementUnreadCount(chatId, participantId)
                    } catch (error) {}
                })

            await Promise.allSettled(tasks)
        }

        await updateDoc(doc(db, 'chats', chatId), {
            lastMessage: {
                text: trimmedText,
                senderId,
                createdAt: serverTimestamp()
            },
            updatedAt: serverTimestamp()
        })

        return messageId
    } catch (error: any) {
        throw error
    }
}

export async function searchUsers(searchTerm: string): Promise<User[]> {
    if (!searchTerm?.trim()) {
        return []
    }

    try {
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
    } catch (error) {
        return []
    }
}

export function subscribeToChatMessages(
    chatId: string,
    callback: (messages: Message[]) => void,
    currentUserId?: string
): Unsubscribe {
    if (!chatId) {
        callback([])

        return () => {}
    }

    const messagesRef = collection(db, 'chats', chatId, 'messages')
    const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(100))

    return onSnapshot(
        q,
        snapshot => {
            const messages = snapshot.docs
                .map(doc => {
                    const data = doc.data()

                    return {
                        id: doc.id,
                        chatId: data.chatId || chatId,
                        senderId: data.senderId || '',
                        type: (data.type || 'text') as Message['type'],
                        text: data.text || '',
                        createdAt: data.createdAt || null,
                        updatedAt: data.updatedAt || null,
                        isEdited: data.isEdited ?? false,
                        isDeleted: data.isDeleted ?? false,
                        deletedAt: data.deletedAt || null,
                        deletedBy: data.deletedBy || null,
                        replyToMessageId: data.replyToMessageId || null,
                        attachments: data.attachments || null,
                        systemData: data.systemData || null
                    } as Message
                })
                .reverse()

            if (currentUserId) {
                snapshot.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        const messageData = change.doc.data()
                        const messageId = change.doc.id
                        const senderId = messageData.senderId

                        if (senderId && senderId !== currentUserId) {
                            setMessageDeliveryStatus(messageId, chatId, currentUserId, 'delivered')
                        }
                    }
                })
            }

            callback(messages)
        },
        error => {
            callback([])
        }
    )
}

export function subscribeToUser(userId: string, callback: (user: User | null) => void): Unsubscribe {
    if (!userId) {
        callback(null)

        return () => {}
    }

    return onSnapshot(
        doc(db, 'users', userId),
        userDoc => {
            if (userDoc.exists()) {
                callback({ id: userDoc.id, ...userDoc.data() } as User)
            } else {
                callback(null)
            }
        },
        error => {
            callback(null)
        }
    )
}

export async function setTypingStatus(chatId: string, userId: string, isTyping: boolean): Promise<void> {
    if (!chatId || !userId) {
        return
    }

    const typingRef = doc(db, 'chats', chatId, 'typing', userId)

    try {
        if (isTyping) {
            await setDoc(typingRef, {
                userId,
                startedAt: serverTimestamp()
            })
        } else {
            await deleteDoc(typingRef)
        }
    } catch (error) {}
}

export function subscribeToTyping(chatId: string, callback: (typingUsers: string[]) => void): Unsubscribe {
    if (!chatId) {
        callback([])

        return () => {}
    }

    const typingRef = collection(db, 'chats', chatId, 'typing')

    return onSnapshot(
        typingRef,
        snapshot => {
            const typingUsers = snapshot.docs.map(doc => doc.data().userId as string).filter(Boolean)
            callback(typingUsers)
        },
        error => {
            callback([])
        }
    )
}

export async function markChatAsRead(chatId: string, userId: string, lastMessageId?: string): Promise<void> {
    if (!chatId || !userId) {
        return
    }

    try {
        const chatMemberRef = doc(db, 'chats', chatId, 'members', userId)
        const updateData: any = {
            lastReadAt: serverTimestamp(),
            unreadCount: 0
        }

        if (lastMessageId) {
            updateData.lastReadMessageId = lastMessageId
        }

        await setDoc(
            chatMemberRef,
            {
                userId,
                ...updateData
            },
            { merge: true }
        )
    } catch (error) {}
}

export async function incrementUnreadCount(chatId: string, userId: string): Promise<void> {
    if (!chatId || !userId) {
        return
    }

    try {
        const chatMemberRef = doc(db, 'chats', chatId, 'members', userId)
        const chatMemberDoc = await getDoc(chatMemberRef)

        if (chatMemberDoc.exists()) {
            const currentCount = (chatMemberDoc.data().unreadCount || 0) as number

            await updateDoc(chatMemberRef, {
                unreadCount: currentCount + 1
            })
        } else {
            await setDoc(chatMemberRef, {
                userId,
                unreadCount: 1,
                joinedAt: serverTimestamp()
            })
        }
    } catch (error) {}
}

export function subscribeToChatMember(
    chatId: string,
    userId: string,
    callback: (unreadCount: number) => void
): Unsubscribe {
    if (!chatId || !userId) {
        callback(0)

        return () => {}
    }

    const chatMemberRef = doc(db, 'chats', chatId, 'members', userId)

    return onSnapshot(
        chatMemberRef,
        snapshot => {
            if (snapshot.exists()) {
                const data = snapshot.data()
                callback((data.unreadCount || 0) as number)
            } else {
                callback(0)
            }
        },
        error => {
            callback(0)
        }
    )
}

export async function setMessageDeliveryStatus(
    messageId: string,
    chatId: string,
    userId: string,
    status: MessageStatus
): Promise<void> {
    if (!messageId || !chatId || !userId) {
        return
    }

    try {
        const statusRef = doc(db, 'chats', chatId, 'messages', messageId, 'deliveryStatus', userId)
        const statusData: any = {
            messageId,
            chatId,
            userId,
            status
        }

        if (status === 'delivered') {
            statusData.deliveredAt = serverTimestamp()
        } else if (status === 'read') {
            statusData.readAt = serverTimestamp()
            statusData.deliveredAt = serverTimestamp()
        }

        await setDoc(statusRef, statusData, { merge: true })
    } catch (error) {}
}

export function subscribeToMessageDeliveryStatus(
    messageId: string,
    chatId: string,
    userId: string,
    callback: (status: MessageStatus | null) => void
): Unsubscribe {
    if (!messageId || !chatId || !userId) {
        callback(null)

        return () => {}
    }

    const statusRef = doc(db, 'chats', chatId, 'messages', messageId, 'deliveryStatus', userId)

    return onSnapshot(
        statusRef,
        snapshot => {
            if (snapshot.exists()) {
                const data = snapshot.data()
                callback((data.status || 'sent') as MessageStatus)
            } else {
                callback(null)
            }
        },
        error => {
            callback(null)
        }
    )
}
