// src/components/Navbar.jsx
import React, { useState } from 'react';
import { formatUnits } from 'viem';
import { useConnect, useAccount, useBalance, useDisconnect } from 'wagmi';
import CustomModal from './CustomModal'; 

// Importa la dirección del contrato HGP desde App.jsx para usarla aquí
import { HGP_ERC20_ADDRESS } from '../App'; 

function Navbar({ isConnected, address, balanceData, hgpBalance, nftCount, connect, connectors, pendingConnector }) {
  const [showConnectOptions, setShowConnectOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const { disconnect } = useDisconnect();

  const showInfoModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const closeInfoModal = () => {
    setShowModal(false);
    setModalMessage('');
  };

  const copyAddressToClipboard = (addr, label) => {
    const tempInput = document.createElement('textarea');
    tempInput.value = addr;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showInfoModal(`¡Dirección de ${label} copiada al portapapeles!`);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md p-4 lg:px-8 z-40 flex justify-between items-center border-b border-purple-700 shadow-xl h-[72px]">
      {showModal && <CustomModal message={modalMessage} onClose={closeInfoModal} />}

      {/* Contenedor Izquierdo: Logo y Dirección del Contrato */}
      <div className="flex items-center space-x-4">
        {/* Logo o Título de la DApp */}
        <div className="text-purple-400 text-3xl font-bold transition duration-300 hover:text-purple-300 cursor-pointer animate-fade-in delay-500">
          HighPower
        </div>

        {/* Información del Contrato del Token HGP - Siempre visible y copiable */}
        <div className="flex items-center space-x-2 bg-gray-800 p-2 px-3 rounded-full border border-blue-600 shadow-md">
          <span className="text-gray-400 text-xs sm:text-sm font-semibold whitespace-nowrap">Contrato $HGP:</span>
          <span 
            className="text-white font-mono text-xs sm:text-sm cursor-pointer hover:text-blue-300 transition-colors duration-200 flex items-center"
            onClick={() => copyAddressToClipboard(HGP_ERC20_ADDRESS, '$HGP Token')}
            title={`Copiar dirección del contrato $HGP: ${HGP_ERC20_ADDRESS}`}
            tabIndex="0"
          >
            {/* Truncar dirección para pantallas pequeñas, mostrar más en grandes */}
            <span className="hidden sm:inline">{HGP_ERC20_ADDRESS.slice(0, 10)}...{HGP_ERC20_ADDRESS.slice(-8)}</span>
            <span className="inline sm:hidden">{HGP_ERC20_ADDRESS.slice(0, 6)}...{HGP_ERC20_ADDRESS.slice(-4)}</span>
            <i className="fas fa-copy ml-2 text-xs text-gray-500 hover:text-blue-400"></i>
          </span>
        </div>
      </div>

      {/* Área de la billetera del usuario */}
      <div className="relative flex items-center space-x-4">
        {isConnected && address ? (
          <div className="flex items-center space-x-3 bg-gray-800 p-2 pl-4 rounded-full border border-purple-600 shadow-lg">
            {/* Círculo de estado de conexión */}
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} transition-colors duration-300`}></div>
            
            {/* Balances del usuario - Horizontales */}
            <div className="flex flex-row items-center space-x-4 text-sm">
              <span className="text-green-400 font-semibold whitespace-nowrap">
                {balanceData ? `${formatUnits(balanceData.value, balanceData.decimals).substring(0, Math.min(formatUnits(balanceData.value, balanceData.decimals).length, 8))} ${balanceData.symbol}` : 'Cargando...'}
              </span>
              <span className="text-yellow-400 font-semibold whitespace-nowrap">
                {hgpBalance} HGP
              </span>
              <span className="text-blue-400 font-semibold whitespace-nowrap">
                {nftCount} NFTs
              </span>
            </div>
            
            {/* Botón de Desconectar */}
            <button
              onClick={() => disconnect()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full text-sm
                         transition duration-300 ease-in-out transform hover:scale-105 shadow-md ml-4"
            >
              Desconectar
            </button>
          </div>
        ) : (
          <div className="relative flex items-center"> {/* Asegura que el círculo de estado esté presente incluso desconectado */}
            {/* Círculo de estado de conexión para el estado desconectado */}
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} mr-3 transition-colors duration-300`}></div>
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
