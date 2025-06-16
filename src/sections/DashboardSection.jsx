// src/sections/DashboardSection.jsx
import React from 'react';
import { formatEther } from 'viem';

function DashboardSection({ address, balanceData, hgpBalance, nftCount, isConnected, onNavigate, totalHGPSupply }) {
  return (
    <section id="dashboard" className="p-6 bg-[var(--dark-gray)] rounded-3xl shadow-xl text-center flex flex-col items-center justify-center min-h-[400px] border-2 border-blue-500">
      <h2 className="text-5xl font-bold mb-8 text-[var(--accent-green)] drop-shadow-lg">Dashboard HighPower</h2>
      {!isConnected ? (
        // Si no está conectado, muestra un mensaje central indicando dónde conectar
        <div className="space-y-4 w-full max-w-sm">
          <h3 className="text-3xl font-semibold mb-6 text-[var(--light-gray-text)]">¡Conecta tu billetera para acceder al Dashboard!</h3>
          <p className="text-gray-400 text-lg">Usa los botones de conexión en la barra superior.</p>
        </div>
      ) : (
        // Si está conectado, muestra el contenido del dashboard
        <div className="space-y-6 w-full max-w-2xl">
          <h3 className="text-4xl font-bold text-[var(--accent-yellow)] mb-6">¡Bienvenido, {address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : 'Usuario'}!</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tarjeta de Saldo BNB/ETH */}
            <div className="bg-gradient-to-br from-[var(--primary-purple)] to-[var(--secondary-blue)] p-8 rounded-2xl shadow-xl border border-[var(--accent-green)] transform transition duration-300 hover:scale-[1.02]">
              <h3 className="text-2xl font-semibold text-[var(--off-white)] mb-4">Balance BNB/ETH</h3>
              <p className="text-4xl font-bold text-[var(--accent-yellow)]">
                {balanceData ? `${formatEther(balanceData.value).substring(0, Math.min(formatEther(balanceData.value).length, 8))} ${balanceData.symbol}` : 'Cargando...'}
              </p>
            </div>

            {/* Tarjeta de Saldo HGP */}
            <div className="bg-gradient-to-br from-[var(--secondary-blue)] to-[var(--primary-purple)] p-8 rounded-2xl shadow-xl border border-[var(--accent-yellow)] transform transition duration-300 hover:scale-[1.02]">
              <h3 className="text-2xl font-semibold text-[var(--off-white)] mb-4">Saldo de $HGP</h3>
              <p className="text-4xl font-bold text-[var(--accent-yellow)]">
                {hgpBalance} HGP
              </p>
            </div>

            {/* Tarjeta de Conteo de NFTs (¡Aplicando el mismo gradiente para consistencia!) */}
            <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-[var(--primary-purple)] to-[var(--secondary-blue)] p-8 rounded-2xl shadow-xl border border-[var(--secondary-blue)] transform transition duration-300 hover:scale-[1.02]">
                <h3 className="text-2xl font-semibold text-[var(--off-white)] mb-4">Tus NFTs HighPower</h3>
                <p className="text-4xl font-bold text-[var(--accent-green)]">
                    {nftCount} NFTs
                </p>
            </div>
          </div>
          
          <div className="bg-[var(--primary-purple)] p-6 rounded-2xl shadow-md border border-[var(--accent-green)]">
            <p className="text-[var(--light-gray-text)] text-lg mb-2 font-semibold">Estado General del Ecosistema:</p>
            <ul className="list-disc list-inside text-left text-[var(--off-white)] text-md space-y-2">
              <li><strong>Suministro Total $HGP:</strong> {totalHGPSupply} HGP</li>
              <li><strong>Volumen de Trading (24h):</strong> $PENDIENTE_CONECTAR_API</li>
              <li><strong>Liquidez Total Bloqueada (TVL):</strong> $PENDIENTE_CONECTAR_API</li>
              <li><strong>Último NFT acuñado:</strong> #PENDIENTE_CONECTAR_API</li>
            </ul>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => onNavigate('swap')}
              className="bg-[var(--accent-green)] hover:bg-[var(--secondary-blue)] text-[var(--dark-gray)] font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 text-lg shadow-md"
            >
              Ir a Swap
            </button>
            <button
              onClick={() => onNavigate('nfts')}
              className="bg-[var(--accent-yellow)] hover:bg-[var(--primary-purple)] text-[var(--dark-gray)] font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 text-lg shadow-md"
            >
              Explorar NFTs
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default DashboardSection;
