import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import {
  addChildToFirebase,
  getChildrenByParentId,
  type ChildData,
} from "@/firebase";
import { getCurrentUserProfile } from "@/services/authService";

import { useCurrentProfile } from "./useProfileQueries";

const CHILDREN_PERMISSION = "children:manage";

export type AddChildPayload = Omit<
  ChildData,
  "parentId" | "createdAt" | "updatedAt"
>;

export const childrenQueryKeys = {
  all: ["children"] as const,
  byParent: (parentId: string) => ["children", "parent", parentId] as const,
};

export const useCurrentParentChildren = () => {
  const profileQuery = useCurrentProfile();
  const profile = profileQuery.data;

  const childrenQuery = useQuery({
    queryKey: childrenQueryKeys.byParent(profile?.uid ?? "pending"),
    enabled: Boolean(profile),
    queryFn: async () => {
      if (!profile) {
        return [];
      }

      if (!profile.permissions.includes(CHILDREN_PERMISSION)) {
        throw new Error("You do not have permission to manage children.");
      }

      return getChildrenByParentId(profile.uid);
    },
  });

  const refetchProfile = profileQuery.refetch;
  const refetchList = childrenQuery.refetch;

  const refetchChildren = useCallback(async () => {
    if (!profile) {
      await refetchProfile();
      return;
    }

    await refetchList();
  }, [profile, refetchList, refetchProfile]);

  return {
    profile,
    children: childrenQuery.data ?? [],
    isLoading: profileQuery.isLoading || childrenQuery.isLoading,
    isFetching: profileQuery.isFetching || childrenQuery.isFetching,
    isRefreshing: profileQuery.isRefetching || childrenQuery.isRefetching,
    error: profileQuery.error ?? childrenQuery.error,
    refetchChildren,
  };
};

export const useAddChild = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (child: AddChildPayload) => {
      const profile = await getCurrentUserProfile();

      if (!profile.permissions.includes(CHILDREN_PERMISSION)) {
        throw new Error("You do not have permission to manage children.");
      }

      const childId = await addChildToFirebase({
        ...child,
        parentId: profile.uid,
      });

      return { childId, parentId: profile.uid };
    },
    onSuccess: ({ parentId }) => {
      void queryClient.invalidateQueries({ queryKey: childrenQueryKeys.all });
      void queryClient.invalidateQueries({
        queryKey: childrenQueryKeys.byParent(parentId),
      });
    },
  });
};
