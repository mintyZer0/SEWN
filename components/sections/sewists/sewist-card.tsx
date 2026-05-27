"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, MessageCircle, MapPin, Award, Briefcase, TrendingUp, CheckCircle } from "react-feather";
import { supabase } from "@/utils/supabase/client";
import { getChatRoomId } from "@/lib/utils";
import { getS3PublicUrl } from "@/lib/s3-client";

export type Sewist = {
  id: string;
  name: string;
  location: string;
  img_src?: string;
  rating: number;
  completed_orders?: number;
  services?: string[];
  years_of_experience?: number;
  is_verified?: boolean;
  is_tesda_certified?: boolean;
};

export interface SewistCardProps {
  sewist: Sewist;
}

export default function SewistCard({
  sewist,
}: SewistCardProps) {
  const router = useRouter();
  const defaultAvatar = getS3PublicUrl("default.jpg");
  const [avatarSrc, setAvatarSrc] = useState(getS3PublicUrl(sewist.img_src) || defaultAvatar);

  useEffect(() => {
    setAvatarSrc(getS3PublicUrl(sewist.img_src) || defaultAvatar);
  }, [sewist.img_src]);

  const openChatWithSewist = async (sewistId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      const redirect = `/chat`;
      router.push(`/auth/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    const buyerId = user.id;
    const sewistUUID = sewistId;

    // Use the stable room ID function
    const stableConversationId = getChatRoomId(buyerId, sewistUUID);

    // Try to get existing conversation with stable ID
    const { data: existing, error: selectErr } = await supabase
      .from("chat_conversations")
      .select("id")
      .eq("id", stableConversationId)
      .maybeSingle();

    let conversationId: string;

    if (existing) {
      conversationId = existing.id;
    } else {
      const { data: newConv, error: insertErr } = await supabase
        .from("chat_conversations")
        .insert({
          id: stableConversationId,
          buyer_id: buyerId,
          sewist_id: sewistUUID,
        })
        .select("id")
        .single();

      if (insertErr) {
        console.error("Failed to create conversation with stable ID:", insertErr);
        return;
      }

      conversationId = newConv.id;
    }

    window.dispatchEvent(
      new CustomEvent("open-chat", {
        detail: { conversationId, view: "chat" },
      })
    );
  };

  return (
    <div className="bg-orchid-vertical-b rounded-3xl overflow-hidden px-5 sm:px-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 w-full max-w-xl h-auto">
      <Link href={`/sewists/${sewist.id}`} className="block h-full">
        <div className="relative w-full aspect-video bg-white rounded-b-3xl mt-6">
          <Image
            src={avatarSrc}
            alt={sewist.name || "Sewist"}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover rounded-b-3xl"
            onError={() => setAvatarSrc(defaultAvatar)}
          />
          <button
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              await openChatWithSewist(sewist.id);
            }}
            className="absolute top-2 right-2 bg-secondary hover:bg-primary hover:text-white text-heading p-2 rounded-full shadow-lg transition-colors z-10"
            aria-label="Message sewist"
          >
            <MessageCircle size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-white">
                <Image
                  src={avatarSrc}
                  alt={sewist.name || "Sewist"}
                  width={48}
                  height={48}
                  className="object-cover"
                  onError={() => setAvatarSrc(defaultAvatar)}
                />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-semibold">{sewist.name}</h3>
                {sewist.is_verified && (
                  <CheckCircle size={18} className="text-blue-200 fill-current" />
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 bg-white text-heading px-3 py-1 rounded-full text-sm sm:text-base">
              <Star size={16} fill="currentColor" />
              <span className="font-semibold">{sewist.rating > 0 ? sewist.rating.toFixed(1) : "N/A"}</span>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
            <div className="flex items-start gap-2">
              <MapPin size={20} className="shrink-0 mt-0.5" />
              <span>{sewist.location}</span>
            </div>

            <div className="flex items-start gap-2">
              <Award size={20} className="shrink-0 mt-0.5" />
              <span>{sewist.years_of_experience ?? 0}+ years experience</span>
            </div>

            <div className="flex items-start gap-2">
              <Briefcase size={20} className="shrink-0 mt-0.5" />
              <span>{sewist.services?.join(", ") || "No services listed"}</span>
            </div>

            <div className="flex items-start gap-2">
              <TrendingUp size={20} className="shrink-0 mt-0.5" />
              <span>{sewist.completed_orders ?? 0} orders completed</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
