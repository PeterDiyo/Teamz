import { Id } from "@/convex/_generated/dataModel";
import { UseGetMember } from "../api/use-get-member";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ChevronDownIcon,
  Loader,
  MailIcon,
  XIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/components/hooks/use-workspace-id";
import { useConfirm } from "@/components/hooks/use-confirm";
import { useCurrentMember } from "../api/use-current-member";
import { useUpdateMember } from "../api/use-update-member";
import { useRemoveMember } from "../api/use-remove-member";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileProps {
  memberId: Id<"members">;
  onClose: () => void;
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const [LeaveDialog, confirmLeave] = useConfirm(
    "Leave Workspace",
    "Are you sure you want to leave this workspace?"
  );

  const [RemoveDialog, confirmRemove] = useConfirm(
    "Remove member",
    "Are you sure you want to remove this member?"
  );

  const [UpdateDialog, confirmUpdate] = useConfirm(
    "Change role",
    "Are you sure you want to change this members role?"
  );

  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    useCurrentMember({ workspaceId });

  const { data: member, isLoading: isLoadingMember } = UseGetMember({
    id: memberId,
  });

  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();
  const { mutate: removeMember, isPending: isRemovingMember } =
    useRemoveMember();

  const onRemove = async () => {
    const ok = await confirmRemove();

    if (!ok) {
      return;
    }
    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          toast.success("Member removed");
          onClose();
        },
        onError: () => {
          toast.error("Failed to remove member");
        },
      }
    );
  };

  const onLeave = async () => {
    const ok = await confirmLeave();
    if (!ok) {
      return;
    }
    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          router.replace("/");
          toast.success("You left the workspace");
          onClose();
        },
        onError: () => {
          toast.error("Failed to leave the workspace");
        },
      }
    );
  };

  const onUpdate = async (role: "admin" | "member") => {
    const ok = await confirmUpdate();
    if (!ok) {
      return;
    }
    updateMember(
      { id: memberId, role },
      {
        onSuccess: () => {
          toast.success("Role changed");
          onClose();
        },
        onError: (error) => {
          console.error("Role update error:", error);
          toast.error("Failed to change role");
        },
      }
    );
  };

  if (isLoadingMember || isLoadingCurrentMember) {
    return (
      <div className="h-full flex flex-col text-neutral-200">
        <div className="flex h-[49px] justify-between items-center px-4 border-b border-neutral-700">
          <p className="text-lg font-bold">Profile</p>
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

  if (!member) {
    return (
      <div className="h-full flex flex-col text-neutral-200">
        <div className="flex h-[49px] justify-between items-center px-4 border-b border-neutral-700">
          <p className="text-lg font-bold">Profile</p>
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
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Profile not found</p>
        </div>
      </div>
    );
  }

  const avatarFallback = member.user.name?.[0] ?? "M";

  return (
    <>
      <RemoveDialog />
      <LeaveDialog />
      <UpdateDialog />
      <div className="h-full flex flex-col text-neutral-200">
        <div className="flex h-[49px] justify-between items-center px-4 border-b border-neutral-700">
          <p className="text-lg font-bold">Profile</p>
          <Button
            onClick={onClose}
            size="iconSm"
            variant="ghost"
            className="hover:bg-neutral-300/20 hover:text-neutral-200"
          >
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col p-4 items-center justify-center">
          <Avatar className="max-w-[256px] max-h-[256px] size-full rounded-md">
            <AvatarImage src={member.user.image} />
            <AvatarFallback className="aspect-square text-6xl rounded-md">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col p-4">
          <p className="text-xl font-bold">{member.user.name}</p>
          {currentMember?.role === "admin" &&
          currentMember?._id !== memberId ? (
            <div className="flex items-center gap-2 mt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="w-full capitalize hover:bg-neutral-600/50 hover:text-neutral-200"
                    variant="outline"
                  >
                    {member.role} <ChevronDownIcon className="size-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-neutral-800 border-neutral-700">
                  <DropdownMenuRadioGroup
                    value={member.role}
                    onValueChange={(role) =>
                      onUpdate(role as "admin" | "member")
                    }
                  >
                    <DropdownMenuRadioItem
                      value="admin"
                      className="text-neutral-200 focus:bg-neutral-700 focus:text-neutral-200"
                    >
                      Admin
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="member"
                      className="text-neutral-200 focus:bg-neutral-700 focus:text-neutral-200"
                    >
                      Member
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={onRemove}
                className="w-full"
                variant="destructive"
              >
                Remove
              </Button>
            </div>
          ) : currentMember?._id === memberId &&
            currentMember?.role !== "admin" ? (
            <div className="flex items-center gap-2 mt-4">
              <Button
                onClick={onLeave}
                className="w-full hover:bg-neutral-600/50 hover:text-neutral-200"
                variant="outline"
              >
                Leave
              </Button>
            </div>
          ) : null}
        </div>
        <Separator className="bg-neutral-700" />
        <div className="flex flex-col p-4">
          <p className="text-sm font-bold mb-4 text-neutral-300">
            Contact Information
          </p>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-md bg-neutral-700/70 flex items-center justify-center">
              <MailIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <p className="text-[13px] font-semibold text-muted-foreground">
                Email Address
              </p>
              <Link
                href={`mailto:${member.user.email}`}
                className="text-sm hover:underline text-[#1974b9]"
              >
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
