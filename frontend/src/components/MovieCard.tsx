import React from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../types';
import { PlayIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import { BASE_API_URL } from '../config';


interface MovieCardProps {
  movie: Movie;
  size?: 'small' | 'medium' | 'large';
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-32 h-48',
    medium: 'w-48 h-72', 
    large: 'w-64 h-96'
  };

  // Gestion des URLs d'images
  const thumbnailUrl = movie.thumbnail_url 
    ? movie.thumbnail_url.startsWith('http') 
      ? movie.thumbnail_url 
      : `${BASE_API_URL}${movie.thumbnail_url}`
    : '/placeholder.jpg';

    
  return (
    <div className="group relative cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10">
      <div className={`${sizeClasses[size]} relative overflow-hidden rounded-lg shadow-lg`}>
        {/* Élément img ajouté ici */}
        <img
          src={thumbnailUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.jpg';
          }}
        />
        
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-4">
            <Link
              to={`/watch/${movie.id}`}
              className="bg-white text-black p-3 rounded-full hover:bg-gray-200 transition-colors"
              title="Regarder"
            >
              <PlayIcon className="h-6 w-6" />
            </Link>
            <Link
              to={`/movie/${movie.id}`}
              className="bg-gray-800 bg-opacity-90 text-white p-3 rounded-full hover:bg-gray-700 transition-colors"
              title="Détails"
            >
              <InformationCircleIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
      
      <div className="mt-3">
        <h3 className="text-white font-semibold text-sm truncate">{movie.title}</h3>
        <div className="flex justify-between items-center mt-1">
          <span className="text-gray-400 text-xs">{movie.year}</span>
          <span className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-300">
            {movie.rating}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;