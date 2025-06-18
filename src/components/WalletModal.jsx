import React from "react";

// Puedes expandir y personalizar tus wallets aquí
const WALLET_LIST = [
  // Recientemente usada (ejemplo: MetaMask; puedes poner la lógica real)
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
  // Top Wallets
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
  // Más wallets
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

export default function WalletModal({ open, onClose, onSelectWallet }) {
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
                    onClick={() => onSelectWallet && onSelectWallet(w.id)}
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
        {/* Lado derecho (opcional: ilustración) */}
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
