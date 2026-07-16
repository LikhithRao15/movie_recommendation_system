import api from './api';

export const ratingService = {
  rate: (tmdbId, rating) => api.post('/ratings', { tmdbId, rating }),
  getAll: () => api.get('/ratings'),
};
