import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getChatRoomId(id1: string, id2: string) {
  if (!id1 || !id2) return "global-chat";
  return [id1, id2].sort().join('_');
}
