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
        {/* Nodos grandes que representan "hubs" o "bloques" */}
        <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] rounded-full opacity-5 blur-3xl bg-[var(--primary-purple)] animate-node-flow-1"></div>
        <div className="absolute bottom-[15%] right-[15%] w-[350px] h-[350px] rounded-full opacity-5 blur-3xl bg-[var(--secondary-blue)] animate-node-flow-2"></div>
        <div className="absolute top-[60%] left-[30%] w-[250px] h-[250px] rounded-full opacity-5 blur-3xl bg-[var(--accent-green)] animate-node-flow-3"></div>
        <div className="absolute top-[25%] right-[20%] w-[400px] h-[400px] rounded-full opacity-5 blur-3xl bg-[var(--accent-yellow)] animate-node-flow-4"></div>

        {/* Pequeñas partículas/puntos de datos que fluyen entre los nodos */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white opacity-10 blur-sm animate-data-flow"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${10 + Math.random() * 20}s`, // Variar duración
              animationDelay: `${Math.random() * 10}s`, // Variar retraso para desfase
              opacity: `${0.05 + Math.random() * 0.1}`, // Variar opacidad
            }}
          ></div>
        ))}
      </div>

      {/* Contenido principal centrado: Título y botón "Únete a la comunidad" */}
      <div className={`relative z-10 p-8 max-w-4xl mx-auto flex flex-col items-center justify-center flex-grow
                      ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                      transition-all duration-1000 ease-out`}>
        {/* Título principal profesional y relevante */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[var(--off-white)] leading-tight drop-shadow-lg mb-8">
          <span className="text-[var(--accent-yellow)]">Potenciando</span> la <span className="text-[var(--accent-green)]">Economía Web3</span>: <br/>
          Tu <span className="text-[var(--primary-purple)]">Ecosistema para Tokens</span>, <br/>
          <span className="text-[var(--secondary-blue)]">NFTs y Rendimientos Descentralizados</span>.
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
        /* Animaciones de movimiento continuo para los "nodos" grandes */
        @keyframes node-flow-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(150px, 80px) scale(1.05); }
          50% { transform: translate(0, 160px) scale(0.95); }
          75% { transform: translate(-150px, 80px) scale(1.02); }
        }
        @keyframes node-flow-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-180px, -90px) scale(1.03); }
          50% { transform: translate(0, -180px) scale(0.98); }
          75% { transform: translate(180px, -90px) scale(1.01); }
        }
        @keyframes node-flow-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(100px, -120px) scale(0.97); }
          50% { transform: translate(200px, 0) scale(1.04); }
          75% { transform: translate(100px, 120px) scale(0.99); }
        }
        @keyframes node-flow-4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-120px, 100px) scale(1.02); }
          50% { transform: translate(0, 200px) scale(0.96); }
          75% { transform: translate(120px, 100px) scale(1.01); }
        }

        /* Animación para las pequeñas partículas/puntos de datos */
        @keyframes data-flow {
          0% { transform: translate(0, 0); opacity: 0.1; }
          25% { transform: translate(calc(var(--random-x-1) * 1px), calc(var(--random-y-1) * 1px)); opacity: 0.15; }
          50% { transform: translate(calc(var(--random-x-2) * 1px), calc(var(--random-y-2) * 1px)); opacity: 0.1; }
          75% { transform: translate(calc(var(--random-x-3) * 1px), calc(var(--random-y-3) * 1px)); opacity: 0.15; }
          100% { transform: translate(0, 0); opacity: 0.1; }
        }
        /* Las variables --random-x/y se generarán por JS para cada partícula */
        /* Para fines de demostración, esto se puede simular o se pueden usar valores aleatorios en CSS */
        /* Dado que estamos en React, los valores se inyectan inline para cada partícula. */

        /* Animaciones de entrada de contenido principal */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bounceOnce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
        .animate-fade-in.delay-500 { animation-delay: 0.5s; }
        .animate-fade-in.delay-1000 { animation-delay: 1s; }
        .animate-bounce-once { animation: bounceOnce 1s ease-in-out; }

        /* Transición para el contenedor principal */
        .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 1000ms; }
      `}</style>
    </div>
  );
}

export default HomePage;
