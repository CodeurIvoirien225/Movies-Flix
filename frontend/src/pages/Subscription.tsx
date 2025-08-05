import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckIcon } from "@heroicons/react/24/solid";

const Subscription = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const plans = [
    {
      name: "Standard",
      price: 2000,
      features: [
        "Accès illimité aux films et séries",
        "Qualité HD",
        "Support 24/7",
      ],
      popular: true,
    },
  ];

  const handleSubscribe = async (planName: string, price: number) => {
    try {
      const response = await fetch(
        "https://movies-flix-backend.onrender.com/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            price: price,
            email: email,
            plan: planName,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la session Stripe");
      }

      const data = await response.json();
      window.location.href = data.url;
    } catch (err) {
      console.error("Erreur :", err);
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
            Regardez vos films et séries préférés à moindre coût
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-lg p-8 ${
                plan.popular
                  ? "bg-red-900 bg-opacity-20 border-2 border-red-600"
                  : "bg-gray-900 border border-gray-700"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    POPULAIRE
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-white text-2xl font-bold mb-2">
                  {plan.name}
                </h3>
                <div className="text-white">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-400">FCFA/mois</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center text-gray-300"
                  >
                    <CheckIcon className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mb-4">
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="border p-2 w-full rounded-md bg-gray-800 text-white border-gray-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                onClick={() => handleSubscribe(plan.name, plan.price)}
                disabled={!email}
                className={`w-full py-3 px-6 rounded-md font-semibold transition-colors ${
                  plan.popular
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gray-600 hover:bg-gray-700 text-white"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Choisir ce plan
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          
        </div>
      </div>
    </div>
  );
};

export default Subscription;