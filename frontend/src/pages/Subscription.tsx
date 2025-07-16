import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CheckIcon } from '@heroicons/react/24/solid';

const Subscription: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const plans = [
 
    {
      name: 'Standard',
      price: 8000,
      features: [
        'Accès illimité aux films et séries',
        'Qualité HD',
              ],
      popular: true
    },
   
  ];

  const handleSubscribe = async (planName: string, price: number) => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // This would integrate with Stripe
      console.log(`Subscribing to ${planName} plan for ${price}FCFA/month`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Redirection vers Stripe pour le paiement...');
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('Erreur lors de l\'abonnement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Choisissez votre abonnement
          </h1>
          <p className="text-gray-400 text-lg">
            Regardez vos films et séries préférés à moins coût
          </p>
        </div>

        {user?.subscription_status === 'active' && (
          <div className="bg-green-900 bg-opacity-50 border border-green-600 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <CheckIcon className="h-6 w-6 text-green-400 mr-3" />
              <div>
                <h3 className="text-green-400 font-semibold">Abonnement actif</h3>
                <p className="text-gray-300">Votre abonnement est actif et vous avez accès à tout le contenu.</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-lg p-8 ${
                plan.popular
                  ? 'bg-red-900 bg-opacity-20 border-2 border-red-600'
                  : 'bg-gray-900 border border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-white text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-white">
                  <span className="text-4xl font-bold">{plan.price}FCFA</span>
                  <span className="text-gray-400">/mois</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-300">
                    <CheckIcon className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.name, plan.price)}
                disabled={loading || user?.subscription_status === 'active'}
                className={`w-full py-3 px-6 rounded-md font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {user?.subscription_status === 'active' ? 'Abonné' : 'Choisir ce plan'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            Vous pouvez annuler votre abonnement à tout moment. Aucun engagement.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Subscription;