import React from 'react';
import { useLocation } from 'react-router-dom';
import MovieGrid from '../components/MovieGrid';

const CategoryPage: React.FC = () => {
  const location = useLocation();
  
  // Déterminez la catégorie en fonction du chemin
  const currentCategory = location.pathname === '/series' ? 'Série TV' : 'Film';
  


  return (
    <div className="pt-16 min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">
          {currentCategory === 'Film' ? 'Tous les films' : 'Toutes les séries'}
        </h1>
        <MovieGrid category={currentCategory} />
      </div>
    </div>
  );
};

export default CategoryPage;