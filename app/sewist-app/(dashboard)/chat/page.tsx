import { createClient } from "@/utils/supabase/server";
import { ChatContainer } from "@/components/messaging/chat-container";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ userId?: string; conversationId?: string }>;
}

export default async function ChatPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const conversationId = params.conversationId || null;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/chat");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("first_name, last_name")
    .eq("id", user.id)
    .single();

  const username =
    profile
      ? `${profile.first_name} ${profile.last_name}`
      : user.email || "Guest";

  return (
    <ChatContainer 
      initialConversationId={conversationId}
      currentUserId={user.id}
      initialUsername={username}
      isSewistApp={true}
    />
  );
}
