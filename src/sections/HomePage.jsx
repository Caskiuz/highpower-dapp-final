import React from 'react';

function HomePage({ onLaunchDapp, onShowVideo }) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[var(--dark-gray)] text-[var(--off-white)] p-4 pt-[72px] sm:pt-4">
      {/* Título Principal y Slogan */}
      <div className="text-center mb-10 z-10 p-4 max-w-4xl">
        {/* Tamaños de texto más pequeños en móvil */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-4 text-[var(--accent-green)] drop-shadow-lg animate-fade-in-up">
          Potencia la Economía Descentralizada
        </h1>
        <p className="text-2xl sm:text-3xl font-semibold text-[var(--primary-purple)] mb-8 animate-fade-in-up delay-200">
          Tu Ecosistema Definitivo para Tokens, NFTs y Rendimientos Sostenibles.
        </p>
      </div>

      {/* Botones de Acción */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 z-10 animate-fade-in-up delay-400">
        <button
          onClick={onLaunchDapp}
          className="px-8 py-4 bg-[var(--primary-purple)] text-white font-bold text-lg rounded-full shadow-xl
                     hover:bg-[var(--secondary-blue)] transition duration-300 transform hover:scale-105"
        >
          Iniciar Aplicación
        </button>
        <button
          onClick={onShowVideo}
          className="px-8 py-4 bg-transparent border-2 border-[var(--accent-green)] text-[var(--accent-green)] font-bold text-lg rounded-full shadow-xl
                     hover:bg-[var(--accent-green)] hover:text-[var(--dark-gray)] transition duration-300 transform hover:scale-105"
        >
          ¿Qué es Web3 y DeFi?
        </button>
      </div>

      {/* Sección de Redes Sociales */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-6 z-10 animate-fade-in-up delay-600">
        <a href="https://twitter.com/highpowercoin" target="_blank" rel="noopener noreferrer" className="text-[var(--secondary-blue)] hover:text-[var(--primary-purple)] transition-colors duration-300 transform hover:scale-110">
          <i className="fab fa-twitter text-3xl"></i>
        </a>
        <a href="https://t.me/highpowercommunity" target="_blank" rel="noopener noreferrer" className="text-[var(--secondary-blue)] hover:text-[var(--primary-purple)] transition-colors duration-300 transform hover:scale-110">
          <i className="fab fa-telegram-plane text-3xl"></i>
        </a>
        <a href="https://discord.com/invite/highpower" target="_blank" rel="noopener noreferrer" className="text-[var(--secondary-blue)] hover:text-[var(--primary-purple)] transition-colors duration-300 transform hover:scale-110">
          <i className="fab fa-discord text-3xl"></i>
        </a>
        <a href="https://medium.com/highpower" target="_blank" rel="noopener noreferrer" className="text-[var(--secondary-blue)] hover:text-[var(--primary-purple)] transition-colors duration-300 transform hover:scale-110">
          <i className="fab fa-medium text-3xl"></i>
        </a>
      </div>

      {/* Animaciones de fondo y estilos generales */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-600 { animation-delay: 0.6s; }
      `}</style>
    </div>
  );
}

export default HomePage;
