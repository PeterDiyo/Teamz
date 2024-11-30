import { GetMessagesReturnType } from "./features/messages/api/use-get-messages";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { Message } from "./message";
import { ChannelHero } from "./channel-hero";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useWorkspaceId } from "./hooks/use-workspace-id";
import { useCurrentMember } from "./features/members/api/use-current-member";
import { Loader } from "lucide-react";
import { ConversationHero } from "./conversation-hero";

const TIME_THRESHOLD = 5;

interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: "channel" | "thread" | "conversation";
  data: GetMessagesReturnType | undefined;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d");
};

export const MessageList = ({
  memberName,
  memberImage,
  channelName,
  channelCreationTime,
  data,
  variant = "channel",
  loadMore,
  isLoadingMore,
  canLoadMore,
}: MessageListProps) => {
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });

  const groupedMessages = data?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof data>
  );

  return (
    <div className="flex-1 flex flex-col-reverse overflow-y-auto messages-scrollbar">
      {Object.entries(groupedMessages || {}).map(([dateKey, message]) => (
        <div key={dateKey}>
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-neutral-500" />
            <span className="relative inline-block bg-neutral-800 px-4 py-1 rounded-full text-xs text-neutral-400 border border-neutral-500 shadow-sm">
              {formatDateLabel(dateKey)}
            </span>
          </div>
          {message.map((msg, index) => {
            const prevMessage = message[index - 1];
            const isCompact =
              prevMessage &&
              prevMessage.user?._id === msg.user?._id &&
              differenceInMinutes(
                new Date(msg._creationTime),
                new Date(prevMessage._creationTime)
              ) < TIME_THRESHOLD;

            return (
              <Message
                key={msg._id}
                id={msg._id}
                memberId={msg.memberId}
                authorImage={msg.user.image}
                authorName={msg.user.name}
                isAuthor={msg.memberId === currentMember?._id}
                reactions={msg.reactions}
                body={msg.body}
                image={msg.image}
                updatedAt={msg.updatedAt}
                createdAt={msg._creationTime}
                isEditing={editingId === msg._id}
                setEditingId={setEditingId}
                isCompact={isCompact}
                hideThreadButton={variant === "thread"}
                threadCount={msg.threadCount}
                threadImage={msg.threadImage}
                threadTimestamp={msg.threadTimeStamp}
              />
            );
          })}
        </div>
      ))}
      <div
        className="h-1"
        ref={(el) => {
          if (el) {
            const observer = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting && canLoadMore) {
                  loadMore();
                }
              },
              { threshold: 1.0 }
            );
            observer.observe(el);
            return () => observer.disconnect();
          }
        }}
      />
      {isLoadingMore && (
        <div className="text-center my-2 relative">
          <hr className="absolute top-1/2 left-0 right-0 border-t border-neutral-500" />
          <span className="relative inline-block bg-neutral-800 px-4 py-1 rounded-full text-xs text-neutral-400 border border-neutral-500 shadow-sm">
            <Loader className="size-4 animate-spin" />
          </span>
        </div>
      )}
      {variant === "channel" && channelName && channelCreationTime && (
        <ChannelHero name={channelName} creationTime={channelCreationTime} />
      )}
      {variant === "conversation" && (
        <ConversationHero name={memberName} image={memberImage} />
      )}
    </div>
  );
};
