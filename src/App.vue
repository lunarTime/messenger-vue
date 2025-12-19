<script setup lang="ts">
    import { RouterView } from 'vue-router'
    import { useTheme } from '@/shared/composables/useTheme'
    import AnimateBG from '@/shared/ui/AnimateBG.vue'

    useTheme()
</script>

<template>
    <AnimateBG />
    <RouterView v-slot="{ Component }">
        <transition
            name="fade"
            mode="out-in"
            appear
        >
            <component :is="Component" />
        </transition>
    </RouterView>
</template>

<style scoped>
    .fade-enter-active,
    .fade-leave-active {
        @apply transition-opacity duration-400;
    }

    .fade-enter-from,
    .fade-leave-to {
        @apply opacity-0;
    }
</style>
