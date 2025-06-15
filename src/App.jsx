import { useState, useEffect } from 'react';
import {
  createConfig,
  WagmiConfig,
  http,
  useAccount,
  useConnect,
  useDisconnect,
  useWriteContract,
  useWaitForTransactionReceipt,
  useBalance,
  useReadContract,
  createStorage, // <--- CAMBIO AQUÍ: Importamos createStorage directamente de 'wagmi'
} from 'wagmi';
import { bsc, bscTestnet, mainnet, sepolia } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from '@wagmi/connectors';
import { formatEther } from 'viem';

// 1. Wagmi Configuration
const config = createConfig({
  chains: [mainnet, sepolia, bsc, bscTestnet],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'HighPower DApp',
      preference: 'smartWalletOnly',
    }),
    walletConnect({ projectId: '56246e8df9c9151e77b7e93def28838e' }), // Su ID de Proyecto
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
  },
  // Configuración de persistencia para Wagmi
  // Le pasamos localStorage directamente a createStorage
  storage: createStorage({ storage: localStorage }),
});

// ABI de la función mint de su contrato MyNFT
const nftContractAbi = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "tokenURI_",
        "type": "string"
      }
    ],
    "name": "mint",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Direcciones de contratos proporcionadas
const SIMPLE_TOKEN_CONTRACT_ADDRESS = '0x03Fd2cE62B4BB54f09716f9588A5E13bC0756773';
const NFT_CONTRACT_ADDRESS = '0x11Cae128d6AD9A00ceAF179171321F2E0abE30a8';

function AppContent() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();

  const { data: balanceData } = useBalance({ address: address });

  const { data: nftBalance, isLoading: isLoadingNftBalance, error: nftBalanceError, refetch: refetchNftBalance } = useReadContract({
    abi: nftContractAbi,
    address: NFT_CONTRACT_ADDRESS,
    functionName: 'balanceOf',
    args: [address],
    query: {
      enabled: isConnected && !!address,
    },
  });

  const { data: hash, isPending: isMinting, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: confirmError } = useWaitForTransactionReceipt({
    hash: hash,
  });

  const [tokenURI, setTokenURI] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isConfirmed) {
      refetchNftBalance(); // Vuelve a leer el balance después de una acuñación exitosa
      showCustomModal('¡NFT acuñado con éxito! Tu balance se ha actualizado.');
    }
  }, [isConfirmed, refetchNftBalance]);

  const showCustomModal = (msg) => {
    setMessage(msg);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setMessage('');
  };

  const handleMintNFT = async () => {
    if (!isConnected) {
        showCustomModal('Por favor, conecta tu billetera primero para acuñar un NFT.');
        return;
    }
    
    if (!tokenURI.trim()) {
        showCustomModal('Error: Por favor, ingresa una URI para el Token (ej. un hash IPFS o URL).');
        return;
    }

    try {
      writeContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: nftContractAbi,
        functionName: 'mint',
        args: [tokenURI],
      });
    } catch (error) {
      console.error("Error al iniciar la transacción de acuñación:", error);
      showCustomModal(`Error al intentar acuñar el NFT: ${error.message || error.toString()}.
      Posibles causas:
      1. El contrato desplegado en la blockchain no coincide exactamente con el código que ha proporcionado.
      2. El contrato tiene restricciones internas (ej. límite de acuñación por billetera, suministro máximo alcanzado, acuñación pausada) que no se ven directamente en la función 'mint' principal.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-inter">
      {/* Custom Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center max-w-sm w-full border border-purple-600">
            <h3 className="text-xl font-bold text-purple-300 mb-4">Mensaje Importante</h3>
            <p className="text-gray-200 mb-6">{message}</p>
            <button
              onClick={closeModal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-lg w-full">
        <h1 className="text-4xl font-bold mb-6 text-purple-400">HighPower DApp</h1>
        <p className="text-gray-300 mb-8">Conéctate a tu billetera y explora el mundo blockchain.</p>

        {!isConnected ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">¡Conectar billetera!</h2>
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector, chainId: bscTestnet.id })}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                type="button"
              >
                {connector.name}
                {pendingConnector?.id === connector.id && ' (Conectando...)'}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-green-400">¡Conectado!</h2>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Dirección de la Billetera:</p>
              <p className="font-mono text-lg break-all">{address}</p>
            </div>
            {/* Display balance correctly */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Balance ({balanceData?.symbol || 'Cargando'}):</p>
              <p className="font-mono text-lg">{balanceData ? formatEther(balanceData.value) : 'Cargando...'}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Red conectada:</p>
              <p className="font-mono text-lg">{chain?.name || 'Desconocida'}</p>
            </div>
            {/* Mostrar el balance de NFTs */}
            <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Tu balance de NFTs:</p>
                {isLoadingNftBalance ? (
                    <p className="font-mono text-lg">Cargando...</p>
                ) : nftBalanceError ? (
                    <p className="font-mono text-red-400">Error al cargar NFTs: {nftBalanceError.message}</p>
                ) : (
                    <p className="font-mono text-lg">{nftBalance !== undefined ? nftBalance.toString() : 'N/A'}</p>
                )}
            </div>

            <button
              onClick={() => disconnect()}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              type="button"
            >
              Desconectar
            </button>

            {/* NFT Minting Section */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">Acuñar NFT</h3>
              <div className="mb-4">
                <label htmlFor="tokenURI" className="block text-gray-300 text-sm font-bold mb-2">
                  URI del Token (ej. IPFS hash/URL):
                </label>
                <input
                  type="text"
                  id="tokenURI"
                  value={tokenURI}
                  onChange={(e) => setTokenURI(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                  placeholder="ipfs://Qme..."
                />
              </div>
              <button
                onClick={handleMintNFT}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                type="button"
                disabled={isMinting || isConfirming}
              >
                {isMinting ? 'Acuñando...' : isConfirming ? 'Confirmando...' : 'Acuñar NFT'}
              </button>

              {hash && (
                <p className="mt-4 text-sm text-gray-300">
                  Transacción enviada: <a href={`https://testnet.bscscan.com/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline break-all">Ver en BSCScan (Testnet)</a>
                </p>
              )}
              {confirmError && <p className="mt-2 text-red-500 font-semibold">Error al confirmar la acuñación: {confirmError.message}</p>}
            </div>
          </div>
        )}

        <p className="mt-10 text-gray-500 text-sm">© 2025 HighPower DApp. Todos los derechos reservados.</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <WagmiConfig config={config}>
      <AppContent />
    </WagmiConfig>
  );
}
