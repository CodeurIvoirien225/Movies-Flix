import React from 'react';
import { useLocation } from 'react-router-dom';
import MovieGrid from '../components/MovieDetails'; // Vous devrez créer ce composant

const MoviesPage: React.FC = () => {
  const { pathname } = useLocation();
  const category = pathname === '/series' ? 'Série TV' : 'Film';

  return (
    <div className="pt-16 min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">
          {category === 'Film' ? 'Tous les films' : 'Toutes les séries'}
        </h1>
        <MovieGrid category={category} />
      </div>
    </div>
  );
};

export default MoviesPage;