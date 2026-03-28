import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/hooks/use-realtime-chat'

interface ChatMessageItemProps {
  message: ChatMessage
  isOwnMessage: boolean
  showHeader?: boolean
}

export const ChatMessageItem = ({ message, isOwnMessage }: ChatMessageItemProps) => {
  return (
    <div className={`flex w-full ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={cn(
          'max-w-[70%] px-8 py-4 rounded-3xl shadow-sm text-white font-medium text-lg',
          'third-gradient', // Using the defined gradient from globals.css
          isOwnMessage ? 'rounded-tr-none' : 'rounded-tl-none'
        )}
      >
        {message.content}
      </div>
    </div>
  )
}
