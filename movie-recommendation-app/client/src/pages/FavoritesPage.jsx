import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiTrash2, FiFilm } from 'react-icons/fi';
import { favoriteService } from '../services/favoriteService';
import { SkeletonGrid } from '../components/common/SkeletonCard';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    favoriteService.getAll()
      .then(({ data }) => setFavorites(data.favorites || []))
      .catch(() => setFavorites([]))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (tmdbId) => {
    setRemoving(tmdbId);
    try {
      await favoriteService.remove(tmdbId);
      setFavorites((prev) => prev.filter((f) => f.tmdbId !== tmdbId));
    } catch {}
    setRemoving(null);
  };

  return (
    <div className="min-h-screen bg-dark-300 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-primary-500 rounded-xl flex items-center justify-center">
            <FiHeart className="text-white fill-current" size={20} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">My Favorites</h1>
            {!loading && <p className="text-gray-500 text-sm">{favorites.length} movies saved</p>}
          </div>
        </div>

        {loading ? (
          <SkeletonGrid count={12} />
        ) : favorites.length === 0 ? (
          <div className="text-center py-20">
            <FiHeart size={64} className="mx-auto mb-4 text-gray-700" />
            <h3 className="text-2xl font-bold text-white mb-2">No favorites yet</h3>
            <p className="text-gray-500 mb-6">Start adding movies you love!</p>
            <Link to="/" className="btn-primary">Browse Movies</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {favorites.map((fav, i) => (
              <motion.div
                key={fav._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group"
              >
                <Link to={`/movie/${fav.tmdbId}`} className="block">
                  <div className="aspect-[2/3] rounded-xl overflow-hidden bg-dark-500">
                    {fav.movie?.posterUrl ? (
                      <img src={fav.movie.posterUrl} alt={fav.movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <FiFilm size={32} />
                      </div>
                    )}
                  </div>
                  <p className="text-white text-sm font-medium mt-2 truncate">{fav.movie?.title || 'Unknown'}</p>
                  <p className="text-gray-500 text-xs">{fav.movie?.releaseDate?.slice(0, 4)}</p>
                </Link>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(fav.tmdbId)}
                  disabled={removing === fav.tmdbId}
                  className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all text-white"
                >
                  {removing === fav.tmdbId ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FiTrash2 size={12} />
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
