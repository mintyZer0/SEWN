import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/hooks/use-realtime-chat'

interface ChatMessageItemProps {
  message: ChatMessage
  isOwnMessage: boolean
  showHeader?: boolean
  variant?: "default" | "compact"
  isLatest?: boolean
}

export const ChatMessageItem = ({ message, isOwnMessage, variant = "default", isLatest = false }: ChatMessageItemProps) => {
  const isCompact = variant === "compact";
  
  const timeString = message.createdAt 
    ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div 
      className={`flex w-full flex-col ${isOwnMessage ? 'items-end' : 'items-start'} ${isCompact ? 'mb-2' : 'mb-4'} group focus:outline-none`} 
      tabIndex={0}
    >
      <div className="relative flex max-w-[80%] items-center group/tooltip">
        {/* Tooltip for own message (appears on the left) */}
        {isOwnMessage && timeString && !isLatest && (
          <div className="absolute right-full mr-2 pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-opacity group-hover/tooltip:delay-1000 duration-200 bg-gray-800/80 text-white text-[11px] px-2 py-1 rounded-lg whitespace-nowrap z-10">
            {timeString}
          </div>
        )}

        <div
          className={cn(
            'shadow-sm text-white font-medium transition-transform active:scale-[0.98] w-full',
            isCompact ? 'px-4 py-2 rounded-2xl text-sm bg-primary' : 'px-8 py-4 rounded-3xl text-lg third-gradient',
            isOwnMessage ? (isCompact ? 'rounded-tr-none' : 'rounded-tr-none') : (isCompact ? 'rounded-tl-none' : 'rounded-tl-none')
          )}
        >
          {message.content}
        </div>

        {/* Tooltip for other message (appears on the right) */}
        {!isOwnMessage && timeString && !isLatest && (
          <div className="absolute left-full ml-2 pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-opacity group-hover/tooltip:delay-1000 duration-200 bg-gray-800/80 text-white text-[11px] px-2 py-1 rounded-lg whitespace-nowrap z-10">
            {timeString}
          </div>
        )}
      </div>

      {timeString && (
        <div 
          className={cn(
            "grid transition-all duration-300 ease-in-out",
            isLatest 
              ? "grid-rows-[1fr] opacity-100 mt-1" 
              : "grid-rows-[0fr] opacity-0 group-focus:grid-rows-[1fr] group-focus:opacity-100 group-focus:mt-1"
          )}
        >
          <div className="overflow-hidden">
            <span className={cn(
              "block text-[11px] text-gray-400 px-1",
              isOwnMessage ? "mr-1 text-right" : "ml-1 text-left"
            )}>
              {timeString}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
