import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useReadContract } from 'wagmi'; // Solo necesitamos useReadContract para getReserves y totalSupply

import {
  HGP_TOKEN_CONFIG,
  LP_TOKEN_CONTRACT_ADDRESS,
  PANCAKE_PAIR_ABI,
} from '../constants/contract-config';

// Constantes para los decimales de los tokens
const HGP_DECIMALS = 18;
const WBNB_DECIMALS = 18; // WBNB sigue siendo el par en PancakeSwap

function TradingAndAnalyticsSection({ isConnected, userAddress, hgpBalance, bnbBalance, showCustomModal }) {
  const [buyAmountHGP, setBuyAmountHGP] = useState('');
  const [sellAmountHGP, setSellAmountHGP] = useState('');

  // --- Lectura de datos del contrato del par PancakeSwap (para precio y liquidez actuales) ---
  // Esto es una lectura de un único valor (reservas), no un historial de logs, por lo que debería funcionar.
  const { data: reservesRaw } = useReadContract({
    address: LP_TOKEN_CONTRACT_ADDRESS,
    abi: PANCAKE_PAIR_ABI,
    functionName: 'getReserves',
    query: {
      enabled: !!LP_TOKEN_CONTRACT_ADDRESS,
      watch: true, // Actualiza en tiempo real si hay cambios en las reservas
    }
  });

  // Suministro total de HGP para Market Cap
  const { data: hgpTotalSupplyRaw } = useReadContract({
    ...HGP_TOKEN_CONFIG,
    functionName: 'totalSupply',
    query: {
      enabled: !!HGP_TOKEN_CONFIG.address,
      watch: true,
    }
  });
  const hgpTotalSupply = hgpTotalSupplyRaw ? formatUnits(hgpTotalSupplyRaw, HGP_DECIMALS) : '0';


  // --- Cálculos de métricas: Precio, Liquidez, Capitalización de Mercado ---
  const { currentPrice, totalLiquidezBNB, marketCapUSD } = useMemo(() => {
    if (!reservesRaw || !hgpTotalSupplyRaw) {
      return { currentPrice: '0.00', totalLiquidezBNB: '0.00', marketCapUSD: '0.00' };
    }

    const reserveHGP = parseFloat(formatUnits(reservesRaw[0], HGP_DECIMALS)); // reserve0 (HGP)
    const reserveWBNB = parseFloat(formatUnits(reservesRaw[1], WBNB_DECIMALS)); // reserve1 (WBNB)

    let price = 0;
    if (reserveHGP > 0) {
      price = reserveWBNB / reserveHGP; // Precio de HGP en términos de WBNB
    }

    const liquidityBNB = reserveWBNB * 2; // Asumiendo que el pool está balanceado 50/50
    const calculatedMarketCap = parseFloat(hgpTotalSupply) * price;

    return {
      currentPrice: price.toFixed(6), // Precio de HGP en WBNB
      totalLiquidezBNB: liquidityBNB.toFixed(2),
      marketCapUSD: calculatedMarketCap.toFixed(2)
    };
  }, [reservesRaw, hgpTotalSupplyRaw, hgpTotalSupply]);


  // URLs para redirigir a PancakeSwap - Usando BNB nativo
  const pancakSwapBuyURL = useMemo(() => {
    return `https://pancakeswap.finance/swap?outputCurrency=${HGP_TOKEN_CONFIG.address}&inputCurrency=BNB`;
  }, [HGP_TOKEN_CONFIG.address]);

  const pancakSwapSellURL = useMemo(() => {
    return `https://pancakeswap.finance/swap?inputCurrency=${HGP_TOKEN_CONFIG.address}&outputCurrency=BNB`;
  }, [HGP_TOKEN_CONFIG.address]);

  // Funciones de formateo auxiliares (para balances del usuario)
  const formatTokenPrecise = (amount, decimals = 18, precision = 4) => {
    if (typeof amount === 'bigint') {
      return parseFloat(formatUnits(amount, decimals)).toFixed(precision);
    }
    return '0.0000';
  };


  return (
    <section id="trading-analytics" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-8 text-center border-2 border-[var(--primary-purple)]">
      <h2 className="text-4xl font-bold text-[var(--primary-purple)] mb-6">Trading y Analíticas $HGP</h2>
      <p className="text-[var(--light-gray-text)] text-lg mb-8">
        Consulta las métricas actuales del pool de $HGP en PancakeSwap y realiza tus operaciones.
      </p>

      {!isConnected && (
        <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-red-500 text-center">
          <p className="text-red-400 text-xl font-semibold">
            ¡Conecta tu billetera para ver las métricas en tiempo real y acceder a las operaciones!
          </p>
        </div>
      )}

      {isConnected && (
        <>
          {/* Métricas en Tiempo Real */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900 p-6 rounded-lg shadow-inner border border-[var(--accent-green)]">
              <h3 className="text-2xl font-bold text-[var(--accent-green)] mb-2">Precio Actual $HGP (por WBNB)</h3>
              <p className="text-4xl font-bold text-[var(--off-white)]">{currentPrice} WBNB</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-inner border border-[var(--secondary-blue)]">
              <h3 className="text-2xl font-bold text-[var(--secondary-blue)] mb-2">Liquidez Total (en WBNB)</h3>
              <p className="text-4xl font-bold text-[var(--off-white)]">{totalLiquidezBNB} WBNB</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-inner border border-[var(--accent-yellow)]">
              <h3 className="text-2xl font-bold text-[var(--accent-yellow)] mb-2">Capitalización de Mercado</h3>
              <p className="text-4xl font-bold text-[var(--off-white)]">${marketCapUSD}</p>
            </div>
          </div>

          {/* Tus balances actuales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
            <div className="bg-gray-900 p-6 rounded-lg shadow-inner border border-[var(--accent-green)]">
              <h3 className="text-2xl font-bold text-[var(--accent-green)] mb-2">Tu Balance $HGP</h3>
              <p className="text-4xl font-bold text-[var(--off-white)]">{formatTokenPrecise(hgpBalance, HGP_DECIMALS)} HGP</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-inner border border-[var(--secondary-blue)]">
              <h3 className="text-2xl font-bold text-[var(--secondary-blue)] mb-2">Tu Balance BNB</h3>
              <p className="text-4xl font-bold text-[var(--off-white)]">{formatTokenPrecise(bnbBalance, WBNB_DECIMALS)} BNB</p>
            </div>
          </div>

          {/* Gráfica de Precios (Placeholder) */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-xl border border-[var(--primary-purple)] mb-8">
            <h3 className="text-3xl font-bold text-[var(--off-white)] mb-4">Historial de Precios $HGP</h3>
            <div className="w-full h-80 bg-gray-800 rounded-lg flex items-center justify-center p-4 relative overflow-hidden">
              {/* Placeholder visual de la gráfica */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                 {/* Ejemplo de un SVG muy simple que simula una gráfica */}
                <svg width="80%" height="80%" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 0 40 Q 20 20 40 30 T 80 10 Q 90 5 100 15" stroke="var(--accent-green)" strokeWidth="2" fill="none" />
                  <path d="M 0 45 Q 25 25 50 35 T 85 15 Q 95 10 100 20" stroke="var(--primary-purple)" strokeWidth="1" fill="none" strokeDasharray="4 2" />
                </svg>
              </div>
              <p className="text-yellow-400 text-center text-lg font-semibold relative z-10">
                Debido a las limitaciones de los nodos RPC públicos y la falta de servicios de datos para tokens de testnet, **no es posible mostrar un gráfico de historial de precios interactivo con datos reales** en esta DApp.
                <br/><br/>
                Esta es una limitación inherente al entorno de prueba. En la red principal (mainnet), se integrarían gráficas de proveedores como CoinGecko o TradingView.
              </p>
            </div>
             <p className="text-gray-500 text-sm mt-4">
              *La visualización de la gráfica es solo un placeholder. Las métricas en la parte superior sí son en tiempo real.
            </p>
          </div>

          {/* Sección de Trading (Redirigiendo a PancakeSwap) */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-xl border border-[var(--secondary-blue)] mb-8">
            <h3 className="text-3xl font-bold text-[var(--off-white)] mb-6">Realizar Operaciones de Trading</h3>
            <p className="text-gray-400 text-lg mb-4">
              Para comprar o vender $HGP, serás redirigido a la interfaz de swap de PancakeSwap.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Comprar HGP */}
              <div className="bg-gray-800 p-6 rounded-lg border border-[var(--accent-green)] flex flex-col items-center">
                <h4 className="text-2xl font-bold text-[var(--accent-green)] mb-4">Comprar $HGP</h4>
                <p className="text-gray-400 mb-4 text-center">Intercambia BNB por HGP en PancakeSwap.</p>
                <input
                  type="number"
                  value={buyAmountHGP}
                  onChange={(e) => setBuyAmountHGP(e.target.value)}
                  placeholder="Cantidad deseada de HGP"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-green-500 mb-4 text-center"
                  readOnly
                />
                <a
                  href={pancakSwapBuyURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[var(--accent-green)] hover:bg-green-700 text-[var(--dark-gray)] font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center justify-center mt-auto"
                >
                  <i className="fas fa-external-link-alt mr-2"></i> Ir a PancakeSwap para Comprar
                </a>
              </div>

              {/* Vender HGP */}
              <div className="bg-gray-800 p-6 rounded-lg border border-red-600 flex flex-col items-center">
                <h4 className="text-2xl font-bold text-red-400 mb-4">Vender $HGP</h4>
                <p className="text-gray-400 mb-4 text-center">Intercambia HGP por BNB en PancakeSwap.</p>
                <input
                  type="number"
                  value={sellAmountHGP}
                  onChange={(e) => setSellAmountHGP(e.target.value)}
                  placeholder="Cantidad deseada de HGP a vender"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500 mb-4 text-center"
                  readOnly
                />
                <a
                  href={pancakSwapSellURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center justify-center mt-auto"
                >
                  <i className="fas fa-external-link-alt mr-2"></i> Ir a PancakeSwap para Vender
                </a>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-4">
              *Asegúrate de tener conectada la misma billetera en PancakeSwap.
            </p>
          </div>
        </>
      )}
    </section>
  );
}

export default TradingAndAnalyticsSection;
