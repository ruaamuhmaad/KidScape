import api from '@/services/apiBase';
import { HOME_API_ENDPOINTS } from '@/api/endpoints';

type RatingValue = string | number;
export type ActivitySource = 'guest' | 'child';

type HomeClubApiResponse = {
  id: string;
  title?: string;
  details?: string | { about?: string; [key: string]: unknown };
  description?: string;
  rating?: RatingValue;
  imageUrl?: string;
  location?: string;
};

type HomeActivityApiResponse = {
  id: string;
  title?: string;
  location?: string;
  description?: string;
  rating?: RatingValue;
  imageUrl?: string;
  image?: string;
  mood?: string;
  emotion?: string;
  category?: string;
  type?: string;
  status?: string;
  targetMood?: string;
  recommendedMood?: string;
  tags?: string[];
  moods?: string[];
  emotions?: string[];
  categories?: string[];
  recommendedFor?: string[];
};

type InterestDetailsApiResponse = {
  description?: string;
  activities?: HomeActivityApiResponse[];
};

const asString = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string') {
    return value;
  }

  if (value === null || value === undefined) {
    return fallback;
  }

  return String(value);
};

const asRating = (value: unknown): RatingValue => {
  if (typeof value === 'number' || typeof value === 'string') {
    return value;
  }

  return '';
};

export interface Club {
  id: string;
  title: string;
  details: string;
  description: string;
  rating: RatingValue;
  imageUrl: string;
  location: string;
}

export interface Activity {
  id: string;
  title: string;
  location: string;
  description: string;
  rating: RatingValue;
  imageUrl: string;
  mood: string;
  emotion: string;
  category: string;
  type: string;
  status: string;
  targetMood: string;
  recommendedMood: string;
  tags: string[];
  moods: string[];
  emotions: string[];
  categories: string[];
  recommendedFor: string[];
}

const mapClub = (club: HomeClubApiResponse): Club => {
  const descriptionValue =
    typeof club.description === 'string' && club.description.trim()
      ? club.description
      : typeof club.details === 'object' && typeof club.details.about === 'string'
      ? club.details.about
      : '';

  const detailsValue =
    typeof club.details === 'string' && club.details.trim() ? club.details : '';

  return {
    id: club.id,
    title: asString(club.title),
    details: asString(detailsValue),
    description: asString(descriptionValue),
    rating: asRating(club.rating),
    imageUrl: asString(club.imageUrl),
    location: asString(club.location ?? ''),
  };
};

const mapActivity = (activity: HomeActivityApiResponse): Activity => ({
  id: activity.id,
  title: asString(activity.title),
  location: asString(activity.location),
  description: asString(activity.description),
  rating: asRating(activity.rating),
  imageUrl: asString(activity.imageUrl ?? activity.image),
  mood: asString(activity.mood),
  emotion: asString(activity.emotion),
  category: asString(activity.category),
  type: asString(activity.type),
  status: asString(activity.status),
  targetMood: asString(activity.targetMood),
  recommendedMood: asString(activity.recommendedMood),
  tags: Array.isArray(activity.tags) ? activity.tags.filter((item): item is string => typeof item === 'string') : [],
  moods: Array.isArray(activity.moods) ? activity.moods.filter((item): item is string => typeof item === 'string') : [],
  emotions: Array.isArray(activity.emotions)
    ? activity.emotions.filter((item): item is string => typeof item === 'string')
    : [],
  categories: Array.isArray(activity.categories)
    ? activity.categories.filter((item): item is string => typeof item === 'string')
    : [],
  recommendedFor: Array.isArray(activity.recommendedFor)
    ? activity.recommendedFor.filter((item): item is string => typeof item === 'string')
    : [],
});

export interface InterestApiResponse {
  id: string;
  title?: string;
  name?: string;
  imageUrl?: string;
  description?: string;
}

export interface Interest {
  id: string;
  title: string;
  imageUrl?: string;
  description?: string;
}

export const fetchInterests = async (): Promise<Interest[]> => {
  const { data } = await api.get(HOME_API_ENDPOINTS.interests);

  if (!Array.isArray(data)) return [];

  if (data.every((item) => typeof item === "string")) {
    return data
      .filter((item): item is string => typeof item === "string")
      .map((title) => ({ id: title, title }));
  }

  const mapped = (data as InterestApiResponse[])
    .map((item) => {
      if (!item) return null;

      const title = String(item.title ?? item.name ?? item.id ?? "");

      if (!title) return null;

      return {
        id: String(item.id ?? title),
        title,
        imageUrl: item.imageUrl ? String(item.imageUrl) : undefined,
        description: item.description ? String(item.description) : undefined,
      } as Interest;
    })
    .filter((i): i is Interest => i !== null);

  return mapped;
};

export const fetchClubs = async (): Promise<Club[]> => {
  const { data } = await api.get<HomeClubApiResponse[]>(
    HOME_API_ENDPOINTS.clubs
  );

  return Array.isArray(data) ? data.map(mapClub) : [];
};
export const fetchClubById = async (id: string): Promise<Club | null> => {
  try {
    const { data } = await api.get<HomeClubApiResponse | null>(HOME_API_ENDPOINTS.clubDetails, {
      params: { id },
    });

    return data ? mapClub(data) : null;
  } catch (error) {
    console.warn('Error fetching club from Firebase API', error);
    return null;
  }
};
export const fetchActivities = async (
  source: ActivitySource = "guest"
): Promise<Activity[]> => {
  const { data } = await api.get<HomeActivityApiResponse[]>(
    HOME_API_ENDPOINTS.activities,
    {
      params: { source },
    }
  );

  return Array.isArray(data) ? data.map(mapActivity) : [];
};

export const fetchInterestPageData = async (
  interest: string
): Promise<{ description: string; activities: Activity[] }> => {
  try {
    const { data } = await api.get<InterestDetailsApiResponse>(HOME_API_ENDPOINTS.interestDetails, {
      params: { interest },
    });

    return {
      description: asString(data.description, 'No description available'),
      activities: Array.isArray(data.activities) ? data.activities.map(mapActivity) : [],
    };
  } catch (error) {
    console.warn('Error fetching interest page data from Firebase API', error);
    return { description: 'No description available', activities: [] };
  }
};
