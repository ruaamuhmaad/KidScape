import axios, { AxiosHeaders, type AxiosAdapter } from 'axios';

import { resolveApiRequest } from '@/api/handlers';

const localApiAdapter: AxiosAdapter = async (config) => {
  const data = await resolveApiRequest(config);

  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    config,
    request: null,
  };
};

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  adapter: localApiAdapter,
});

export default api;
