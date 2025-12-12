import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    updateProfile,
    type User as FirebaseUser
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/app/providers/firebase'
import type { RegisterFormData } from '@/shared/types/auth'

const googleProvider = new GoogleAuthProvider()

export async function registerWithEmail(data: RegisterFormData) {
    const { email, password, firstName, lastName } = data
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
    })

    await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        email: user.email,
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        photoURL: null,
        isOnline: true,
        lastSeen: serverTimestamp(),
        createdAt: serverTimestamp()
    })

    return user
}

export async function loginWithEmail(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)

    return userCredential.user
}

export async function loginWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user
    const userDoc = doc(db, 'users', user.uid)
    const nameParts = (user.displayName || 'Unknown User').split(' ')
    const firstName = nameParts[0] || 'Unknown'
    const lastName = nameParts.slice(1).join(' ') || ''

    await setDoc(
        userDoc,
        {
            id: user.uid,
            email: user.email,
            firstName,
            lastName,
            displayName: user.displayName || `${firstName} ${lastName}`,
            photoURL: user.photoURL,
            isOnline: true,
            lastSeen: serverTimestamp(),
            createdAt: serverTimestamp()
        },
        { merge: true }
    )

    return user
}

export async function signOut() {
    await firebaseSignOut(auth)
}

export function onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback)
}
