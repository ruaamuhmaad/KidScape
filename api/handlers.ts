import type { AxiosRequestConfig } from 'axios';

import {
  type ActivitySource,
  getAllActivitiesFromFirebase,
  getAllClubsFromFirebase,
  getClubFromFirebase,
  getInterestActivitiesFromFirebase,
  getInterestDescriptionFromFirebase,
  getInterestsFromFirebase,
} from '@/firebase';

import { HOME_API_ENDPOINTS, withApiPrefix } from './endpoints';

type ApiMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
type ApiHandler = (config: AxiosRequestConfig) => Promise<unknown>;

const getFirstStringParam = (value: unknown): string | undefined => {
  if (typeof value === 'string' && value.trim()) {
    return value;
  }

  if (Array.isArray(value)) {
    const firstString = value.find(
      (item): item is string => typeof item === 'string' && item.trim().length > 0
    );
    return firstString;
  }

  return undefined;
};

const getActivitySourceParam = (value: unknown): ActivitySource => {
  const source = getFirstStringParam(value);
  return source === 'child' ? 'child' : 'guest';
};

const endpointHandlers: Record<string, Partial<Record<ApiMethod, ApiHandler>>> = {
  [withApiPrefix(HOME_API_ENDPOINTS.activities)]: {
    get: async (config) =>
      getAllActivitiesFromFirebase(
        {
          mood: getFirstStringParam(config.params?.mood),
        },
        getActivitySourceParam(config.params?.source)
      ),
  },
  [withApiPrefix(HOME_API_ENDPOINTS.clubs)]: {
    get: async () => getAllClubsFromFirebase(),
  },
  [withApiPrefix(HOME_API_ENDPOINTS.clubDetails)]: {
    get: async (config) => {
      const id = getFirstStringParam(config.params?.id);
      return id ? getClubFromFirebase(id) : null;
    },
  },
  [withApiPrefix(HOME_API_ENDPOINTS.interests)]: {
    get: async () => getInterestsFromFirebase(),
  },
  [withApiPrefix(HOME_API_ENDPOINTS.interestDetails)]: {
    get: async (config) => {
      const interest = getFirstStringParam(config.params?.interest) ?? 'Sport';

      const [description, activities] = await Promise.all([
        getInterestDescriptionFromFirebase(interest),
        getInterestActivitiesFromFirebase(interest),
      ]);

      return { description, activities };
    },
  },
};

const normalizeUrl = (url?: string, baseURL?: string) => {
  if (!url) {
    return baseURL ?? '';
  }

  if (/^https?:\/\//i.test(url)) {
    return new URL(url).pathname;
  }

  const normalizedBase = (baseURL ?? '').replace(/\/+$/, '');
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`;

  if (!normalizedBase || normalizedUrl.startsWith(normalizedBase)) {
    return normalizedUrl;
  }

  return `${normalizedBase}${normalizedUrl}`;
};

export const resolveApiRequest = async (config: AxiosRequestConfig) => {
  const method = (config.method ?? 'get').toLowerCase() as ApiMethod;
  const resolvedUrl = normalizeUrl(config.url, config.baseURL);
  const handler = endpointHandlers[resolvedUrl]?.[method];

  if (!handler) {
    throw new Error(`No API handler registered for ${method.toUpperCase()} ${resolvedUrl}`);
  }

  return handler(config);
};
