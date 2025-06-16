// src/sections/DashboardSection.jsx
import React from 'react';
import { formatEther } from 'viem';
import InteractiveCards from '../components/InteractiveCards'; // Importa el nuevo componente

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
          
          {/* Sección de Balances - Más concisa y destacada */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-[var(--primary-purple)] to-[var(--secondary-blue)] p-6 rounded-2xl shadow-lg border border-[var(--accent-green)]">
              <h3 className="text-xl font-semibold text-[var(--off-white)] mb-2">Tu Balance BNB/ETH</h3>
              <p className="text-3xl font-bold text-[var(--accent-yellow)]">
                {balanceData ? `${formatEther(balanceData.value).substring(0, Math.min(formatEther(balanceData.value).length, 8))} ${balanceData.symbol}` : 'Cargando...'}
              </p>
            </div>
            <div className="bg-gradient-to-br from-[var(--secondary-blue)] to-[var(--primary-purple)] p-6 rounded-2xl shadow-lg border border-[var(--accent-yellow)]">
              <h3 className="text-xl font-semibold text-[var(--off-white)] mb-2">Tu Saldo $HGP</h3>
              <p className="text-3xl font-bold text-[var(--accent-yellow)]">
                {hgpBalance} HGP
              </p>
            </div>
            <div className="bg-gradient-to-br from-[var(--primary-purple)] to-[var(--secondary-blue)] p-6 rounded-2xl shadow-lg border border-[var(--secondary-blue)]">
              <h3 className="text-xl font-semibold text-[var(--off-white)] mb-2">Tus NFTs HighPower</h3>
              <p className="text-3xl font-bold text-[var(--accent-green)]">
                {nftCount} NFTs
              </p>
            </div>
          </div>

          {/* Nueva Sección Interactiva de Llamadas a la Acción */}
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

          {/* Estado General del Ecosistema - Puede ser un módulo más pequeño si es necesario */}
          <div className="bg-[var(--primary-purple)] p-6 rounded-2xl shadow-md border border-[var(--accent-green)] mt-8">
            <p className="text-[var(--light-gray-text)] text-lg mb-2 font-semibold">Estado General del Ecosistema:</p>
            <ul className="list-disc list-inside text-left text-[var(--off-white)] text-md space-y-2">
              <li><strong>Suministro Total $HGP:</strong> {totalHGPSupply} HGP</li>
              <li><strong>Volumen de Trading (24h):</strong> $PENDIENTE_CONECTAR_API</li>
              <li><strong>Liquidez Total Bloqueada (TVL):</strong> $PENDIENTE_CONECTAR_API</li>
              <li><strong>Último NFT acuñado:</strong> #PENDIENTE_CONECTAR_API</li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

export default DashboardSection;
