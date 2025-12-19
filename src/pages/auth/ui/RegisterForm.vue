<script setup lang="ts">
    import { reactive, ref, computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { registerWithEmail } from '@/shared/api/firebase/auth'
    import { useUserStore } from '@/entities/user/store/user.store'
    import type { RegisterFormData } from '@/shared/types/auth'
    import Button from 'primevue/button'
    import Message from 'primevue/message'
    import FloatLabel from 'primevue/floatlabel'
    import InputText from 'primevue/inputtext'
    import Password from 'primevue/password'

    const router = useRouter()
    const userStore = useUserStore()

    const formData = reactive<RegisterFormData>({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    })

    const confirmPassword = ref('')
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const passwordsMatch = computed(() => {
        if (!confirmPassword.value) {
            return true
        }

        return formData.password === confirmPassword.value
    })

    async function handleRegister() {
        if (!formData.email || !formData.password || !formData.firstName) {
            error.value = 'Заполните обязательные поля'

            return
        }

        if (formData.password.length < 6) {
            error.value = 'Пароль должен содержать минимум 6 символов'

            return
        }

        if (formData.password !== confirmPassword.value) {
            error.value = 'Пароли не совпадают'

            return
        }

        isLoading.value = true
        error.value = null

        try {
            await registerWithEmail(formData)

            let attempts = 0
            const maxAttempts = 100

            while (attempts < maxAttempts) {
                if (userStore.isAuthenticated && !userStore.isLoading) {
                    await router.replace({ name: 'chat' })

                    return
                }

                await new Promise(resolve => setTimeout(resolve, 50))

                attempts++
            }

            error.value = 'Не удалось подтвердить регистрацию. Попробуйте войти вручную'
        } catch (e: any) {
            error.value = getErrorMessage(e.code)
        } finally {
            isLoading.value = false
        }
    }

    function getErrorMessage(code: string): string {
        const messages: Record<string, string> = {
            'auth/email-already-in-use': 'Email уже используется',
            'auth/invalid-email': 'Неверный формат email',
            'auth/weak-password': 'Пароль слишком слабый',
            'auth/operation-not-allowed': 'Регистрация отключена',
            'auth/network-request-failed': 'Ошибка сети'
        }

        return messages[code] || 'Произошла ошибка. Попробуйте снова'
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
            @submit.prevent="handleRegister"
            class="space-y-4"
        >
            <div class="grid grid-cols-2 gap-4">
                <FloatLabel variant="on">
                    <InputText
                        id="firstName"
                        v-model="formData.firstName"
                        autocomplete="given-name"
                        fluid
                        required
                        :disabled="isLoading"
                    />
                    <label for="firstName">Имя</label>
                </FloatLabel>

                <FloatLabel variant="on">
                    <InputText
                        id="lastName"
                        v-model="formData.lastName"
                        autocomplete="family-name"
                        fluid
                        :disabled="isLoading"
                    />
                    <label for="lastName">Фамилия</label>
                </FloatLabel>
            </div>

            <FloatLabel variant="on">
                <InputText
                    id="reg-email"
                    v-model="formData.email"
                    type="email"
                    autocomplete="email"
                    fluid
                    required
                    :disabled="isLoading"
                />
                <label for="reg-email">E-mail</label>
            </FloatLabel>

            <FloatLabel variant="on">
                <Password
                    id="password"
                    v-model="formData.password"
                    :feedback="true"
                    promptLabel="Введите пароль"
                    weakLabel="Слабый пароль"
                    mediumLabel="Средний пароль"
                    strongLabel="Сложный пароль"
                    toggleMask
                    fluid
                    required
                    :disabled="isLoading"
                />
                <label for="password">Пароль</label>
            </FloatLabel>

            <FloatLabel variant="on">
                <Password
                    id="confirmPassword"
                    v-model="confirmPassword"
                    :feedback="false"
                    toggleMask
                    fluid
                    required
                    :disabled="isLoading"
                    :invalid="!passwordsMatch"
                />
                <label for="confirmPassword">Подтвердите пароль</label>
            </FloatLabel>

            <Button
                type="submit"
                class="w-full"
                :loading="isLoading"
                :disabled="!passwordsMatch"
            >
                Зарегистрироваться
            </Button>
        </form>
    </div>
</template>
