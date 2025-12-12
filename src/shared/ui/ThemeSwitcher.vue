<script setup lang="ts">
    import { computed } from 'vue'
    import { useTheme } from '@/shared/composables/useTheme'
    import Button from 'primevue/button'

    const { isDark, toggleTheme } = useTheme()

    const currentIcon = computed(() => (isDark.value ? 'pi pi-sun' : 'pi pi-moon'))
</script>

<template>
    <Button
        :icon="currentIcon"
        @click="toggleTheme"
        size="large"
        rounded
        text
        severity="secondary"
        aria-label="Toggle theme"
        v-tooltip.bottom="{
            value: 'Сменить тему',
            showDelay: 800,
            hideDelay: 300,
            pt: {
                text: { class: 'text-center' }
            }
        }"
    />
</template>
