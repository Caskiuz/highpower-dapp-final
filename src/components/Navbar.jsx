// src/components/Navbar.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useConnect, useDisconnect } from 'wagmi';
import { bscTestnet } from 'wagmi/chains';
import { formatEther } from 'viem';

function Navbar({ isConnected, address, balanceData, hgpBalance }) {
  const { connect, connectors, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();

  // Dirección de contrato de ejemplo para copiar (puedes cambiarla por tu HGP Token address si quieres)
  const contractAddressToDisplay = "0x03Fd2cE62B4BB54f09716f9588A5E13bC0756773"; // HighPower Token (HGP) address
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(contractAddressToDisplay)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000); // Reset después de 2 segundos
        })
        .catch(err => {
          console.error('Error al copiar:', err);
          // Fallback para navegadores antiguos o entornos sin navigator.clipboard
          const textArea = document.createElement("textarea");
          textArea.value = contractAddressToDisplay;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy'); // Este método es compatible con más entornos
          textArea.remove();
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
    } else {
      // Fallback si navigator.clipboard no está disponible
      const textArea = document.createElement("textarea");
      textArea.value = contractAddressToDisplay;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [contractAddressToDisplay]);

  return (
    // Barra superior fija con ancho completo, bg-gray-900, y un padding adecuado
    <nav className="fixed top-0 left-0 w-full bg-gray-900 px-4 py-3 z-40 shadow-lg border-b border-purple-700">
      <div className="container mx-auto flex items-center justify-between">
        {/* Lado Izquierdo: Logo HighPower y Dirección de Contrato */}
        <div className="flex items-center space-x-4">
          {/* Logo HighPower */}
          <div className="text-purple-400 text-3xl font-bold rounded-lg p-2 transition duration-300 hover:bg-gray-800 cursor-pointer">
            HighPower
          </div>

          {/* Barra de Contrato/Dirección (visible en desktop) */}
          <div className="hidden md:flex items-center bg-gray-800 rounded-full p-2 space-x-2 border border-gray-700 text-sm">
            <span className="text-gray-400">Contrato:</span>
            <span className="text-blue-400 font-mono truncate max-w-[150px]">{contractAddressToDisplay.substring(0, 6)}...{contractAddressToDisplay.substring(contractAddressToDisplay.length - 4)}</span>
            <button
              onClick={handleCopyAddress}
              className="bg-purple-600 hover:bg-purple-700 text-white p-1 rounded-full text-xs transition duration-300 relative"
              title="Copiar Dirección"
            >
              {copied ? (
                <i className="fas fa-check text-green-300"></i> // Icono de verificado
              ) : (
                <i className="fas fa-copy"></i> // Icono de copiar
              )}
            </button>
          </div>
        </div>

        {/* Lado Derecho: Indicadores de Conexión y Botones de Conectar/Desconectar */}
        <div className="flex items-center space-x-4">
          {/* Indicador de conexión (verde/rojo) */}
          <div className={`w-4 h-4 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>

          {isConnected ? (
            <div className="flex items-center space-x-3 bg-gray-800 rounded-lg p-2 shadow-inner border border-gray-700">
              <span className="text-gray-400 text-sm hidden sm:block truncate max-w-[100px]">
                {address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : 'Dirección...'}
              </span>
              <span className="text-yellow-300 text-sm hidden md:block">
                {balanceData?.value !== undefined ? `${formatEther(balanceData.value).substring(0, Math.min(formatEther(balanceData.value).length, 5))} ${balanceData.symbol}` : '0.00 BNB'}
              </span>
              <span className="text-blue-300 text-sm hidden lg:block"> {/* Solo visible en pantallas grandes */}
                {hgpBalance !== undefined ? `${hgpBalance.substring(0, Math.min(hgpBalance.length, 5))} HGP` : '0.00 HGP'}
              </span>
              <button
                onClick={disconnect}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg text-sm transition duration-300"
              >
                Desconectar
              </button>
            </div>
          ) : (
            <div className="flex space-x-2">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => connect({ connector, chainId: bscTestnet.id })}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-4 rounded-lg text-lg transition duration-300"
                  type="button"
                  disabled={pendingConnector?.id === connector.id}
                >
                  {connector.name === 'MetaMask' ? 'Conectar Billetera' : connector.name} {/* Cambia el texto para MetaMask */}
                  {pendingConnector?.id === connector.id && '...'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
