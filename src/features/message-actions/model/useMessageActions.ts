import { useMessageStore } from '@/entities/message/store/message.store'

export function useMessageActions() {
    const messageStore = useMessageStore()

    return {
        editMessage: (messageId: string, newText: string) => messageStore.editMessage(messageId, newText),
        deleteMessageForMe: (messageId: string) => messageStore.deleteMessageForMe(messageId),
        deleteMessageForAll: (messageId: string) => messageStore.deleteMessageForAll(messageId)
    }
}
