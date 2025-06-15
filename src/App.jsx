import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useReadContract, useSimulateContract, useWriteContract } from 'wagmi';
import { ContractFunctionExecutionError } from 'viem';

// IMPORTAR ABIs de tus contratos
import SimpleTokenABI from './abis/SimpleToken.json';
import MyNFTABI from './abis/MyNFT.json';


// !! IMPORTANTE: Mantén estas direcciones como las que Hardhat te dio en el último despliegue !!
const SIMPLE_TOKEN_CONTRACT_ADDRESS = '0x03Fd2cE62B4BB54f09716f9588A5E13bC0756773'; // Dirección REAL de tu SimpleToken (HGP)
const MY_NFT_CONTRACT_ADDRESS = '0x11Cae128d6AD9A00ceAF179171321F2E0abE30a8'; // Dirección REAL de tu MyNFT (HPNFT)

function App() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error, isConnecting, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();

  // ***** CORRECCIÓN AQUI: Declaración de estados faltantes *****
  const [isManualMetaMaskReady, setIsManualMetaMaskReady] = useState(false);
  const [isConnectingLocally, setIsConnectingLocally] = useState(false);
  // **********************************************************

  const [nftMintingMessage, setNftMintingMessage] = useState('');
  const [isMintingNFT, setIsMintingNFT] = useState(false);
  const [nftTokenURI, setNftTokenURI] = useState('ipfs://QmZ4Y9pMv2oW2f7v8k3f3h3g3d3c3b3a3c3e3e3g3h3i3j3k3l3m3n3o3p3q3r3s3t3u3v3w3x3y3y3z'); // URI de ejemplo


  // useSimulateContract para acuñar NFT
  const { data: mintNftConfig, error: simulateMintNftError } = useSimulateContract({
    address: MY_NFT_CONTRACT_ADDRESS,
    abi: MyNFTABI.abi, // Usa el ABI real importado
    functionName: 'mint', // Función 'mint' en el nuevo contrato MyNFT.sol
    args: [nftTokenURI], // Solo el tokenURI, ya que acuña a msg.sender
    enabled: isConnected && !!address && !isMintingNFT,
  });

  // useWriteContract para ejecutar la acuñación de NFT
  const { writeContract: mintNFT, isPending: isMintingNFTTx } = useWriteContract({
    onSuccess(data) {
      setNftMintingMessage(`NFT acuñado! Hash de Tx: ${data.hash}.`);
      setIsMintingNFT(false);
    },
    onError(err) {
      if (err instanceof ContractFunctionExecutionError) {
        setNftMintingMessage(`Error al acuñar NFT: ${err.shortMessage || err.message}`);
      } else {
        setNftMintingMessage(`Error al acuñar NFT: ${err.message}`);
      }
      setIsMintingNFT(false);
    },
  });

  const handleMintNFT = async () => {
    if (!mintNftConfig || !mintNftConfig.request || !mintNFT) {
      setNftMintingMessage("Error: No se pudo preparar la función de acuñación. Conecte su billetera.");
      if (simulateMintNftError) {
        console.error("Error al simular la acuñación:", simulateMintNftError);
      }
      return;
    }
    setIsMintingNFT(true);
    setNftMintingMessage('Acuñando NFT...');
    mintNFT(mintNftConfig.request);
  };

  // useReadContract para leer el balance de HGP
  const { data: hgpBalance, isLoading: isHGPBalanceLoading, refetch: refetchHGPBalance } = useReadContract({
    address: SIMPLE_TOKEN_CONTRACT_ADDRESS,
    abi: SimpleTokenABI.abi, // Usa el ABI real importado
    functionName: 'balanceOf',
    args: [address],
    enabled: isConnected && !!address,
    watch: true,
  });

  // Efecto para la detección manual de MetaMask y actualización del estado
  useEffect(() => {
    const checkAndSetManualReady = () => {
      if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
        console.log("SUCCESS: MetaMask (window.ethereum) fue detectado. Estableciendo isManualMetaMaskReady a true.");
        setIsManualMetaMaskReady(true);
      } else {
        console.warn("ADVERTENCIA: window.ethereum (MetaMask) aún NO detectado o no es MetaMask.");
        setIsManualMetaMaskReady(false);
      }
    };

    checkAndSetManualReady();
    const timer = setTimeout(checkAndSetManualReady, 1000); // Re-verificar después de 1 segundo

    return () => clearTimeout(timer); // Limpiar el timer si el componente se desmonta
  }, [connectors]); // Dependencia en 'connectors' para re-ejecutar si cambian los conectores

  // Manejador de clic para los botones de conexión
  const handleConnectClick = async (connector) => {
    // Evitar múltiples intentos de conexión si ya hay uno en progreso
    if (isConnectingLocally || isConnecting) {
      console.log("Ya hay un intento de conexión en progreso.");
      return;
    }

    setIsConnectingLocally(true); // Indicar que estamos iniciando una conexión localmente
    try {
      await connect({ connector });
    } catch (err) {
      console.error("Error durante el intento de conexión:", err);
    } finally {
      setIsConnectingLocally(false); // Siempre resetear el estado local al finalizar
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        HighPower DApp (BNB Chain)
      </h1>

      {/* Sección de conexión de billetera */}
      <div className="mb-4">
        {isConnected ? (
          <div className="text-center">
            <p className="text-lg mb-2 text-gray-400">
              Conectado como: <span className="font-mono text-purple-300">{address}</span>
            </p>
            <button
              onClick={() => disconnect()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Desconectar Cartera
            </button>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            {connectors.map((connector) => {
              // Lógica mejorada para determinar si el conector está "listo"
              const isActuallyReady = (
                // Para MetaMask o conectores inyectados, usamos nuestra detección manual
                (connector.id === 'metaMaskSDK' || connector.id === 'injected') ? isManualMetaMaskReady : connector.ready
              );

              const isDisabled = !isActuallyReady || isConnecting || isConnectingLocally;

              return (
                <button
                  key={connector.id}
                  onClick={() => handleConnectClick(connector)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isDisabled}
                >
                  {isConnecting || (isConnectingLocally && connector.id === pendingConnector?.id)
                    ? 'Conectando...'
                    : `Conectar con ${connector.name} (Ready: ${String(isActuallyReady)})`}
                </button>
              );
            })}
            {error && <p className="text-red-500 mt-2 text-center">Error: {error.message}</p>}
          </div>
        )}
      </div>

      {/* Sección de acuñación de NFT */}
      {isConnected && (
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md mt-8">
          <h2 className="text-3xl font-semibold mb-6 text-center text-blue-400">
            Acuñar NFT HighPower
          </h2>

          <div className="mb-4">
            <label htmlFor="nftUri" className="block text-gray-400 text-sm font-bold mb-2">
              URI de Metadatos del NFT:
            </label>
            <input
              type="text"
              id="nftUri"
              value={nftTokenURI}
              onChange={(e) => setNftTokenURI(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
              placeholder="ej., ipfs://QmZ4Y9pMv2oW2f7v8k3f3h3g3d3c3b3a3c3e3f3g3h3i3j3k3l3m3n3o3p3q3r3s3t3u3v3w3x3y3y3z"
              disabled={isMintingNFT}
            />
             <p className="text-xs text-gray-500 mt-1">
                Esta URI debe apuntar a un archivo JSON de metadatos (como los de OpenSea) que contenga la imagen del NFT y otras propiedades.
            </p>
          </div>

          <button
            onClick={handleMintNFT}
            disabled={!mintNftConfig?.request || isMintingNFT || isMintingNFTTx}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {isMintingNFT || isMintingNFTTx ? 'Acuñando NFT...' : 'Acuñar NFT'}
          </button>

          {nftMintingMessage && (
            <p className={`mt-4 text-center text-lg ${nftMintingMessage.startsWith('Error') ? 'text-red-500' : 'text-green-400'}`}>
              {nftMintingMessage}
            </p>
          )}

          {simulateMintNftError && (
            <p className="mt-2 text-sm text-red-400 text-center">
              Error de preparación (simulación): {simulateMintNftError.message}
            </p>
          )}
        </div>
      )}

      {/* Sección de gestión de tokens BEP-20 (HGP) */}
      {isConnected && (
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md mt-8">
          <h2 className="text-3xl font-semibold mb-6 text-center text-blue-400">
            Gestionar Tokens HGP (BEP-20)
          </h2>
          {isHGPBalanceLoading ? (
            <p className="text-center text-gray-400">Cargando balance de HGP...</p>
          ) : (
            hgpBalance !== undefined ? (
              <p className="text-center text-lg text-green-400">
                Tu balance de HGP: <span className="font-bold">{Number(hgpBalance) / (10**18)}</span> HGP
              </p>
            ) : (
              <p className="text-center text-red-400">
                No se pudo cargar el balance de HGP. Asegúrate de que el contrato sea correcto.
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default App;
