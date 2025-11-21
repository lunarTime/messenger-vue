<script setup lang="ts">
    import { computed } from 'vue'
    import { formatTime } from '@/shared/utils/formatTime'
    import { PencilIcon } from '@heroicons/vue/24/solid'

    const props = defineProps<{
        text: string
        variant: 'incoming' | 'outgoing'
        deleted?: boolean
        createdAd: Date | string | number
        edited?: boolean
    }>()

    const isOutgoing = computed(() => props.variant === 'outgoing')
    const whiteDarkColorClass = computed(() => (isOutgoing.value ? 'text-white' : 'text-dark'))
    const bubbleClass = computed(() =>
        isOutgoing.value ? 'self-end bg-accent text-white' : 'self-start bg-lightgray text-dark'
    )
    const createdDateDisplay = computed(() => formatTime(props.createdAd))
</script>

<template>
    <div
        class="max-w-200 w-fit pb-2 pt-3 px-3 text-xs rounded-bubble"
        :class="bubbleClass"
    >
        <template v-if="!deleted">
            <div class="relative flex flex-col">
                <div class="relative bottom-0.5 flex items-center self-end gap-1.5 w-fit min-w-max">
                    <div
                        v-if="edited"
                        class="min-w-max w-fit ml-2 text-xs"
                        :class="whiteDarkColorClass"
                    >
                        <PencilIcon
                            class="lg:size-3 size-2 block"
                            :class="whiteDarkColorClass"
                        />
                    </div>
                    <div
                        class="relative -top-0.5 min-w-max w-fit text-xs self-end"
                        :class="whiteDarkColorClass"
                    >
                        {{ createdDateDisplay }}
                    </div>
                </div>
                <div class="lg:text-lg text-base break-all">
                    {{ text }}
                </div>
            </div>
        </template>

        <template v-else>
            <div class="flex flex-col">
                <div
                    class="relative -top-0.5 min-w-max w-fit text-xs self-end"
                    :class="whiteDarkColorClass"
                >
                    {{ createdDateDisplay }}
                </div>
                <span
                    class="lg:text-lg text-base italic"
                    :class="whiteDarkColorClass"
                >
                    Message deleted
                </span>
            </div>
        </template>
    </div>
</template>
