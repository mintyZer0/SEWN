'use client'

import { SendHorizontal, Smile, Image as ImageIcon, Play, FileText, Mail, Copy, Loader2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState, useRef } from 'react'

import { cn } from '@/lib/utils'
import { ChatMessageItem } from './chat-message'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import MediaPreviewModal from './media-preview-modal'
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
  };
  variant?: "default" | "compact";
  isSewistApp?: boolean;
}

export const RealtimeChat = ({
  roomName,
  username,
  onMessage,
  messages: initialMessages = [],
  targetUser = { name: "Chini De Bertha" },
  variant = "default",
  isSewistApp = false,
}: RealtimeChatProps) => {
  const { containerRef, scrollToBottom } = useChatScroll()
  const isCompact = variant === "compact";

  const {
    messages: realtimeMessages,
    sendMessage,
    isConnected,
  } = useRealtimeChat({
    roomName,
    username,
  })
  const textareaRef = useRef<HTMLTextAreaElement>(null);  
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const [newMessage, setNewMessage] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [stagedMedia, setStagedMedia] = useState<{ file: File; preview: string; type: 'image' | 'video' } | null>(null)

  const [previewData, setPreviewData] = useState<{ url: string; type: 'image' | 'video' } | null>(null)

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

      if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    },
    [newMessage, isConnected, sendMessage]
  )

  const handleMediaSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isConnected) return;

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      alert('Only image and video files are allowed.');
      return;
    }

    // Size limits: 5MB for images, 25MB for videos
    const sizeLimit = isImage ? 5 * 1024 * 1024 : 25 * 1024 * 1024;
    if (file.size > sizeLimit) {
      alert(`File is too large. Maximum size for ${isImage ? 'images' : 'videos'} is ${isImage ? '5MB' : '25MB'}.`);
      return;
    }

    // Secondary extension check
    const allowedExtensions = isImage 
      ? ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'] 
      : ['mp4', 'webm', 'ogg', 'mov'];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExt || !allowedExtensions.includes(fileExt)) {
      alert(`Unsupported file extension: .${fileExt}. Allowed: ${allowedExtensions.join(', ')}`);
      return;
    }

    // Create local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setStagedMedia({
        file,
        preview: reader.result as string,
        type: isImage ? 'image' : 'video'
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSendStagedMedia = async () => {
    if (!stagedMedia || !isConnected) return;

    try {
      setIsUploading(true);
      const { file, type } = stagedMedia;
      const fileExt = file.name.split('.').pop();
      const folder = type === 'video' ? 'chat-videos' : 'chat-images';
      const fileName = `${folder}/${roomName}/${Date.now()}.${fileExt}`;

      // 1. Get signed upload URL for private bucket
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          filename: fileName, 
          contentType: file.type,
          bucketType: 'private'
        }),
      });

      if (!res.ok) throw new Error('Failed to get upload URL');
      const { url, publicUrl } = await res.json();

      // 2. Upload to S3
      const uploadRes = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (!uploadRes.ok) throw new Error(`Failed to upload media`);

      // 3. Send message with the private URL marker
      sendMessage(publicUrl);
      setStagedMedia(null);
    } catch (err: any) {
      console.error('Media upload error:', err);
      alert('Failed to upload media: ' + err.message);
    } finally {
      setIsUploading(false);
      if (mediaInputRef.current) mediaInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full bg-transparent md:bg-background antialiased min-h-0 h-full">
      {/* Header */}
      {!isCompact ? (
        <div className="hidden md:block shrink-0">
          <div className="p-8 flex items-center gap-6">
            {targetUser.avatar ? (
              <img src={targetUser.avatar} alt={targetUser.name} className="w-16 h-16 rounded-full object-cover shadow-sm flex-shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary/10 flex-shrink-0 shadow-sm" />
            )}
            <h3 className="text-2xl font-black text-primary">{targetUser.name}</h3>
          </div>
          <div className="mx-8 border-b border-primary/10" />
        </div>
      ) : (
        <div className="hidden md:flex p-4 items-center gap-3 bg-white/50 border-b border-primary/5 shrink-0 shadow-sm">
          {targetUser.avatar ? (
            <img src={targetUser.avatar} alt={targetUser.name} className="w-10 h-10 rounded-full object-cover shadow-sm flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 shadow-sm" />
          )}
          <h3 className="text-md font-bold text-primary truncate">{targetUser.name}</h3>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 relative min-h-0">
        <div 
          ref={containerRef} 
          className={cn(
            "absolute inset-0 overflow-y-auto custom-scrollbar",
            isCompact ? "px-4 py-4 space-y-1" : "px-12 py-8 space-y-2"
          )}
        >
          {allMessages.length === 0 ? (
            <div className="text-center text-sm text-primary/40 mt-10">
              Start a conversation with {targetUser.name}
            </div>
          ) : null}
          
          {allMessages.map((message, index) => (
            <ChatMessageItem
              key={message.id}
              message={message}
              isOwnMessage={message.user.name === username}
              variant={variant}
              isLatest={index === allMessages.length - 1}
              onPreview={(url, type) => setPreviewData({ url, type })}
              isSewistApp={isSewistApp}
            />
          ))}

          {isUploading && (
            <div className="flex justify-end mb-4 animate-pulse px-12">
               <div className="px-6 py-3 rounded-3xl bg-secondary/20 border border-primary/10 text-primary/40 text-sm flex items-center gap-2 font-medium">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading media...
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Media Preview Overlay */}
      {stagedMedia && (
        <div className="px-8 pb-4 animate-in slide-in-from-bottom-4 duration-300 shrink-0">
           <div className="relative group bg-secondary/10 rounded-3xl p-4 border-2 border-primary/5 flex items-center gap-6 shadow-sm overflow-hidden">
              <div className="relative h-32 w-32 shrink-0 rounded-2xl overflow-hidden bg-black shadow-md border border-white/20">
                {stagedMedia.type === 'image' ? (
                  <img src={stagedMedia.preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <video src={stagedMedia.preview} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                  {stagedMedia.type === 'video' && <Play className="text-white h-8 w-8 fill-current" />}
                </div>
              </div>
              
              <div className="flex-1 space-y-1 overflow-hidden">
                <p className="font-bold text-primary truncate">{stagedMedia.file.name}</p>
                <p className="text-sm text-primary/40">{(stagedMedia.file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>

              <div className="flex flex-col gap-2">
                <button 
                  onClick={handleSendStagedMedia}
                  disabled={isUploading}
                  className="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 min-w-[100px]"
                >
                  {isUploading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Send"}
                </button>
                <button 
                  onClick={() => setStagedMedia(null)}
                  disabled={isUploading}
                  className="text-primary/40 hover:text-rose-500 font-bold px-4 py-2 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Input Area */}
      <div className={cn("p-4 md:p-8 pt-0 space-y-3 shrink-0", isCompact ? "md:p-4" : "")}>
        <form 
          onSubmit={handleSendMessage} 
          className={cn("relative group transition-opacity", stagedMedia ? "opacity-50 pointer-events-none grayscale" : "opacity-100")}
        >
          <div className="relative flex items-center">
            <textarea
              ref={textareaRef}
              rows={1}
              className={cn(
                "w-full bg-transparent border border-primary/40 transition-all placeholder:text-primary/60 text-primary-dark resize-none overflow-hidden rounded-full py-3 px-6 text-sm md:text-lg pr-12 focus:outline-none focus:ring-1 focus:ring-primary/50 shadow-inner",
                isCompact ? "md:py-2 md:px-4 md:text-sm md:pr-10" : ""
              )}
              value={newMessage}
              onChange={(e) => {  
                setNewMessage(e.target.value);
                const elem = e.target;

                // reset size to measure content correctly
                elem.style.height = "auto";

                // compute height based on scrollHeight
                const lnheight = parseInt(window.getComputedStyle(elem).lineHeight || "24");
                const maxHeight = lnheight * 5; // limit to 5 lines
                
                elem.style.height = Math.min(elem.scrollHeight, maxHeight) + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e as any);
                }
              }}
              placeholder={stagedMedia ? "Media ready to send" : "Type your message here"}
              disabled={!isConnected || !!stagedMedia}
              style={{ minHeight: '44px' }}
            />
            <button
              type="submit"
              disabled={!isConnected || !newMessage.trim() || isUploading || !!stagedMedia}
              className="absolute right-4 text-third hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100 p-1"
            >
              <SendHorizontal className="size-5 md:size-6" strokeWidth={2.5} />
            </button>
          </div>
        </form>

        {/* Action Icons */}
        <div className="flex gap-4 px-4 pb-2">
          <input
            type="file"
            ref={mediaInputRef}
            onChange={handleMediaSelect}
            accept="image/*,video/*"
            className="hidden"
          />
          {[
            { Icon: Smile, label: "Emojis" },
            { Icon: ImageIcon, onClick: () => mediaInputRef.current?.click(), label: "Media" },
            { Icon: Copy, label: "Copy Template" }
          ].map(({ Icon, onClick, label }, idx) => (
            <button 
              key={idx} 
              type="button"
              onClick={onClick}
              title={label}
              disabled={isUploading || !!stagedMedia}
              className="text-primary/70 hover:text-primary transition-colors disabled:opacity-50"
            >
              <Icon className="size-5 md:size-6" />
            </button>
          ))}
        </div>
      </div>

      <MediaPreviewModal
        isOpen={!!previewData}
        url={previewData?.url || null}
        type={previewData?.type || 'image'}
        onClose={() => setPreviewData(null)}
      />
    </div>
  )
}
