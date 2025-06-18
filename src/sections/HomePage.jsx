import React from "react";

// SVG animado simple para fondo tipo blockchain: nodos y líneas que se mueven sutilmente
function AnimatedBlockchainBg() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      viewBox="0 0 1440 720"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#635bff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0e0727" stopOpacity="0.85" />
        </radialGradient>
      </defs>
      <rect width="1440" height="720" fill="url(#glow)" />
      {/* Nodos y conexiones animadas con CSS */}
      <g className="animate-fade-in-slow">
        <circle cx="200" cy="150" r="5" fill="#92ffde" opacity="0.8" />
        <circle cx="430" cy="100" r="7" fill="#e0aaff" opacity="0.7" />
        <circle cx="900" cy="180" r="6" fill="#ffb9f6" opacity="0.7" />
        <circle cx="1200" cy="400" r="4" fill="#89b4ff" opacity="0.7" />
        <circle cx="1050" cy="600" r="8" fill="#a6ffcb" opacity="0.7" />
        <circle cx="300" cy="600" r="7" fill="#fff" opacity="0.4" />
        <line x1="200" y1="150" x2="430" y2="100" stroke="#635bff" strokeWidth="2" opacity="0.2" />
        <line x1="430" y1="100" x2="900" y2="180" stroke="#b988f7" strokeWidth="2" opacity="0.2" />
        <line x1="900" y1="180" x2="1200" y2="400" stroke="#92ffde" strokeWidth="2" opacity="0.18" />
        <line x1="1200" y1="400" x2="1050" y2="600" stroke="#89b4ff" strokeWidth="2" opacity="0.18" />
        <line x1="1050" y1="600" x2="300" y2="600" stroke="#a6ffcb" strokeWidth="2" opacity="0.15" />
        <animateTransform attributeName="transform" type="translate"
          values="0 0; 15 -10; 0 0" dur="7s" repeatCount="indefinite" />
      </g>
    </svg>
  );
}

export default function HeroSection({ onLaunchDapp, onShowVideo }) {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center overflow-x-hidden bg-black px-2 sm:px-4 py-10 sm:py-16">
      {/* Fondo animado tipo blockchain */}
      <AnimatedBlockchainBg />

      {/* Hero content */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center justify-center">
        {/* Logo/Token */}
        <span className="text-5xl sm:text-6xl font-extrabold text-white tracking-wide drop-shadow-lg mb-4 select-none">
          HGP
        </span>
        {/* Eslogan */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
          Potencia la Economía Descentralizada
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-indigo-200 mb-6 max-w-[95vw]">
          Tu Ecosistema Definitivo para Tokens, NFTs y Rendimientos Sostenibles.<br />
          <span className="text-indigo-400 font-semibold">
            HighPower: Staking, Liquidez y NFTs en la BSC Testnet.
          </span>
        </p>
        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-5">
          <button
            onClick={onLaunchDapp}
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-bold text-lg rounded-full shadow-xl
                       hover:bg-indigo-500 transition duration-300 transform hover:scale-105"
          >
            Launch App
          </button>
          <button
            onClick={onShowVideo}
            className="w-full sm:w-auto px-8 py-3 bg-transparent border-2 border-indigo-400 text-indigo-200 font-bold text-lg rounded-full shadow-xl
                       hover:bg-indigo-400 hover:text-black transition duration-300 transform hover:scale-105"
          >
            ¿Qué es Web3 y DeFi?
          </button>
        </div>
        {/* Métricas */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center w-full mb-6">
          <MetricCard label="TVL" value="$0" />
          <MetricCard label="Usuarios" value="0" />
          <MetricCard label="Pools activos" value="0" />
          <MetricCard label="NFTs emitidos" value="0" />
        </div>
        {/* Redes Sociales */}
        <div className="flex flex-row justify-center gap-5 mb-2">
          <SocialIcon href="https://twitter.com/highpowercoin" icon="twitter" />
          <SocialIcon href="https://t.me/highpowercommunity" icon="telegram" />
          <SocialIcon href="https://discord.com/invite/highpower" icon="discord" />
          <SocialIcon href="https://medium.com/highpower" icon="medium" />
        </div>
      </div>
      {/* Animación CSS para el fondo SVG */}
      <style>{`
        @keyframes fade-in-slow {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in-slow { animation: fade-in-slow 2s ease-out forwards; }
      `}</style>
    </section>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="bg-black/40 rounded-lg px-5 py-3 flex flex-col items-center shadow-md border border-gray-800 min-w-[90px] sm:min-w-[120px] mb-2 sm:mb-0">
      <span className="text-lg sm:text-2xl font-bold text-indigo-400">{value}</span>
      <span className="text-xs sm:text-sm text-gray-300 mt-1">{label}</span>
    </div>
  );
}

function SocialIcon({ href, icon }) {
  const icons = {
    twitter: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M24 4.56c-.883.392-1.832.656-2.828.775 1.017-.61 1.798-1.575 2.166-2.724-.951.564-2.007.974-3.127 1.195-.898-.956-2.178-1.555-3.594-1.555-2.72 0-4.928 2.206-4.928 4.927 0 .386.045.762.13 1.122-4.094-.205-7.725-2.168-10.158-5.152-.425.729-.669 1.577-.669 2.482 0 1.713.872 3.227 2.197 4.116-.81-.026-1.573-.248-2.24-.617v.062c0 2.393 1.703 4.393 3.96 4.846-.415.113-.852.173-1.303.173-.318 0-.626-.03-.928-.086.627 1.956 2.444 3.38 4.6 3.419-1.68 1.317-3.797 2.103-6.102 2.103-.397 0-.788-.023-1.175-.068 2.178 1.397 4.768 2.215 7.548 2.215 9.051 0 14.008-7.496 14.008-13.986 0-.21-.005-.423-.014-.633.961-.695 1.797-1.562 2.457-2.549z"/>
      </svg>
    ),
    telegram: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M22.5 2.5L2.7 9.78a1.25 1.25 0 0 0 .17 2.4l4.28 1.08 1.63 5.19a1.25 1.25 0 0 0 2.11.47l2.25-2.2 4.73 3.5a1.25 1.25 0 0 0 1.98-.83l2.12-14a1.25 1.25 0 0 0-1.55-1.49zm-3.42 15.08l-5.21-3.85-2.14 2.09-.89-2.85 9.02-7.97-7.21 6.36-4.11-1.04 15.09-5.1-2.75 12.36z" />
      </svg>
    ),
    discord: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M20.317 4.369A19.791 19.791 0 0 0 16.885 3.2a.074.074 0 0 0-.079.037c-.35.607-.734 1.415-1.006 2.05a18.13 18.13 0 0 0-5.6 0 12.69 12.69 0 0 0-1.008-2.05.076.076 0 0 0-.079-.037A19.736 19.736 0 0 0 3.683 4.369a.067.067 0 0 0-.031.028C.533 9.113-.32 13.77.099 18.378a.08.08 0 0 0 .028.054c2.128 1.568 4.202 2.528 6.281 3.168a.077.077 0 0 0 .084-.028c.483-.664.915-1.37 1.289-2.117a.076.076 0 0 0-.041-.105 12.8 12.8 0 0 1-1.882-.902.077.077 0 0 1-.008-.128c.126-.094.252-.192.373-.291a.074.074 0 0 1 .077-.009c3.927 1.792 8.18 1.792 12.062 0a.072.072 0 0 1 .078.009c.121.099.247.197.373.291a.077.077 0 0 1-.006.128 12.678 12.678 0 0 1-1.883.902.076.076 0 0 0-.041.105c.375.747.807 1.453 1.289 2.117a.076.076 0 0 0 .084.028c2.08-.64 4.153-1.6 6.281-3.168a.076.076 0 0 0 .028-.054c.5-5.177-.838-9.786-3.59-13.981a.061.061 0 0 0-.03-.028zM8.02 15.331c-1.183 0-2.156-1.085-2.156-2.419 0-1.333.951-2.418 2.156-2.418 1.21 0 2.176 1.09 2.156 2.418 0 1.333-.951 2.419-2.156 2.419zm7.974 0c-1.183 0-2.156-1.085-2.156-2.419 0-1.333.951-2.418 2.156-2.418 1.21 0 2.176 1.09 2.156 2.418 0 1.333-.946 2.419-2.156 2.419z"/>
      </svg>
    ),
    medium: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M2.01 6.71c.02-.2-.06-.41-.22-.54L.28 4.84V4.56h6.1l4.7 10.3 4.13-10.3h5.84v.28l-1.18 1.13c-.1.08-.14.22-.11.34v13.78c-.03.12.01.26.11.34l1.15 1.13v.28h-8.2v-.28l1.19-1.16c.11-.11.11-.14.11-.34V7.67l-4.78 12.16h-.65L2.96 7.67v8.66c-.03.23.05.46.23.63l1.54 1.87v.28H.14v-.28l1.54-1.87c.18-.17.26-.4.23-.63V6.71z"/>
      </svg>
    ),
  };
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-indigo-400 hover:text-white transition-colors duration-300 transform hover:scale-110"
    >
      {icons[icon]}
    </a>
  );
}
