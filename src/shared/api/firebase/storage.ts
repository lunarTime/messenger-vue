import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '@/app/providers/firebase'

export async function uploadAvatar(userId: string, file: File): Promise<string> {
    if (!file.type.startsWith('image/')) {
        throw new Error('Файл должен быть изображением')
    }

    if (file.size > 5 * 1024 * 1024) {
        throw new Error('Размер файла не должен превышать 5MB')
    }

    const fileName = `${Date.now()}_${file.name}`
    const storageRef = ref(storage, `avatars/${userId}/${fileName}`)

    await uploadBytes(storageRef, file)

    const downloadURL = await getDownloadURL(storageRef)

    return downloadURL
}

export async function deleteAvatar(photoURL: string) {
    const path = extractPathFromURL(photoURL)

    if (!path) {
        return
    }

    const storageRef = ref(storage, path)

    await deleteObject(storageRef)
}

function extractPathFromURL(url: string): string | null {
    try {
        const urlObj = new URL(url)
        const path = urlObj.pathname.split('/o/')[1]?.split('?')[0]

        return path ? decodeURIComponent(path) : null
    } catch {
        return null
    }
}
