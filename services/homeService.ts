import api from '@/services/apiBase';

type RatingValue = string | number;

type HomeClubApiResponse = {
  id: string;
  title?: string;
  details?: string;
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
}

const mapClub = (club: HomeClubApiResponse): Club => ({
  id: club.id,
  title: asString(club.title),
  details: asString(club.details ?? club.description),
  rating: asRating(club.rating),
  imageUrl: asString(club.imageUrl),
  location: asString(club.location ?? club.details ?? club.description),
});

const mapActivity = (activity: HomeActivityApiResponse): Activity => ({
  id: activity.id,
  title: asString(activity.title),
  location: asString(activity.location),
  description: asString(activity.description),
  rating: asRating(activity.rating),
  imageUrl: asString(activity.imageUrl),
});

export const fetchInterests = async (): Promise<string[]> => {
  try {
    const { data } = await api.get<string[]>('/home/interests');
    return Array.isArray(data) ? data.filter((item): item is string => typeof item === 'string') : [];
  } catch (error) {
    console.warn('Error fetching interests from API', error);
    return [];
  }
};

export const fetchClubs = async (): Promise<Club[]> => {
  try {
    const { data } = await api.get<HomeClubApiResponse[]>('/home/clubs');
    return Array.isArray(data) ? data.map(mapClub) : [];
  } catch (error) {
    console.warn('Error fetching clubs from API', error);
    return [];
  }
};

export const fetchActivities = async (): Promise<Activity[]> => {
  try {
    const { data } = await api.get<HomeActivityApiResponse[]>('/home/activities');
    return Array.isArray(data) ? data.map(mapActivity) : [];
  } catch (error) {
    console.warn('Error fetching activities from API', error);
    return [];
  }
};
