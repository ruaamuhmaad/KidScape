import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, onUserStateChange } from '@/firebase/login';
import { getFavorites, addFavorite, removeFavorite } from '@/firebase/favoritesService';
import { fetchActivities, type Activity } from '@/services/homeService';
import { homeQueryKeys } from '@/hooks/useHomeQueries';
import { getActivityById } from '@/firebase/activityDetailsService';
import type { User } from 'firebase/auth';

export const useFavorites = () => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(getCurrentUser());

  useEffect(() => {
    const unsubscribe = onUserStateChange((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        queryClient.setQueryData(['favorites', null], []);
      }
    });
    return () => unsubscribe();
  }, [queryClient]);

  const {
    data: favoriteIds = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['favorites', user?.uid],
    queryFn: () => (user ? getFavorites(user.uid) : Promise.resolve([])),
    enabled: !!user,
  });

  const toggleFavorite = useMutation({
    mutationFn: async ({ activityId, isFavorite }: { activityId: string | number; isFavorite: boolean }) => {
      if (!user) throw new Error('Must be logged in to favorite');
      const safeId = String(activityId).trim();
      if (isFavorite) {
        await removeFavorite(user.uid, safeId);
      } else {
        await addFavorite(user.uid, safeId);
      }
    },
    onMutate: async ({ activityId, isFavorite }) => {
      if (!user) return;
      const safeId = String(activityId).trim();
      await queryClient.cancelQueries({ queryKey: ['favorites', user.uid] });
      const previousFavorites = queryClient.getQueryData<string[]>(['favorites', user.uid]);
      queryClient.setQueryData<string[]>(['favorites', user.uid], (old = []) => {
        if (isFavorite) {
          return old.filter((id) => String(id) !== safeId);
        } else {
          return Array.from(new Set([...old.map(String), safeId]));
        }
      });
      return { previousFavorites };
    },
    onError: (err, variables, context) => {
      if (user && context?.previousFavorites) {
        queryClient.setQueryData(['favorites', user.uid], context.previousFavorites);
      }
    },
    onSettled: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['favorites', user.uid] });
      }
    },
  });

  return {
    user,
    favoriteIds,
    isLoading,
    isError,
    error,
    refetch,
    toggleFavorite: toggleFavorite.mutate,
    isToggling: toggleFavorite.isPending,
  };
};

export const useFavoriteActivities = () => {
  const {
    user,
    favoriteIds,
    isLoading: isLoadingIds,
    isError: isErrorIds,
    error: idsError,
    refetch: refetchIds,
  } = useFavorites();

  const {
    data: favoriteActivities = [],
    isLoading: isLoadingActivities,
    isError: isErrorActivities,
    error: activitiesError,
    refetch: refetchActivities,
  } = useQuery({
    queryKey: ['favoriteActivitiesDetails', favoriteIds],
    queryFn: async () => {
      if (!favoriteIds || favoriteIds.length === 0) return [];
      
      const uniqueStringIds = Array.from(new Set(favoriteIds.map(id => String(id).trim())));
      
      const activities = await Promise.all(
        uniqueStringIds.map(id => getActivityById(id))
      );
      
      return activities
        .filter(a => a !== null)
        .map(a => ({
          id: a!.id,
          title: a!.title || '',
          location: a!.location || '',
          description: a!.description || '',
          rating: a!.rating || 0,
          imageUrl: a!.image || '', 
        }));
    },
    enabled: favoriteIds.length > 0,
  });

  const refetchAll = async () => {
    await Promise.all([refetchIds(), refetchActivities()]);
  };

  return {
    user,
    favoriteActivities: favoriteIds.length === 0 ? [] : favoriteActivities,
    isLoading: isLoadingIds || (favoriteIds.length > 0 && isLoadingActivities),
    isError: isErrorIds || isErrorActivities,
    error: idsError || activitiesError,
    refetch: refetchAll,
  };
};
