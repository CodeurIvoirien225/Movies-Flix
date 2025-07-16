import React, { useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Movie } from '../types';
import MovieCard from './MovieCard';

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  gradient?: string;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ title, movies, gradient = 'from-gray-800 to-gray-900' }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 400;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative group mb-8">
      <div className="flex items-center mb-4">
        <h2 className="text-white text-xl font-bold">{title}</h2>
        <div className={`ml-4 h-1 flex-1 bg-gradient-to-r ${gradient} rounded-full`}></div>
      </div>
      
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Scroll left"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        
        <div
          ref={carouselRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="flex-shrink-0">
              <MovieCard movie={movie} size="medium" />
            </div>
          ))}
        </div>
        
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Scroll right"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default MovieCarousel;