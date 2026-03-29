export function getChatRoomId(_unusedUserId: string, conversationId: string): string {
  return `chat:${conversationId}`;
}