import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

interface useGetWorkSpaceInfoProps {
  id: Id<"workspaces">;
}

export const useGetWorkSpaceInfo = ({ id }: useGetWorkSpaceInfoProps) => {
  const data = useQuery(api.workspaces.getInfoById, { id });
  const isLoading = data === undefined;

  return { data, isLoading };
};
