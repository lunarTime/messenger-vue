import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/entities/user/store/user.store'

export function useAuthNavigation() {
    const router = useRouter()
    const userStore = useUserStore()

    async function navigateAfterAuth(targetRoute = 'chat', maxWaitTime = 5000): Promise<void> {
        if (userStore.isAuthenticated) {
            await router.replace({ name: targetRoute })

            return Promise.resolve()
        }

        return new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
                stopWatch()
                reject(new Error('Время авторизации вышло'))
            }, maxWaitTime)

            const stopWatch = watch(
                () => userStore.isAuthenticated,
                isAuth => {
                    if (isAuth) {
                        clearTimeout(timeout)
                        stopWatch()
                        router
                            .replace({ name: targetRoute })
                            .then(() => {
                                resolve()
                            })
                            .catch(reject)
                    }
                },
                { immediate: true }
            )
        })
    }

    async function navigateAfterAuthFast(targetRoute = 'chat', maxWaitTime = 5000): Promise<void> {
        const startTime = Date.now()

        while (!userStore.isAuthenticated) {
            if (Date.now() - startTime > maxWaitTime) {
                throw new Error('Ошибка авторизации: превышено время ожидания')
            }

            await new Promise(resolve => setTimeout(resolve, 100))
        }

        await router.replace({ name: targetRoute })
    }

    return {
        navigateAfterAuth,
        navigateAfterAuthFast
    }
}
