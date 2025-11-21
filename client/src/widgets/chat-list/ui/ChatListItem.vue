<script setup lang="ts">
    defineProps<{
        name: string
        lastMessage: string
        active?: boolean
    }>()
</script>

<template>
    <div
        class="group flex items-center gap-3 px-4 py-3 hover:bg-accent cursor-pointer transition-colors select-none"
        :class="active ? 'bg-accent' : ''"
    >
        <div class="size-10 rounded-full bg-warning"></div>

        <div class="flex flex-col">
            <span
                class="font-medium group-hover:text-white transition-colors leading-none"
                :class="active ? 'text-white' : 'text-dark'"
            >
                {{ name }}
            </span>
            <span
                class="text-sm group-hover:text-white transition-colors leading-none"
                :class="active ? 'text-white' : 'text-dark'"
            >
                {{ lastMessage }}
            </span>
        </div>
    </div>
</template>
