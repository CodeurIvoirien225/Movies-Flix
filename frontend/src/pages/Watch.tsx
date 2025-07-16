import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Movie } from '../types';
import { ArrowLeftIcon, PlayIcon, PauseIcon, SpeakerWaveIcon } from '@heroicons/react/24/solid';

const Watch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.subscription_status !== 'active') {
      navigate('/subscription');
      return;
    }

    if (id) {
      fetchMovie(id);
    }
  }, [id, user, navigate]);

  const fetchMovie = async (movieId: string) => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('id', movieId)
        .single();

      if (error) throw error;
      setMovie(data);
    } catch (error) {
      console.error('Error fetching movie:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Film non trouvé</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative">
      {/* Video Player */}
      <div className="relative h-screen">
        {/* Video placeholder - in real app this would be a video element */}
        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
          <img
            src={movie.thumbnail_url}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          
          {/* Play/Pause Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlayPause}
              className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-8 rounded-full transition-all duration-200"
            >
              {isPlaying ? (
                <PauseIcon className="h-16 w-16" />
              ) : (
                <PlayIcon className="h-16 w-16" />
              )}
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent p-8 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <ArrowLeftIcon className="h-8 w-8" />
              </button>
              
              <div>
                <h1 className="text-white text-2xl font-bold">{movie.title}</h1>
                <p className="text-gray-300">{movie.year} • {movie.rating} • {movie.duration}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-white hover:text-gray-300 transition-colors">
                <SpeakerWaveIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-600 rounded-full h-1">
              <div className="bg-red-600 h-1 rounded-full" style={{ width: '30%' }}></div>
            </div>
            <div className="flex justify-between text-gray-400 text-sm mt-1">
              <span>15:32</span>
              <span>45:20</span>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-90 p-8">
        <div className="max-w-4xl">
          <h2 className="text-white text-xl font-bold mb-2">À propos de ce film</h2>
          <p className="text-gray-300 mb-4">{movie.description}</p>
          <div className="flex flex-wrap gap-2">
            {movie.genre.map((genre, index) => (
              <span key={index} className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;