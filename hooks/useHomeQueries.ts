import { useCallback, useEffect, useMemo, useState } from "react";

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
  const [activities, setActivities] = useState<Activity[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const applyHomeData = useCallback((data: HomeData) => {
    setActivities(data.activities);
    setClubs(data.clubs);
    setInterests(data.interests);
  }, []);

  const refetchHomeData = useCallback(async () => {
    setIsFetching(true);
    setIsError(false);
    setError(null);

    try {
      const [firebaseActivities, firebaseClubs, firebaseInterests] =
        await Promise.all([
          fetchActivities(activitySource),
          fetchClubs(),
          fetchInterests(),
        ]);

      const freshData: HomeData = {
        activities: firebaseActivities,
        clubs: firebaseClubs,
        interests: firebaseInterests,
      };

      applyHomeData(freshData);

      await saveHomeCache(activitySource, freshData);
    } catch (err) {
      const cachedData = await loadHomeCache(activitySource);

      if (cachedData) {
        applyHomeData(cachedData);
        setIsError(false);
        setError(null);
      } else {
        setIsError(true);
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to load home data")
        );
      }
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [activitySource, applyHomeData]);

  useEffect(() => {
    setIsLoading(true);
    void refetchHomeData();
  }, [refetchHomeData]);

  return useMemo(
    () => ({
      activities,
      clubs,
      interests,
      isLoading,
      isFetching,
      isError,
      error,
      refetchHomeData,
    }),
    [
      activities,
      clubs,
      interests,
      isLoading,
      isFetching,
      isError,
      error,
      refetchHomeData,
    ]
  );
};