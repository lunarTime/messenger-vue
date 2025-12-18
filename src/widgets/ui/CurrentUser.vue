<script setup lang="ts">
    import { computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { useUserStore } from '@/entities/user/store/user.store'
    import { logout } from '@/shared/api/firebase/auth'
    import ThemeSwitcher from '@/shared/ui/ThemeSwitcher.vue'

    const router = useRouter()
    const userStore = useUserStore()

    const user = computed(() => userStore.currentUser)

    const handleLogout = async () => {
        await logout()

        router.push({ name: 'auth' })
    }
</script>

<template>
    <div class="flex items-center justify-between gap-2 p-4">
        <div
            v-if="user"
            class="flex items-center gap-2"
        >
            <Avatar
                :image="user?.photoURL ?? undefined"
                :label="user?.photoURL ? undefined : user.displayName.charAt(0).toUpperCase()"
                :class="user?.photoURL ? undefined : 'bg-(--p-primary-color)! text-white!'"
                shape="circle"
                size="large"
            />

            <div class="flex flex-col">
                <span>
                    {{ user?.displayName }}
                </span>
                <span>
                    {{ user?.email }}
                </span>
            </div>
        </div>
        <div class="flex items-center gap-2">
            <ThemeSwitcher />
            <Button
                @click="handleLogout"
                icon="pi pi-sign-out"
                severity="danger"
                v-tooltip.top="{
                    value: 'Выйти из аккаунта',
                    showDelay: 800,
                    hideDelay: 300,
                    pt: {
                        text: { class: 'text-center' }
                    }
                }"
            />
        </div>
    </div>
</template>
