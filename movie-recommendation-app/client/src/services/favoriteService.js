import api from './api';

export const favoriteService = {
  add: (tmdbId) => api.post('/favorites', { tmdbId }),
  getAll: () => api.get('/favorites'),
  remove: (tmdbId) => api.delete(`/favorites/${tmdbId}`),
};
