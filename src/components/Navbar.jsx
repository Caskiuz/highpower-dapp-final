import React, { useState, useCallback } from "react";
import { formatUnits } from "viem";

export default function Navbar({
  isConnected,
  address,
  balanceData,
  hgpBalance,
  nftCount,
  connect,
  connectors,
  pendingConnector,
  disconnect,
  HGP_TOKEN_CONFIG
}) {
  const [copied, setCopied] = useState(false);

  const formatValue = (value, decimals = 18) => {
    if (typeof value === "bigint") {
      const num = parseFloat(formatUnits(value, decimals));
      if (num > 0 && num < 0.01) return num.toPrecision(2);
      return num.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    }
    return value;
  };

  const copyContractAddress = useCallback(() => {
    if (HGP_TOKEN_CONFIG?.address) {
      try {
        navigator.clipboard.writeText(HGP_TOKEN_CONFIG.address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        prompt("Copia la dirección del contrato manualmente:", HGP_TOKEN_CONFIG.address);
      }
    }
  }, [HGP_TOKEN_CONFIG]);

  // Animación digital: glow, partículas y gradiente
  const BlockchainGlow = () => (
    <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <span className="animate-pulse w-12 h-12 rounded-full bg-gradient-to-br from-primaryPurple via-secondaryBlue to-accentGreen opacity-40 blur-2xl"></span>
      <span className="animate-spin-slow absolute w-16 h-16 rounded-full border-2 border-dashed border-primaryPurple opacity-20"></span>
    </span>
  );

  return (
    <nav className="fixed top-0 left-0 w-full bg-[var(--dark-gray)]/95 backdrop-blur-lg px-2 sm:px-4 flex flex-row items-center justify-between z-40 shadow-lg border-b border-[var(--primary-purple)] h-auto min-h-[56px] sm:min-h-[68px] transition-all">
      {/* Logo y título */}
      <div className="flex items-center gap-2 sm:gap-3 relative">
        <span className="relative flex items-center">
          {/* SVG giratorio */}
          <span className="relative flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none"
              className="h-8 w-8 sm:h-10 sm:w-10 object-contain animate-spin-slow z-10 drop-shadow-lg">
              <rect x="0" y="0" width="40" height="40" rx="12" fill="#1C1C28" />
              <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle"
                fontFamily="Inter, Arial, sans-serif" fontSize="17" fontWeight="bold">
                <tspan fill="#8A2BE2">H</tspan>
                <tspan fill="#39FF14">G</tspan>
                <tspan fill="#FF4081">P</tspan>
              </text>
              <circle cx="20" cy="20" r="18" stroke="#6B46C1" strokeWidth="1.5" strokeOpacity="0.6" />
            </svg>
            <BlockchainGlow />
          </span>
          {/* Texto con gradiente */}
          <span
            className="ml-2 sm:ml-3 text-xl sm:text-3xl font-extrabold bg-gradient-to-r from-primaryPurple via-accentGreen to-secondaryBlue bg-clip-text text-transparent drop-shadow-[0_0_10px_#6B46C1] select-none"
            style={{
              letterSpacing: "0.02em",
              textShadow: "0 0 6px #6B46C1cc, 0 0 32px #6B46C199"
            }}
          >
            HighPower
          </span>
        </span>
      </div>
      {/* Tu lógica funcional original para wallet, balance, botones, etc. */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {isConnected ? (
          <div className="flex items-center gap-2">
            <span className="bg-gray-800 rounded px-2 py-1 text-xs text-[var(--accent-green)]">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
            <span className="bg-gray-800 rounded px-2 py-1 text-xs">{formatValue(balanceData?.value, 18)} tBNB</span>
            <span className="bg-gray-800 rounded px-2 py-1 text-xs">{formatValue(hgpBalance)} HGP</span>
            <span className="bg-orange-600 rounded px-2 py-1 text-xs">{nftCount} NFTs</span>
            <button onClick={disconnect} className="bg-red-600 hover:bg-red-700 text-white rounded px-3 py-1 text-xs font-bold">Desconectar</button>
          </div>
        ) : (
          <button onClick={connect} className="bg-[var(--primary-purple)] hover:bg-[var(--secondary-blue)] text-white rounded px-4 py-2 font-bold transition">Conectar Wallet</button>
        )}
      </div>
    </nav>
  );
}
