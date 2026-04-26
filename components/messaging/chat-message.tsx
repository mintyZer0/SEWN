"use client";

import { cn } from '@/lib/utils'
import { Maximize2 } from 'lucide-react'
import type { ChatMessage } from '@/hooks/use-realtime-chat'
import PrivateVideoPlayer from './private-video-player'
import PrivateImage from './private-image'

interface ChatMessageItemProps {
  message: ChatMessage
  isOwnMessage: boolean
  showHeader?: boolean
  variant?: "default" | "compact"
  isLatest?: boolean
  onPreview?: (url: string, type: "image" | "video") => void
}

export const ChatMessageItem = ({ message, isOwnMessage, variant = "default", isLatest = false, onPreview }: ChatMessageItemProps) => {
  const isCompact = variant === "compact";
  
  const timeString = message.createdAt 
    ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(message.content);
  const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(message.content);
  const isPrivate = message.content.startsWith("s3-private://");
  const isMedia = isVideo || isImage || isPrivate;

  return (
    <div 
      className={cn(
        "flex w-full flex-col group focus:outline-none",
        isOwnMessage ? 'items-end' : 'items-start',
        isCompact ? 'mb-2' : 'mb-4'
      )}
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
            'shadow-sm font-medium transition-transform active:scale-[0.98] w-full',
            isMedia ? 'p-1 rounded-3xl bg-secondary/10 border-2 border-primary/5' : (
              isCompact ? 'px-4 py-2 rounded-2xl text-sm bg-primary text-white whitespace-pre-wrap break-words' : 'px-8 py-4 rounded-3xl text-lg third-gradient text-white whitespace-pre-wrap break-words'
            ),
            isOwnMessage ? 'rounded-tr-none' : 'rounded-tl-none'
          )}
        >
          {isMedia ? (
            <div 
              onClick={() => onPreview?.(message.content, (isVideo || (isPrivate && !isImage)) ? "video" : "image")}
              className="cursor-pointer group/media relative"
            >
              {(isVideo || (isPrivate && !isImage)) 
                ? <PrivateVideoPlayer url={message.content} className="w-full max-w-[320px] sm:max-w-[400px]" />
                : <PrivateImage url={message.content} className="w-full max-w-[320px] sm:max-w-[400px]" />
              }
              <div className="absolute inset-0 bg-black/0 group-hover/media:bg-black/10 transition-colors rounded-2xl flex items-center justify-center opacity-0 group-hover/media:opacity-100">
                  <div className="bg-black/40 p-2 rounded-full backdrop-blur-sm">
                    <Maximize2 className="text-white h-5 w-5" />
                  </div>
              </div>
            </div>
          ) : (
            message.content
          )}
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
