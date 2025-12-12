import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/entities/user/store/user.store'

export function useAuthNavigation() {
    const router = useRouter()
    const userStore = useUserStore()

    async function navigateAfterAuth(targetRoute = 'chat') {
        return new Promise<void>(resolve => {
            const stopWatch = watch(
                () => userStore.isAuthenticated,
                isAuth => {
                    if (isAuth) {
                        stopWatch()

                        router.replace({ name: targetRoute })

                        resolve()
                    }
                },
                {
                    immediate: true
                }
            )
        })
    }

    return {
        navigateAfterAuth
    }
}
