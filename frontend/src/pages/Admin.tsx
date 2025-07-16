import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Movie } from '../types';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { BASE_API_URL } from '../config';




const Admin: React.FC = () => {
  const { user } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [formData, setFormData] = useState<any>({
    title: '',
    description: '',
    thumbnail_url: '',
    video_url: '',
    category: '',
    year: new Date().getFullYear(),
    rating: 'Tout public',
    duration: '',
    genre: [] as string[],
    featured: false
  });

  // Options pour les sélecteurs
  const ageRatings = [
    { value: 'Tout public', label: 'Tout public' },
    { value: 'Déconseillé aux moins de 10 ans', label: 'Déconseillé aux -10 ans' },
    { value: 'Réservé aux plus de 16 ans', label: 'Réservé aux +16 ans' },
    { value: 'Adultes uniquement', label: 'Adultes uniquement (+18)' }
  ];

  const categories = [
    'Film',
    'Série TV',
    'Comédie',
    'Drame',
    'Action',
    'Horreur',
    'Documentaire',
    'Animation'
  ];

  const genres = [
    'Action',
    'Aventure',
    'Comédie',
    'Drame',
    'Horreur',
    'Science-Fiction',
    'Thriller',
    'Romance',
    'Documentaire',
    'Animation'
  ];

  useEffect(() => {
    if (!user?.is_admin) return;
    fetchMovies();
  }, [user]);

  const fetchMovies = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/api/movies`);
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingMovie ? 'PUT' : 'POST';
      const url = editingMovie
        ? `${BASE_API_URL}/api/movies/${editingMovie.id}`
        : `${BASE_API_URL}/api/movies`;

      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('category', formData.category);
      form.append('year', formData.year.toString());
      form.append('rating', formData.rating);
      form.append('duration', formData.duration);
      form.append('genre', JSON.stringify(formData.genre));
      form.append('featured', String(formData.featured));

      if (formData.thumbnail_url instanceof File) {
        form.append('thumbnail', formData.thumbnail_url);
      }

      if (formData.video_url instanceof File) {
        form.append('video', formData.video_url);
      }

      const response = await fetch(url, {
        method,
        body: form
      });

      if (!response.ok) throw new Error('Erreur lors de l\'upload');

      setShowForm(false);
      setEditingMovie(null);
      setFormData({
        title: '',
        description: '',
        thumbnail_url: '',
        video_url: '',
        category: '',
        year: new Date().getFullYear(),
        rating: 'Tout public',
        duration: '',
        genre: [],
        featured: false
      });

      fetchMovies();
    } catch (err) {
      console.error(err);
      alert('Erreur upload');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      description: movie.description,
      thumbnail_url: movie.thumbnail_url,
      video_url: movie.video_url,
      category: movie.category,
      year: movie.year,
      rating: movie.rating,
      duration: movie.duration,
      genre: movie.genre,
      featured: movie.featured
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce film ?')) return;

    try {
      const response = await fetch(`${BASE_API_URL}/api/movies/${id}`, { 
        method: 'DELETE' 
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      fetchMovies();
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la suppression');
    }
  };

  if (!user?.is_admin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Accès refusé</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Administration</h1>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingMovie(null);
              setFormData({
                title: '',
                description: '',
                thumbnail_url: '',
                video_url: '',
                category: '',
                year: new Date().getFullYear(),
                rating: 'Tout public',
                duration: '',
                genre: [],
                featured: false
              });
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Ajouter un film</span>
          </button>
        </div>

        {/* Movie Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-8 rounded-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingMovie ? 'Modifier le film' : 'Ajouter un film'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Titre</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white h-24"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Image de couverture
                    {editingMovie && !(formData.thumbnail_url instanceof File) && (
                      <span className="text-gray-400 ml-2">(Laisser vide pour conserver l'actuelle)</span>
                    )}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      thumbnail_url: e.target.files?.[0] || '' 
                    })}
                    className="w-full text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Fichier vidéo
                    {editingMovie && !(formData.video_url instanceof File) && (
                      <span className="text-gray-400 ml-2">(Laisser vide pour conserver l'actuel)</span>
                    )}
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      video_url: e.target.files?.[0] || '' 
                    })}
                    className="w-full text-white text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Catégorie</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                      required
                    >
                      <option value="">Choisir une catégorie</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Année</label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Classification</label>
                    <select
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                    >
                      {ageRatings.map((rating) => (
                        <option key={rating.value} value={rating.value}>{rating.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Durée</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="ex: 2h 15min"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Genres</label>
                  <select
                    multiple
                    value={formData.genre}
                    onChange={(e) => {
                      const options = Array.from(e.target.selectedOptions, option => option.value);
                      setFormData({ ...formData, genre: options });
                    }}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white h-auto"
                    required
                  >
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                  
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="featured" className="text-white text-sm">Film à la une</label>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingMovie(null);
                    }}
                    className="px-4 py-2 text-gray-400 hover:text-white"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                  >
                    {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}


        {/* Movies List */}
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-800">
            <h2 className="text-xl font-bold text-white">Films et séries</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
            <thead className="bg-gray-800">
  <tr>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Image</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Titre</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Catégorie</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Année</th>
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase"
      style={{ minWidth: '140px' }}
    >
      Classification
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
  </tr>
</thead>

<tbody className="divide-y divide-gray-700">
  {movies.map((movie) => (
    <tr key={movie.id} className="hover:bg-gray-800">
      <td className="px-6 py-4">
        <img
          src={movie.thumbnail_url}
          alt={movie.title}
          className="w-16 h-10 object-cover rounded"
        />
      </td>
      <td className="px-6 py-4 text-white font-medium">{movie.title}</td>
      <td className="px-6 py-4 text-gray-300">{movie.category}</td>
      <td className="px-6 py-4 text-gray-300">{movie.year}</td>
      <td
        className="px-6 py-4 text-gray-300 whitespace-normal break-words"
        title={movie.rating}
      >
        {movie.rating === 'Déconseillé aux -10 ans' ? 'Déconseillé aux -10 ans' : movie.rating}
      </td>
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(movie)}
            className="text-blue-400 hover:text-blue-300"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleDelete(movie.id)}
            className="text-red-400 hover:text-red-300"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Admin;