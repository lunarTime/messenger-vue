<script setup lang="ts">
    import { useRouter } from 'vue-router'
    import ThemeSwitcher from '@/shared/ui/ThemeSwitcher.vue'
    import Button from 'primevue/button'

    const router = useRouter()

    const goToAuth = () => {
        router.push({ name: 'auth' })
    }
</script>

<template>
    <div class="relative flex flex-col items-center justify-center min-h-screen">
        <div class="absolute top-4 right-4 z-1">
            <ThemeSwitcher />
        </div>

        <div class="max-w-150 text-center px-4">
            <h1 class="mb-6 lg:text-4xl text-2xl font-bold"> Корпоративный real-time мессенджер </h1>
            <p class="mb-8 lg:text-lg text-sm">
                Проект разработан на стеке Vue, PrimeVue, TypeScript и Firebase. <br />
                Для начала общения авторизуйтесь или зарегистрируйтесь и введите в поиск имя или e-mail собеседника.
            </p>

            <Button
                @click="goToAuth"
                class="px-8 py-3"
            >
                Начать общение
            </Button>
        </div>
    </div>
</template>
