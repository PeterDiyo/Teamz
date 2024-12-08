import { useGetWorkSpace } from "@/components/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/components/hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import { Info, Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGetChannels } from "@/components/features/channels/api/use-get-channels";
import { UseGetMembers } from "@/components/features/members/api/use-get-members";

const Toolbar = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useState(false);

  const { data } = useGetWorkSpace({ id: workspaceId });
  const { data: channels } = useGetChannels({ workspaceId });
  const { data: members } = UseGetMembers({ workspaceId });

  const onChannelClick = (channelId: string) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/channel/${channelId}`);
  };

  const onMemberClick = (memberId: string) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/member/${memberId}`);
  };

  return (
    <nav className="bg-neutral-900 flex items-center justify-between h-10 p-1.5">
      <div className="flex-1 text-neutral-100 ml-2 font-mono hidden md:flex text-lg">
        Teamz
      </div>
      <div className="min-w-[280px] max-w-[642px] grow-[2] shrink">
        <Button
          onClick={() => setOpen(true)}
          size="sm"
          className="hover:bg-accent-15 border-b bg-neutral-800/70 border-neutral-400 w-full justify-start h-7 px-2"
        >
          <Search className="size-4 text-neutral-400 mr-2" />
          <span className="text-sm text-neutral-200">Search {data?.name}</span>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty> No results found.</CommandEmpty>
            <CommandGroup heading="Channels">
              {channels?.map((channel) => (
                <CommandItem
                  key={channel._id}
                  onSelect={() => onChannelClick(channel._id)}
                >
                  {channel.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Members">
              {members?.map((member) => (
                <CommandItem
                  key={member._id}
                  onSelect={() => onMemberClick(member._id)}
                >
                  {member.user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant="transparent" size="iconSm">
          <Info className="size-5 text-neutral-100" />
        </Button>
      </div>
    </nav>
  );
};

export default Toolbar;
