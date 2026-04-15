import {
  createContext,
  type PropsWithChildren,
  useContext,
  useDeferredValue,
  useMemo,
  useState,
} from 'react';

import { useHomeQueries } from '@/hooks/useHomeQueries';
import { type Activity, type Club } from '@/services/homeService';

const defaultInterests = [
  'Sport',
  'Art',
  'Swimming',
  'Football',
  'Cooking',
  'educational',
  'Music',
] as const;

export type HomeFilters = {
  city: string;
  age: string;
  minPrice: string;
  maxPrice: string;
  rating: number;
};

const defaultHomeFilters: HomeFilters = {
  city: '',
  age: '',
  minPrice: '',
  maxPrice: '',
  rating: 0,
};

type HomeContextValue = {
  activities: Activity[];
  clubs: Club[];
  interests: string[];
  filteredActivities: Activity[];
  filteredClubs: Club[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filterVisible: boolean;
  openFilters: () => void;
  closeFilters: () => void;
  appliedFilters: HomeFilters;
  applyFilters: (filters: HomeFilters) => void;
  displayInterests: string[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  errorMessage: string | null;
  refetchHomeData: () => Promise<void>;
};

const HomeContext = createContext<HomeContextValue | undefined>(undefined);

const normalizeText = (value: string) => value.trim().toLowerCase();

const parseRating = (value: string | number) => {
  if (typeof value === 'number') {
    return value;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const matchesSearch = (query: string, values: string[]) => {
  if (!query) {
    return true;
  }

  return values.some((value) => normalizeText(value).includes(query));
};

const matchesCity = (selectedCity: string, value: string) => {
  if (!selectedCity) {
    return true;
  }

  return normalizeText(value).includes(normalizeText(selectedCity));
};

const matchesRating = (minimumRating: number, value: string | number) => {
  if (!minimumRating) {
    return true;
  }

  return parseRating(value) >= minimumRating;
};

export function HomeProvider({ children }: PropsWithChildren) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<HomeFilters>(defaultHomeFilters);
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const {
    activities,
    clubs,
    interests,
    isLoading,
    isFetching,
    isError,
    error,
    refetchHomeData,
  } = useHomeQueries();

  const normalizedSearchQuery = normalizeText(deferredSearchQuery);

  const filteredActivities = useMemo(
    () =>
      activities.filter((activity) => {
        return (
          matchesSearch(normalizedSearchQuery, [activity.title, activity.location, activity.description]) &&
          matchesCity(appliedFilters.city, activity.location) &&
          matchesRating(appliedFilters.rating, activity.rating)
        );
      }),
    [activities, appliedFilters.city, appliedFilters.rating, normalizedSearchQuery]
  );

  const filteredClubs = useMemo(
    () =>
      clubs.filter((club) => {
        return (
          matchesSearch(normalizedSearchQuery, [club.title, club.details, club.location]) &&
          matchesCity(appliedFilters.city, club.location) &&
          matchesRating(appliedFilters.rating, club.rating)
        );
      }),
    [appliedFilters.city, appliedFilters.rating, clubs, normalizedSearchQuery]
  );

  const displayInterests = useMemo(
    () => (interests.length ? interests : [...defaultInterests]),
    [interests]
  );

  const value = useMemo<HomeContextValue>(
    () => ({
      activities,
      clubs,
      interests,
      filteredActivities,
      filteredClubs,
      searchQuery,
      setSearchQuery,
      filterVisible,
      openFilters: () => setFilterVisible(true),
      closeFilters: () => setFilterVisible(false),
      appliedFilters,
      applyFilters: (filters) => {
        setAppliedFilters(filters);
        setFilterVisible(false);
      },
      displayInterests,
      isLoading,
      isFetching,
      isError,
      errorMessage: error?.message ?? null,
      refetchHomeData,
    }),
    [
      activities,
      appliedFilters,
      clubs,
      displayInterests,
      error,
      filterVisible,
      filteredActivities,
      filteredClubs,
      interests,
      isError,
      isFetching,
      isLoading,
      refetchHomeData,
      searchQuery,
    ]
  );

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
}

export const useHome = () => {
  const context = useContext(HomeContext);

  if (!context) {
    throw new Error('useHome must be used within a HomeProvider.');
  }

  return context;
};
