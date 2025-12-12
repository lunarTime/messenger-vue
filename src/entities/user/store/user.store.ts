import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth'
import { auth } from '@/app/providers/firebase'
import { getUserById, setUserOnlineStatus, searchUsers } from '@/shared/api/firebase/firestore'
import type { User } from '@/shared/types/user'

export const useUserStore = defineStore('user', () => {
    const currentUser = ref<User | null>(null)
    const firebaseUser = ref<FirebaseUser | null>(null)
    const isLoading = ref(true)
    const searchResults = ref<User[]>([])
    const isSearching = ref(false)

    const userId = computed(() => currentUser.value?.id ?? null)
    const isAuthenticated = computed(() => !!currentUser.value)

    const initAuth = () => {
        return onAuthStateChanged(auth, async user => {
            firebaseUser.value = user

            if (user) {
                try {
                    const userData = await getUserById(user.uid)

                    currentUser.value = userData

                    if (userData) {
                        await setUserOnlineStatus(user.uid, true)
                    }
                } catch (error) {
                    console.error('Ошибка загрузки данных пользователя:', error)

                    currentUser.value = null
                }
            } else {
                currentUser.value = null
            }

            isLoading.value = false
        })
    }

    const search = async (searchTerm: string) => {
        if (!searchTerm.trim()) {
            searchResults.value = []

            return
        }

        isSearching.value = true

        try {
            const results = await searchUsers(searchTerm)

            if (userId.value) {
                searchResults.value = results.filter(user => user.id !== userId.value)
            } else {
                searchResults.value = results
            }
        } catch (error) {
            console.error('Ошибка при поиске пользователей:', error)

            searchResults.value = []
        } finally {
            isSearching.value = false
        }
    }

    const clearSearch = () => {
        searchResults.value = []
    }

    const setOfflineStatus = async () => {
        if (userId.value) {
            await setUserOnlineStatus(userId.value, false)
        }
    }

    return {
        currentUser,
        firebaseUser,
        userId,
        isAuthenticated,
        isLoading,
        searchResults,
        isSearching,
        initAuth,
        search,
        clearSearch,
        setOfflineStatus
    }
})
