import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BASE_API_URL } from '../config';

const Watch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyAccess = async () => {
      console.log("🚀 Début de verifyAccess");
      const token = localStorage.getItem('token');
      console.log("Token:", token);

      if (!token) {
        navigate('/signin');
        return;
      }

      try {
        setLoading(true);
        
        // 1. Vérifier l'abonnement de l'utilisateur
        const userRes = await fetch(`${BASE_API_URL}/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Réponse user:", userRes);

        if (!userRes.ok) throw new Error('Échec de récupération des infos utilisateur');
        
        const userData = await userRes.json();
        console.log("Données utilisateur complètes:", userData);
        const isSubscribed = userData.is_subscribed === 1;
        console.log("Abonnement vérifié:", isSubscribed)

        if (!isSubscribed) {
          navigate('/subscription');
          return;
        }

        // 2. Récupérer le film depuis l'API si pas dans location.state
        let movieData = location.state?.movie;
        
        if (!movieData && id) {
          const movieRes = await fetch(`${BASE_API_URL}/api/movies/${id}`);
          if (!movieRes.ok) throw new Error('Film non trouvé');
          movieData = await movieRes.json();
        }

        if (!movieData) {
          throw new Error('Aucun film sélectionné');
        }

        setMovie({
          ...movieData,
          video_url: movieData.video_url.startsWith('http')
            ? movieData.video_url
            : `${BASE_API_URL}${movieData.video_url}`
        });

      } catch (err) {
        console.error("Erreur:", err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        navigate('/movies');
      } finally {
        setLoading(false);
      }
    };

    verifyAccess();
  }, [navigate, id, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Film non disponible</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-50 bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition text-white"
      >
        Retour
      </button>

      <div className="w-full h-screen flex items-center justify-center">
        <video
          className="w-full h-full object-contain"
          autoPlay
          controls
          controlsList="nodownload"
          src={movie.video_url}
        />
      </div>
    </div>
  );
};

export default Watch;