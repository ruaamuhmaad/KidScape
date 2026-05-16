export const API_PREFIX = '/api';

export const HOME_API_ENDPOINTS = {
  activities: '/home/activities',
  clubs: '/home/clubs',
  interests: '/home/interests',
} as const;

export const withApiPrefix = (endpoint: string) => `${API_PREFIX}${endpoint}`;
