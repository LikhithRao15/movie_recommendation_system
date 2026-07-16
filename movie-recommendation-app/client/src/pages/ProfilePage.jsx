import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiHeart, FiStar, FiCalendar, FiMail, FiTrendingUp } from 'react-icons/fi';
import { MdAutoAwesome } from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { ratingService } from '../services/ratingService';
import StarRating from '../components/common/StarRating';

const StatCard = ({ icon, label, value, color }) => (
  <div className="glass-card p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
    <div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-gray-400 text-sm">{label}</p>
    </div>
  </div>
);

const ProfilePage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ favoriteCount: 0, ratingCount: 0, recentRatings: [] });
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      authService.getProfile(),
      ratingService.getAll(),
    ]).then(([profileRes, ratingsRes]) => {
      setStats(profileRes.data.stats || {});
      setRatings(ratingsRes.data.ratings || []);
    }).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '—';

  return (
    <div className="min-h-screen bg-dark-300 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-xl">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-display font-bold text-white mb-1">{user?.name}</h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-400 mb-3">
                <FiMail size={14} />
                <span className="text-sm">{user?.email}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 text-sm">
                <FiCalendar size={14} />
                <span>Member since {joinDate}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <StatCard icon={<FiHeart className="text-accent-400 fill-current" size={22} />}
              label="Favorite Movies" value={stats.favoriteCount || 0}
              color="bg-accent-500/20" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <StatCard icon={<FiStar className="text-yellow-400 fill-current" size={22} />}
              label="Movies Rated" value={stats.ratingCount || 0}
              color="bg-yellow-500/20" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <StatCard icon={<MdAutoAwesome className="text-primary-400" size={22} />}
              label="Recommendations" value={stats.ratingCount > 0 ? 'Active' : 'Pending'}
              color="bg-primary-500/20" />
          </motion.div>
        </div>

        {/* Rating History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
              <FiTrendingUp className="text-primary-400" /> Rating History
            </h2>
            <Link to="/" className="text-primary-400 text-sm hover:underline">Browse Movies</Link>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading...</div>
          ) : ratings.length === 0 ? (
            <div className="glass-card p-10 text-center">
              <FiStar size={48} className="mx-auto mb-3 text-gray-600" />
              <p className="text-gray-400 mb-2">No ratings yet</p>
              <p className="text-gray-500 text-sm">Rate movies to power your recommendations</p>
            </div>
          ) : (
            <div className="glass-card overflow-hidden">
              <div className="divide-y divide-white/5">
                {ratings.map((r, i) => (
                  <motion.div
                    key={r._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors"
                  >
                    <div>
                      <Link to={`/movie/${r.tmdbId}`} className="text-white font-medium hover:text-primary-400 transition-colors">
                        Movie #{r.tmdbId}
                      </Link>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {new Date(r.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <StarRating value={r.rating} readonly size="sm" />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
