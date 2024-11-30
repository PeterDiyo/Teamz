import { useCurrentMember } from "@/components/features/members/api/use-current-member";
import { useGetWorkSpace } from "@/components/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/components/hooks/use-workspace-id";
import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";
import WorkspaceHearder from "./workspace-header";
import { SidebarItem } from "./sidebar-item";
import { useGetChannels } from "@/components/features/channels/api/use-get-channels";
import { WorkspaceSection } from "./workspace-section";
import { UseGetMembers } from "@/components/features/members/api/use-get-members";
import { UserItem } from "./user-item";
import { useCreateChannelModal } from "@/components/features/channels/store/use-create-channel-modal";
import { useChannelId } from "@/components/hooks/use-channel-id";
import { useMemberId } from "@/components/hooks/use-member-id";

const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const memberId = useMemberId();

  const [_open, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkSpace({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });
  const { data: members, isLoading: membersLoading } = UseGetMembers({
    workspaceId,
  });

  if (workspaceLoading || memberLoading) {
    return (
      <div className="flex flex-col bg-[#222222] h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-neutral-100" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="flex flex-col gap-y-2 bg-[#222222] h-full items-center justify-center">
        <AlertTriangle className="size-5 text-neutral-100" />
        <p className="text-neutral-100 text-sm">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#222222] h-full">
      <WorkspaceHearder
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem label="Threads" icon={MessageSquareText} id="threads" />
        <SidebarItem label="Drafts & Sent" icon={SendHorizonal} id="drafts" />
      </div>
      <WorkspaceSection
        label="Channels"
        hint="New channel"
        onNew={member.role === "admin" ? () => setOpen(true) : undefined}
      >
        {channels?.map((item) => {
          return (
            <SidebarItem
              key={item._id}
              icon={HashIcon}
              label={item.name}
              id={item._id}
              variant={channelId === item._id ? "active" : "default"}
            />
          );
        })}
      </WorkspaceSection>
      <WorkspaceSection
        label="Direct Messages"
        hint="New direct message"
        onNew={() => {}}
      >
        {members?.map((item) => {
          return (
            <div className="my-0.5">
              <UserItem
                key={item._id}
                id={item._id}
                label={item.user.name}
                image={item.user.image}
                variant={item._id === memberId ? "active" : "default"}
              />
            </div>
          );
        })}
      </WorkspaceSection>
    </div>
  );
};

export default WorkspaceSidebar;
