import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { BASE_API_URL } from '../config';



interface UserProfile {
  id: string;
  email: string;
  is_admin: boolean;
  full_name?: string;
  subscription_status?: string;
}

const Profile: React.FC = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${BASE_API_URL}/api/user`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement du profil');
        }
        
        const data = await response.json();
        setUser(data);
        setFormData({
          full_name: data.full_name || '',
          email: data.email
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/api/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          full_name: formData.full_name
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error('Erreur lors de la mise à jour');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setEditMode(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>
        
        <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Informations personnelles</h2>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md transition-colors"
              >
                <PencilIcon className="h-4 w-4" />
                <span>Modifier</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleUpdateProfile}
                  className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 px-3 py-2 rounded-md transition-colors"
                >
                  <CheckIcon className="h-4 w-4" />
                  <span>Valider</span>
                </button>
                <button
  onClick={() => setEditMode(false)}
  className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md transition-colors"
>
  <XMarkIcon className="h-4 w-4" /> {/* Changé de XIcon à XMarkIcon */}
  <span>Annuler</span>
</button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-1">Email</label>
              {editMode ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                  disabled // On ne permet pas de modifier l'email dans cet exemple
                />
              ) : (
                <p className="text-white">{user?.email}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Nom complet</label>
              {editMode ? (
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                />
              ) : (
                <p className="text-white">{user?.full_name || 'Non renseigné'}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Statut</label>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                  user?.is_admin ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {user?.is_admin ? 'Administrateur' : 'Utilisateur'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Abonnement</label>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                  user?.subscription_status === 'active' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  {user?.subscription_status === 'active' ? 'Actif' : 'Inactif'}
                </span>
                <Link 
                  to="/subscription" 
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Gérer l'abonnement
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-900 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Historique de visionnage</h2>
          <p className="text-gray-400">Fonctionnalité à venir...</p>
        </div>

        <div className="mt-8 bg-gray-900 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Paramètres de compte</h2>
          <div className="space-y-4">
            <button className="text-red-400 hover:text-red-300">
              Changer le mot de passe
            </button>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;