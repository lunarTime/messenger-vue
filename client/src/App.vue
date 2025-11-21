<script setup lang="ts">
    import { RouterView } from 'vue-router'
</script>

<template>
    <transition
        name="fade"
        mode="out-in"
        appear
    >
        <RouterView />
    </transition>
</template>

<style scoped>
    .fade-enter-active,
    .fade-leave-active {
        @apply transition-opacity duration-1000;
    }

    .fade-enter-from,
    .fade-leave-to {
        @apply opacity-0;
    }
</style>
