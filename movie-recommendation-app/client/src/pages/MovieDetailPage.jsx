import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiStar, FiHeart, FiPlay, FiClock, FiCalendar, FiGlobe,
  FiArrowLeft, FiX, FiCheck
} from 'react-icons/fi';
import { movieService } from '../services/movieService';
import { favoriteService } from '../services/favoriteService';
import { ratingService } from '../services/ratingService';
import { useAuth } from '../contexts/AuthContext';
import MovieCarousel from '../components/common/MovieCarousel';
import StarRating from '../components/common/StarRating';

const MovieDetailPage = () => {
  const { tmdbId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [toast, setToast] = useState(null);
  const [favs, setFavs] = useState(new Set());
  const [ratingsMap, setRatingsMap] = useState(new Map());

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);
    movieService.getDetails(tmdbId)
      .then(({ data }) => setMovie(data.movie))
      .catch(() => setError('Failed to load movie details. Please try again.'))
      .finally(() => setLoading(false));
  }, [tmdbId]);

  useEffect(() => {
    if (!isAuthenticated) return;
    favoriteService.getAll().then(({ data }) => {
      const set = new Set(data.favorites?.map((f) => f.tmdbId) || []);
      setFavs(set);
      setIsFavorite(set.has(Number(tmdbId)));
    }).catch(() => {});
    ratingService.getAll().then(({ data }) => {
      const map = new Map((data.ratings || []).map((r) => [r.tmdbId, r.rating]));
      setRatingsMap(map);
      setUserRating(map.get(Number(tmdbId)) || 0);
    }).catch(() => {});
  }, [isAuthenticated, tmdbId]);

  const handleToggleFavorite = useCallback(async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setFavLoading(true);
    try {
      if (isFavorite) {
        await favoriteService.remove(tmdbId);
        setIsFavorite(false);
        showToast('Removed from favorites');
      } else {
        await favoriteService.add(tmdbId);
        setIsFavorite(true);
        showToast('Added to favorites ❤️');
      }
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to update favorite', 'error');
    } finally {
      setFavLoading(false);
    }
  }, [isAuthenticated, isFavorite, tmdbId, navigate]);

  const handleRate = useCallback(async (rating) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setRatingLoading(true);
    try {
      await ratingService.rate(Number(tmdbId), rating);
      setUserRating(rating);
      showToast(`Rated ${rating}/5 ⭐`);
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to save rating', 'error');
    } finally {
      setRatingLoading(false);
    }
  }, [isAuthenticated, tmdbId, navigate]);

  if (loading) return (
    <div className="min-h-screen bg-dark-300 pt-16 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading movie details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-dark-300 pt-16 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🎬</div>
        <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <button onClick={() => navigate(-1)} className="btn-secondary">← Go Back</button>
      </div>
    </div>
  );

  if (!movie) return null;

  return (
    <div className="min-h-screen bg-dark-300">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 ${
              toast.type === 'error' ? 'bg-red-500/90' : 'bg-green-500/90'
            } backdrop-blur-sm text-white text-sm font-medium`}
          >
            <FiCheck size={16} /> {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop Hero */}
      <div className="relative h-[55vh] min-h-[400px] overflow-hidden">
        {movie.backdropUrl && (
          <img src={movie.backdropUrl} alt={movie.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-dark-300/50 to-dark-300" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-300/80 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-20 left-4 sm:left-8 flex items-center gap-2 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/20 transition-all"
        >
          <FiArrowLeft size={16} /> Back
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0"
          >
            <div className="w-52 md:w-64 rounded-2xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10">
              {movie.posterUrl ? (
                <img src={movie.posterUrl} alt={movie.title} className="w-full aspect-[2/3] object-cover" />
              ) : (
                <div className="w-full aspect-[2/3] bg-dark-500 flex items-center justify-center">
                  <FiPlay size={48} className="text-gray-600" />
                </div>
              )}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex-1"
          >
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight mb-2">{movie.title}</h1>
            {movie.tagline && <p className="text-gray-400 italic text-lg mb-4">"{movie.tagline}"</p>}

            {/* Meta badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              {movie.rating > 0 && (
                <span className="flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 rounded-full px-3 py-1 text-sm font-bold">
                  <FiStar size={13} className="fill-current" /> {movie.rating?.toFixed(1)} ({movie.voteCount?.toLocaleString()})
                </span>
              )}
              {movie.runtime > 0 && (
                <span className="flex items-center gap-1.5 bg-white/10 border border-white/10 text-gray-300 rounded-full px-3 py-1 text-sm">
                  <FiClock size={13} /> {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </span>
              )}
              {movie.releaseDate && (
                <span className="flex items-center gap-1.5 bg-white/10 border border-white/10 text-gray-300 rounded-full px-3 py-1 text-sm">
                  <FiCalendar size={13} /> {movie.releaseDate}
                </span>
              )}
              {movie.language && (
                <span className="flex items-center gap-1.5 bg-white/10 border border-white/10 text-gray-300 rounded-full px-3 py-1 text-sm uppercase">
                  <FiGlobe size={13} /> {movie.language}
                </span>
              )}
            </div>

            {/* Genres */}
            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {movie.genres.map((g) => (
                  <span key={g} className="bg-primary-500/20 border border-primary-500/30 text-primary-300 text-xs rounded-lg px-3 py-1 font-medium">
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <p className="text-gray-300 text-base leading-relaxed mb-6 max-w-2xl">{movie.overview}</p>

            {/* Director */}
            {movie.director && (
              <p className="text-gray-400 text-sm mb-5">
                <span className="text-gray-500">Directed by</span>{' '}
                <span className="text-white font-medium">{movie.director.name}</span>
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {movie.trailerKey && (
                <button onClick={() => setShowTrailer(true)} className="btn-primary flex items-center gap-2">
                  <FiPlay size={16} className="fill-current" /> Play Trailer
                </button>
              )}
              <button
                onClick={handleToggleFavorite}
                disabled={favLoading}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all duration-300 border ${
                  isFavorite
                    ? 'bg-accent-500/20 border-accent-400 text-accent-300 hover:bg-accent-500/30'
                    : 'border-gray-600 text-gray-300 hover:border-accent-400 hover:text-accent-300'
                }`}
              >
                <FiHeart size={16} className={isFavorite ? 'fill-current' : ''} />
                {isFavorite ? 'In Favorites' : 'Add to Favorites'}
              </button>
            </div>

            {/* Star Rating */}
            <div className="glass-card p-4 inline-flex flex-col gap-2">
              <p className="text-gray-400 text-sm font-medium">Your Rating</p>
              <StarRating value={userRating} onRate={handleRate} size="lg" />
              {!isAuthenticated && <p className="text-gray-500 text-xs">Login to rate this movie</p>}
            </div>
          </motion.div>
        </div>

        {/* Production Companies */}
        {movie.productionCompanies?.length > 0 && (
          <div className="mt-8">
            <h3 className="text-gray-400 text-sm font-medium mb-3">Production</h3>
            <div className="flex flex-wrap gap-4">
              {movie.productionCompanies.map((c, i) => (
                <span key={i} className="text-gray-300 text-sm bg-dark-500 border border-dark-600 px-3 py-1.5 rounded-lg">{c.name}</span>
              ))}
            </div>
          </div>
        )}

        {/* Cast */}
        {movie.cast?.length > 0 && (
          <div className="mt-10">
            <h2 className="section-title mb-5">Cast</h2>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
              {movie.cast.map((actor) => (
                <div key={actor.id} className="flex-shrink-0 w-28 text-center group">
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-dark-500 border-2 border-dark-600 group-hover:border-primary-500 transition-colors mb-2">
                    {actor.profilePath ? (
                      <img src={actor.profilePath} alt={actor.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-2xl font-bold bg-dark-600">
                        {actor.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <p className="text-white text-xs font-medium leading-tight">{actor.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Movies */}
        {movie.similarMovies?.length > 0 && (
          <div className="mt-10">
            <MovieCarousel
              title="Similar Movies"
              movies={movie.similarMovies}
              favorites={favs}
              ratings={ratingsMap}
              onToggleFavorite={async (id) => {
                const isFav = favs.has(id);
                if (isFav) { await favoriteService.remove(id); setFavs((prev) => { const n = new Set(prev); n.delete(id); return n; }); }
                else { await favoriteService.add(id); setFavs((prev) => new Set([...prev, id])); }
              }}
            />
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      <AnimatePresence>
        {showTrailer && movie.trailerKey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setShowTrailer(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`https://www.youtube.com/embed/${movie.trailerKey}?autoplay=1`}
                className="w-full h-full"
                allow="autoplay; fullscreen"
                allowFullScreen
                title="Trailer"
              />
            </motion.div>
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
            >
              <FiX size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MovieDetailPage;
