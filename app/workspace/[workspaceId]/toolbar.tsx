import { useGetWorkSpace } from "@/components/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/components/hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import { Info, Search } from "lucide-react";

const Toolbar = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkSpace({ id: workspaceId });

  return (
    <nav className="bg-neutral-900 flex items-center justify-between h-10 p-1.5">
      <div className="flex-1 text-neutral-100 ml-2 font-mono hidden md:flex text-lg">
        Teamz
      </div>
      <div className="min-w-[280px] max-w-[642px] grow-[2] shrink">
        <Button
          size="sm"
          className="hover:bg-accent-15 border-b bg-neutral-800/50 border-neutral-400 w-full justify-start h-7 px-2"
        >
          <Search className="size-4 text-neutral-300 mr-2" />
          <span className="text-sm text-neutral-300">Search {data?.name}</span>
        </Button>
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
