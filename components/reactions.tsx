import { Doc, Id } from "@/convex/_generated/dataModel";
import { useWorkspaceId } from "./hooks/use-workspace-id";
import { useCurrentMember } from "./features/members/api/use-current-member";
import { cn } from "@/lib/utils";
import { Hint } from "./hint";
import { EmojiPopover } from "./emoji-popover";
import { MdOutlineAddReaction } from "react-icons/md";

interface ReactionsProps {
  data: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  onChange: (value: string) => void;
}

export const Reactions = ({ data, onChange }: ReactionsProps) => {
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });

  const currentMemberId = currentMember?._id;
  if (data.length === 0 || !currentMember) {
    return null;
  }

  return (
    <div className="flex items-center gap-0.5 mt-1 mb-1">
      {data.map((reaction) => (
        <Hint
          key={reaction._id}
          label={`${reaction.count} ${reaction.count === 1 ? "person" : "people"} reacted with ${reaction.value}`}
        >
          <button
            onClick={() => onChange(reaction.value)}
            className={cn(
              "h-6 px-2 rounded-full bg-neutral-600/70 border border-transparent flex items-center gap-x-1 text-neutral-300",
              currentMemberId &&
                reaction.memberIds.includes(currentMemberId) &&
                "border-violet-500"
            )}
          >
            {reaction.value}
            <span
              className={cn(
                "text-xs",
                currentMemberId &&
                  reaction.memberIds.includes(currentMemberId) &&
                  "text-violet-400"
              )}
            >
              {reaction.count}
            </span>
          </button>
        </Hint>
      ))}
      <EmojiPopover
        hint="Add reaction"
        onEmojiSelect={(emoji) => onChange(emoji.native)}
      >
        <button className="h-7 px-3 rounded-full bg-neutral-600/70 border border-transparent flex items-center gap-x-1">
          <MdOutlineAddReaction className="size-4" />
        </button>
      </EmojiPopover>
    </div>
  );
};
