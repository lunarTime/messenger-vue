<script setup lang="ts">
    import { computed } from 'vue'

    const props = defineProps<{
        text: string
        variant: 'incoming' | 'outgoing'
        deleted?: boolean
        edited?: boolean
    }>()

    const bubbleClass = computed(() => {
        if (props.variant === 'outgoing') {
            return 'self-end bg-accent text-white'
        }

        return 'self-start bg-lightgray text-dark'
    })
</script>

<template>
    <div
        class="max-w-[70%] py-1.5 px-2 rounded-bubble text-xs whitespace-pre-wrap"
        :class="bubbleClass"
    >
        <template v-if="!deleted">
            <span>
                {{ text }}
            </span>
            <span
                v-if="edited"
                class="ml-2 text-xs text-gray"
            >
                (edited)
            </span>
        </template>

        <template v-else>
            <span class="text-gray italic"> Message deleted </span>
        </template>
    </div>
</template>
