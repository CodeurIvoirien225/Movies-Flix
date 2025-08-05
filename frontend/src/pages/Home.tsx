import React, { useState, useEffect } from 'react';
import { Movie } from '../types';
import Hero from '../components/Hero';
import MovieCarousel from '../components/MovieCarousel';
import { FiLoader } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { BASE_API_URL } from '../config';



const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('https://movies-flix-backend.onrender.com/api/movies');
      
      if (!res.ok) {
        throw new Error(`Erreur HTTP: ${res.status}`);
      }

      const data = await res.json();
      
      
      // Fonction pour parser correctement le champ genre
      const parseGenre = (genre: any): string[] => {
        if (Array.isArray(genre)) return genre;
        if (typeof genre === 'string') {
          try {
            // Gestion des différents formats possibles
            const cleaned = genre.replace(/\\"/g, '"').replace(/'/g, '"');
            const parsed = JSON.parse(cleaned);
            return Array.isArray(parsed) ? parsed : [parsed];
          } catch (e) {
            console.warn('Error parsing genre:', genre, e);
            return [];
          }
        }
        return [];
      };

      // Transformation des données
      const processedMovies = data.map((movie: any) => ({
        ...movie,
        thumbnail_url: movie.thumbnail_url 
          ? `${BASE_API_URL}${movie.thumbnail_url}`
          : '/placeholder.jpg', // Image par défaut si aucune image
        video_url: movie.video_url 
          ? `${BASE_API_URL}${movie.video_url}`
          : '',
        genre: parseGenre(movie.genre),
        featured: Boolean(movie.featured)
      }));

      setMovies(processedMovies);
      
      // Trouver le film featured ou prendre le premier
      const featured = processedMovies.find(movie => movie.featured) || processedMovies[0] || null;
      setFeaturedMovie(featured);
      
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Erreur lors du chargement des films');
    } finally {
      setLoading(false);
    }
  };


  const getMoviesByCategory = (category: string) => {
    return movies.filter(movie => 
      movie.category?.toLowerCase() === category.toLowerCase()
    );
  };
  
  // Et pour les genres (si vous voulez aussi filtrer par genre)

  const getMoviesByGenre = (genre: string) => {
    const genreVariants: Record<string, string[]> = {
      'drame': ['drame', 'drama'],
      'comédie': ['comédie', 'comedy'],
      'horreur': ['horreur', 'horror']
    };
  
    return movies.filter(movie =>
      movie.genre?.some(g => {
        const searchTerms = genreVariants[genre.toLowerCase()] || [genre.toLowerCase()];
        return searchTerms.includes(g.toLowerCase());
      })
    );
  };



  const getRandomMovies = (count: number) => {
    return [...movies]
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.min(count, movies.length));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <FiLoader className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Aucun film disponible</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen">
      {/* Hero Section */}
      {featuredMovie && (
        <Hero 
          movie={{
            ...featuredMovie,
            thumbnail_url: featuredMovie.thumbnail_url || '/default-hero.jpg'
          }} 
        />
      )}

      {/* Content Sections */}
      <div className="px-4 sm:px-8 lg:px-12 py-8 space-y-16">
      <MovieCarousel 
  title="Tendances actuelles" 
  movies={movies.slice(0, 10)}
  onMovieClick={(movie) => navigate(`/movie/${movie.id}`)}
  gradient="from-blue-500 to-purple-600"
/>
        
        <MovieCarousel 
          title="Films d'action" 
          movies={getMoviesByGenre('Action')} 
          gradient="from-red-500 to-orange-500"
        />
        
        <MovieCarousel 
  title="Comédies" 
  movies={getMoviesByCategory('Comédie')} 
  gradient="from-yellow-400 to-amber-500"
/>
        
        <MovieCarousel 
  title="Drames" 
  movies={getMoviesByCategory('Drame')} 
  gradient="from-emerald-500 to-teal-600"
/>


        <MovieCarousel 
          title="Horreur" 
          movies={getMoviesByCategory('Horreur')} 
          gradient="from-purple-800 to-red-900"
        />
        
        <MovieCarousel 
          title="Recommandés pour vous" 
          movies={getRandomMovies(8)} 
          gradient="from-pink-500 to-rose-500"
        />
        
        <MovieCarousel 
          title="Récemment ajoutés" 
          movies={[...movies].reverse().slice(0, 8)} 
          gradient="from-indigo-500 to-blue-600"
        />
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 py-8 px-8 text-center text-gray-400">
        <p>© {new Date().getFullYear()} Movies-Flix. Tous droits réservés.</p>
      </div>
    </div>
  );
};


export default Home;