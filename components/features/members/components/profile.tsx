import { Id } from "@/convex/_generated/dataModel";

interface ProfileProps {
  memberId: Id<"members">;
  onClose: () => void;
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
  return <div className="text-neutral-200">Profile</div>;
};
