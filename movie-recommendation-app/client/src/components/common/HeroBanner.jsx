import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiStar, FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const HeroBanner = ({ movies = [] }) => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (movies.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % Math.min(movies.length, 5));
    }, 6000);
    return () => clearInterval(timer);
  }, [movies.length]);

  if (movies.length === 0) {
    return <div className="w-full h-[75vh] bg-dark-400 rounded-2xl mb-8 animate-pulse" />;
  }

  const movie = movies[current];

  return (
    <div className="relative w-full h-[75vh] min-h-[500px] mb-8 overflow-hidden rounded-2xl mx-4 sm:mx-6 lg:mx-8" style={{ width: 'calc(100% - 2rem)' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {/* Backdrop Image */}
          <img
            src={movie.backdropUrl || movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-dark-300 via-dark-300/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-300 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full p-8 md:p-12 max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${current}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Badges */}
            <div className="flex items-center gap-3 mb-3">
              {movie.rating > 0 && (
                <div className="flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-3 py-1">
                  <FiStar size={12} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 text-xs font-bold">{movie.rating?.toFixed(1)}</span>
                </div>
              )}
              {movie.releaseDate && (
                <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1">
                  <FiCalendar size={12} className="text-gray-300" />
                  <span className="text-gray-300 text-xs">{movie.releaseDate.slice(0, 4)}</span>
                </div>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-bold text-white text-shadow mb-3 leading-tight">
              {movie.title}
            </h1>

            {movie.overview && (
              <p className="text-gray-300 text-base md:text-lg line-clamp-3 mb-6 leading-relaxed">
                {movie.overview}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/movie/${movie.tmdbId}`)}
                className="btn-primary flex items-center gap-2"
              >
                <FiPlay size={16} className="fill-current" /> Watch Details
              </button>
              <button
                onClick={() => navigate(`/movie/${movie.tmdbId}`)}
                className="btn-secondary flex items-center gap-2"
              >
                More Info
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Dots & Arrows */}
      <div className="absolute bottom-6 right-8 flex items-center gap-3 z-10">
        <button onClick={() => setCurrent((c) => (c - 1 + Math.min(movies.length, 5)) % Math.min(movies.length, 5))}
          className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full border border-white/20 transition-all">
          <FiChevronLeft className="text-white" size={16} />
        </button>
        <div className="flex gap-2">
          {Array.from({ length: Math.min(movies.length, 5) }).map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-primary-400 w-6' : 'bg-white/40 hover:bg-white/60'}`}
            />
          ))}
        </div>
        <button onClick={() => setCurrent((c) => (c + 1) % Math.min(movies.length, 5))}
          className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full border border-white/20 transition-all">
          <FiChevronRight className="text-white" size={16} />
        </button>
      </div>
    </div>
  );
};

export default HeroBanner;
