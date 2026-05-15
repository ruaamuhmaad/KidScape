import ApiBase from './apiBase';
import { withApiPrefix, HOME_API_ENDPOINTS } from './endpoints';

export const getActivities = async (params?: Record<string, unknown>) => {
  const response = await ApiBase.get(withApiPrefix(HOME_API_ENDPOINTS.activities), { params });
  return response.data;
};

export const getClubs = async () => {
  const response = await ApiBase.get(withApiPrefix(HOME_API_ENDPOINTS.clubs));
  return response.data;
};

export const getInterests = async () => {
  const response = await ApiBase.get(withApiPrefix(HOME_API_ENDPOINTS.interests));
  return response.data;
};

export default {
  getActivities,
  getClubs,
  getInterests,
};
