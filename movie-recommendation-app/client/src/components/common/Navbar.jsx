import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiX, FiFilm, FiHeart, FiUser, FiLogOut, FiMenu, FiChevronDown
} from 'react-icons/fi';
import { MdLocalMovies } from 'react-icons/md';
import { useAuth } from '../../contexts/AuthContext';
import { movieService } from '../../services/movieService';
import useDebounce from '../../hooks/useDebounce';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);
  const debouncedQuery = useDebounce(query, 350);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Live search suggestions
  useEffect(() => {
    if (debouncedQuery.trim().length < 2) { setSuggestions([]); return; }
    movieService.search(debouncedQuery).then(({ data }) => {
      setSuggestions(data.results?.slice(0, 6) || []);
    }).catch(() => setSuggestions([]));
  }, [debouncedQuery]);

  // Click outside to close
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery(''); setSuggestions([]); setShowSearch(false);
    }
  };

  const handleSuggestionClick = (movie) => {
    navigate(`/movie/${movie.tmdbId}`);
    setQuery(''); setSuggestions([]); setShowSearch(false);
  };

  const handleLogout = () => { logout(); navigate('/'); setShowDropdown(false); };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-dark-300/95 backdrop-blur-md shadow-lg shadow-black/30' : 'bg-gradient-to-b from-black/70 to-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <MdLocalMovies className="text-white text-xl" />
            </div>
            <span className="font-display font-bold text-xl gradient-text hidden sm:block">CineAI</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="nav-link text-sm">Home</Link>
            <Link to="/search" className="nav-link text-sm">Discover</Link>
            {isAuthenticated && (
              <Link to="/favorites" className="nav-link text-sm flex items-center gap-1">
                <FiHeart className="text-accent-400" size={14} /> Favorites
              </Link>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div ref={searchRef} className="relative">
              <AnimatePresence>
                {showSearch ? (
                  <motion.form
                    onSubmit={handleSearch}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 260, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="flex items-center bg-dark-500/90 border border-dark-600 rounded-full px-4 py-2 overflow-hidden"
                  >
                    <FiSearch className="text-gray-400 mr-2 flex-shrink-0" size={16} />
                    <input
                      autoFocus
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search movies..."
                      className="bg-transparent text-white text-sm outline-none flex-1 placeholder-gray-500 w-full"
                    />
                    <button type="button" onClick={() => { setShowSearch(false); setQuery(''); setSuggestions([]); }}>
                      <FiX className="text-gray-400 hover:text-white" size={16} />
                    </button>
                  </motion.form>
                ) : (
                  <button
                    onClick={() => setShowSearch(true)}
                    className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all"
                  >
                    <FiSearch size={20} />
                  </button>
                )}
              </AnimatePresence>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full mt-2 right-0 w-72 glass-card overflow-hidden shadow-2xl"
                  >
                    {suggestions.map((movie) => (
                      <button
                        key={movie.tmdbId}
                        onClick={() => handleSuggestionClick(movie)}
                        className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-white/10 transition-colors text-left"
                      >
                        {movie.posterUrl ? (
                          <img src={movie.posterUrl} alt={movie.title} className="w-9 h-12 object-cover rounded-md flex-shrink-0" />
                        ) : (
                          <div className="w-9 h-12 bg-dark-600 rounded-md flex items-center justify-center flex-shrink-0">
                            <FiFilm className="text-gray-500" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{movie.title}</p>
                          <p className="text-gray-400 text-xs">{movie.releaseDate?.slice(0, 4) || 'N/A'}</p>
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={handleSearch}
                      className="w-full text-center py-2.5 text-primary-400 text-sm hover:bg-white/5 border-t border-white/10"
                    >
                      See all results →
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 bg-dark-500 hover:bg-dark-600 rounded-full px-3 py-1.5 transition-colors"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-200 hidden sm:block max-w-[80px] truncate">{user?.name}</span>
                  <FiChevronDown className={`text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} size={14} />
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-48 glass-card overflow-hidden shadow-2xl"
                    >
                      <Link to="/profile" onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors">
                        <FiUser className="text-primary-400" size={16} />
                        <span className="text-sm">Profile</span>
                      </Link>
                      <Link to="/favorites" onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors">
                        <FiHeart className="text-accent-400" size={16} />
                        <span className="text-sm">Favorites</span>
                      </Link>
                      <button onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors w-full text-left border-t border-white/10">
                        <FiLogOut className="text-red-400" size={16} />
                        <span className="text-sm text-red-400">Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4 hidden sm:block">Login</Link>
                <Link to="/signup" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-gray-300 hover:text-white" onClick={() => setMobileMenu(!mobileMenu)}>
              <FiMenu size={22} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-dark-400/95 rounded-xl mb-2 border border-white/10"
            >
              <div className="flex flex-col p-4 gap-3">
                <Link to="/" onClick={() => setMobileMenu(false)} className="nav-link py-2">Home</Link>
                <Link to="/search" onClick={() => setMobileMenu(false)} className="nav-link py-2">Discover</Link>
                {isAuthenticated && (
                  <Link to="/favorites" onClick={() => setMobileMenu(false)} className="nav-link py-2">Favorites</Link>
                )}
                {!isAuthenticated && (
                  <Link to="/login" onClick={() => setMobileMenu(false)} className="nav-link py-2">Login</Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
