import React, { useState, useCallback } from 'react';
import { formatUnits } from 'viem';

import { HGP_TOKEN_CONFIG } from '../constants/contract-config.js'; 

function Navbar({ isConnected, address, balanceData, hgpBalance, nftCount, connect, connectors, pendingConnector, disconnect }) {
  const [copied, setCopied] = useState(false);

  // Función para formatear BigInts a números legibles (con 18 decimales para HGP, 0 para NFTs)
  const formatValue = (value, decimals = 18) => {
    if (typeof value === 'bigint') {
      // Ajuste de precisión para valores muy pequeños en el navbar si es necesario
      const num = parseFloat(formatUnits(value, decimals));
      return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }
    return value;
  };

  // Función para copiar la dirección del contrato
  const copyContractAddress = useCallback(() => {
    if (HGP_TOKEN_CONFIG.address) {
      try {
        const el = document.createElement('textarea');
        el.value = HGP_TOKEN_CONFIG.address;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Error al copiar la dirección:', err);
        prompt('Copia la dirección del contrato manualmente:', HGP_TOKEN_CONFIG.address);
      }
    }
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-[var(--dark-gray)] p-3 md:p-4 flex flex-col sm:flex-row items-center justify-between z-40 shadow-lg border-b border-[var(--primary-purple)] h-auto sm:h-[72px]">
      {/* Logo y Título */}
      <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-0">
        <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 object-contain">
          <rect x="0" y="0" width="40" height="40" rx="8" fill="#1C1C28"/>
          <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" 
                fontFamily="Inter, Arial, sans-serif" fontSize="16" fontWeight="bold">
            <tspan fill="#8A2BE2">H</tspan>
            <tspan fill="#39FF14">G</tspan>
            <tspan fill="#FF4081">P</tspan>
          </text>
          <circle cx="20" cy="20" r="18" stroke="#5F4B8B" strokeWidth="1" strokeOpacity="0.5"/>
        </svg>

        <span className="text-2xl sm:text-3xl font-extrabold text-[var(--accent-green)]">HighPower</span>

        {/* Dirección del Contrato HGP con botón de copiar */}
        {HGP_TOKEN_CONFIG.address && (
          <div className="flex items-center ml-2 sm:ml-4 bg-gray-700 rounded-full px-2 py-1 shadow-inner border border-gray-600 text-xs sm:text-sm">
            <span className="text-gray-400 mr-1 hidden lg:inline">Contrato HGP:</span>
            <span className="text-white font-semibold mr-1 cursor-pointer" onClick={copyContractAddress} title="Click para copiar">
              {`${HGP_TOKEN_CONFIG.address.substring(0, 4)}...${HGP_TOKEN_CONFIG.address.substring(HGP_TOKEN_CONFIG.address.length - 3)}`}
            </span>
            <button
              onClick={copyContractAddress}
              className="px-2 py-0.5 bg-purple-700 hover:bg-purple-800 text-white rounded-full text-xs transition duration-200"
            >
              {copied ? '¡Copiado!' : <i className="fas fa-copy"></i>}
            </button>
          </div>
        )}
      </div>

      {/* Información de la Billetera y Conexión */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {isConnected && address ? (
          <div className="flex items-center bg-gray-700 rounded-full px-2 py-1 sm:px-4 sm:py-2 shadow-inner border border-gray-600 text-xs sm:text-sm flex-wrap justify-center sm:justify-start">
            <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 mr-1 sm:mr-2 shadow-lg animate-pulse"></span>
            
            <span className="text-gray-300 mr-1 hidden sm:inline">Tu Saldo:</span>
            {balanceData && (
              <span className="text-white font-semibold px-2 py-0.5 bg-gray-600 rounded-full mr-1">
                {formatValue(balanceData.value, balanceData.decimals)} {balanceData.symbol}
              </span>
            )}
            {hgpBalance !== undefined && (
              <span className="text-white font-semibold px-2 py-0.5 bg-purple-600 rounded-full mr-1">
                {hgpBalance} HGP
              </span>
            )}
            {nftCount !== undefined && (
              <span className="text-white font-semibold px-2 py-0.5 bg-orange-600 rounded-full">
                {nftCount} NFTs
              </span>
            )}
            <button
              onClick={disconnect}
              className="ml-2 sm:ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold text-xs sm:text-sm transition duration-300 transform hover:scale-105"
            >
              Desconectar
            </button>
          </div>
        ) : (
          <div className="relative flex items-center">
            {/* Indicador de Desconexión - Rojo desconectado */}
            <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 mr-1 sm:mr-2 shadow-lg"></span>

            {/* Botón de conexión para Wagmi - Esto mostrará el modal de WalletConnect */}
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                type="button"
                className="px-4 py-1.5 sm:px-6 sm:py-2 bg-[var(--primary-purple)] hover:bg-[var(--secondary-blue)] text-white rounded-full font-bold text-sm sm:text-lg shadow-lg transition duration-300 transform hover:scale-105"
              >
                {pendingConnector?.id === connector.id ? 'Conectando...' : 'Conectar Wallet'}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
