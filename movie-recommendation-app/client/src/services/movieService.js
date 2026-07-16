import api from './api';

export const movieService = {
  search: (q, page = 1) => api.get('/movies/search', { params: { q, page } }),
  getTrending: (page = 1) => api.get('/movies/trending', { params: { page } }),
  getTopRated: (page = 1) => api.get('/movies/top-rated', { params: { page } }),
  getLatest: (page = 1) => api.get('/movies/latest', { params: { page } }),
  getByGenre: (genre, page = 1) => api.get(`/movies/genre/${genre}`, { params: { page } }),
  getDetails: (tmdbId) => api.get(`/movies/details/${tmdbId}`),
};
