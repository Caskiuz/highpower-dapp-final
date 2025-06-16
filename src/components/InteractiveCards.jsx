// src/components/InteractiveCards.jsx
import React from 'react';

function InteractiveCards({ onNavigate }) {
  const cards = [
    {
      id: 1,
      title: 'Stake tus $HGP',
      description: 'Genera ingresos pasivos bloqueando tus tokens HGP en nuestros pools de staking.',
      buttonText: 'Ir a Rendimientos',
      path: 'yield',
      bgColor: 'from-blue-500 to-purple-600',
      imagePlaceholder: 'https://placehold.co/400x200/4F46E5/FFFFFF?text=Stake+HGP', // Placeholder azul/púrpura
    },
    {
      id: 2,
      title: 'Farmear Liquidez',
      description: 'Aporta liquidez a los pares HGP y gana recompensas de farming.',
      buttonText: 'Ir a Rendimientos',
      path: 'yield',
      bgColor: 'from-green-500 to-blue-500',
      imagePlaceholder: 'https://placehold.co/400x200/22C55E/FFFFFF?text=Farm+Liquidez', // Placeholder verde/azul
    },
    {
      id: 3,
      title: 'Acuña tus NFTs',
      description: 'Crea y posee activos digitales únicos de HighPower en nuestro Marketplace.',
      buttonText: 'Explorar NFTs',
      path: 'nfts',
      bgColor: 'from-pink-500 to-red-600',
      imagePlaceholder: 'https://placehold.co/400x200/EC4899/FFFFFF?text=Acuñar+NFTs', // Placeholder rosa/rojo
    },
    {
      id: 4,
      title: 'Participa en la DAO',
      description: 'Influye en el futuro del ecosistema HighPower con tu poder de voto.',
      buttonText: 'Ir a Gobernanza',
      path: 'dao',
      bgColor: 'from-orange-500 to-yellow-600',
      imagePlaceholder: 'https://placehold.co/400x200/F97316/FFFFFF?text=Gobernanza+DAO', // Placeholder naranja/amarillo
    },
    {
      id: 5,
      title: 'Intercambia $HGP',
      description: 'Compra y vende tokens HGP de forma rápida y segura en nuestro Swap.',
      buttonText: 'Ir a Swap',
      path: 'swap',
      bgColor: 'from-indigo-500 to-purple-500',
      imagePlaceholder: 'https://placehold.co/400x200/6366F1/FFFFFF?text=Swap+HGP', // Placeholder indigo/púrpura
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {cards.map((card) => (
        <div 
          key={card.id} 
          className={`relative overflow-hidden rounded-2xl shadow-xl border border-gray-700
                      bg-gradient-to-br ${card.bgColor}
                      transform transition duration-500 ease-in-out hover:scale-105 hover:shadow-2xl
                      flex flex-col items-center justify-center p-6 text-white`}
          style={{ backgroundImage: `url(${card.imagePlaceholder})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          {/* Capa de superposición para mejorar la legibilidad del texto sobre la imagen */}
          <div className="absolute inset-0 bg-black opacity-40 rounded-2xl"></div>
          
          <h3 className="relative z-10 text-3xl font-bold mb-3 text-center drop-shadow-md">
            {card.title}
          </h3>
          <p className="relative z-10 text-lg mb-6 text-center opacity-90">
            {card.description}
          </p>
          <button
            onClick={() => onNavigate(card.path)}
            className="relative z-10 bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm
                       hover:bg-opacity-30 text-white font-semibold py-3 px-8 rounded-full
                       transition duration-300 ease-in-out transform hover:scale-110 shadow-lg"
          >
            {card.buttonText}
          </button>
        </div>
      ))}
    </div>
  );
}

export default InteractiveCards;
