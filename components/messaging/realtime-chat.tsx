'use client'

import { SendHorizontal, Smile, Image as ImageIcon, Play, FileText, Mail, Copy } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { cn } from '@/lib/utils'
import { ChatMessageItem } from './chat-message'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import {
  useRealtimeChat,
  type ChatMessage,
} from '@/hooks/use-realtime-chat'

interface RealtimeChatProps {
  roomName: string
  username: string
  onMessage?: (messages: ChatMessage[]) => void
  messages?: ChatMessage[]
  targetUser?: {
    name: string;
    avatar?: string;
  }
}

export const RealtimeChat = ({
  roomName,
  username,
  onMessage,
  messages: initialMessages = [],
  targetUser = { name: "Chini De Bertha" }
}: RealtimeChatProps) => {
  const { containerRef, scrollToBottom } = useChatScroll()

  const {
    messages: realtimeMessages,
    sendMessage,
    isConnected,
  } = useRealtimeChat({
    roomName,
    username,
  })
  const [newMessage, setNewMessage] = useState('')

  const allMessages = useMemo(() => {
    const mergedMessages = [...initialMessages, ...realtimeMessages]
    const uniqueMessages = mergedMessages.filter(
      (message, index, self) => index === self.findIndex((m) => m.id === message.id)
    )
    return uniqueMessages.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  }, [initialMessages, realtimeMessages])

  useEffect(() => {
    if (onMessage) {
      onMessage(allMessages)
    }
  }, [allMessages, onMessage])

  useEffect(() => {
    scrollToBottom()
  }, [allMessages, scrollToBottom])

  const handleSendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!newMessage.trim() || !isConnected) return

      sendMessage(newMessage)
      setNewMessage('')
    },
    [newMessage, isConnected, sendMessage]
  )

  return (
    <div className="flex flex-col h-full w-full bg-background antialiased">
      {/* Header */}
      <div className="p-8 flex items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex-shrink-0 shadow-sm" />
        <h3 className="text-2xl font-black text-primary">{targetUser.name}</h3>
      </div>
      
      <div className="mx-8 border-b border-primary/10" />

      {/* Messages */}
      <div 
        ref={containerRef} 
        className="flex-1 overflow-y-auto px-12 py-8 space-y-2 custom-scrollbar"
      >
        {allMessages.length === 0 ? (
          <div className="text-center text-sm text-primary/40 mt-10">
            Start a conversation with {targetUser.name}
          </div>
        ) : null}
        
        {allMessages.map((message) => (
          <ChatMessageItem
            key={message.id}
            message={message}
            isOwnMessage={message.user.name === username}
          />
        ))}
      </div>

      {/* Input Area */}
      <div className="p-8 space-y-4">
        <form 
          onSubmit={handleSendMessage} 
          className="relative group"
        >
          <input
            className="w-full bg-secondary/20 border-2 border-primary/5 rounded-full py-4 px-8 pr-16 text-lg focus:outline-none focus:border-third/30 transition-all placeholder:text-primary/20 text-primary"
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here"
            disabled={!isConnected}
          />
          <button
            type="submit"
            disabled={!isConnected || !newMessage.trim()}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-third hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100"
          >
            <SendHorizontal className="size-8" />
          </button>
        </form>

        {/* Action Icons */}
        {/* Placeholder icons for future features like emojis, attachments, etc. Currently does nothing */}
        <div className="flex gap-4 px-2 pl-4">
          {[Smile, ImageIcon, Play, FileText, Mail, Copy].map((Icon, idx) => (
            <button key={idx} className="text-primary/40 hover:text-third transition-colors">
              <Icon className="size-6" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
