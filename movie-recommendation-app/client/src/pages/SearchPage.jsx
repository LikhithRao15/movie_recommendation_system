import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';
import { movieService } from '../services/movieService';
import { favoriteService } from '../services/favoriteService';
import MovieCard from '../components/common/MovieCard';
import { SkeletonGrid } from '../components/common/SkeletonCard';
import useDebounce from '../hooks/useDebounce';
import { useAuth } from '../contexts/AuthContext';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const initialQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!isAuthenticated) return;
    favoriteService.getAll().then(({ data }) => {
      setFavorites(new Set(data.favorites?.map((f) => f.tmdbId) || []));
    }).catch(() => {});
  }, [isAuthenticated]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]); setTotalPages(1); setTotalResults(0); return;
    }
    setLoading(true);
    setSearchParams({ q: debouncedQuery });
    setPage(1);
    movieService.search(debouncedQuery, 1)
      .then(({ data }) => {
        setResults(data.results || []);
        setTotalPages(data.totalPages || 1);
        setTotalResults(data.totalResults || 0);
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const loadMore = () => {
    const nextPage = page + 1;
    setLoading(true);
    movieService.search(debouncedQuery, nextPage)
      .then(({ data }) => {
        setResults((prev) => [...prev, ...(data.results || [])]);
        setPage(nextPage);
      })
      .finally(() => setLoading(false));
  };

  const handleToggleFavorite = async (tmdbId) => {
    const isFav = favorites.has(tmdbId);
    try {
      if (isFav) { await favoriteService.remove(tmdbId); setFavorites((p) => { const n = new Set(p); n.delete(tmdbId); return n; }); }
      else { await favoriteService.add(tmdbId); setFavorites((p) => new Set([...p, tmdbId])); }
    } catch {}
  };

  return (
    <div className="min-h-screen bg-dark-300 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-white mb-6">
            {query ? `Search Results` : 'Discover Movies'}
          </h1>

          <div className="relative max-w-xl">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for any movie..."
              className="input-field pl-12 pr-12 text-base"
              autoFocus
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                <FiX size={18} />
              </button>
            )}
          </div>

          {totalResults > 0 && (
            <p className="text-gray-500 text-sm mt-3">
              Found <span className="text-white font-medium">{totalResults.toLocaleString()}</span> results for "{debouncedQuery}"
            </p>
          )}
        </div>

        {/* Results Grid */}
        {loading && results.length === 0 ? (
          <SkeletonGrid count={12} />
        ) : results.length > 0 ? (
          <>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {results.map((movie, i) => (
                <motion.div key={`${movie.tmdbId}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}>
                  <MovieCard
                    movie={movie}
                    isFavorite={favorites.has(movie.tmdbId)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </motion.div>
              ))}
            </motion.div>

            {page < totalPages && (
              <div className="text-center mt-10">
                <button onClick={loadMore} disabled={loading} className="btn-secondary px-8">
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        ) : debouncedQuery ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-bold text-white mb-2">No movies found</h3>
            <p className="text-gray-500">Try a different search term</p>
          </div>
        ) : (
          <div className="text-center py-20 text-gray-600">
            <FiSearch size={64} className="mx-auto mb-4 opacity-30" />
            <p className="text-xl">Start typing to search movies</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
