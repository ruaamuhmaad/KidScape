import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getCurrentUserProfile,
  updateCurrentUserProfile,
} from "@/services/authService";

type ProfileUpdatePayload = Parameters<typeof updateCurrentUserProfile>[0];

export const profileQueryKeys = {
  current: ["profile", "current"] as const,
};

export const useCurrentProfile = () =>
  useQuery({
    queryKey: profileQueryKeys.current,
    queryFn: getCurrentUserProfile,
  });

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProfileUpdatePayload) => updateCurrentUserProfile(payload),
    onSuccess: (profile) => {
      queryClient.setQueryData(profileQueryKeys.current, profile);
    },
  });
};
