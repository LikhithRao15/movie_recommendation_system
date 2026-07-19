import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiHeart, FiPlay } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const MovieCard = ({ movie, isFavorite, userRating, onToggleFavorite, onRate }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [hovering, setHovering] = useState(false);

  if (!movie) return null;

  const { tmdbId, title, posterUrl, backdropUrl, rating, releaseDate, overview } = movie;
  const year = releaseDate?.slice(0, 4);
  const displayImage = !imgError && (posterUrl || backdropUrl);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { navigate('/login'); return; }
    onToggleFavorite?.(tmdbId);
  };

  return (
    <motion.div
      className="movie-card select-none flex flex-col h-full"
      onHoverStart={() => setHovering(true)}
      onHoverEnd={() => setHovering(false)}
      whileHover={{ scale: 1.04 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/movie/${tmdbId}`} className="flex flex-col h-full">
        {/* Poster — fixed aspect ratio, fills available width */}
        <div className="relative aspect-[2/3] bg-dark-500 overflow-hidden rounded-xl flex-shrink-0">
          {displayImage ? (
            <img
              src={posterUrl || backdropUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-dark-500 to-dark-700 text-gray-600">
              <FiPlay size={32} />
              <p className="text-xs mt-2 text-center px-2 line-clamp-2">{title}</p>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Favorite button */}
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm border transition-all duration-200 z-10
              ${isFavorite
                ? 'bg-accent-500/80 border-accent-400 text-white'
                : 'bg-black/50 border-white/20 text-gray-300 hover:bg-accent-500/60 hover:text-white'
              } ${hovering ? 'opacity-100' : 'opacity-0'}`}
          >
            <FiHeart size={14} className={isFavorite ? 'fill-current' : ''} />
          </button>

          {/* Rating badge */}
          {rating > 0 && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
              <FiStar size={11} className="text-yellow-400 fill-current" />
              <span className="text-yellow-400 text-xs font-bold">{rating?.toFixed(1)}</span>
            </div>
          )}

          {/* Hover info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: hovering ? 1 : 0, y: hovering ? 0 : 10 }}
            className="absolute bottom-0 left-0 right-0 p-3"
          >
            {overview && (
              <p className="text-gray-300 text-xs line-clamp-3 leading-relaxed">{overview}</p>
            )}
          </motion.div>
        </div>

        {/* Card Info — fixed height so all cards align uniformly */}
        <div className="p-2 pt-2.5 flex-shrink-0" style={{ minHeight: '52px' }}>
          <h3 className="text-white text-sm font-medium line-clamp-1 leading-tight">{title}</h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-gray-500 text-xs">{year || '—'}</span>
            {userRating && (
              <div className="flex items-center gap-1">
                <FiStar size={10} className="text-primary-400 fill-current" />
                <span className="text-primary-400 text-xs font-medium">{userRating}/5</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
