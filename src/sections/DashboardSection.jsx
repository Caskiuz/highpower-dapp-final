// src/sections/DashboardSection.jsx
import React from 'react';
import { formatEther } from 'viem';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'; // Importar componentes de Recharts
import InteractiveCards from '../components/InteractiveCards';

function DashboardSection({ address, balanceData, hgpBalance, nftCount, isConnected, onNavigate, totalHGPSupply }) {

  // Datos simulados para el gráfico de TVL (Total Value Locked)
  const tvlData = [
    { name: 'Día 1', TVL: 100000 },
    { name: 'Día 7', TVL: 120000 },
    { name: 'Día 14', TVL: 150000 },
    { name: 'Día 21', TVL: 170000 },
    { name: 'Día 28', TVL: 200000 },
    { name: 'Día 35', TVL: 230000 },
    { name: 'Día 42', TVL: 260000 },
    { name: 'Día 49', TVL: 300000 },
  ];

  return (
    <section id="dashboard" className="p-6 bg-[var(--dark-gray)] rounded-3xl shadow-xl text-center flex flex-col items-center justify-center min-h-[400px]">
      
      {!isConnected ? (
        <div className="space-y-4 w-full max-w-sm">
          <h3 className="text-3xl font-semibold mb-6 text-[var(--light-gray-text)]">¡Conecta tu billetera para acceder al Dashboard!</h3>
          <p className="text-gray-400 text-lg">Usa el botón "Conectar Billetera" en la barra superior derecha.</p>
        </div>
      ) : (
        <div className="space-y-8 w-full"> 
          <h2 className="text-5xl font-bold text-[var(--accent-yellow)] drop-shadow-lg mb-8">¡Bienvenido al Dashboard HighPower!</h2>
          
          {/* Sección de Balances y Métricas Clave */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-[var(--primary-purple)] to-[var(--secondary-blue)] p-6 rounded-2xl shadow-lg border border-[var(--accent-green)] flex flex-col items-center">
              <i className="fas fa-wallet text-4xl text-[var(--off-white)] mb-3"></i>
              <h3 className="text-xl font-semibold text-[var(--off-white)] mb-2">Tu Balance BNB/ETH</h3>
              <p className="text-3xl font-bold text-[var(--accent-yellow)]">
                {balanceData ? `${formatEther(balanceData.value).substring(0, Math.min(formatEther(balanceData.value).length, 8))} ${balanceData.symbol}` : 'Cargando...'}
              </p>
            </div>
            <div className="bg-gradient-to-br from-[var(--secondary-blue)] to-[var(--primary-purple)] p-6 rounded-2xl shadow-lg border border-[var(--accent-yellow)] flex flex-col items-center">
              <i className="fas fa-coins text-4xl text-[var(--off-white)] mb-3"></i>
              <h3 className="text-xl font-semibold text-[var(--off-white)] mb-2">Tu Saldo $HGP</h3>
              <p className="text-3xl font-bold text-[var(--accent-yellow)]">
                {hgpBalance} HGP
              </p>
            </div>
            <div className="bg-gradient-to-br from-[var(--primary-purple)] to-[var(--secondary-blue)] p-6 rounded-2xl shadow-lg border border-[var(--secondary-blue)] flex flex-col items-center">
              <i className="fas fa-image text-4xl text-[var(--off-white)] mb-3"></i>
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
            <InteractiveCards onNavigate={onNavigate} />
          </div>

          {/* Gráfico de TVL del Ecosistema */}
          <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-[var(--accent-green)] mb-8">
            <h3 className="text-4xl font-bold text-[var(--off-white)] mb-6 text-left">
              Evolución del Valor Total Bloqueado (TVL)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={tvlData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="var(--light-gray-text)" />
                <YAxis stroke="var(--light-gray-text)" tickFormatter={(value) => `$${value / 1000}K`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--dark-gray)', border: '1px solid var(--primary-purple)', borderRadius: '8px' }}
                  labelStyle={{ color: 'var(--accent-yellow)' }}
                  itemStyle={{ color: 'var(--accent-green)' }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'TVL']}
                />
                <Line type="monotone" dataKey="TVL" stroke="var(--accent-green)" activeDot={{ r: 8 }} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Sección de Marketplace de NFTs */}
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

          {/* Estado General del Ecosistema - Ahora muestra métricas con valores simulados */}
          <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-[var(--primary-purple)] mt-8">
            <h3 className="text-4xl font-bold text-[var(--primary-purple)] mb-6 text-left">
              Métricas Clave del Ecosistema
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">Suministro Total $HGP:</p>
                <p className="text-xl font-bold text-[var(--off-white)]">{totalHGPSupply} HGP</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">Total Value Locked (TVL):</p>
                <p className="text-xl font-bold text-[var(--off-white)]">$300,000</p> {/* Hardcoded */}
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">Volumen de Trading (24h):</p>
                <p className="text-xl font-bold text-[var(--off-white)]">$75,000</p> {/* Hardcoded */}
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">NFTs Minteados:</p>
                <p className="text-xl font-bold text-[var(--off-white)]">1,250</p> {/* Hardcoded */}
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">Holders de $HGP:</p>
                <p className="text-xl font-bold text-[var(--off-white)]">5,800</p> {/* Hardcoded */}
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">Propuestas DAO Activas:</p>
                <p className="text-xl font-bold text-[var(--off-white)]">3</p> {/* Hardcoded */}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default DashboardSection;
