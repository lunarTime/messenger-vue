import type { Message } from '@/shared/types/message'
import type { ChatPreview } from '@/shared/types/chat'

export type IncomingWSMessage =
    | {
          type: 'connected'
          payload: {
              clientId: string
          }
      }
    | {
          type: 'chats'
          payload: ChatPreview[]
      }
    | {
          type: 'messages'
          payload: {
              chatId: string
              items: Message[]
          }
      }
    | {
          type: 'message'
          payload: Message
      }
    | {
          type: 'users_online'
          payload: string[]
      }

export type OutgoingWSMessage =
    | {
          type: 'send_message'
          payload: {
              chatId: string
              userId: string
              participants: string[]
              text: string
          }
      }
    | {
          type: 'get_chats'
          payload: {
              userId: string
          }
      }
    | {
          type: 'load_messages'
          payload: {
              chatId: string
              userId: string
          }
      }
    | {
          type: 'register_user'
          payload: {
              userId: string
          }
      }
