import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import { useGetMessage } from "../api/use-get-message";
import { Message } from "@/components/message";
import { useCurrentMember } from "../../members/api/use-current-member";
import { useWorkspaceId } from "@/components/hooks/use-workspace-id";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useCreateMessage } from "../api/use-create-message";
import { useGenerateUploadUrl } from "../../upload/api/use-generate-upload-url";
import { useChannelId } from "@/components/hooks/use-channel-id";
import { toast } from "sonner";
import { useGetMessages } from "../api/use-get-messages";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

const TIME_THRESHOLD = 5;

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d");
};

type CreateMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  parentMessageId: Id<"messages">;
  body: string;
  image: Id<"_storage"> | undefined;
};

export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const editorRef = useRef<Quill | null>(null);

  const { data: currentMember } = useCurrentMember({ workspaceId });
  const { data: message, isLoading: loadingMessage } = useGetMessage({
    id: messageId,
  });

  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const { results, status, loadMore } = useGetMessages({
    channelId,
    parentMessageId: messageId,
  });

  const canLoadMore = status === "CanLoadMore";
  const isLoadingMore = status === "LoadingMore";

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);
      editorRef?.current?.enable(false);

      const values: CreateMessageValues = {
        channelId,
        workspaceId,
        parentMessageId: messageId,
        body,
        image: undefined,
      };

      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });

        if (!url) {
          throw new Error("Url not found");
        }
        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!result.ok) {
          throw new Error("Failed to upload image");
        }
        const { storageId } = await result.json();

        values.image = storageId;
      }

      await createMessage(values, { throwError: true });

      setEditorKey((prevKey) => prevKey + 1);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
      editorRef?.current?.enable(true);
    }
  };

  const groupedMessages = results?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof results>
  );

  if (loadingMessage || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex flex-col text-neutral-200">
        <div className="flex h-[49px] justify-between items-center px-4 border-b border-neutral-700">
          <p className="text-lg font-bold">Thread</p>
          <Button
            onClick={onClose}
            size="iconSm"
            variant="ghost"
            className="hover:bg-neutral-300/20 hover:text-neutral-200"
          >
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="h-full flex flex-col gap-y-2 items-center justify-center">
          <Loader className="size-5 animate-spin text-neutral-300" />
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="h-full flex flex-col text-neutral-200">
        <div className="flex h-[49px] justify-between items-center px-4 border-b border-neutral-700">
          <p className="text-lg font-bold">Thread</p>
          <Button
            onClick={onClose}
            size="iconSm"
            variant="ghost"
            className="hover:bg-neutral-300/20 hover:text-neutral-200"
          >
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="h-full flex flex-col gap-y-2 items-center justify-center">
          <AlertTriangle className="size-5  text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Message not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col text-neutral-200">
      <div className="flex h-[49px] justify-between items-center px-4 border-b border-neutral-700">
        <p className="text-lg font-bold">Thread</p>
        <Button
          onClick={onClose}
          size="iconSm"
          variant="ghost"
          className="hover:bg-neutral-300/20 hover:text-neutral-200"
        >
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
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
                  hideThreadButton
                  threadCount={msg.threadCount}
                  threadImage={msg.threadImage}
                  threadName={msg.threadName}
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
        <Message
          hideThreadButton
          memberId={message.memberId}
          authorImage={message.user.image}
          authorName={message.user.name}
          isAuthor={message.memberId === currentMember?._id}
          body={message.body}
          image={message.image}
          createdAt={message._creationTime}
          updatedAt={message.updatedAt}
          id={message._id}
          reactions={message.reactions}
          isEditing={editingId === message._id}
          setEditingId={setEditingId}
        />
      </div>
      <div className="px-4">
        <Editor
          key={editorKey}
          onSubmit={handleSubmit}
          innerRef={editorRef}
          disabled={isPending}
          placeholder="Reply..."
        />
      </div>
    </div>
  );
};
