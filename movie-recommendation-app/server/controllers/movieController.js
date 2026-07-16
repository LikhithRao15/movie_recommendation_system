const tmdbClient = require('../config/tmdb');
const { fetchMovieDetails, formatMovie } = require('../utils/tmdbHelpers');

// TMDB Genre IDs
const GENRE_MAP = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  'science fiction': 878,
  'sci-fi': 878,
  thriller: 53,
  war: 10752,
  western: 37,
};

/**
 * @route   GET /api/movies/search?q=query&page=1
 * @access  Public
 */
const searchMovies = async (req, res, next) => {
  try {
    const { q, page = 1 } = req.query;
    if (!q || q.trim().length < 1) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const { data } = await tmdbClient.get('/search/movie', {
      params: { query: q.trim(), page, include_adult: false },
    });

    res.json({
      success: true,
      results: data.results.map(formatMovie),
      totalResults: data.total_results,
      totalPages: data.total_pages,
      page: data.page,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/movies/trending?page=1
 * @access  Public
 */
const getTrending = async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const { data } = await tmdbClient.get('/trending/movie/week', { params: { page } });
    res.json({
      success: true,
      results: data.results.map(formatMovie),
      totalPages: data.total_pages,
      page: data.page,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/movies/top-rated?page=1
 * @access  Public
 */
const getTopRated = async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const { data } = await tmdbClient.get('/movie/top_rated', { params: { page } });
    res.json({
      success: true,
      results: data.results.map(formatMovie),
      totalPages: data.total_pages,
      page: data.page,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/movies/latest?page=1
 * @access  Public
 */
const getLatest = async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const { data } = await tmdbClient.get('/movie/now_playing', { params: { page } });
    res.json({
      success: true,
      results: data.results.map(formatMovie),
      totalPages: data.total_pages,
      page: data.page,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/movies/genre/:genre?page=1
 * @access  Public
 */
const getByGenre = async (req, res, next) => {
  try {
    const { genre } = req.params;
    const { page = 1 } = req.query;

    const genreId = GENRE_MAP[genre.toLowerCase()];
    if (!genreId) {
      return res.status(400).json({ success: false, message: `Unknown genre: ${genre}` });
    }

    const { data } = await tmdbClient.get('/discover/movie', {
      params: {
        with_genres: genreId,
        sort_by: 'popularity.desc',
        page,
        'vote_count.gte': 100,
      },
    });

    res.json({
      success: true,
      genre,
      results: data.results.map(formatMovie),
      totalPages: data.total_pages,
      page: data.page,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/movies/details/:tmdbId
 * @access  Public
 */
const getMovieDetails = async (req, res, next) => {
  try {
    const { tmdbId } = req.params;
    if (!tmdbId || isNaN(tmdbId)) {
      return res.status(400).json({ success: false, message: 'Valid TMDB ID is required' });
    }

    const movie = await fetchMovieDetails(Number(tmdbId));
    res.json({ success: true, movie });
  } catch (error) {
    next(error);
  }
};

module.exports = { searchMovies, getTrending, getTopRated, getLatest, getByGenre, getMovieDetails };
