<script setup lang="ts">
    import { ref } from 'vue'
    import { useMessageStore } from '@/entities/message/store/message.store'
    import AppButton from '@/widgets/ui/AppButton.vue'

    const msgStore = useMessageStore()
    const text = ref('')

    const send = () => {
        if (!text.value.trim()) {
            return
        }

        msgStore.sendMessage(text.value)
        text.value = ''
    }
</script>

<template>
    <div class="flex gap-3 p-3 border-t">
        <textarea
            v-model="text"
            type="text"
            class="flex-1 px-3 py-1 lg:text-xl text-base border border-gray rounded"
            placeholder="Type message..."
            @keydown.enter.prevent="send"
        />
        <AppButton @click="send"> Send </AppButton>
    </div>
</template>
