import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { usePaginatedQuery } from "convex/react";

const BATCH_SIZE = 3;

interface UseGetMessagesProps {
  channelId?: Id<"channels">;
  conversationId?: Id<"conversations">;
  parentMessageId?: Id<"messages">;
}

export type GetMessagesReturnType =
  (typeof api.messages.get._returnType)["page"];

export const useGetMessages = ({
  channelId,
  conversationId,
  parentMessageId,
}: UseGetMessagesProps) => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.get,
    {
      channelId,
      conversationId,
      parentMessageId,
    },
    { initialNumItems: BATCH_SIZE }
  );

  return {
    results,
    status,
    loadMore: () => loadMore(BATCH_SIZE),
  };
};