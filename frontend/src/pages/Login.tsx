import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PlayIcon } from '@heroicons/react/24/solid';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-red-900 to-black opacity-50" />
      
      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="bg-black bg-opacity-80 p-8 rounded-lg shadow-2xl">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <PlayIcon className="h-8 w-8 text-red-600 mr-2" />
            <span className="text-2xl font-bold text-white">Movies-Flix</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-white text-2xl font-bold mb-6">
                {isLogin ? 'Se connecter' : 'S\'inscrire'}
              </h2>
            </div>

            {error && (
              <div className="bg-red-600 text-white p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'S\'inscrire')}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-gray-400 hover:text-white text-sm"
              >
                {isLogin ? 'Créer un compte' : 'J\'ai déjà un compte'}
              </button>
            </div>
          </form>

          <div className="mt-8 flex flex-col items-center space-y-3">
  <Link to="/" className="text-gray-400 hover:text-white text-sm">
    Retour à l'accueil
  </Link>
  <Link
    to="/forgot-password"
    className="text-red-400 hover:text-red-300 text-sm font-semibold"
  >
    Mot de passe oublié ?
  </Link>
</div>
          
        </div>
      </div>
    </div>
  );
};

export default Login;