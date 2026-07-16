import { useState, useCallback } from 'react';
import { favoriteService } from '../services/favoriteService';
import { ratingService } from '../services/ratingService';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook to manage user interactions: favorites and ratings
 */
const useMovieActions = () => {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState(new Set());
  const [ratings, setRatings] = useState(new Map()); // tmdbId -> rating
  const [loadingFav, setLoadingFav] = useState(false);
  const [loadingRating, setLoadingRating] = useState(false);

  const toggleFavorite = useCallback(async (tmdbId) => {
    if (!isAuthenticated) return { requiresAuth: true };
    setLoadingFav(true);
    try {
      const isFav = favorites.has(tmdbId);
      if (isFav) {
        await favoriteService.remove(tmdbId);
        setFavorites((prev) => { const next = new Set(prev); next.delete(tmdbId); return next; });
      } else {
        await favoriteService.add(tmdbId);
        setFavorites((prev) => new Set([...prev, tmdbId]));
      }
      return { success: true, isFavorite: !isFav };
    } catch (err) {
      return { error: err.response?.data?.message || 'Failed to update favorite' };
    } finally {
      setLoadingFav(false);
    }
  }, [isAuthenticated, favorites]);

  const rateMovie = useCallback(async (tmdbId, rating) => {
    if (!isAuthenticated) return { requiresAuth: true };
    setLoadingRating(true);
    try {
      await ratingService.rate(tmdbId, rating);
      setRatings((prev) => new Map([...prev, [tmdbId, rating]]));
      return { success: true };
    } catch (err) {
      return { error: err.response?.data?.message || 'Failed to save rating' };
    } finally {
      setLoadingRating(false);
    }
  }, [isAuthenticated]);

  return { favorites, ratings, loadingFav, loadingRating, toggleFavorite, rateMovie, setFavorites, setRatings };
};

export default useMovieActions;
