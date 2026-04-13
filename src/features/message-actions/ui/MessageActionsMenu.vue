<script setup lang="ts">
    import { ref, computed } from 'vue'
    import { EllipsisVerticalIcon } from '@heroicons/vue/24/solid'
    import type { MenuItem } from 'primevue/menuitem'
    import Button from 'primevue/button'
    import Menu from 'primevue/menu'

    const props = defineProps<{
        isOutgoing: boolean
        isDeleted: boolean
    }>()

    const emit = defineEmits<{
        edit: []
        deleteForMe: []
        deleteForAll: []
    }>()

    const menuRef = ref()
    const isMenuVisible = ref(false)

    const menuItems = computed<MenuItem[]>(() => {
        if (props.isDeleted) return []

        const items: MenuItem[] = []

        if (props.isOutgoing) {
            items.push({
                label: 'Редактировать',
                icon: 'pi pi-pencil',
                command: () => emit('edit')
            })
        }

        items.push({
            label: 'Удалить у меня',
            icon: 'pi pi-trash',
            command: () => emit('deleteForMe')
        })

        if (props.isOutgoing) {
            items.push({
                label: 'Удалить у всех',
                icon: 'pi pi-trash',
                severity: 'danger',
                command: () => emit('deleteForAll')
            })
        }

        return items
    })

    const hasActions = computed(() => menuItems.value.length > 0)

    const toggleMenu = (event: Event) => {
        menuRef.value.toggle(event)
        isMenuVisible.value = !isMenuVisible.value
    }
</script>

<template>
    <div v-if="hasActions">
        <Button
            text
            rounded
            class="opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity"
            :class="{ 'opacity-100': isMenuVisible }"
            @click="toggleMenu"
            aria-label="Меню сообщения"
        >
            <template #icon>
                <EllipsisVerticalIcon class="size-4" />
            </template>
        </Button>

        <Menu
            ref="menuRef"
            :model="menuItems"
            :popup="true"
        />
    </div>
</template>
