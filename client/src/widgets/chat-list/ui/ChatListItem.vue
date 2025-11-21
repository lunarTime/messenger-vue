<script setup lang="ts">
    import { useTimeAgo } from '@/shared/composables/useTimeAgo'

    const props = defineProps<{
        name: string
        lastMessage: string
        active?: boolean
        date: string | number | Date
    }>()

    const timeAgoValue = useTimeAgo(props.date)
</script>

<template>
    <div
        class="group flex items-center gap-3 px-4 py-3 hover:bg-accent cursor-pointer transition-colors select-none"
        :class="active ? 'bg-accent' : ''"
    >
        <div class="flex-none lg:size-16 size-12 rounded-full bg-warning"></div>

        <div class="flex justify-between gap-x-4 flex-1">
            <div class="flex flex-col gap-2 w-[-webkit-fill-available]">
                <span
                    class="block lg:text-xl text-md font-medium group-hover:text-white transition-colors leading-none"
                    :class="active ? 'text-white' : 'text-dark'"
                >
                    {{ name }}
                </span>
                <span
                    class="block lg:text-lg text-xs group-hover:text-white transition-colors leading-none"
                    :class="active ? 'text-white' : 'text-dark'"
                >
                    {{ lastMessage }}
                </span>
            </div>
            <div
                v-if="timeAgoValue"
                class="flex items-center lg:text-xs text-[0.7rem] min-w-max"
                :class="active ? 'text-white' : 'text-dark'"
            >
                {{ timeAgoValue }}
            </div>
        </div>
    </div>
</template>
