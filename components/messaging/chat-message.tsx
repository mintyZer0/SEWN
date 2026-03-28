import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/hooks/use-realtime-chat'

interface ChatMessageItemProps {
  message: ChatMessage
  isOwnMessage: boolean
  showHeader?: boolean
  variant?: "default" | "compact"
}

export const ChatMessageItem = ({ message, isOwnMessage, variant = "default" }: ChatMessageItemProps) => {
  const isCompact = variant === "compact";
  
  return (
    <div className={`flex w-full ${isOwnMessage ? 'justify-end' : 'justify-start'} ${isCompact ? 'mb-2' : 'mb-4'}`}>
      <div
        className={cn(
          'max-w-[80%] shadow-sm text-white font-medium',
          isCompact ? 'px-4 py-2 rounded-2xl text-sm bg-primary' : 'px-8 py-4 rounded-3xl text-lg third-gradient',
          isOwnMessage ? (isCompact ? 'rounded-tr-none' : 'rounded-tr-none') : (isCompact ? 'rounded-tl-none' : 'rounded-tl-none')
        )}
      >
        {message.content}
      </div>
    </div>
  )
}
