import React, { useState, useCallback } from "react";
import { formatUnits } from "viem"; // Si usas ethers, puedes cambiar a: import { formatUnits } from "ethers";

// MODAL WALLET ESTILO PANCAKESWAP
const WALLET_LIST = [
  {
    section: "Recientemente usada",
    wallets: [
      {
        id: "metamask",
        label: "MetaMask",
        logo: "https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg",
      },
    ],
  },
  {
    section: "Principales wallets",
    wallets: [
      {
        id: "trustwallet",
        label: "Trust Wallet",
        logo: "https://seeklogo.com/images/T/trust-wallet-logo-FA02A9A75B-seeklogo.com.png",
      },
      {
        id: "okx",
        label: "OKX Wallet",
        logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/17208.png",
      },
      {
        id: "binancechain",
        label: "Binance Chain",
        logo: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
      },
    ],
  },
  {
    section: "Más wallets",
    wallets: [
      {
        id: "coinbase",
        label: "Coinbase Wallet",
        logo: "https://avatars.githubusercontent.com/u/1885080?s=200&v=4",
      },
      {
        id: "walletconnect",
        label: "WalletConnect",
        logo: "https://raw.githubusercontent.com/walletconnect/walletconnect-assets/master/logo/svg/walletconnect-logo.svg",
      },
      {
        id: "opera",
        label: "Opera Wallet",
        logo: "https://seeklogo.com/images/O/opera-wallet-logo-57E7F8B8B0-seeklogo.com.png",
      },
      {
        id: "brave",
        label: "Brave Wallet",
        logo: "https://avatars.githubusercontent.com/u/36902187?s=200&v=4",
      },
      {
        id: "rabby",
        label: "Rabby Wallet",
        logo: "https://raw.githubusercontent.com/RabbyHub/RabbyWallet/main/assets/icon-512.png",
      },
      {
        id: "math",
        label: "MathWallet",
        logo: "https://mathwallet.org/images/logo-icon.svg",
      },
    ],
  },
];

function WalletModal({ open, onClose, onSelectWallet }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#181635] rounded-3xl shadow-2xl flex flex-col md:flex-row p-2 md:p-0 max-w-3xl w-full animate-fade-in">
        {/* Selección de wallet */}
        <div className="w-full md:w-[420px] p-6 flex flex-col">
          <button
            onClick={onClose}
            className="self-end text-white/60 hover:text-primary-purple transition mb-2"
            aria-label="Cerrar"
          >
            <i className="fas fa-times text-2xl" />
          </button>
          <h2 className="text-2xl mb-3 font-bold text-white">Conectar Wallet</h2>
          {WALLET_LIST.map((group) =>
            <div key={group.section} className="mb-6">
              <div className="text-sm text-gray-400 mb-2">{group.section}</div>
              <div className="grid grid-cols-3 gap-3">
                {group.wallets.map((w) =>
                  <button
                    key={w.id}
                    className="flex flex-col items-center bg-[#23204a] hover:bg-primary-purple/70 px-2 py-3 rounded-2xl shadow group transition"
                    onClick={() => { onSelectWallet && onSelectWallet(w.id); onClose(); }}
                  >
                    <img
                      src={w.logo}
                      alt={w.label}
                      className="w-12 h-12 rounded-full bg-white mb-2 border-2 border-white shadow-md object-contain"
                      onError={e => { e.target.src = "https://cdn-icons-png.flaticon.com/512/8188/8188743.png"; }}
                    />
                    <span className="text-white font-semibold text-xs">{w.label}</span>
                  </button>
                )}
              </div>
            </div>
          )}
          <button
            onClick={onClose}
            className="mt-2 w-full py-2 rounded-full border border-primary-purple text-primary-purple hover:bg-primary-purple/10 transition font-semibold"
          >
            Cancelar
          </button>
        </div>
        {/* Lado derecho (ilustración, opcional) */}
        <div className="hidden md:flex flex-col items-center justify-center w-[320px] bg-[#201d3d] rounded-3xl m-3">
          <img
            src="https://raw.githubusercontent.com/pancakeswap/pancake-frontend/master/public/images/wallets.svg"
            alt="Ilustración conexión"
            className="w-44 mt-12 mb-2"
            draggable={false}
          />
          <span className="text-xl font-bold text-primary-purple mb-2 text-center">¿Aún no tienes una wallet?</span>
          <span className="text-sm text-white/80 px-3 pb-12 text-center">Aprende cómo conectar tu wallet a HighPower y comienza a explorar el ecosistema blockchain.</span>
        </div>
      </div>
      {/* Animaciones */}
      <style>{`
        .animate-fade-in { animation: fadeIn 0.5s cubic-bezier(.22,1,.36,1) 1 both; }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95);}
          to { opacity: 1; transform: scale(1);}
        }
      `}</style>
    </div>
  );
}

// ------------------ NAVBAR PRINCIPAL ------------------
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
  HGP_TOKEN_CONFIG // pásalo como prop o importa, según tu proyecto
}) {
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Formatea balance amigable y seguro para BigInt
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

  // Copia contrato
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

  // Mapea walletId a el conector real
  const connectorMap = {
    metamask: ["MetaMask", "injected", "metamask"],
    walletconnect: ["WalletConnect", "walletconnect"],
    coinbase: ["Coinbase Wallet", "coinbase"],
    trustwallet: ["Trust Wallet", "trustwallet"],
    okx: ["OKX Wallet", "okx"],
    binancechain: ["Binance Chain Wallet", "binancechain"],
    opera: ["Opera Wallet", "opera"],
    brave: ["Brave Wallet", "brave"],
    rabby: ["Rabby Wallet", "rabby"],
    math: ["MathWallet", "mathwallet"],
  };

  const handleSelectWallet = walletId => {
    const names = connectorMap[walletId] || [walletId];
    const connector = connectors?.find(
      c => names.includes(c.name) || names.includes(c.id)
    );
    if (connector) {
      connect({ connector });
    } else {
      alert("Conector no disponible en esta red o navegador.");
    }
    setWalletModalOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-darkGray/95 backdrop-blur-lg px-2 sm:px-4 flex flex-row items-center justify-between z-40 shadow-lg border-b border-primary-purple h-auto min-h-[56px] sm:min-h-[68px] transition-all">
        {/* Logo y título */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="relative flex items-center">
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none" className="h-8 w-8 sm:h-10 sm:w-10 object-contain animate-spin-slow">
              <rect x="0" y="0" width="40" height="40" rx="12" fill="#1C1C28"/>
              <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle"
                fontFamily="Inter, Arial, sans-serif" fontSize="17" fontWeight="bold">
                <tspan fill="#8A2BE2">H</tspan>
                <tspan fill="#39FF14">G</tspan>
                <tspan fill="#FF4081">P</tspan>
              </text>
              <circle cx="20" cy="20" r="18" stroke="#8A2BE2" strokeWidth="1.5" strokeOpacity="0.45"/>
            </svg>
            <span className="absolute -inset-1 rounded-full bg-primary-purple opacity-20 blur-sm z-[-1]"></span>
          </span>
          <span className="text-lg sm:text-2xl font-extrabold text-accentGreen tracking-tight drop-shadow-lg select-none">HighPower</span>
          {HGP_TOKEN_CONFIG?.address && (
            <div className="hidden md:flex items-center ml-2 bg-gray-700 rounded-full px-2 py-0.5 shadow-inner border border-gray-600 text-xs">
              <span className="text-gray-400 mr-1">Contrato:</span>
              <span className="text-white font-semibold mr-1 cursor-pointer" onClick={copyContractAddress} title="Click para copiar">
                {`${HGP_TOKEN_CONFIG.address.substring(0, 4)}...${HGP_TOKEN_CONFIG.address.substring(HGP_TOKEN_CONFIG.address.length - 3)}`}
              </span>
              <button
                onClick={copyContractAddress}
                className="px-1 py-0 bg-primary-purple hover:bg-primary-purple/80 text-white rounded-full text-xs transition duration-200"
                title="Copiar dirección"
              >
                {copied ? "¡Copiado!" : <i className="fas fa-copy"></i>}
              </button>
            </div>
          )}
        </div>
        {/* Info de wallet conectada o botón */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-end">
          {isConnected && address ? (
            <div className="flex items-center bg-gray-800/90 rounded-full px-2 py-1 sm:px-4 sm:py-2 shadow-inner border border-primary-purple text-xs sm:text-sm flex-wrap">
              <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-400 mr-1 sm:mr-2 shadow-lg animate-pulse"></span>
              <span className="text-white font-semibold">{address.slice(0, 6)}...{address.slice(-4)}</span>
              {balanceData && (
                <span className="text-white font-semibold px-2 py-0.5 bg-gray-600 rounded-full mr-1 my-0.5">
                  {formatValue(balanceData.value, balanceData.decimals)} {balanceData.symbol}
                </span>
              )}
              {hgpBalance !== undefined && (
                <span className="text-white font-semibold px-2 py-0.5 bg-primary-purple rounded-full mr-1 my-0.5">
                  {hgpBalance} HGP
                </span>
              )}
              {nftCount !== undefined && (
                <span className="text-white font-semibold px-2 py-0.5 bg-orange-600 rounded-full my-0.5">
                  {nftCount} NFTs
                </span>
              )}
              <button
                onClick={disconnect}
                className="ml-2 sm:ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold text-xs sm:text-sm transition duration-300 hover:scale-105 shadow"
              >
                <i className="fas fa-sign-out-alt mr-1" /> Desconectar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setWalletModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2 bg-primary-purple hover:bg-primary-purple/90 text-white rounded-full font-bold text-lg shadow-xl transition duration-300 hover:scale-105"
            >
              <i className="fas fa-wallet text-lg" />
              Conectar Wallet
            </button>
          )}
        </div>
        {/* Contrato HGP: visible en mobile */}
        {HGP_TOKEN_CONFIG?.address && (
          <div className="flex md:hidden items-center mt-2 absolute left-1/2 -translate-x-1/2 bottom-[-30px] bg-gray-700 rounded-full px-2 py-0.5 shadow-inner border border-gray-600 text-xs z-40">
            <span className="text-gray-400 mr-1">Contrato:</span>
            <span className="text-white font-semibold mr-1 cursor-pointer" onClick={copyContractAddress} title="Click para copiar">
              {`${HGP_TOKEN_CONFIG.address.substring(0, 4)}...${HGP_TOKEN_CONFIG.address.substring(HGP_TOKEN_CONFIG.address.length - 3)}`}
            </span>
            <button
              onClick={copyContractAddress}
              className="px-1 py-0 bg-primary-purple hover:bg-primary-purple/80 text-white rounded-full text-xs transition duration-200"
              title="Copiar dirección"
            >
              {copied ? "¡Copiado!" : <i className="fas fa-copy"></i>}
            </button>
          </div>
        )}
        {/* Animación personalizada */}
        <style>{`
          .animate-spin-slow {
            animation: spin 11s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}</style>
      </nav>
      {/* Modal de conexión */}
      <WalletModal
        open={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        onSelectWallet={handleSelectWallet}
      />
      <div className="h-[72px]" />
    </>
  );
}
