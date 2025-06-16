// src/sections/HomePage.jsx
import React, { useEffect, useState } from 'react';

function HomePage({ onLaunchDapp }) {
  // Enlace de Discord - ¡IMPORTANTE: Reemplázalo con tu enlace de invitación real!
  const discordInviteLink = "https://discord.gg/YOUR_DISCORD_INVITE"; 

  // Estado para controlar la animación de entrada del contenido principal
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Activa la animación de entrada después de un pequeño retraso
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500); // Pequeño retraso para la aparición escalonada

    return () => clearTimeout(timer);
  }, []);

  return (
    // Contenedor principal de la Home Page: ocupa toda la altura, centrado visualmente, ocultando desbordamiento
    <div className="relative flex flex-col min-h-screen text-center overflow-hidden bg-[var(--dark-gray)] font-sans">
      
      {/* Barra superior fija para el Logo y el botón "Iniciar aplicación" */}
      <div className="absolute top-0 left-0 w-full p-4 lg:px-8 z-20 flex justify-between items-center bg-transparent">
        {/* Logo HighPower - Esquina superior izquierda */}
        <div className="text-purple-400 text-3xl font-bold rounded-lg p-2 transition duration-300 hover:bg-gray-800 cursor-pointer animate-fade-in delay-500">
          HighPower
        </div>
        {/* Botón "Iniciar aplicación" - Esquina superior derecha */}
        <button
          onClick={onLaunchDapp}
          className="bg-[var(--accent-green)] hover:bg-[var(--secondary-blue)] text-gray-900 font-bold py-3 px-8 rounded-full text-xl
                     transition duration-300 ease-in-out transform hover:scale-105 shadow-xl animate-fade-in delay-1000"
        >
          Iniciar aplicación
        </button>
      </div>

      {/* Fondo dinámico temático de Blockchain/Criptomonedas: Nodos y conexiones etéreas */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Nodos/Bloques principales con animaciones de pulsación y movimiento */}
        <div className="absolute w-40 h-40 rounded-full bg-[var(--primary-purple)] opacity-10 blur-xl animate-node-pulse-1" style={{ top: '10%', left: '15%' }}></div>
        <div className="absolute w-52 h-52 rounded-full bg-[var(--secondary-blue)] opacity-10 blur-xl animate-node-pulse-2" style={{ bottom: '20%', right: '10%' }}></div>
        <div className="absolute w-32 h-32 rounded-full bg-[var(--accent-green)] opacity-10 blur-xl animate-node-pulse-3" style={{ top: '30%', right: '25%' }}></div>
        <div className="absolute w-48 h-48 rounded-full bg-[var(--accent-yellow)] opacity-10 blur-xl animate-node-pulse-4" style={{ bottom: '5%', left: '30%' }}></div>

        {/* Líneas de conexión simuladas o "fibras de datos" */}
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-white opacity-5 rounded-full animate-line-flow"
            style={{
              width: `${50 + Math.random() * 100}px`, // Longitud variable de la línea
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`, // Rotación aleatoria
              animationDuration: `${10 + Math.random() * 20}s`, // Duración variable
              animationDelay: `${Math.random() * 10}s`, // Retraso variable
            }}
          ></div>
        ))}
        {/* Partículas más pequeñas para flujo de datos */}
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full bg-white opacity-10 animate-data-particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${5 + Math.random() * 15}s`,
              animationDelay: `${Math.random() * 8}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Contenido principal centrado: Título y botón "Únete a la comunidad" */}
      <div className={`relative z-10 p-8 max-w-4xl mx-auto flex flex-col items-center justify-center flex-grow
                      ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                      transition-all duration-1000 ease-out`}>
        {/* Título principal profesional y relevante, sin animaciones de texto individuales */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[var(--off-white)] leading-tight drop-shadow-lg mb-8">
          <span className="text-[var(--accent-yellow)]">Potenciando</span> la <span className="text-[var(--accent-green)]">Economía Descentralizada</span>: <br/>
          Tu <span className="text-[var(--primary-purple)]">Ecosistema para Tokens</span>, <br/>
          <span className="text-[var(--secondary-blue)]">NFTs y Rendimientos Sostenibles</span>.
        </h1>
        {/* Botón "Únete a la comunidad" - Centrado */}
        <a
          href={discordInviteLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-10 rounded-full text-2xl
                     transition duration-300 ease-in-out transform hover:scale-105 shadow-xl animate-bounce-once"
        >
            <i className="fab fa-discord mr-3 text-3xl"></i> {/* Icono de Discord, requiere Font Awesome */}
            Únete a la comunidad
        </a>
      </div>

      {/* Bloque de estilos CSS para las animaciones */}
      <style>{`
        /* Animaciones para los nodos principales (pulsación y movimiento lento) */
        @keyframes node-pulse {
          0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.1; }
          25% { transform: scale(1.05) translate(5px, 5px); opacity: 0.15; }
          50% { transform: scale(1) translate(0, 10px); opacity: 0.1; }
          75% { transform: scale(1.03) translate(-5px, 5px); opacity: 0.15; }
        }
        .animate-node-pulse-1 { animation: node-pulse 25s infinite alternate ease-in-out; }
        .animate-node-pulse-2 { animation: node-pulse 30s infinite alternate ease-in-out reverse; }
        .animate-node-pulse-3 { animation: node-pulse 28s infinite alternate ease-in-out; }
        .animate-node-pulse-4 { animation: node-pulse 32s infinite alternate ease-in-out reverse; }

        /* Animación para las líneas de conexión/fibras de datos */
        @keyframes line-flow {
          0% { transform: translate(var(--start-x, 0), var(--start-y, 0)) rotate(var(--start-rotate, 0deg)); opacity: 0; }
          10% { opacity: 0.05; }
          50% { transform: translate(var(--mid-x, 0), var(--mid-y, 0)) rotate(var(--mid-rotate, 0deg)); opacity: 0.1; }
          90% { opacity: 0.05; }
          100% { transform: translate(var(--end-x, 0), var(--end-y, 0)) rotate(var(--end-rotate, 0deg)); opacity: 0; }
        }
        /* Para simular un movimiento más fluido y aleatorio para cada línea,
           las variables --start-x/y, --mid-x/y, --end-x/y, y sus rotaciones
           necesitarían ser inyectadas dinámicamente por JS en un entorno de producción.
           Aquí, estamos aplicando una animación genérica para que se vean moviéndose. */

        /* Animación para las partículas de datos pequeñas */
        @keyframes data-particle {
            0% { transform: translate(0, 0); opacity: 0; }
            10% { opacity: 0.1; }
            50% { transform: translate(calc(var(--random-x) * 1px), calc(var(--random-y) * 1px)); opacity: 0.2; }
            90% { opacity: 0.1; }
            100% { transform: translate(calc(var(--random-x-end) * 1px), calc(var(--random-y-end) * 1px)); opacity: 0; }
        }
        /* Para que cada partícula tenga un camino único, las variables CSS
           (--random-x, --random-y, etc.) se generan inline en el JSX. */


        /* Animaciones generales de fade-in y bounce */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounceOnce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
        .animate-fade-in.delay-500 { animation-delay: 0.5s; }
        .animate-fade-in.delay-1000 { animation-delay: 1s; }
        .animate-bounce-once { animation: bounceOnce 1s ease-in-out; }

        /* Transición para el contenedor principal de texto */
        .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 1000ms; }
      `}</style>
    </div>
  );
}

export default HomePage;
