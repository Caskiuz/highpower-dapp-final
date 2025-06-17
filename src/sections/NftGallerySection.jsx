import React, { useState, useEffect, useCallback } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

// Importa la configuración de tu contrato NFT desde el archivo centralizado
import { NFT_CONTRACT_CONFIG } from '../constants/contract-config.js'; // Ruta correcta relativa a src/sections/

function NftGallerySection({
  isConnected,
  userAddress,
  nftCount, // Esto ahora es un BigInt, se formateará aquí si es necesario
  refetchNftBalance, 
  showCustomModal // Importa la función del modal para usarla
}) {
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery', 'mint'

  // --- LECTURA DE DATOS REALES DE NFT ---
  const { data: nftTotalSupply, refetch: refetchNFTTotalSupply } = useReadContract({
    ...NFT_CONTRACT_CONFIG,
    functionName: 'totalSupply',
    query: {
      enabled: isConnected && !!NFT_CONTRACT_CONFIG.address,
      watch: true, // Observar cambios en el total supply
    }
  });

  const { data: nftOwner, refetch: refetchNFTOwner } = useReadContract({
    ...NFT_CONTRACT_CONFIG,
    functionName: 'owner', // Asume que tu contrato NFT tiene una función 'owner()'
    query: {
      enabled: isConnected && !!NFT_CONTRACT_CONFIG.address,
      staleTime: Infinity,
    }
  });


  // --- FUNCIONES DE ESCRITURA REALES (WAGMI) ---
  const { writeContract: writeMintNFT, isPending: mintNFTPending, error: mintNFTError } = useWriteContract();

  // --- ESTADOS DE TRANSACCIONES (HASH Y CONFIRMACIÓN) ---
  const [mintNFTTxHash, setMintNFTTxHash] = useState(null);

  const { isLoading: isMintingNFT, isSuccess: isMintNFTSuccess, isError: isMintNFTError } = useWaitForTransactionReceipt({
    hash: mintNFTTxHash,
  });

  // --- MANEJO DE EFECTOS POST-TRANSACCIÓN Y ERRORES CON CUSTOM MODAL ---
  useEffect(() => {
    if (mintNFTError) showCustomModal(`Error al acuñar NFT: ${mintNFTError.message}`);
  }, [mintNFTError, showCustomModal]);

  useEffect(() => {
    if (isMintNFTSuccess) {
      showCustomModal('NFT acuñado exitosamente!');
      refetchNFTTotalSupply(); // Actualizar total de NFTs
      refetchNftBalance();     // Actualizar el balance de NFTs del usuario
      setMintNFTTxHash(null);
    }
  }, [isMintNFTSuccess, refetchNFTTotalSupply, refetchNftBalance, showCustomModal]);

  // --- HANDLERS DE INTERACCIÓN REAL ---
  const handleMintNFT = useCallback(async () => {
    if (!isConnected || !userAddress) {
      showCustomModal('Por favor, conecta tu billetera para acuñar un NFT.');
      return;
    }
    if (!NFT_CONTRACT_CONFIG.address) {
        showCustomModal('La dirección del contrato NFT no está configurada.');
        return;
    }

    try {
      writeMintNFT({
        address: NFT_CONTRACT_CONFIG.address,
        abi: NFT_CONTRACT_CONFIG.abi,
        functionName: 'safeMint',
        args: [userAddress], // Acuña el NFT al usuario conectado
      }, {
        onSuccess: (hash) => {
          setMintNFTTxHash(hash);
          showCustomModal(`Transacción de acuñación de NFT enviada! Hash: ${hash.substring(0, 10)}...`);
        },
        onError: (err) => {
          console.error("Error al acuñar NFT:", err);
          showCustomModal(`Error al acuñar NFT: ${err.message}`);
        }
      });
    } catch (error) {
      console.error("Error inesperado al acuñar NFT:", error);
      showCustomModal(`Error inesperado al acuñar NFT: ${error.message}`);
    }
  }, [isConnected, userAddress, writeMintNFT, showCustomModal]);

  const isAnyTxPending = mintNFTPending || isMintingNFT;

  return (
    <section id="nfts" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-8 text-center border-2 border-[var(--primary-purple)]">
      <h2 className="text-4xl font-bold text-[var(--primary-purple)] mb-6">Galería y Acuñación de NFTs HighPower</h2>
      <p className="text-[var(--light-gray-text)] text-lg mb-8">
        Explora y gestiona tus exclusivos NFTs de HighPower. ¡Acuña el tuyo ahora!
      </p>

      {/* Pestañas de navegación */}
      <div className="flex justify-center mb-8 bg-gray-900 p-2 rounded-full shadow-inner border border-gray-700">
        <button
          className={`py-2 px-6 rounded-full font-semibold transition-all duration-300
                      ${activeTab === 'gallery' ? 'bg-[var(--primary-purple)] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('gallery')}
        >
          Mi Galería
        </button>
        <button
          className={`py-2 px-6 rounded-full font-semibold transition-all duration-300
                      ${activeTab === 'mint' ? 'bg-[var(--primary-purple)] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('mint')}
        >
          Acuñar NFT
        </button>
      </div>

      {!isConnected && (
        <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-red-500 text-center">
          <p className="text-red-400 text-xl font-semibold">
            ¡Conecta tu billetera para explorar los NFTs!
          </p>
        </div>
      )}

      {isConnected && (
        <>
          {activeTab === 'gallery' && (
            <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-[var(--secondary-blue)]">
              <h3 className="text-3xl font-bold text-[var(--off-white)] mb-6">Tus NFTs y Estadísticas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-6">
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <p className="text-gray-400 text-sm">Total de NFTs Acuñados en el Contrato:</p>
                  <p className="text-xl font-bold text-[var(--off-white)]">
                    {nftTotalSupply !== undefined ? Number(nftTotalSupply) : 'Cargando...'}
                  </p>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <p className="text-gray-400 text-sm">Tus NFTs Poseídos:</p>
                  <p className="text-xl font-bold text-[var(--off-white)]">
                    {nftCount !== undefined ? Number(nftCount) : 'Cargando...'}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                {Number(nftCount) > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Aquí iría la lógica para mostrar los IDs de los NFTs reales del usuario.
                        Esto requeriría iterar sobre los IDs de los NFTs que posee el usuario,
                        lo cual a menudo implica funciones adicionales en el contrato NFT (ej. tokenOfOwnerByIndex).
                        Por simplicidad, mostramos un placeholder por ahora. */}
                    {Array.from({ length: Number(nftCount) > 3 ? 3 : Number(nftCount) }).map((_, index) => (
                      <div key={index} className="bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-purple-700">
                        <img 
                          src={`https://placehold.co/400x400/8A2BE2/FFFFFF?text=NFT+HighPower+${index + 1}`} 
                          alt={`HighPower NFT ${index + 1}`} 
                          className="w-full h-auto object-cover"
                          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/808080/FFFFFF?text=Error+Loading+NFT'; }}
                        />
                        <div className="p-4">
                          <h4 className="text-xl font-semibold text-white">NFT # {index + 1}</h4>
                          <p className="text-gray-400 text-sm">Un token de poder en el ecosistema HighPower.</p>
                        </div>
                      </div>
                    ))}
                    {Number(nftCount) > 3 && (
                        <p className="col-span-full text-center text-gray-500 mt-4">
                            Mostrando los primeros 3 NFTs. Posees un total de {Number(nftCount)} NFTs.
                        </p>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-900 p-6 rounded-lg text-center border border-gray-700">
                    <p className="text-gray-500 text-xl font-semibold">¡Aún no tienes NFTs de HighPower!</p>
                    <p className="text-gray-400 mt-2">Dirígete a la pestaña "Acuñar NFT" para obtener el tuyo.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'mint' && (
            <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-[var(--accent-green)]">
              <h3 className="text-3xl font-bold text-[var(--off-white)] mb-6">Acuñar Nuevo NFT HighPower</h3>
              <p className="text-gray-400 mb-6">
                Acuña un NFT único de HighPower y conviértete en parte de la leyenda.
                Solo el propietario del contrato ({nftOwner ? `${nftOwner.substring(0,6)}...${nftOwner.substring(nftOwner.length - 4)}` : 'Cargando...'}) puede acuñar en este demo.
              </p>
              <button
                onClick={handleMintNFT}
                disabled={isAnyTxPending || userAddress !== nftOwner} // Deshabilita si no eres el propietario
                className={`w-full bg-[var(--accent-green)] hover:bg-[var(--secondary-blue)] text-[var(--dark-gray)] font-bold py-3 px-8 rounded-full text-xl
                            transition duration-300 ease-in-out transform hover:scale-105 shadow-xl flex items-center justify-center
                            ${isAnyTxPending || userAddress !== nftOwner ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isMintingNFT ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-magic mr-3"></i>}
                {isMintingNFT ? 'Acuñando...' : 'Acuñar NFT'}
              </button>
              {userAddress !== nftOwner && (
                  <p className="text-red-400 text-sm mt-4">
                      No eres el propietario del contrato NFT. Solo el propietario puede acuñar en esta versión de demostración.
                  </p>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default NftGallerySection;
