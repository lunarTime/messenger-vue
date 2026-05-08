import { useMessageStore } from '@/entities/message/store/message.store'
import type { MessageAttachment } from '@/shared/types/message'

export function useMessageActions() {
    const messageStore = useMessageStore()

    return {
        editMessage: (messageId: string, newText: string, attachments?: MessageAttachment[]) =>
            messageStore.editMessage(messageId, newText, attachments),
        deleteMessageForMe: (messageId: string) => messageStore.deleteMessageForMe(messageId),
        deleteMessageForAll: (messageId: string) => messageStore.deleteMessageForAll(messageId)
    }
}
