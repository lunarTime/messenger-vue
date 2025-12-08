<script setup lang="ts">
    import { RouterView } from 'vue-router'
</script>

<template>
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
