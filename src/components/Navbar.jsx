// src/components/Navbar.jsx
import React, { useState } from 'react';
import { formatUnits } from 'viem';
import { useConnect, useAccount, useBalance, useDisconnect } from 'wagmi'; // Importar hooks de wagmi
import CustomModal from './CustomModal'; // Asegúrate de importar CustomModal

function Navbar({ isConnected, address, balanceData, hgpBalance, connect, connectors, pendingConnector }) {
  const [showConnectOptions, setShowConnectOptions] = useState(false);
  const [showModal, setShowModal] = useState(false); // Estado para el modal de mensajes
  const [modalMessage, setModalMessage] = useState(''); // Mensaje del modal

  const { disconnect } = useDisconnect(); // Hook para desconectar

  // Función para mostrar el modal con un mensaje
  const showInfoModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const closeInfoModal = () => {
    setShowModal(false);
    setModalMessage('');
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md p-4 lg:px-8 z-40 flex justify-between items-center border-b border-purple-700 shadow-xl h-[72px]">
      {showModal && <CustomModal message={modalMessage} onClose={closeInfoModal} />} {/* Renderizar el modal */}

      {/* Logo o Título de la DApp */}
      <div className="text-purple-400 text-3xl font-bold transition duration-300 hover:text-purple-300 cursor-pointer animate-fade-in delay-500">
        HighPower
      </div>

      {/* Área de la billetera */}
      <div className="relative flex items-center space-x-4">
        {isConnected && address ? (
          <>
            <div className="flex flex-col text-right text-sm">
              <span className="text-gray-300">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              <span className="text-green-400 font-semibold">
                {balanceData ? `${formatUnits(balanceData.value, balanceData.decimals).substring(0, Math.min(formatUnits(balanceData.value, balanceData.decimals).length, 8))} ${balanceData.symbol}` : 'Cargando...'}
              </span>
              <span className="text-yellow-400 font-semibold">
                {hgpBalance} HGP
              </span>
            </div>
            <button
              onClick={() => disconnect()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full text-sm
                         transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
            >
              Desconectar
            </button>
          </>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowConnectOptions(!showConnectOptions)}
              className="bg-[var(--accent-green)] hover:bg-[var(--secondary-blue)] text-gray-900 font-bold py-3 px-6 rounded-full text-lg
                         transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)]"
            >
              Conectar Billetera
            </button>

            {showConnectOptions && (
              <div className="absolute right-0 mt-3 w-64 bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-purple-700 animate-slide-down">
                <p className="text-gray-300 px-4 py-2 text-sm">Selecciona una billetera:</p>
                {connectors.map((connector) => (
                  <button
                    key={connector.uid}
                    onClick={() => connect({ connector })}
                    className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 ease-in-out"
                    type="button"
                  >
                    {connector.name}
                    {pendingConnector?.id === connector.id && ' (conectando...)'}
                  </button>
                ))}
                {/* Estilos para animar la aparición del menú */}
                <style>{`
                  @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                  .animate-slide-down {
                    animation: slideDown 0.3s ease-out forwards;
                  }
                `}</style>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
