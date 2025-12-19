<script setup lang="ts">
    import { reactive, ref } from 'vue'
    import { useAuthNavigation } from '@/shared/composables/useAuthNavigation'
    import { loginWithEmail } from '@/shared/api/firebase/auth'
    import type { LoginFormData } from '@/shared/types/auth'
    import Button from 'primevue/button'
    import Message from 'primevue/message'
    import FloatLabel from 'primevue/floatlabel'
    import InputText from 'primevue/inputtext'
    import Password from 'primevue/password'

    const { navigateAfterAuthFast } = useAuthNavigation()

    const formData = reactive<LoginFormData>({
        email: '',
        password: ''
    })

    const isLoading = ref(false)
    const error = ref<string | null>(null)

    async function handleEmailLogin() {
        if (!formData.email || !formData.password) {
            error.value = 'Заполните все поля'

            return
        }

        isLoading.value = true
        error.value = null

        try {
            await loginWithEmail(formData.email, formData.password)
            await navigateAfterAuthFast()
        } catch (e: any) {
            error.value = getErrorMessage(e.code)
        } finally {
            isLoading.value = false
        }
    }

    function getErrorMessage(code: string): string {
        const messages: Record<string, string> = {
            'auth/invalid-email': 'Неверный формат email',
            'auth/user-disabled': 'Аккаунт заблокирован',
            'auth/user-not-found': 'Пользователь не найден',
            'auth/wrong-password': 'Неверный пароль',
            'auth/too-many-requests': 'Слишком много попыток. Попробуйте позже',
            'auth/network-request-failed': 'Ошибка сети'
        }

        return messages[code] || 'Произошла ошибка. Попробуйте еще раз'
    }
</script>

<template>
    <div>
        <Message
            v-if="error"
            severity="error"
            class="mb-6"
        >
            {{ error }}
        </Message>

        <form
            @submit.prevent="handleEmailLogin"
            class="space-y-4"
        >
            <FloatLabel variant="on">
                <InputText
                    id="email"
                    v-model="formData.email"
                    autocomplete="on"
                    showClear
                    required
                    fluid
                    :disabled="isLoading"
                />
                <label for="email">E-mail</label>
            </FloatLabel>

            <FloatLabel variant="on">
                <Password
                    id="password"
                    v-model="formData.password"
                    showClear
                    required
                    fluid
                    :feedback="false"
                    :disabled="isLoading"
                />
                <label for="password">Пароль</label>
            </FloatLabel>

            <Button
                type="submit"
                :disabled="isLoading"
                :loading="isLoading"
                class="w-full"
            >
                {{ isLoading ? 'Вход...' : 'Войти' }}
            </Button>
        </form>
    </div>
</template>
