import React from 'react';

const Success: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-8">
      <div className="max-w-md text-center border border-green-500 rounded-lg p-6 bg-green-900 bg-opacity-20">
        <h1 className="text-3xl font-bold text-green-400 mb-4">✅ Paiement réussi !</h1>
        <p className="text-lg text-gray-300 mb-4">
          Merci pour votre achat. Votre abonnement est maintenant actif.
        </p>
        <a
          href="/"
          className="inline-block mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-semibold transition"
        >
          Retour à l’accueil
        </a>
      </div>
    </div>
  );
};

export default Success;
