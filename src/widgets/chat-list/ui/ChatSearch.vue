<script setup lang="ts">
    import { ref } from 'vue'
    import { watchDebounced } from '@vueuse/core'
    import { searchUsers } from '@/shared/api/firebase/firestore'
    import { useChatStore } from '@/entities/chat/store/chat.store'
    import { useUserStore } from '@/entities/user/store/user.store'
    import type { AutoCompleteOptionSelectEvent } from 'primevue/autocomplete'
    import type { User } from '@/shared/types/user'
    import AutoComplete from 'primevue/autocomplete'
    import Avatar from 'primevue/avatar'

    const chatStore = useChatStore()
    const userStore = useUserStore()

    const searchQuery = ref('')
    const users = ref<User[]>([])
    const isLoading = ref(false)

    watchDebounced(
        searchQuery,
        async query => {
            if (!query.trim()) {
                users.value = []

                return
            }

            isLoading.value = true

            try {
                const results = await searchUsers(query)

                users.value = results.filter(user => user.id !== userStore.userId)
            } catch (e) {
                console.error('Ошибка поиска:', e)

                users.value = []
            } finally {
                isLoading.value = false
            }
        },
        {
            debounce: 500
        }
    )

    const handleSelectUser = async (event: AutoCompleteOptionSelectEvent) => {
        const user = event.value as User

        if (!user?.id) return

        try {
            await chatStore.openChatWith(user.id)

            searchQuery.value = ''
            users.value = []
        } catch (error) {
            console.error('Ошибка открытия чата:', error)
        }
    }

    const getUserOnlineStatus = (user: User): boolean => {
        const cachedUser = chatStore.chatParticipants.get(user.id)

        return cachedUser?.isOnline ?? user.isOnline ?? false
    }
</script>

<template>
    <div class="p-4">
        <AutoComplete
            v-model="searchQuery"
            :suggestions="users"
            :loading="isLoading"
            @item-select="handleSelectUser"
            placeholder="Поиск по email или имени..."
            fluid
        >
            <template #option="{ option }">
                <div class="flex items-center justify-between w-full gap-3 py-2">
                    <div class="flex items-center gap-2">
                        <Avatar
                            :image="option?.photoURL ?? undefined"
                            :label="option?.photoURL ? undefined : option.displayName?.charAt(0).toUpperCase()"
                            :class="option?.photoURL ? undefined : 'bg-(--p-primary-color)! text-white!'"
                            shape="circle"
                            size="large"
                        />
                        <div class="flex-1 min-w-0">
                            <div class="font-semibold lg:text-lg text-sm truncate">
                                {{ option.displayName }}
                            </div>
                            <div class="lg:text-base text-xs opacity-65 truncate">
                                {{ option.email }}
                            </div>
                        </div>
                    </div>
                    <div
                        v-if="getUserOnlineStatus(option)"
                        class="w-3 h-3 rounded-full bg-green-500 border shrink-0"
                        title="Онлайн"
                    />
                </div>
            </template>

            <template #empty>
                <div class="p-3 text-center lg:text-lg text-base">
                    {{ searchQuery ? 'Пользователи не найдены' : 'Начните вводить для поиска' }}
                </div>
            </template>
        </AutoComplete>
    </div>
</template>
