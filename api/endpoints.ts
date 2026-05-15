export const API_PREFIX = '/api';

export const HOME_API_ENDPOINTS = {
  activities: '/home/activities',
  clubs: '/home/clubs',
  clubDetails: '/home/clubs/detail',
  interests: '/home/interests',
  interestDetails: '/home/interests/detail',
} as const;

export const withApiPrefix = (endpoint: string) => `${API_PREFIX}${endpoint}`;
