import type { AxiosRequestConfig } from 'axios';

import {
  getAllActivitiesFromFirebase,
  getAllClubsFromFirebase,
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

const endpointHandlers: Record<string, Partial<Record<ApiMethod, ApiHandler>>> = {
  [withApiPrefix(HOME_API_ENDPOINTS.activities)]: {
    get: async (config) =>
      getAllActivitiesFromFirebase({
        mood: getFirstStringParam(config.params?.mood),
      }),
  },
  [withApiPrefix(HOME_API_ENDPOINTS.clubs)]: {
    get: async () => getAllClubsFromFirebase(),
  },
  [withApiPrefix(HOME_API_ENDPOINTS.interests)]: {
    get: async () => getInterestsFromFirebase(),
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
