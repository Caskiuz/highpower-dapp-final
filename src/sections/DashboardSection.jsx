// src/sections/DashboardSection.jsx
import React from 'react';
import { formatEther } from 'viem';
import InteractiveCards from '../components/InteractiveCards'; // Importa el componente de tarjetas interactivas

function DashboardSection({ address, balanceData, hgpBalance, nftCount, isConnected, onNavigate, totalHGPSupply }) {
  return (
    // Dashboard se extiende, ahora dentro del layout flex de App.jsx
    <section id="dashboard" className="p-6 bg-[var(--dark-gray)] rounded-3xl shadow-xl text-center flex flex-col items-center justify-center min-h-[400px]">
      
      {!isConnected ? (
        // Si no está conectado, muestra un mensaje central indicando dónde conectar
        <div className="space-y-4 w-full max-w-sm">
          <h3 className="text-3xl font-semibold mb-6 text-[var(--light-gray-text)]">¡Conecta tu billetera para acceder al Dashboard!</h3>
          <p className="text-gray-400 text-lg">Usa el botón "Conectar Billetera" en la barra superior derecha.</p>
        </div>
      ) : (
        // Si está conectado, muestra el contenido del dashboard
        <div className="space-y-8 w-full"> {/* Espaciado general */}
          <h2 className="text-5xl font-bold text-[var(--accent-yellow)] drop-shadow-lg mb-8">¡Bienvenido al Dashboard HighPower!</h2>
          
          {/* Sección de Balances y Métricas Clave - Más detallada y con iconos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Balance BNB/ETH */}
            <div className="bg-gradient-to-br from-[var(--primary-purple)] to-[var(--secondary-blue)] p-6 rounded-2xl shadow-lg border border-[var(--accent-green)] flex flex-col items-center">
              <i className="fas fa-wallet text-4xl text-[var(--off-white)] mb-3"></i>
              <h3 className="text-xl font-semibold text-[var(--off-white)] mb-2">Tu Balance BNB/ETH</h3>
              <p className="text-3xl font-bold text-[var(--accent-yellow)]">
                {balanceData ? `${formatEther(balanceData.value).substring(0, Math.min(formatEther(balanceData.value).length, 8))} ${balanceData.symbol}` : 'Cargando...'}
              </p>
            </div>
            {/* Saldo $HGP */}
            <div className="bg-gradient-to-br from-[var(--secondary-blue)] to-[var(--primary-purple)] p-6 rounded-2xl shadow-lg border border-[var(--accent-yellow)] flex flex-col items-center">
              <i className="fas fa-coins text-4xl text-[var(--off-white)] mb-3"></i>
              <h3 className="text-xl font-semibold text-[var(--off-white)] mb-2">Tu Saldo $HGP</h3>
              <p className="text-3xl font-bold text-[var(--accent-yellow)]">
                {hgpBalance} HGP
              </p>
            </div>
            {/* Tus NFTs HighPower */}
            <div className="bg-gradient-to-br from-[var(--primary-purple)] to-[var(--secondary-blue)] p-6 rounded-2xl shadow-lg border border-[var(--secondary-blue)] flex flex-col items-center">
              <i className="fas fa-image text-4xl text-[var(--off-white)] mb-3"></i>
              <h3 className="text-xl font-semibold text-[var(--off-white)] mb-2">Tus NFTs HighPower</h3>
              <p className="text-3xl font-bold text-[var(--accent-green)]">
                {nftCount} NFTs
              </p>
            </div>
          </div>

          {/* Nueva Sección Interactiva de Llamadas a la Acción - Más destacada */}
          <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-blue-500 mb-8">
            <h3 className="text-4xl font-bold text-[var(--accent-green)] mb-6 text-left">
              Explora Oportunidades en HighPower
            </h3>
            <InteractiveCards onNavigate={onNavigate} /> {/* Renderiza las tarjetas interactivas */}
          </div>

          {/* Sección de Marketplace de NFTs (antes "Zona de Juegos") */}
          <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-purple-500">
            <h3 className="text-4xl font-bold text-[var(--accent-yellow)] mb-6 text-left">
              Marketplace de NFTs
            </h3>
            <div className="text-[var(--light-gray-text)] text-lg h-64 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg">
              <p>Aquí se mostrarán los NFTs más populares y los lanzamientos, ¡próximamente!</p>
            </div>
            <button
              onClick={() => onNavigate('nfts')}
              className="mt-6 bg-[var(--accent-green)] hover:bg-[var(--secondary-blue)] text-[var(--dark-gray)] font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 text-lg shadow-md"
            >
              Ver todo el Marketplace
            </button>
          </div>

          {/* Estado General del Ecosistema - Ahora es un panel de métricas más completo */}
          <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-[var(--primary-purple)] mt-8">
            <h3 className="text-4xl font-bold text-[var(--primary-purple)] mb-6 text-left">
              Métricas del Ecosistema
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">Suministro Total $HGP:</p>
                <p className="text-xl font-bold text-[var(--off-white)]">{totalHGPSupply} HGP</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">Total Value Locked (TVL):</p>
                <p className="text-xl font-bold text-[var(--off-white)]">$PENDIENTE_CONECTAR_API</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">Volumen de Trading (24h):</p>
                <p className="text-xl font-bold text-[var(--off-white)]">$PENDIENTE_CONECTAR_API</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">NFTs Minteados:</p>
                <p className="text-xl font-bold text-[var(--off-white)]">PENDIENTE_CONECTAR_API</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">Holders de $HGP:</p>
                <p className="text-xl font-bold text-[var(--off-white)]">PENDIENTE_CONECTAR_API</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">Propuestas DAO Activas:</p>
                <p className="text-xl font-bold text-[var(--off-white)]">PENDIENTE_CONECTAR_API</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default DashboardSection;
