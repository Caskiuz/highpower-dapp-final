import React, { useState, useCallback } from 'react';
import { formatUnits } from 'viem';

// Importa HGP_TOKEN_CONFIG desde el archivo centralizado para obtener la dirección del contrato
import { HGP_TOKEN_CONFIG } from '../constants/contract-config.js'; 

function Navbar({ isConnected, address, balanceData, hgpBalance, nftCount, connect, connectors, pendingConnector, disconnect }) {
  const [copied, setCopied] = useState(false);

  // Función para formatear BigInts a números legibles (con 18 decimales para HGP, 0 para NFTs)
  const formatValue = (value, decimals = 18) => {
    if (typeof value === 'bigint') {
      return parseFloat(formatUnits(value, decimals)).toFixed(2);
    }
    return value; // Si ya es string/number, lo devuelve tal cual
  };

  // Función para copiar la dirección del contrato
  const copyContractAddress = useCallback(() => {
    if (HGP_TOKEN_CONFIG.address) {
      try {
        // Usa document.execCommand('copy') por compatibilidad en entornos específicos (como iframes)
        const el = document.createElement('textarea');
        el.value = HGP_TOKEN_CONFIG.address;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Resetear estado de copiado después de 2 segundos
      } catch (err) {
        console.error('Error al copiar la dirección:', err);
        // Fallback si execCommand falla o no está disponible
        prompt('Copia la dirección del contrato manualmente:', HGP_TOKEN_CONFIG.address);
      }
    }
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-[var(--dark-gray)] p-4 flex items-center justify-between z-40 shadow-lg border-b border-[var(--primary-purple)] h-[72px]">
      {/* Logo y Título */}
      <div className="flex items-center space-x-3">
        {/* SVG del Logo de HighPower con 'HGP' - Integrado directamente */}
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 object-contain">
          <rect x="0" y="0" width="40" height="40" rx="8" fill="#1C1C28"/> {/* Fondo oscuro del logo */}

          <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" // Corregido: dominant-baseline -> dominantBaseline, text-anchor -> textAnchor
                fontFamily="Inter, Arial, sans-serif" fontSize="18" fontWeight="bold"> // Corregido: font-family -> fontFamily, font-size -> fontSize, font-weight -> fontWeight
            <tspan fill="#8A2BE2">H</tspan>
            <tspan fill="#39FF14">G</tspan>
            <tspan fill="#FF4081">P</tspan>
          </text>

          <circle cx="20" cy="20" r="18" stroke="#5F4B8B" strokeWidth="1" strokeOpacity="0.5"/> {/* Borde sutil */}
        </svg>

        <span className="text-3xl font-extrabold text-[var(--accent-green)] hidden md:block">HighPower</span>

        {/* Dirección del Contrato HGP con botón de copiar */}
        {HGP_TOKEN_CONFIG.address && (
          <div className="flex items-center ml-4 bg-gray-700 rounded-full px-3 py-1 shadow-inner border border-gray-600 text-sm">
            <span className="text-gray-400 mr-2 hidden lg:inline">Contrato HGP:</span>
            <span className="text-white font-semibold mr-2 cursor-pointer" onClick={copyContractAddress} title="Click para copiar">
              {`${HGP_TOKEN_CONFIG.address.substring(0, 6)}...${HGP_TOKEN_CONFIG.address.substring(HGP_TOKEN_CONFIG.address.length - 4)}`}
            </span>
            <button
              onClick={copyContractAddress}
              className="px-2 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded-full text-xs transition duration-200"
            >
              {copied ? '¡Copiado!' : <i className="fas fa-copy"></i>}
            </button>
          </div>
        )}
      </div>

      {/* Información de la Billetera y Conexión */}
      <div className="flex items-center space-x-4">
        {isConnected && address ? (
          <div className="flex items-center bg-gray-700 rounded-full px-4 py-2 shadow-inner border border-gray-600 text-sm">
            {/* Indicador de Conexión - Verde conectado */}
            <span className="w-3 h-3 rounded-full bg-green-500 mr-2 shadow-lg animate-pulse"></span>
            
            <span className="text-gray-300 mr-2 hidden sm:inline">Tu Saldo:</span>
            {balanceData && (
              <span className="text-white font-semibold px-3 py-1 bg-gray-600 rounded-full mr-2">
                {formatValue(balanceData.value, balanceData.decimals)} {balanceData.symbol}
              </span>
            )}
            {hgpBalance !== undefined && (
              <span className="text-white font-semibold px-3 py-1 bg-purple-600 rounded-full mr-2">
                {hgpBalance} HGP
              </span>
            )}
            {nftCount !== undefined && (
              <span className="text-white font-semibold px-3 py-1 bg-orange-600 rounded-full">
                {nftCount} NFTs
              </span>
            )}
            <button
              onClick={disconnect}
              className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold text-sm transition duration-300 transform hover:scale-105"
            >
              Desconectar
            </button>
          </div>
        ) : (
          <div className="relative flex items-center">
            {/* Indicador de Desconexión - Rojo desconectado */}
            <span className="w-3 h-3 rounded-full bg-red-500 mr-2 shadow-lg"></span>

            {/* Botón de conexión para Wagmi - Esto mostrará el modal de WalletConnect */}
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                type="button"
                className="px-6 py-2 bg-[var(--primary-purple)] hover:bg-[var(--secondary-blue)] text-white rounded-full font-bold text-lg shadow-lg transition duration-300 transform hover:scale-105"
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
