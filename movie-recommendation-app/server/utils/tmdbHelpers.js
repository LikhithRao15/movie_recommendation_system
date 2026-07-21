const tmdbClient = require('../config/tmdb');

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

/**
 * Get full poster URL
 */
const getPosterUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

/**
 * Get full backdrop URL
 */
const getBackdropUrl = (path, size = 'w1280') => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

/**
 * Fetch full movie details with credits, videos, similar
 */
const fetchMovieDetails = async (tmdbId) => {
  try {
    const { data } = await tmdbClient.get(`/movie/${tmdbId}`, {
      params: {
        append_to_response: 'credits,videos,similar,release_dates',
      },
    });

    const director = data.credits?.crew?.find((c) => c.job === 'Director');
    const cast = data.credits?.cast?.slice(0, 10).map((actor) => ({
      id: actor.id,
      name: actor.name,
      character: actor.character,
      profilePath: getPosterUrl(actor.profile_path, 'w185'),
    }));

    const trailer = data.videos?.results?.find(
      (v) => v.type === 'Trailer' && v.site === 'YouTube'
    );

    return {
      tmdbId: data.id,
      title: data.title,
      tagline: data.tagline,
      overview: data.overview,
      posterUrl: getPosterUrl(data.poster_path),
      backdropUrl: getBackdropUrl(data.backdrop_path),
      genres: data.genres?.map((g) => g.name) || [],
      rating: data.vote_average,
      voteCount: data.vote_count,
      runtime: data.runtime,
      releaseDate: data.release_date,
      language: data.original_language,
      popularity: data.popularity,
      budget: data.budget,
      revenue: data.revenue,
      productionCompanies: data.production_companies?.slice(0, 3).map((c) => ({
        name: c.name,
        logoPath: getPosterUrl(c.logo_path, 'w92'),
      })),
      director: director
        ? { name: director.name, profilePath: getPosterUrl(director.profile_path, 'w185') }
        : null,
      cast,
      trailerKey: trailer?.key || null,
      similarMovies: data.similar?.results?.slice(0, 12).map(formatMovie) || [],
    };
  } catch (error) {
    throw new Error(`Failed to fetch movie ${tmdbId}: ${error.message}`);
  }
};

/**
 * Format a raw TMDB movie result into a compact card format
 */
const formatMovie = (movie) => ({
  tmdbId: movie.id,
  title: movie.title,
  posterUrl: getPosterUrl(movie.poster_path),
  backdropUrl: getBackdropUrl(movie.backdrop_path),
  rating: movie.vote_average,
  releaseDate: movie.release_date,
  overview: movie.overview,
  genres: movie.genre_ids || [],
  popularity: movie.popularity,
});

/**
 * Fetch multiple movie details in parallel with concurrency limit
 */
const fetchMoviesBatch = async (tmdbIds, concurrency = 8) => {
  const results = [];
  const valid = tmdbIds.filter((id) => id && !isNaN(id));

  for (let i = 0; i < valid.length; i += concurrency) {
    const batch = valid.slice(i, i + concurrency);
    const settled = await Promise.allSettled(
      batch.map((id) => fetchMovieDetails(id))
    );
    settled.forEach((result) => {
      if (result.status === 'fulfilled') results.push(result.value);
    });
  }
  return results;
};

/**
 * Fetch lightweight compact movie info for cards (fast, no heavy credits/videos)
 */
const fetchCompactMovie = async (tmdbId) => {
  try {
    const { data } = await tmdbClient.get(`/movie/${tmdbId}`);
    return formatMovie(data);
  } catch (error) {
    return null;
  }
};

/**
 * Fetch compact movie batch fast
 */
const fetchCompactBatch = async (tmdbIds, concurrency = 10) => {
  const results = [];
  const valid = tmdbIds.filter((id) => id && !isNaN(id));

  for (let i = 0; i < valid.length; i += concurrency) {
    const batch = valid.slice(i, i + concurrency);
    const settled = await Promise.allSettled(
      batch.map((id) => fetchCompactMovie(id))
    );
    settled.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) results.push(result.value);
    });
  }
  return results;
};

module.exports = {
  fetchMovieDetails,
  fetchMoviesBatch,
  fetchCompactMovie,
  fetchCompactBatch,
  formatMovie,
  getPosterUrl,
  getBackdropUrl,
};
