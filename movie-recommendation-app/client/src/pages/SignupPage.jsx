import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiCheck } from 'react-icons/fi';
import { MdLocalMovies } from 'react-icons/md';
import CineMindLogo from '../components/common/CineMindLogo';

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    setError('');
    try {
      await signup(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = form.password.length >= 8 ? 'strong' : form.password.length >= 6 ? 'medium' : 'weak';
  const strengthColor = { strong: 'bg-green-500', medium: 'bg-yellow-500', weak: 'bg-red-500' };
  const strengthWidth = { strong: 'w-full', medium: 'w-2/3', weak: 'w-1/3' };

  return (
    <div className="min-h-screen bg-dark-300 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8 flex flex-col items-center">
          <Link to="/" className="mb-4">
            <CineMindLogo size="xl" />
          </Link>
          <h1 className="text-3xl font-display font-bold text-white mt-2">Join CineMind</h1>
          <p className="text-gray-400 mt-1">Get personalized AI movie recommendations</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                <FiAlertCircle size={16} /> {error}
              </motion.div>
            )}

            <div>
              <label className="text-gray-400 text-sm font-medium mb-2 block">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  className="input-field pl-12" placeholder="John Doe" required minLength={2} />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm font-medium mb-2 block">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  className="input-field pl-12" placeholder="you@example.com" required />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm font-medium mb-2 block">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input type={showPassword ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} className="input-field pl-12 pr-12" placeholder="Min. 6 characters" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    <div className={`h-1 flex-1 rounded-full transition-all ${form.password.length >= 2 ? strengthColor[passwordStrength] : 'bg-dark-600'}`} />
                    <div className={`h-1 flex-1 rounded-full transition-all ${form.password.length >= 6 ? strengthColor[passwordStrength] : 'bg-dark-600'}`} />
                    <div className={`h-1 flex-1 rounded-full transition-all ${form.password.length >= 8 ? 'bg-green-500' : 'bg-dark-600'}`} />
                  </div>
                  <p className="text-xs text-gray-500">
                    Password strength: <span className={`font-medium ${passwordStrength === 'strong' ? 'text-green-400' : passwordStrength === 'medium' ? 'text-yellow-400' : 'text-red-400'}`}>{passwordStrength}</span>
                  </p>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary py-3 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating Account...</>
              ) : <><FiCheck size={18} /> Create Account</>}
            </button>
          </form>

          {/* Features list */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-gray-500 text-xs text-center mb-3">What you get with CineAI:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Personalized Picks', 'Smart Recommendations', 'Favorites List', 'Movie Ratings'].map((f) => (
                <span key={f} className="text-xs text-primary-300 bg-primary-500/10 border border-primary-500/20 rounded-full px-3 py-1">{f}</span>
              ))}
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
