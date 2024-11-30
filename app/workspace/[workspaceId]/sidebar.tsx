import { UserButton } from "@/components/features/auth/components/user-button";
import WorkSpaceSwitcher from "./workspace-switcher";
import SidebarButton from "./sidebar-button";
import {
  Bell,
  Calendar,
  Home,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-[70px] h-full bg-neutral-900 flex flex-col gap-y-4 items-center pt-[9px] pb-4">
      <WorkSpaceSwitcher />
      <SidebarButton
        icon={Home}
        label="Home"
        isActive={pathname.includes("/workspace")}
      />
      <SidebarButton icon={MessageCircle} label="Inbox" />
      <SidebarButton icon={Bell} label="Activity" />
      <SidebarButton icon={Calendar} label="Event" />
      <SidebarButton icon={MoreHorizontal} label="More" />
      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </aside>
  );
};

export default Sidebar;
