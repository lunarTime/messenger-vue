<script setup lang="ts">
    import { ref, computed } from 'vue'
    import { useAuthNavigation } from '@/shared/composables/useAuthNavigation'
    import { useTheme } from '@/shared/composables/useTheme'
    import { signInWithGoogle } from '@/shared/api/firebase/auth'
    import type { AuthType } from '@/shared/types/auth'
    import LoginForm from '@/pages/auth/ui/LoginForm.vue'
    import RegisterForm from '@/pages/auth/ui/RegisterForm.vue'
    import ThemeSwitcher from '@/shared/ui/ThemeSwitcher.vue'
    import Tabs from 'primevue/tabs'
    import TabList from 'primevue/tablist'
    import Tab from 'primevue/tab'
    import TabPanels from 'primevue/tabpanels'
    import TabPanel from 'primevue/tabpanel'
    import Divider from 'primevue/divider'

    const { bgColor } = useTheme()
    const { navigateAfterAuth } = useAuthNavigation()

    const activeTab = ref<AuthType>('login')
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const authHeaderText = computed(() => (activeTab.value === 'login' ? 'Войти' : 'Зарегистрироваться'))

    const handleGoogleSignIn = async () => {
        isLoading.value = true
        error.value = null

        try {
            await signInWithGoogle()
            await navigateAfterAuth()
        } catch (error: any) {
            console.error('Ошибка авторизации через Google:', error)

            error.value = error.message
        } finally {
            isLoading.value = false
        }
    }
</script>

<template>
    <div class="relative flex items-center justify-center min-h-screen">
        <div class="absolute top-4 right-4 z-50">
            <ThemeSwitcher />
        </div>

        <div
            class="w-full max-w-md p-8 mx-4 rounded-2xl shadow-xl"
            :class="bgColor"
        >
            <h1 class="mb-8 text-4xl font-bold text-center">
                {{ authHeaderText }}
            </h1>

            <Tabs
                :value="activeTab"
                @update:value="activeTab = $event as AuthType"
            >
                <TabList class="w-full mb-6">
                    <Tab
                        value="login"
                        class="py-2 flex-1 text-center cursor-pointer"
                    >
                        Вход
                    </Tab>
                    <Tab
                        value="register"
                        class="py-2 flex-1 text-center cursor-pointer"
                    >
                        Регистрация
                    </Tab>
                </TabList>

                <TabPanels>
                    <TabPanel value="login">
                        <LoginForm />
                    </TabPanel>

                    <TabPanel value="register">
                        <RegisterForm />
                    </TabPanel>
                </TabPanels>

                <Divider align="center">
                    <span>или</span>
                </Divider>

                <div class="flex items-center justify-center gap-2">
                    <Button
                        icon="pi pi-google"
                        @click="handleGoogleSignIn"
                    />
                </div>
            </Tabs>
        </div>
    </div>
</template>
