import { useQueries } from '@tanstack/react-query';

import {
  fetchActivities,
  fetchClubs,
  fetchInterests,
  type Activity,
  type Club,
} from '@/services/homeService';

export const homeQueryKeys = {
  activities: ['home', 'activities'] as const,
  clubs: ['home', 'clubs'] as const,
  interests: ['home', 'interests'] as const,
};

type HomeQueriesResult = {
  activities: Activity[];
  clubs: Club[];
  interests: string[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  refetchHomeData: () => Promise<void>;
};

export const useHomeQueries = (): HomeQueriesResult => {
  const [activitiesQuery, clubsQuery, interestsQuery] = useQueries({
    queries: [
      {
        queryKey: homeQueryKeys.activities,
        queryFn: fetchActivities,
      },
      {
        queryKey: homeQueryKeys.clubs,
        queryFn: fetchClubs,
      },
      {
        queryKey: homeQueryKeys.interests,
        queryFn: fetchInterests,
      },
    ],
  });

  const error = [activitiesQuery.error, clubsQuery.error, interestsQuery.error].find(
    (candidate): candidate is Error => candidate instanceof Error
  ) ?? null;

  const refetchHomeData = async () => {
    await Promise.all([
      activitiesQuery.refetch(),
      clubsQuery.refetch(),
      interestsQuery.refetch(),
    ]);
  };

  return {
    activities: activitiesQuery.data ?? [],
    clubs: clubsQuery.data ?? [],
    interests: interestsQuery.data ?? [],
    isLoading: [activitiesQuery, clubsQuery, interestsQuery].some((query) => query.isLoading),
    isFetching: [activitiesQuery, clubsQuery, interestsQuery].some((query) => query.isFetching),
    isError: [activitiesQuery, clubsQuery, interestsQuery].some((query) => query.isError),
    error,
    refetchHomeData,
  };
};
