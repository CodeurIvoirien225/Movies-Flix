import React from 'react';
import { Link } from 'react-router-dom';
import { PlayIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import { Movie } from '../types';

interface HeroProps {
  movie: Movie;
}

const Hero: React.FC<HeroProps> = ({ movie }) => {
  return (
    <div className="relative h-screen">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={movie.thumbnail_url}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full">
        <div className="px-4 sm:px-6 lg:px-8 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            {movie.title}
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-200 mb-6 leading-relaxed">
            {movie.description}
          </p>
          
          <div className="flex items-center space-x-4 mb-8">
            <span className="text-green-400 font-semibold">{movie.rating}</span>
            <span className="text-gray-300">{movie.year}</span>
            <span className="text-gray-300">{movie.duration}</span>
          </div>
          
          <div className="flex space-x-4">
            <Link
              to={`/watch/${movie.id}`}
              className="bg-white text-black px-8 py-3 rounded-md font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center space-x-2"
            >
              <PlayIcon className="h-5 w-5" />
              <span>Regarder</span>
            </Link>
            
            <Link
              to={`/movie/${movie.id}`}
              className="bg-gray-600 bg-opacity-70 text-white px-8 py-3 rounded-md font-semibold hover:bg-opacity-90 transition-all duration-200 flex items-center space-x-2"
            >
              <InformationCircleIcon className="h-5 w-5" />
              <span>Plus d'infos</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;