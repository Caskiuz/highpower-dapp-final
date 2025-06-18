import React, { useState, useEffect, useCallback } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

// Importa la configuración de tu contrato NFT desde el archivo centralizado
import { NFT_CONTRACT_CONFIG } from '../constants/contract-config.js';

function NftGallerySection({
  isConnected,
  userAddress,
  nftCount,
  refetchNftBalance,
  showCustomModal
}) {
  const [activeTab, setActiveTab] = useState('gallery');

  // --- LECTURA DE DATOS REALES DE NFT ---
  const { data: nftTotalSupply, refetch: refetchNFTTotalSupply } = useReadContract({
    ...NFT_CONTRACT_CONFIG,
    functionName: 'totalSupply',
    query: {
      enabled: isConnected && !!NFT_CONTRACT_CONFIG.address,
      watch: true,
    }
  });

  const { data: nftOwner, refetch: refetchNFTOwner } = useReadContract({
    ...NFT_CONTRACT_CONFIG,
    functionName: 'owner', // Asume que tu contrato NFT tiene una función 'owner()'
    query: {
      enabled: isConnected && !!NFT_CONTRACT_CONFIG.address,
    }
  });

  // Normalizar las direcciones a minúsculas para una comparación consistente
  const normalizedUserAddress = userAddress ? userAddress.toLowerCase() : '';
  const normalizedNftOwner = nftOwner ? nftOwner.toLowerCase() : '';

  // Depuración: Loggea las direcciones y el resultado de la comparación
  useEffect(() => {
    console.log("--- Depuración NFT Owner ---");
    console.log("Usuario Conectado (normalizedUserAddress):", normalizedUserAddress);
    console.log("Propietario del Contrato NFT (normalizedNftOwner):", normalizedNftOwner);
    console.log("¿userAddress es el propietario?:", normalizedUserAddress === normalizedNftOwner);
    console.log("--- Fin Depuración NFT Owner ---");
  }, [normalizedUserAddress, normalizedNftOwner]);

  // Depuración: Loggea el total supply
  useEffect(() => {
    console.log("--- Depuración NFT Total Supply ---");
    console.log("Total de NFTs Acuñados (nftTotalSupply):", nftTotalSupply !== undefined ? Number(nftTotalSupply) : 'Cargando...');
    console.log("--- Fin Depuración NFT Total Supply ---");
  }, [nftTotalSupply]);


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
      setMintNFTTxHash(null);  // Limpiar el hash de la transacción
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
    
    // Verificación final antes de intentar la acuñación
    if (normalizedUserAddress !== normalizedNftOwner) {
      showCustomModal('Error: No eres el propietario del contrato NFT para acuñar.');
      console.error("Intento de acuñación denegado: userAddress no coincide con nftOwner.");
      return;
    }

    try {
      await writeMintNFT({
        address: NFT_CONTRACT_CONFIG.address,
        abi: NFT_CONTRACT_CONFIG.abi,
        functionName: 'safeMint',
        args: [userAddress],
      }, {
        onSuccess: (hash) => {
          setMintNFTTxHash(hash);
          showCustomModal(`Transacción de acuñación de NFT enviada! Hash: ${hash.substring(0, 10)}...`);
        },
        onError: (err) => {
          console.error("Error al acuñar NFT (on Error):", err);
          showCustomModal(`Error al acuñar NFT: ${err.message}`);
        }
      });
    } catch (error) {
      console.error("Error inesperado al acuñar NFT (Try-Catch):", error);
      showCustomModal(`Error inesperado al acuñar NFT: ${error.message}`);
    }
  }, [isConnected, userAddress, normalizedUserAddress, normalizedNftOwner, writeMintNFT, showCustomModal]);

  const isAnyTxPending = mintNFTPending || isMintingNFT;

  return (
    <section id="nfts" className="p-4 sm:p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-8 text-center border-2 border-[var(--primary-purple)]">
      <h2 className="text-2xl sm:text-4xl font-bold text-[var(--primary-purple)] mb-4 sm:mb-6">Galería y Acuñación de NFTs HighPower</h2>
      <p className="text-[var(--light-gray-text)] text-base sm:text-lg mb-6 sm:mb-8">
        Explora y gestiona tus exclusivos NFTs de HighPower. ¡Acuña el tuyo ahora!
      </p>

      {/* Pestañas de navegación */}
      <div className="flex justify-center mb-6 sm:mb-8 bg-gray-900 p-2 rounded-full shadow-inner border border-gray-700">
        <button
          className={`py-2 px-4 sm:px-6 rounded-full font-semibold transition-all duration-300
                      ${activeTab === 'gallery' ? 'bg-[var(--primary-purple)] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('gallery')}
        >
          Mi Galería
        </button>
        <button
          className={`py-2 px-4 sm:px-6 rounded-full font-semibold transition-all duration-300
                      ${activeTab === 'mint' ? 'bg-[var(--primary-purple)] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('mint')}
        >
          Acuñar NFT
        </button>
      </div>

      {!isConnected && (
        <div className="bg-gray-800 p-4 sm:p-6 rounded-3xl shadow-xl border border-red-500 text-center">
          <p className="text-red-400 text-lg sm:text-xl font-semibold">
            ¡Conecta tu billetera para explorar los NFTs!
          </p>
        </div>
      )}

      {isConnected && (
        <>
          {activeTab === 'gallery' && (
            <div className="bg-gray-800 p-4 sm:p-6 rounded-3xl shadow-xl border border-[var(--secondary-blue)]">
              <h3 className="text-2xl sm:text-3xl font-bold text-[var(--off-white)] mb-4 sm:mb-6">Tus NFTs y Estadísticas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center mb-4 sm:mb-6">
                <div className="bg-gray-900 p-3 sm:p-4 rounded-lg border border-gray-700">
                  <p className="text-gray-400 text-xs sm:text-sm">Total de NFTs Acuñados en el Contrato:</p>
                  <p className="text-lg sm:text-xl font-bold text-[var(--off-white)]">
                    {nftTotalSupply !== undefined ? Number(nftTotalSupply) : 'Cargando...'}
                  </p>
                </div>
                <div className="bg-gray-900 p-3 sm:p-4 rounded-lg border border-gray-700">
                  <p className="text-gray-400 text-xs sm:text-sm">Tus NFTs Poseídos:</p>
                  <p className="text-lg sm:text-xl font-bold text-[var(--off-white)]">
                    {nftCount !== undefined ? Number(nftCount) : 'Cargando...'}
                  </p>
                </div>
              </div>

              <div className="mt-6 sm:mt-8">
                {Number(nftCount) > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {Array.from({ length: Number(nftCount) > 3 ? 3 : Number(nftCount) }).map((_, index) => (
                      <div key={index} className="bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-purple-700">
                        <img
                          src={`https://placehold.co/400x400/8A2BE2/FFFFFF?text=NFT+HighPower+${index + 1}`}
                          alt={`HighPower NFT ${index + 1}`}
                          className="w-full h-auto object-cover"
                          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/808080/FFFFFF?text=Error+Loading+NFT'; }}
                        />
                        <div className="p-4">
                          <h4 className="text-lg sm:text-xl font-semibold text-white">NFT # {index + 1}</h4>
                          <p className="text-gray-400 text-xs sm:text-sm">Un token de poder en el ecosistema HighPower.</p>
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
                  <div className="bg-gray-900 p-4 sm:p-6 rounded-lg text-center border border-gray-700">
                    <p className="text-gray-500 text-lg sm:text-xl font-semibold">¡Aún no tienes NFTs de HighPower!</p>
                    <p className="text-gray-400 mt-2">Dirígete a la pestaña "Acuñar NFT" para obtener el tuyo.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'mint' && (
            <div className="bg-gray-800 p-4 sm:p-6 rounded-3xl shadow-xl border border-[var(--accent-green)]">
              <h3 className="text-2xl sm:text-3xl font-bold text-[var(--off-white)] mb-4 sm:mb-6">Acuñar Nuevo NFT HighPower</h3>
              <p className="text-gray-400 mb-4 sm:mb-6">
                Acuña un NFT único de HighPower y conviértete en parte de la leyenda.
                Solo el propietario del contrato ({nftOwner ? `${nftOwner.substring(0,6)}...${nftOwner.substring(nftOwner.length - 4)}` : 'Cargando...'}) puede acuñar en este demo.
              </p>
              <button
                onClick={handleMintNFT}
                disabled={isAnyTxPending || normalizedUserAddress !== normalizedNftOwner}
                className={`w-full bg-[var(--accent-green)] hover:bg-[var(--secondary-blue)] text-[var(--dark-gray)] font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full text-lg sm:text-xl
                            transition duration-300 ease-in-out transform hover:scale-105 shadow-xl flex items-center justify-center
                            ${isAnyTxPending || normalizedUserAddress !== normalizedNftOwner ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isAnyTxPending ? <i className="fas fa-spinner fa-spin mr-2 sm:mr-3"></i> : <i className="fas fa-magic mr-2 sm:mr-3"></i>}
                {isAnyTxPending ? 'Acuñando...' : 'Acuñar NFT'}
              </button>
              {normalizedUserAddress !== normalizedNftOwner && (
                <p className="text-red-400 text-xs sm:text-sm mt-2 sm:mt-4">
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
