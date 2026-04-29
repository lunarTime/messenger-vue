import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './index'

export async function uploadFile(path: string, file: File): Promise<string> {
    const storageRef = ref(storage, path)

    await uploadBytes(storageRef, file)

    return await getDownloadURL(storageRef)
}

export async function deleteFile(path: string): Promise<void> {
    const storageRef = ref(storage, path)

    await deleteObject(storageRef)
}

export async function uploadUserAvatar(userId: string, file: File): Promise<string> {
    const path = `avatars/${userId}/${Date.now()}_${file.name}`

    return await uploadFile(path, file)
}

export async function uploadChatImage(chatId: string, file: File): Promise<string> {
    const path = `chats/${chatId}/${Date.now()}_${file.name}`

    return await uploadFile(path, file)
}
