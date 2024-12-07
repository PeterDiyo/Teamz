import { Id } from "@/convex/_generated/dataModel";
import { UseGetMember } from "../api/use-get-member";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader, MailIcon, XIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface ProfileProps {
  memberId: Id<"members">;
  onClose: () => void;
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
  const { data: member, isLoading: isLoadingMember } = UseGetMember({
    id: memberId,
  });

  if (isLoadingMember) {
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
          <AlertTriangle className="size-5  text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Profile not found</p>
        </div>
      </div>
    );
  }

  const avatarFallback = member.user.name?.[0] ?? "M";

  return (
    <>
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
          {/* {currentMember?.role === "admin" &&
          currentMember?._id !== memberId ? (
            <div className="flex items-center gap-2 mt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="w-full capitalize" variant="outline">
                    {member.role} <ChevronDownIcon className="size-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuRadioGroup
                    value={member.role}
                    onValueChange={(role) =>
                      onUpdate(role as "admin" | "member")
                    }
                  >
                    <DropdownMenuRadioItem value="admin">
                      Admin
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="member">
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
              <Button onClick={onLeave} className="w-full" variant="default">
                Leave
              </Button>
            </div>
          ) : null} */}
        </div>
        <Separator className="bg-neutral-700" />
        <div className="flex flex-col p-4 ">
          <p className="text-sm font-bold mb-4 text-neutral-300">
            Contact Information
          </p>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-md bg-neutral-600/40 flex items-center justify-center">
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
