import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useReadContract, useSimulateContract, useWriteContract } from 'wagmi';
import { ContractFunctionExecutionError } from 'viem';

// IMPORTAR ABIs de tus contratos (¡Ajusta las rutas!)
// Si tienes los ABIs de tus contratos de Solidity (ej., SimpleToken.json, MyNFT.json),
// cópialos a la carpeta `public/abis` dentro de tu proyecto `highpower-dapp-final`.
// Luego puedes importarlos así:
// import SimpleTokenABI from '/abis/SimpleToken.json';
// import MyNFTABI from '/abis/MyNFT.json';

// Por simplicidad para que compile ahora, usaremos ABIs de ejemplo.
// !! RECUERDA REEMPLAZAR ESTOS CON TUS ABIs REALES DESPUÉS DE DESPLEGAR TUS CONTRATOS. !!
const SimpleTokenABI = { "abi": [ { "inputs": [ { "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }, { "internalType": "uint256", "name": "initialSupply", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" } ] };
// <<-- ¡¡MYNFTABI CORREGIDO: AHORA INCLUYE LA FUNCIÓN mintNFT!! -->>
const MyNFTABI = { "abi": [ { "inputs": [ { "internalType": "string", "name": "name_", "type": "string" }, { "internalType": "string", "name": "symbol_", "type": "string" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "recipient", "type": "address" }, { "indexed": false, "internalType": "string", "name": "tokenURI", "type": "string" } ], "name": "NFTMinted", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "string", "name": "tokenURI_", "type": "string" } ], "name": "mintNFT", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "tokenURI", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" } ] };


// !! IMPORTANTE: Reemplaza estas direcciones con las de tus contratos desplegados en BNB Testnet !!
const SIMPLE_TOKEN_CONTRACT_ADDRESS = '0xE02F5740F01EDBC5ccAE634312f7C6a90a31053B'; // Tu dirección de SimpleToken
const MY_NFT_CONTRACT_ADDRESS = '0x4732ecF022235C877f60Ca000eEA7c19440f436F'; // Tu dirección de MyNFT

function App() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error, isConnecting, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();

  const [nftMintingMessage, setNftMintingMessage] = useState('');
  const [isMintingNFT, setIsMintingNFT] = useState(false);
  const [nftTokenURI, setNftTokenURI] = useState('ipfs://QmZ4Y9pMv2oW2f7v8k3f3h3g3d3c3b3a3c3e3f3g3h3i3j3k3l3m3n3o3p3q3r3s3t3u3v3w3x3y3z');

  // useSimulateContract para acuñar NFT
  const { data: mintNftConfig, error: simulateMintNftError } = useSimulateContract({
    address: MY_NFT_CONTRACT_ADDRESS,
    abi: MyNFTABI.abi, // <<-- ¡¡AHORA ESTE ABI TIENE mintNFT!! -->>
    functionName: 'mintNFT',
    args: [address, nftTokenURI],
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
    abi: SimpleTokenABI.abi,
    functionName: 'balanceOf',
    args: [address],
    enabled: isConnected && !!address,
    watch: true,
  });

  // LÍNEAS DE DEPURACIÓN
  console.log("Estado de conexión:", {
    isConnected,
    address,
    isConnecting,
    pendingConnector: pendingConnector?.id,
    error: error?.message,
    connectors: connectors.map(c => ({ id: c.id, name: c.name, ready: c.ready }))
  });

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
            {connectors.map((connector) => (
              <button
                key={connector.id}
                onClick={() => connect({ connector })}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!connector.ready || isConnecting}
              >
                {isConnecting && connector.id === pendingConnector?.id
                  ? 'Conectando...'
                  : `Conectar con ${connector.name}`}
              </button>
            ))}
            {error && <p className="text-red-500 mt-2 text-center">{error.message}</p>}
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
              placeholder="ej., ipfs://QmZ4Y9pMv2oW2f7v8k3f3h3g3d3c3b3a3c3e3f3g3h3i3j3k3l3m3n3o3p3q3r3s3t3u3v3w3x3y3z"
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
          {/* Aquí podrías añadir más funciones para el token HGP, como transferencias */}
        </div>
      )}
    </div>
  );
}

export default App;
