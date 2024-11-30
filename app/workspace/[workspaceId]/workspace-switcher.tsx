import { useGetWorkSpace } from "@/components/features/workspaces/api/use-get-workspace";
import { useGetWorkSpaces } from "@/components/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/components/features/workspaces/store/use-create-workspace-modal";
import { useWorkspaceId } from "@/components/hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const WorkSpaceSwitcher = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [_open, setOpen] = useCreateWorkspaceModal();

  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkSpaces();
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkSpace({
    id: workspaceId,
  });

  const filteredWorkspaces = workspaces?.filter(
    (workspace) => workspace?._id !== workspaceId
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-9 relative overflow-hidden bg-violet-600/75 hover:bg-violet-600/90 font-semibold text-xl">
          {workspaceLoading ? (
            <Loader className="size-5 animate-spin shrink-0" />
          ) : (
            workspace?.name.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        className="w-64 border-none bg-neutral-800"
      >
        <DropdownMenuItem
          onClick={() => router.push(`/workspace/${workspaceId}`)}
          className="cursor-pointer flex-col justify-start items-start capitalize text-white hover:!bg-neutral-800/30 hover:!text-neutral-50"
        >
          {workspace?.name}
          <span className="text-xs text-neutral-400">Active workspace</span>
        </DropdownMenuItem>
        {filteredWorkspaces?.map((workspace) => {
          return (
            <DropdownMenuItem
              key={workspace._id}
              className="cursor-pointer capitalize text-neutral-300 hover:!bg-neutral-700/50 hover:!text-neutral-50 overflow-hidden"
              onClick={() => router.push(`/workspace/${workspace._id}`)}
            >
              <div className="shrink-0 size-9 relative overflow-hidden bg-neutral-600/90 text-neutral-100 font-semibold text-lg rounded-md flex items-center justify-center mr-2">
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <p className="truncate">{workspace.name}</p>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuItem
          className="cursor-pointer text-neutral-300 hover:!bg-neutral-800/30 hover:!text-neutral-50"
          onClick={() => setOpen(true)}
        >
          <div className="size-9 relative overflow-hidden bg-violet-600/60 text-neutral-100 font-semibold text-lg rounded-md flex items-center justify-center mr-2">
            <Plus />
          </div>
          Create a new workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WorkSpaceSwitcher;