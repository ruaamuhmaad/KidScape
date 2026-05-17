import { useEffect, useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";

import {
  fetchActivities,
  fetchClubs,
  fetchInterests,
  type Activity,
  type ActivitySource,
  type Club,
  type Interest,
} from "@/services/homeService";

import {
  loadHomeCache,
  saveHomeCache,
} from "@/services/homeCacheService";

export const homeQueryKeys = {
  activities: (source: ActivitySource) => ["home", "activities", source] as const,
  clubs: ["home", "clubs"] as const,
  interests: ["home", "interests"] as const,
};

type HomeQueriesResult = {
  activities: Activity[];
  clubs: Club[];
  interests: Interest[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  refetchHomeData: () => Promise<void>;
};

type HomeData = {
  activities: Activity[];
  clubs: Club[];
  interests: Interest[];
};

export const useHomeQueries = (
  activitySource: ActivitySource
): HomeQueriesResult => {
  const [cachedData, setCachedData] = useState<HomeData | null>(null);

  const [activitiesQuery, clubsQuery, interestsQuery] = useQueries({
    queries: [
      {
        queryKey: homeQueryKeys.activities(activitySource),
        queryFn: () => fetchActivities(activitySource),
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

  useEffect(() => {
    async function loadCache() {
      const data = await loadHomeCache(activitySource);
      setCachedData(data);
    }

    void loadCache();
  }, [activitySource]);

  const activities = activitiesQuery.data ?? cachedData?.activities ?? [];
  const clubs = clubsQuery.data ?? cachedData?.clubs ?? [];
  const interests = interestsQuery.data ?? cachedData?.interests ?? [];

  useEffect(() => {
    const hasFreshData =
      Boolean(activitiesQuery.data) &&
      Boolean(clubsQuery.data) &&
      Boolean(interestsQuery.data);

    if (!hasFreshData) {
      return;
    }

    void saveHomeCache(activitySource, {
      activities: activitiesQuery.data ?? [],
      clubs: clubsQuery.data ?? [],
      interests: interestsQuery.data ?? [],
    });
  }, [
    activitySource,
    activitiesQuery.data,
    clubsQuery.data,
    interestsQuery.data,
  ]);

  const error =
    [activitiesQuery.error, clubsQuery.error, interestsQuery.error].find(
      (candidate): candidate is Error => candidate instanceof Error
    ) ?? null;

  const refetchHomeData = async () => {
    await Promise.all([
      activitiesQuery.refetch(),
      clubsQuery.refetch(),
      interestsQuery.refetch(),
    ]);
  };

  const queries = [activitiesQuery, clubsQuery, interestsQuery];

  return useMemo(
    () => ({
      activities,
      clubs,
      interests,
      isLoading: queries.some((query) => query.isLoading) && !cachedData,
      isFetching: queries.some((query) => query.isFetching),
      isError: queries.some((query) => query.isError) && !cachedData,
      error: cachedData ? null : error,
      refetchHomeData,
    }),
    [
      activities,
      clubs,
      interests,
      queries,
      cachedData,
      error,
      refetchHomeData,
    ]
  );
};