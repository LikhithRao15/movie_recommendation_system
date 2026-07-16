import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiZap } from 'react-icons/fi';
import { MdAutoAwesome } from 'react-icons/md';
import HeroBanner from '../components/common/HeroBanner';
import MovieCarousel from '../components/common/MovieCarousel';
import { movieService } from '../services/movieService';
import { recommendationService } from '../services/recommendationService';
import { favoriteService } from '../services/favoriteService';
import { ratingService } from '../services/ratingService';
import { useAuth } from '../contexts/AuthContext';

const SECTIONS = [
  { key: 'trending', title: 'Trending This Week', icon: '🔥', accent: 'from-orange-400', fetch: () => movieService.getTrending() },
  { key: 'topRated', title: 'Top Rated', icon: '⭐', accent: 'from-yellow-400', fetch: () => movieService.getTopRated() },
  { key: 'action', title: 'Action & Adventure', icon: '💥', accent: 'from-red-400', fetch: () => movieService.getByGenre('action') },
  { key: 'romance', title: 'Romance', icon: '💕', accent: 'from-pink-400', fetch: () => movieService.getByGenre('romance') },
  { key: 'comedy', title: 'Comedy', icon: '😂', accent: 'from-green-400', fetch: () => movieService.getByGenre('comedy') },
  { key: 'horror', title: 'Horror', icon: '👻', accent: 'from-purple-500', fetch: () => movieService.getByGenre('horror') },
  { key: 'scifi', title: 'Science Fiction', icon: '🚀', accent: 'from-blue-400', fetch: () => movieService.getByGenre('sci-fi') },
];

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [sections, setSections] = useState({});
  const [loadingMap, setLoadingMap] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRec, setLoadingRec] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [ratings, setRatings] = useState(new Map());

  // Load all movie sections
  useEffect(() => {
    SECTIONS.forEach(({ key, fetch }) => {
      setLoadingMap((prev) => ({ ...prev, [key]: true }));
      fetch()
        .then(({ data }) => {
          setSections((prev) => ({ ...prev, [key]: data.results || [] }));
        })
        .catch(() => setSections((prev) => ({ ...prev, [key]: [] })))
        .finally(() => setLoadingMap((prev) => ({ ...prev, [key]: false })));
    });
  }, []);

  // Load user data if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    // Fetch favorites
    favoriteService.getAll().then(({ data }) => {
      const favSet = new Set(data.favorites?.map((f) => f.tmdbId) || []);
      setFavorites(favSet);
    }).catch(() => {});

    // Fetch ratings
    ratingService.getAll().then(({ data }) => {
      const rMap = new Map((data.ratings || []).map((r) => [r.tmdbId, r.rating]));
      setRatings(rMap);
    }).catch(() => {});

    // Fetch recommendations
    setLoadingRec(true);
    recommendationService.get().then(({ data }) => {
      setRecommendations(data.recommendations || []);
    }).catch(() => setRecommendations([]))
      .finally(() => setLoadingRec(false));
  }, [isAuthenticated]);

  const handleToggleFavorite = useCallback(async (tmdbId) => {
    const isFav = favorites.has(tmdbId);
    try {
      if (isFav) {
        await favoriteService.remove(tmdbId);
        setFavorites((prev) => { const next = new Set(prev); next.delete(tmdbId); return next; });
      } else {
        await favoriteService.add(tmdbId);
        setFavorites((prev) => new Set([...prev, tmdbId]));
      }
    } catch {}
  }, [favorites]);

  const trendingMovies = sections.trending || [];

  return (
    <div className="min-h-screen bg-dark-300 pt-16">
      {/* Hero Banner */}
      <HeroBanner movies={trendingMovies.slice(0, 5)} />

      <div className="pb-16">
        {/* Recommended For You */}
        {isAuthenticated && (recommendations.length > 0 || loadingRec) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2"
          >
            <div className="px-4 sm:px-6 lg:px-8 mb-1">
              <div className="flex items-center gap-3 bg-gradient-to-r from-primary-500/20 to-accent-500/10 border border-primary-500/20 rounded-2xl px-5 py-3 mb-2 inline-flex">
                <MdAutoAwesome className="text-primary-400 text-xl" />
                <span className="text-primary-300 text-sm font-medium">Powered by your taste</span>
              </div>
            </div>
            <MovieCarousel
              title="Recommended For You"
              movies={recommendations}
              loading={loadingRec}
              icon="✨"
              accentColor="from-primary-400"
              favorites={favorites}
              ratings={ratings}
              onToggleFavorite={handleToggleFavorite}
            />
          </motion.div>
        )}

        {/* All Sections */}
        {SECTIONS.map((section) => (
          <MovieCarousel
            key={section.key}
            title={section.title}
            movies={sections[section.key] || []}
            loading={!!loadingMap[section.key]}
            icon={section.icon}
            accentColor={section.accent}
            favorites={favorites}
            ratings={ratings}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
