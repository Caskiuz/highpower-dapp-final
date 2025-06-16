// src/sections/NftGallerySection.jsx
import React, { useState, useEffect, useCallback } from 'react';

// Secciones del Marketplace: Gallery, Mint, Sell (listar), Buy
function NftGallerySection({
  isConnected,
  address,
  nftCount,
  showCustomModal,
  mockMintNFT, // Función simulada para minting
  refetchNftBalance,
  isMinting, // Estado de minting de App.jsx
  isConfirming, // Estado de confirmación de App.jsx
  hash, // Hash de transacción de App.jsx
  confirmError // Error de confirmación de App.jsx
}) {
  const [activeTab, setActiveTab] = useState('marketplace'); // Pestaña activa: 'marketplace', 'your-nfts', 'mint'

  // Simulación de NFTs del usuario (solo para UI)
  const [userNfts, setUserNfts] = useState([]);
  // Simulación de NFTs en el marketplace (solo para UI)
  const [marketplaceNfts, setMarketplaceNfts] = useState([]);

  // Mock de NFTs disponibles para el marketplace y minteo
  useEffect(() => {
    // Generar algunos NFTs iniciales para el marketplace
    const initialMarketplaceNfts = Array.from({ length: 9 }).map((_, i) => ({
      id: `nft-market-${i + 1}`,
      name: `HighPower Gem #${i + 1}`,
      imageUrl: `https://placehold.co/300x300/${['8A2BE2', '4169E1', '00FF7F', 'FFD700'][i % 4]}/FFFFFF?text=NFT+${i + 1}`,
      price: (Math.random() * 0.5 + 0.1).toFixed(3), // Precio en BNB simulado
      owner: `0xSimulatedOwner${i + 1}....`,
      description: `Un NFT coleccionable único de la serie HighPower Gems. Potencia tu presencia en el ecosistema.`,
      listed: true,
    }));
    setMarketplaceNfts(initialMarketplaceNfts);

    // Si el usuario está conectado, simular que tiene algunos NFTs
    if (isConnected) {
        const initialUserNfts = Array.from({ length: nftCount > 0 ? nftCount : 1 }).map((_, i) => ({ // Asegurarse de que al menos haya 1 si nftCount es 0
            id: `nft-user-${i + 1}`,
            name: `Tu Power NFT #${i + 1}`,
            imageUrl: `https://placehold.co/300x300/${['6B46C1', '4299E1', '6EE7B7'][i % 3]}/000000?text=My+NFT+${i + 1}`,
            description: `Este es uno de tus NFTs HighPower coleccionables.`,
            listed: false,
        }));
        setUserNfts(initialUserNfts);
    } else {
        setUserNfts([]);
    }
  }, [isConnected, nftCount]);

  // Manejar el minteo de un nuevo NFT (simulado)
  const handleMintNft = useCallback(async () => {
    if (!isConnected) {
      showCustomModal("Por favor, conecta tu billetera para acuñar un NFT.");
      return;
    }

    showCustomModal("Iniciando acuñación de NFT (simulado)... Por favor, confirma en tu billetera.");
    try {
      // Simular la llamada a la función de acuñación
      const tx = await mockMintNFT(); 
      console.log("Transacción de acuñación simulada enviada:", tx.hash);
      showCustomModal(`Transacción enviada: ${tx.hash.substring(0, 10)}... Confirmando...`);

      // Simular la confirmación de la transacción
      setTimeout(() => {
        showCustomModal("¡NFT acuñado con éxito! (Simulado)");
        // Simular que el usuario ahora tiene 1 NFT más
        const newNft = {
          id: `nft-user-${userNfts.length + 1}`,
          name: `Tu Nuevo NFT Power #${userNfts.length + 1}`,
          imageUrl: `https://placehold.co/300x300/${['6B46C1', '4299E1', '6EE7B7'][userNfts.length % 3]}/000000?text=My+New+NFT`,
          description: `¡Acabas de acuñar este impresionante NFT HighPower!`,
          listed: false,
        };
        setUserNfts(prev => [...prev, newNft]);
        if (refetchNftBalance) refetchNftBalance(); // Intenta refetch si la función real existe
      }, 3000); // Simula 3 segundos para confirmación
    } catch (error) {
      console.error("Error al acuñar NFT simulado:", error);
      showCustomModal(`Error al acuñar NFT: ${error.message || "Transacción rechazada."}`);
    }
  }, [isConnected, showCustomModal, mockMintNFT, userNfts.length, refetchNftBalance]);

  // Simular la compra de un NFT del marketplace
  const handleBuyNft = useCallback((nftId, price) => {
    if (!isConnected) {
      showCustomModal("Conecta tu billetera para comprar NFTs.");
      return;
    }
    showCustomModal(`Comprando NFT ${nftId} por ${price} BNB (simulado)...`);
    // Lógica para simular la compra y mover el NFT al usuario
    setTimeout(() => {
        setMarketplaceNfts(prev => prev.filter(nft => nft.id !== nftId));
        const purchasedNft = marketplaceNfts.find(nft => nft.id === nftId);
        if (purchasedNft) {
            setUserNfts(prev => [...prev, { ...purchasedNft, listed: false, id: `user-${purchasedNft.id}` }]);
            showCustomModal(`¡NFT ${nftId} comprado con éxito! (Simulado)`);
            if (refetchNftBalance) refetchNftBalance();
        }
    }, 2000);
  }, [isConnected, showCustomModal, marketplaceNfts, refetchNftBalance]);

  // Simular el listado de un NFT propio
  const handleListNft = useCallback((nftId) => {
    showCustomModal(`Listando NFT ${nftId} en el marketplace (simulado)...`);
    setTimeout(() => {
        setUserNfts(prev => prev.map(nft => 
            nft.id === nftId ? { ...nft, listed: true } : nft
        ));
        const listedNft = userNfts.find(nft => nft.id === nftId);
        if (listedNft) {
             setMarketplaceNfts(prev => [...prev, { ...listedNft, listed: true, id: `market-${listedNft.id}` }]);
             showCustomModal(`¡NFT ${nftId} listado con éxito! (Simulado)`);
        }
    }, 2000);
  }, [showCustomModal, userNfts]);

  // Simular la des-listado de un NFT propio
  const handleDelistNft = useCallback((nftId) => {
    showCustomModal(`Deslistando NFT ${nftId} del marketplace (simulado)...`);
    setTimeout(() => {
        setUserNfts(prev => prev.map(nft => 
            nft.id === nftId ? { ...nft, listed: false } : nft
        ));
        setMarketplaceNfts(prev => prev.filter(nft => nft.id !== `market-${nftId}`));
        showCustomModal(`¡NFT ${nftId} deslistado con éxito! (Simulado)`);
    }, 2000);
  }, [showCustomModal]);


  const NftCard = ({ nft, onAction, actionLabel, isUserNft = false }) => {
    const isListed = nft.listed;
    return (
      <div className="bg-gray-900 p-4 rounded-xl shadow-md border border-gray-700 flex flex-col items-center justify-between transition-transform duration-200 hover:scale-103 hover:border-[var(--secondary-blue)]">
        <img src={nft.imageUrl} alt={nft.name} className="w-full h-48 object-cover rounded-lg mb-4 border border-gray-600" />
        <h3 className="text-xl font-bold text-[var(--off-white)] mb-2 text-center">{nft.name}</h3>
        <p className="text-gray-400 text-sm mb-2 text-center overflow-hidden h-12">{nft.description}</p>
        
        {isUserNft && !isListed && (
            <button
                onClick={() => onAction(nft.id)}
                className="mt-4 w-full bg-[var(--primary-purple)] hover:bg-[var(--secondary-blue)] text-white font-bold py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105 shadow-md"
            >
                Listar en Marketplace
            </button>
        )}
        {isUserNft && isListed && (
            <button
                onClick={() => onAction(nft.id)}
                className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105 shadow-md"
            >
                Deslistar
            </button>
        )}
        {!isUserNft && ( // Es un NFT del marketplace
            <>
                <p className="text-[var(--accent-green)] font-bold text-xl mb-4">{nft.price} BNB</p>
                <button
                    onClick={() => onAction(nft.id, nft.price)}
                    className="w-full bg-[var(--accent-green)] hover:bg-[var(--primary-purple)] text-[var(--dark-gray)] font-bold py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105 shadow-md"
                >
                    Comprar Ahora
                </button>
            </>
        )}
      </div>
    );
  };

  return (
    <section id="nfts" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-8 text-center border-2 border-[var(--accent-yellow)]">
      <h2 className="text-4xl font-bold text-[var(--accent-yellow)] mb-6">HighPower Metamarket & Galería NFT</h2>
      <p className="text-[var(--light-gray-text)] text-lg mb-8">
        Explora y colecciona NFTs únicos en nuestro Metamarket, o acuña tus propios activos digitales.
      </p>

      {/* Pestañas de navegación */}
      <div className="flex justify-center mb-8 bg-gray-900 p-2 rounded-full shadow-inner border border-gray-700">
        <button
          className={`py-2 px-6 rounded-full font-semibold transition-all duration-300 
                      ${activeTab === 'marketplace' ? 'bg-[var(--primary-purple)] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('marketplace')}
        >
          Marketplace
        </button>
        <button
          className={`py-2 px-6 rounded-full font-semibold transition-all duration-300 
                      ${activeTab === 'your-nfts' ? 'bg-[var(--primary-purple)] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('your-nfts')}
        >
          Tus NFTs
        </button>
        <button
          className={`py-2 px-6 rounded-full font-semibold transition-all duration-300 
                      ${activeTab === 'mint' ? 'bg-[var(--primary-purple)] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('mint')}
        >
          Acuñar NFT
        </button>
      </div>

      {/* Contenido de las pestañas */}
      {activeTab === 'marketplace' && (
        <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-[var(--secondary-blue)]">
          <h3 className="text-3xl font-bold text-[var(--off-white)] mb-6">NFTs en Venta</h3>
          <p className="text-gray-400 mb-6">Descubre colecciones únicas y adquiere activos digitales raros.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketplaceNfts.length > 0 ? (
              marketplaceNfts.map(nft => (
                <NftCard key={nft.id} nft={nft} onAction={handleBuyNft} actionLabel="Comprar" />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No hay NFTs listados en el marketplace en este momento.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'your-nfts' && (
        <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-[var(--primary-purple)]">
          <h3 className="text-3xl font-bold text-[var(--off-white)] mb-6">Tu Colección de NFTs</h3>
          <p className="text-gray-400 mb-6">Aquí se muestran los NFTs de tu billetera. Puedes listarlos para venderlos.</p>
          {!isConnected && (
              <p className="text-red-400 mb-4">Conecta tu billetera para ver tus NFTs.</p>
          )}
          {isConnected && userNfts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userNfts.map(nft => (
                    <NftCard key={nft.id} nft={nft} onAction={nft.listed ? handleDelistNft : handleListNft} isUserNft={true} />
                ))}
            </div>
          ) : isConnected ? (
            <p className="text-gray-500 text-center">Aún no tienes NFTs HighPower. ¡Acuña uno ahora!</p>
          ) : null}
        </div>
      )}

      {activeTab === 'mint' && (
        <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-[var(--accent-green)]">
          <h3 className="text-3xl font-bold text-[var(--off-white)] mb-6">Acuñar Nuevo HighPower NFT</h3>
          <p className="text-gray-400 mb-6">
            Crea un nuevo NFT único de la colección HighPower. El coste de acuñación es simbólico en la testnet.
          </p>
          <div className="flex flex-col items-center justify-center space-y-4">
            <img 
              src="https://placehold.co/200x200/4299E1/000000?text=Mint+New+NFT" 
              alt="NFT por acuñar" 
              className="w-48 h-48 rounded-xl object-cover border-4 border-[var(--accent-green)] shadow-lg" 
            />
            <p className="text-[var(--light-gray-text)] text-xl font-semibold">Coste de Acuñación: 0.005 BNB (Testnet)</p>
            <button
              onClick={handleMintNft}
              className={`bg-[var(--accent-green)] hover:bg-[var(--secondary-blue)] text-[var(--dark-gray)] font-bold py-3 px-8 rounded-full text-xl
                         transition duration-300 ease-in-out transform hover:scale-105 shadow-xl flex items-center justify-center
                         ${isMinting || isConfirming ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isMinting || isConfirming}
            >
              {isMinting ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-hammer mr-3"></i>}
              {isMinting ? 'Acuñando...' : isConfirming ? 'Confirmando...' : 'Acuñar Ahora'}
            </button>
            {hash && (
                <p className="text-sm text-gray-400 mt-2">
                    Transacción Hash: <a href={`https://testnet.bscscan.com/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="text-[var(--accent-green)] hover:underline">
                        {hash.substring(0, 10)}...{hash.substring(hash.length - 8)}
                    </a>
                </p>
            )}
            {confirmError && (
                <p className="text-red-400 text-sm mt-2">
                    Error: {confirmError.shortMessage || confirmError.message}
                </p>
            )}
          </div>
        </div>
      )}

      {/* Flujo de Valor de NFTs (Infografía Animada Placeholder) */}
      <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-[var(--primary-purple)]">
        <h3 className="text-3xl font-bold text-[var(--off-white)] mb-6">Flujo de Valor en el Ecosistema NFT</h3>
        <p className="text-[var(--light-gray-text)] mb-4">
          Descubre cómo las tarifas del marketplace y las interacciones con NFTs generan valor para el ecosistema y los holders.
        </p>
        <div className="relative w-full h-80 bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
          {/* Placeholder para la infografía animada */}
          <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-xl font-bold animate-pulse">
            [Infografía Animada de Flujo de Valor NFT - PRÓXIMAMENTE]
          </div>
          {/* Puedes añadir SVG o elementos Canvas aquí para la animación */}
          {/* Ejemplo de animación de partículas de fondo (simple) */}
          <style>{`
            @keyframes nftFlowPulse {
              0% { box-shadow: 0 0 15px var(--primary-purple); }
              50% { box-shadow: 0 0 30px var(--secondary-blue); }
              100% { box-shadow: 0 0 15px var(--primary-purple); }
            }
            .nft-flow-pulse {
              animation: nftFlowPulse 3s infinite ease-in-out;
            }
          `}</style>
          <div className="absolute w-24 h-24 rounded-full bg-[var(--primary-purple)] opacity-20 nft-flow-pulse"></div>
          <div className="absolute w-16 h-16 rounded-full bg-[var(--secondary-blue)] opacity-20 nft-flow-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute w-12 h-12 rounded-full bg-[var(--accent-green)] opacity-20 nft-flow-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        <p className="text-gray-500 text-sm mt-4">
          *Esta sección se actualizará con una infografía interactiva para ilustrar el ciclo económico de los NFTs.
        </p>
      </div>
    </section>
  );
}

export default NftGallerySection;
