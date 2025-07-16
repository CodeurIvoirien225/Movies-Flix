import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Movie } from '../types';
import { FiArrowLeft, FiStar, FiClock, FiCalendar } from 'react-icons/fi';
import { BASE_API_URL } from '../config';



const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/api/movies/${id}`);
        if (!res.ok) {
          throw new Error(`Erreur HTTP: ${res.status}`);
        }
        const data = await res.json();
        
        const processedMovie = {
          ...data,
          thumbnail_url: data.thumbnail_url 
            ? `${BASE_API_URL}${data.thumbnail_url}`
            : '/placeholder.jpg',
          video_url: data.video_url 
            ? `${BASE_API_URL}${data.video_url}`
            : '',
          genre: Array.isArray(data.genre) ? data.genre : 
                typeof data.genre === 'string' ? 
                JSON.parse(data.genre.replace(/\\"/g, '"')) : []
        };
        
        setMovie(processedMovie);
      } catch (err) {
        console.error('Error fetching movie:', err);
        setError('Erreur lors du chargement du film');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-red-500 text-xl">{error}</div>
    </div>;
  }

  if (!movie) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white text-xl">Film non trouvé</div>
    </div>;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-50 bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition"
      >
        <FiArrowLeft className="text-2xl" />
      </button>

      <div className="relative h-96 w-full overflow-hidden">
        <img 
          src={movie.thumbnail_url} 
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-8 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 lg:w-1/4">
            <img 
              src={movie.thumbnail_url} 
              alt={movie.title}
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>

          <div className="w-full md:w-2/3 lg:w-3/4">
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-6 text-gray-300">
              <div className="flex items-center">
                <FiStar className="mr-1 text-yellow-400" />
                <span>{movie.rating || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <FiClock className="mr-1" />
                <span>{movie.duration} min</span>
              </div>
              <div className="flex items-center">
                <FiCalendar className="mr-1" />
                <span>{movie.year || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <span className="px-2 py-1 bg-gray-700 rounded text-sm">
                  {movie.category}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genre?.map((genre, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-blue-600 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-3">Synopsis</h2>
              <p className="text-gray-300 leading-relaxed">
                {movie.description || 'Aucune description disponible.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate(`/watch/${movie.id}`)}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
              >
                Regarder maintenant
              </button>
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;