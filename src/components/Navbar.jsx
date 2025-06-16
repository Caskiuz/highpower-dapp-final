// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useConnect, useDisconnect } from 'wagmi';
import { bscTestnet } from 'wagmi/chains';
import { formatEther } from 'viem';

// La barra de navegación ahora recibe todas las props necesarias
function Navbar({ onNavigate, isConnected, address, balanceData, hgpBalance }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { connect, connectors, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();

  // Log para depuración de props en Navbar
  useEffect(() => {
    console.log("Navbar Props recibidas:", { isConnected, address, balanceData, hgpBalance });
  }, [isConnected, address, balanceData, hgpBalance]);

  const navItems = [
    { name: 'Dashboard', path: 'dashboard' },
    { name: 'Acerca de HighPower', path: 'about' },
    { name: 'Token $HGP', path: 'tokenomics' }, 
    { name: 'Rendimientos', path: 'yield' },
    { name: 'NFTs', path: 'nfts' },
    { name: 'Swap', path: 'swap' },
    { name: 'Gobernanza DAO', path: 'dao' },
    { name: 'Roadmap', path: 'roadmap' },
    { name: 'Tech Stack', path: 'tech' }, 
    { name: 'Contacto', path: 'contact' },
  ];

  return (
    // El contenedor principal de la navegación será fijo en la parte superior, con z-index alto
    <nav className="bg-gray-900 shadow-lg fixed top-0 z-40 w-full border-b border-purple-700">
      {/* PRIMERA FILA: Barra de Estado de Sesión (Logo + Info de Conexión) */}
      <div className="flex items-center justify-between flex-wrap w-full px-4 py-3 lg:px-8 bg-gray-800 border-b border-purple-600">
        {/* Logo/Título HighPower - Siempre a la izquierda en esta fila */}
        <div className="text-purple-400 text-3xl font-bold rounded-lg p-2 transition duration-300 hover:bg-gray-700 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          HighPower
        </div>

        {/* Barra de estado de sesión (Desktop) - Siempre a la derecha de esta fila */}
        <div className="ml-auto p-2 bg-gray-700 rounded-lg shadow-inner flex items-center space-x-3 border border-gray-600">
          {/* Indicador de conexión */}
          <div className={`w-4 h-4 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>

          {isConnected ? (
            <>
              <span className="text-gray-400 text-sm hidden sm:block truncate max-w-[100px]">
                {address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : 'Dirección...'}
              </span>
              <span className="text-yellow-300 text-sm hidden sm:block">
                {balanceData?.value !== undefined ? `${formatEther(balanceData.value).substring(0, Math.min(formatEther(balanceData.value).length, 5))} ${balanceData.symbol}` : '0.00 BNB'}
              </span>
              <span className="text-blue-300 text-sm hidden md:block"> {/* Ocultar en sm, mostrar en md */}
                {hgpBalance !== undefined ? `${hgpBalance.substring(0, Math.min(hgpBalance.length, 5))} HGP` : '0.00 HGP'}
              </span>
              <button
                onClick={disconnect}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg text-sm transition duration-300"
              >
                Desconectar
              </button>
            </>
          ) : (
            // Botones de conectar cuando no está conectado
            <div className="flex space-x-2">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => connect({ connector, chainId: bscTestnet.id })}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded-lg text-sm transition duration-300"
                  type="button"
                  disabled={pendingConnector?.id === connector.id}
                >
                  {connector.name}
                  {pendingConnector?.id === connector.id && ' (Conectando...)'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SEGUNDA FILA: Menú de Navegación (Solo enlaces) */}
      <div className="container mx-auto flex justify-center items-center py-2 lg:py-0 bg-gray-900">
        {/* Botón de menú para móviles - Visible solo en móviles para los enlaces */}
        <div className="block lg:hidden w-full text-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-300 focus:outline-none focus:text-white w-full py-2"
          >
            {isMenuOpen ? (
              <svg className="h-8 w-8 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            ) : (
              <svg className="h-8 w-8 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            )}
            <span className="ml-2">Menú</span>
          </button>
        </div>

        {/* Menú de navegación principal (Desktop y móvil colapsado) */}
        <div className={`w-full lg:flex lg:items-center lg:w-auto ${isMenuOpen ? 'block' : 'hidden'} flex-col lg:flex-row justify-center`}>
          {navItems.map((item) => (
            <a
              key={item.path}
              href={`#${item.path}`} 
              onClick={() => {
                onNavigate(item.path);
                setIsMenuOpen(false); // Cierra el menú al hacer clic en un enlace
              }}
              className="block mt-2 lg:inline-block lg:mt-0 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-purple-800 mx-2 text-center"
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
