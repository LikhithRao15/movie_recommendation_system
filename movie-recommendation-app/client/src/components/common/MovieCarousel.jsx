import { useRef } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import MovieCard from './MovieCard';
import SkeletonCard from './SkeletonCard';

const MovieCarousel = ({ title, movies = [], loading, icon, favorites, ratings, onToggleFavorite, accentColor = 'from-primary-400' }) => {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    const amount = 320;
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {icon && <span className="text-2xl">{icon}</span>}
          <div>
            <h2 className={`section-title mb-0 bg-gradient-to-r ${accentColor} to-white bg-clip-text text-transparent`}>
              {title}
            </h2>
            {movies.length > 0 && !loading && (
              <p className="text-gray-500 text-xs mt-0.5">{movies.length} movies</p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 bg-dark-500 hover:bg-dark-600 border border-dark-600 rounded-full transition-all hover:scale-110"
          >
            <FiChevronLeft className="text-gray-300" size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 bg-dark-500 hover:bg-dark-600 border border-dark-600 rounded-full transition-all hover:scale-110"
          >
            <FiChevronRight className="text-gray-300" size={18} />
          </button>
        </div>
      </div>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 px-4 sm:px-6 lg:px-8 scroll-smooth"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ scrollSnapAlign: 'start', flex: '0 0 160px' }}>
              <SkeletonCard />
            </div>
          ))
        ) : movies.length === 0 ? (
          <div className="flex items-center justify-center w-full py-12 text-gray-600">
            <p>No movies available</p>
          </div>
        ) : (
          movies.map((movie, idx) => (
            <motion.div
              key={`${movie.tmdbId}-${idx}`}
              style={{ scrollSnapAlign: 'start', flex: '0 0 160px' }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03, duration: 0.3 }}
            >
              <MovieCard
                movie={movie}
                isFavorite={favorites?.has(movie.tmdbId)}
                userRating={ratings?.get(movie.tmdbId)}
                onToggleFavorite={onToggleFavorite}
              />
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
};

export default MovieCarousel;
