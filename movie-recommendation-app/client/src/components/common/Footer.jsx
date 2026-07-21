import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiGithub, FiTwitter, FiInstagram, FiMail, FiZap } from 'react-icons/fi';
import { MdAutoAwesome } from 'react-icons/md';
import CineMindLogo from './CineMindLogo';

const Footer = () => {
  return (
    <footer className="bg-dark-400 border-t border-white/10 relative overflow-hidden mt-20">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 flex flex-col items-start">
            <Link to="/" className="mb-4 inline-block">
              <CineMindLogo size="lg" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              AI-powered personalized movie recommendation engine. Discover films tailored specifically to your unique cinematic taste.
            </p>
            <div className="flex items-center gap-2 text-xs text-primary-400 font-medium bg-primary-500/10 border border-primary-500/20 px-3 py-1.5 rounded-full">
              <MdAutoAwesome className="text-sm" /> Powered by TMDB & ML
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-400 hover:text-white transition-colors">Discover Movies</Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-400 hover:text-white transition-colors">My Favorites</Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-white transition-colors">User Profile</Link>
              </li>
            </ul>
          </div>

          {/* Popular Genres */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              Browse Genres
            </h3>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              <li>
                <Link to="/search?genre=action" className="text-gray-400 hover:text-white transition-colors">Action</Link>
              </li>
              <li>
                <Link to="/search?genre=sci-fi" className="text-gray-400 hover:text-white transition-colors">Sci-Fi</Link>
              </li>
              <li>
                <Link to="/search?genre=romance" className="text-gray-400 hover:text-white transition-colors">Romance</Link>
              </li>
              <li>
                <Link to="/search?genre=comedy" className="text-gray-400 hover:text-white transition-colors">Comedy</Link>
              </li>
              <li>
                <Link to="/search?genre=horror" className="text-gray-400 hover:text-white transition-colors">Horror</Link>
              </li>
              <li>
                <Link to="/search?genre=thriller" className="text-gray-400 hover:text-white transition-colors">Thriller</Link>
              </li>
              <li>
                <Link to="/search?genre=drama" className="text-gray-400 hover:text-white transition-colors">Drama</Link>
              </li>
              <li>
                <Link to="/search?genre=animation" className="text-gray-400 hover:text-white transition-colors">Animation</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              About CineMind
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              CineMind analyzes your favorited movies, ratings, and watched trailers to construct an evolving taste profile.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-9 h-9 bg-dark-500 hover:bg-dark-600 border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <FiGithub size={16} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 bg-dark-500 hover:bg-dark-600 border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <FiTwitter size={16} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 bg-dark-500 hover:bg-dark-600 border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <FiInstagram size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} <span className="text-white font-medium">CineMind</span>. Discover Movies You'll Love. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <FiHeart className="text-red-500 fill-current" size={12} /> for Movie Lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
