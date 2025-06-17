import React, { useState, useEffect } from 'react';
import { formatUnits } from 'viem';
import { useReadContract } from 'wagmi';

// Importa las configuraciones de tus contratos y constantes desde el archivo centralizado
import {
  HGP_TOKEN_CONFIG,
  STAKING_CONTRACT_CONFIG,
  NFT_CONTRACT_CONFIG,
  DAO_CONTRACT_CONFIG, // Para obtener el conteo de propuestas si es necesario
  SIMULATED_APR_PERCENTAGE,
} from '../constants/contract-config.js';

function DashboardSection({
  isConnected,
  userAddress,
  onNavigate,
  balanceData, // Balance BNB nativo (BigInt)
  hgpBalance, // Balance HGP del usuario (BigInt)
  nftCount,   // Cantidad de NFTs del usuario (BigInt)
  publicClient, // Cliente público para llamadas de lectura adicionales
}) {
  // --- LECTURA DE DATOS DE CONTRATOS ---
  // Staking: Cantidad stakeada por el usuario
  const { data: userStakedAmount, refetch: refetchUserStakedAmount } = useReadContract({
    ...STAKING_CONTRACT_CONFIG,
    functionName: 'stakedAmount',
    args: [userAddress],
    query: {
      enabled: isConnected && !!userAddress && !!STAKING_CONTRACT_CONFIG.address,
      watch: true,
    },
  });

  // Staking: Recompensas pendientes del usuario
  const { data: pendingRewards, refetch: refetchPendingRewards } = useReadContract({
    ...STAKING_CONTRACT_CONFIG,
    functionName: 'earned',
    args: [userAddress],
    query: {
      enabled: isConnected && !!userAddress && !!STAKING_CONTRACT_CONFIG.address,
      watch: true,
    },
  });

  // DAO: Conteo de la próxima propuesta (para estimar el total de propuestas)
  const { data: nextProposalIdData, refetch: refetchNextProposalId } = useReadContract({
    ...DAO_CONTRACT_CONFIG,
    functionName: 'nextProposalId',
    query: {
      enabled: isConnected && !!DAO_CONTRACT_CONFIG.address,
      watch: true,
    }
  });
  const totalProposals = nextProposalIdData ? Number(nextProposalIdData) - 1 : 0;


  useEffect(() => {
    // Refrescar datos cuando la conexión o la dirección cambian
    if (isConnected && userAddress) {
      refetchUserStakedAmount();
      refetchPendingRewards();
      refetchNextProposalId();
    }
  }, [isConnected, userAddress, refetchUserStakedAmount, refetchPendingRewards, refetchNextProposalId]);


  // Función para formatear BigInts a números legibles (con 18 decimales por defecto)
  const formatTokenAmount = (amount, decimals = 18) => {
    return amount ? parseFloat(formatUnits(amount, decimals)).toFixed(2) : '0.00';
  };

  // Datos formateados para la UI
  const formattedHgpBalance = formatTokenAmount(hgpBalance);
  const formattedBnbBalance = balanceData ? parseFloat(formatUnits(balanceData.value, balanceData.decimals)).toFixed(4) : '0.0000';
  const formattedNftCount = nftCount ? Number(nftCount).toString() : '0';
  const formattedUserStakedAmount = formatTokenAmount(userStakedAmount);
  const formattedPendingRewards = formatTokenAmount(pendingRewards);

  // --- Cálculos de ROI y Rendimiento (Simulados inicialmente) ---
  const aprPercentage = SIMULATED_APR_PERCENTAGE; // Usamos la constante del config
  
  // Calcular ROI (Return on Investment) simple: (Recompensas / Staked) * 100
  const roiPercentage = formattedUserStakedAmount === '0.00' 
    ? '0.00' 
    : ((parseFloat(formattedPendingRewards) / parseFloat(formattedUserStakedAmount)) * 100).toFixed(2);

  // Calcular rendimiento anual estimado (simplificado)
  const estimatedAnnualRewards = (parseFloat(formattedUserStakedAmount) * (aprPercentage / 100)).toFixed(2);
  const estimatedMonthlyRewards = (estimatedAnnualRewards / 12).toFixed(2);
  const estimatedDailyRewards = (estimatedAnnualRewards / 365).toFixed(2);

  return (
    <section id="dashboard" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-8 text-center border-2 border-[var(--primary-purple)]">
      <h2 className="text-4xl font-bold text-[var(--primary-purple)] mb-8">Tu Dashboard de Inversor HighPower</h2>
      <p className="text-[var(--light-gray-text)] text-lg mb-10">
        Una visión completa de tus activos y rendimientos en el ecosistema descentralizado.
      </p>

      {!isConnected && (
        <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-red-500 text-center mb-8">
          <p className="text-red-400 text-xl font-semibold">
            ¡Conecta tu billetera para acceder a tu dashboard personalizado!
          </p>
        </div>
      )}

      {isConnected && (
        <>
          {/* Fila de Tarjetas de Resumen Global */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Tarjeta: Balance HGP */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-[var(--primary-purple)] flex flex-col items-center justify-center">
              <i className="fas fa-coins text-[var(--accent-green)] text-4xl mb-3"></i>
              <h3 className="text-xl font-semibold text-[var(--off-white)] mb-2">Tu Saldo HGP</h3>
              <p className="text-3xl font-bold text-white">{formattedHgpBalance} HGP</p>
            </div>

            {/* Tarjeta: Balance BNB */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-[var(--secondary-blue)] flex flex-col items-center justify-center">
              <i className="fas fa-wallet text-[var(--accent-yellow)] text-4xl mb-3"></i>
              <h3 className="text-xl font-semibold text-[var(--off-white)] mb-2">Tu Balance BNB (Testnet)</h3>
              <p className="text-3xl font-bold text-white">{formattedBnbBalance} tBNB</p>
            </div>

            {/* Tarjeta: NFTs Poseídos */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-[var(--accent-green)] flex flex-col items-center justify-center">
              <i className="fas fa-gem text-purple-400 text-4xl mb-3"></i>
              <h3 className="text-xl font-semibold text-[var(--off-white)] mb-2">Tus NFTs</h3>
              <p className="text-3xl font-bold text-white">{formattedNftCount} NFTs</p>
            </div>

            {/* Tarjeta: Total HGP Stakeado */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-[var(--primary-purple)] flex flex-col items-center justify-center">
              <i className="fas fa-piggy-bank text-[var(--accent-pink)] text-4xl mb-3"></i>
              <h3 className="text-xl font-semibold text-[var(--off-white)] mb-2">HGP Stakeado</h3>
              <p className="text-3xl font-bold text-white">{formattedUserStakedAmount} HGP</p>
            </div>
          </div>

          {/* Sección de Rendimiento de Staking */}
          <div className="bg-gray-800 p-8 rounded-3xl shadow-xl border border-[var(--secondary-blue)] mb-10">
            <h3 className="text-3xl font-bold text-[var(--off-white)] mb-6 flex items-center justify-center">
              <i className="fas fa-chart-line text-[var(--accent-green)] mr-3"></i>
              Rendimiento de Staking $HGP
            </h3>
            <p className="text-gray-400 mb-6">Detalles de tus inversiones en Staking y recompensas acumuladas.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-8">
              <div className="bg-gray-900 p-5 rounded-lg border border-gray-700 flex flex-col items-start">
                <span className="text-gray-400 text-sm">APR Actual</span>
                <p className="text-3xl font-bold text-[var(--accent-green)] mt-1">{aprPercentage}%</p>
              </div>
              <div className="bg-gray-900 p-5 rounded-lg border border-gray-700 flex flex-col items-start">
                <span className="text-gray-400 text-sm">Recompensas Pendientes</span>
                <p className="text-3xl font-bold text-[var(--accent-yellow)] mt-1">{formattedPendingRewards} HGP</p>
              </div>
              <div className="bg-gray-900 p-5 rounded-lg border border-gray-700 flex flex-col items-start">
                <span className="text-gray-400 text-sm">ROI (Basado en Recompensas)</span>
                <p className="text-3xl font-bold text-[var(--accent-pink)] mt-1">{roiPercentage}%</p>
              </div>
            </div>

            <div className="bg-gray-900 p-5 rounded-lg border border-gray-700 text-left mb-8">
              <h4 className="text-xl font-semibold text-[var(--off-white)] mb-3">Ganancias Estimadas</h4>
              <ul className="text-gray-300 space-y-2">
                <li><span className="font-bold">Diarias:</span> {estimatedDailyRewards} HGP</li>
                <li><span className="font-bold">Mensuales:</span> {estimatedMonthlyRewards} HGP</li>
                <li><span className="font-bold">Anuales:</span> {estimatedAnnualRewards} HGP</li>
              </ul>
              <p className="text-gray-500 text-sm mt-3">*Las ganancias estimadas son aproximadas y pueden variar.</p>
            </div>

            <button
              onClick={() => onNavigate('yield')}
              className="mt-6 px-8 py-3 bg-[var(--primary-purple)] hover:bg-[var(--secondary-blue)] text-white font-bold rounded-full text-lg transition duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center mx-auto"
            >
              <i className="fas fa-arrow-right mr-3"></i>
              Ir a Mecanismos de Rendimiento
            </button>
          </div>

          {/* Sección de Acciones Rápidas y Visión General */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tarjeta: Visión General de NFTs */}
            <div className="bg-gray-800 p-6 rounded-3xl shadow-lg border border-[var(--accent-green)] flex flex-col items-center justify-center">
              <i className="fas fa-palette text-purple-400 text-5xl mb-4"></i>
              <h3 className="text-2xl font-bold text-[var(--off-white)] mb-3">Tus Activos NFT</h3>
              <p className="text-xl text-gray-300 mb-4">{formattedNftCount} NFTs en tu colección.</p>
              {/* Navega a la sección de NFTs (Galería, no Marketplace) */}
              <button
                onClick={() => onNavigate('nfts')} 
                className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full transition duration-300 transform hover:scale-105 shadow-md"
              >
                <i className="fas fa-eye mr-2"></i>
                Ver Galería NFT
              </button>
            </div>

            {/* Tarjeta: Participa en la Gobernanza (DAO) */}
            <div className="bg-gray-800 p-6 rounded-3xl shadow-lg border border-[var(--accent-yellow)] flex flex-col items-center justify-center">
              <i className="fas fa-users-cog text-[var(--accent-yellow)] text-5xl mb-4"></i>
              <h3 className="text-2xl font-bold text-[var(--off-white)] mb-3">Gobernanza DAO</h3>
              <p className="text-xl text-gray-300 mb-4">{totalProposals} propuestas disponibles.</p>
              <button
                onClick={() => onNavigate('dao')}
                className="mt-4 px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-full transition duration-300 transform hover:scale-105 shadow-md"
              >
                <i className="fas fa-vote-yea mr-2"></i>
                Ir al DAO
              </button>
            </div>

            {/* Tarjeta: Intercambia y Gestiona HGP */}
            <div className="bg-gray-800 p-6 rounded-3xl shadow-lg border border-[var(--primary-purple)] flex flex-col items-center justify-center">
              <i className="fas fa-exchange-alt text-[var(--primary-purple)] text-5xl mb-4"></i>
              <h3 className="text-2xl font-bold text-[var(--off-white)] mb-3">Intercambiar HGP</h3>
              <p className="text-xl text-gray-300 mb-4">Convierte y gestiona tus tokens HGP.</p>
              <button
                onClick={() => onNavigate('swap')}
                className="mt-4 px-6 py-2 bg-[var(--primary-purple)] hover:bg-[var(--secondary-blue)] text-white font-semibold rounded-full transition duration-300 transform hover:scale-105 shadow-md"
              >
                <i className="fas fa-sync-alt mr-2"></i>
                Ir a Swap
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default DashboardSection;
