export interface LoginFormData {
    email: string
    password: string
}

export interface RegisterFormData {
    email: string
    password: string
    firstName: string
    lastName: string
}

export interface AuthResponse {
    user: {
        uid: string
        email: string | null
        displayName: string | null
        photoURL: string | null
    }
}

export type FirebaseAuthErrorCode =
    | 'auth/email-already-in-use'
    | 'auth/invalid-email'
    | 'auth/operation-not-allowed'
    | 'auth/weak-password'
    | 'auth/user-disabled'
    | 'auth/user-not-found'
    | 'auth/wrong-password'
    | 'auth/too-many-requests'
    | 'auth/network-request-failed'
    | 'auth/popup-closed-by-user'

export interface FirebaseAuthError extends Error {
    code: FirebaseAuthErrorCode
}
