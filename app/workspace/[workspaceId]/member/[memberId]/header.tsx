import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";

interface HeaderProps {
  memberName?: string;
  memberImage?: string;
  onClick?: () => void;
}

export const Header = ({
  memberName = "member",
  memberImage,
  onClick,
}: HeaderProps) => {
  const avatarFallBack = memberName.charAt(0).toUpperCase();

  return (
    <div className="bg-[#222222] border-b border-neutral-900 h-[49px] flex items-center px-4 overflow-hidden">
      <Button
        variant="ghost"
        className="text-lg font-semibold px-2 overflow-hidden w-auto hover:bg-transparent"
        size="sm"
        onClick={onClick}
      >
        <Avatar className="size-7 mr-2">
          <AvatarImage src={memberImage} />
          <AvatarFallback>{avatarFallBack}</AvatarFallback>
        </Avatar>
        <span className="truncate text-neutral-200">{memberName}</span>
        <FaChevronDown className="size-2.5 ml-2 text-neutral-200" />
      </Button>
    </div>
  );
};
