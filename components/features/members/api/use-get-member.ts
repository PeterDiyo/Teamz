import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

interface UseGetMemberProps {
  id: Id<"members">;
}

export const UseGetMember = ({ id }: UseGetMemberProps) => {
  const data = useQuery(api.members.getById, { id });

  const isLoading = data === undefined;

  return { data, isLoading };
};
