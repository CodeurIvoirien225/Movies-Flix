import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { MagnifyingGlassIcon, BellIcon, UserIcon, XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { PlayIcon } from '@heroicons/react/24/solid';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSearch(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm transition-all duration-300">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo et menu hamburger mobile */}
          <div className="flex items-center">
            <button 
              className="md:hidden text-white mr-4"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <PlayIcon className="h-8 w-8 text-red-600" />
              <span className="text-2xl font-bold text-white">Movies-Flix</span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          {!showSearch && (
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-white hover:text-gray-300 transition-colors">
                Accueil
              </Link>
              <Link to="/movies" className="text-white hover:text-gray-300 transition-colors">
                Films
              </Link>
              <Link to="/series" className="text-white hover:text-gray-300 transition-colors">
                Séries
              </Link>
              {user?.is_admin && (
                <Link to="/admin" className="text-white hover:text-gray-300 transition-colors">
                  Admin
                </Link>
              )}
            </div>
          )}

          {/* Barre de recherche */}
          {showSearch && (
            <div className="flex-grow mx-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher des films, séries..."
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery('');
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </form>
            </div>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Bouton Recherche - Masqué pendant la recherche */}
            {!showSearch && (
              <button 
                onClick={() => {
                  setShowSearch(true);
                  setMobileMenuOpen(false);
                }}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>
            )}
            
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors">
                  <UserIcon className="h-6 w-6" />
                  <span className="hidden sm:block">{user.email}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-black bg-opacity-90 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profil
                    </Link>
                    <Link 
                      to="/subscription" 
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Abonnement
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Se connecter
              </Link>
            )}
          </div>
        </div>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black bg-opacity-90 pb-4">
            <div className="flex flex-col space-y-3 px-2 pt-2">
              <Link 
                to="/" 
                className="text-white hover:text-gray-300 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link 
                to="/movies" 
                className="text-white hover:text-gray-300 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Films
              </Link>
              <Link 
                to="/series" 
                className="text-white hover:text-gray-300 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Séries
              </Link>
              {user?.is_admin && (
                <Link 
                  to="/admin" 
                  className="text-white hover:text-gray-300 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              {user && (
                <>
                  <Link 
                    to="/profile" 
                    className="text-white hover:text-gray-300 transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profil
                  </Link>
                  <Link 
                    to="/subscription" 
                    className="text-white hover:text-gray-300 transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Abonnement
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left text-white hover:text-gray-300 transition-colors py-2"
                  >
                    Déconnexion
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;