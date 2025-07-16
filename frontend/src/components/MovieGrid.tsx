import React from 'react';
import { Movie } from '../types';
import MovieCard from './MovieCard';
import { BASE_API_URL } from '../config';




interface MovieGridProps {
  category?: string;
  searchQuery?: string;
}

const MovieGrid: React.FC<MovieGridProps> = ({ category, searchQuery }) => {
  const [movies, setMovies] = React.useState<Movie[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);



  React.useEffect(() => {
    const fetchMovies = async () => {
     
      
      try {
        const url = new URL(`${BASE_API_URL}/api/movies`);
        if (category) {
          url.searchParams.append('category', category);
        }
  
        if (searchQuery) {
          url.searchParams.append('search', searchQuery);
        }

  
        const res = await fetch(url.toString());
        
  
        if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
        
        const data = await res.json();
       
        
        setMovies(data);
      } catch (err) {
        console.error('Erreur fetch:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMovies();
  }, [category, searchQuery]);



  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-white">Chargement en cours...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-gray-400">Aucun contenu disponible</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCard 
          key={movie.id} 
          movie={movie} 
          size="medium" 
        />
      ))}
    </div>
  );
};

export default MovieGrid;