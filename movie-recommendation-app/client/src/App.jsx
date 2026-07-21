import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

const NotFoundPage = () => (
  <div className="min-h-screen bg-dark-300 flex items-center justify-center text-center">
    <div>
      <div className="text-8xl font-display font-bold gradient-text mb-4">404</div>
      <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
      <a href="/" className="btn-primary">Go Home</a>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-dark-300">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movie/:tmdbId" element={<MovieDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/favorites" element={
              <ProtectedRoute><FavoritesPage /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
