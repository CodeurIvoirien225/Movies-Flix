import React from 'react';
import { useLocation } from 'react-router-dom';
import MovieGrid from '../components/MovieGrid';

const SearchResults: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';

  return (
    <div className="pt-16 min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">
          Résultats pour : <span className="text-red-500">"{query}"</span>
        </h1>
        <MovieGrid searchQuery={query} />
      </div>
    </div>
  );
};

export default SearchResults;