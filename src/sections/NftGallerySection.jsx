// src/sections/NftGallerySection.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

// Importa el ABI de tu contrato NFT. Asegúrate de que la ruta sea correcta.
import MyNFTABI from '../abis/MyNFT.json'; 

// Las direcciones de contrato ahora se pasan como props o se definen globalmente en App.jsx
// Para este componente, las importaremos si se usan directamente en los hooks.
// Sin embargo, es mejor que App.jsx las maneje y las pase si el componente las necesita en el render o efectos.
// Para useWriteContract, la dirección se pasa directamente.

function NftGallerySection({ isConnected, showCustomModal, refetchNftBalance }) {
  const [tokenURI, setTokenURI] = useState('');

  // Asegúrate de que HPNFT_ERC721_ADDRESS sea una constante accesible aquí o pasada como prop.
  // Para simplicidad en este refactor, la mantendremos como constante global accesible.
  // Si deseas centralizarla, se debería pasar desde App.jsx a NftGallerySection como una prop.
  const HPNFT_ERC721_ADDRESS = '0x11Cae128d6AD9A00ceAF179171321F2E0abE30a8'; // Asegúrate que esta es la dirección correcta.

  const { data: hash, isPending: isMinting, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: confirmError } = useWaitForTransactionReceipt({
    hash: hash,
  });

  const handleMintNFT = useCallback(async () => {
    if (!isConnected) {
        showCustomModal('Por favor, conecta tu billetera primero para acuñar un NFT.');
        return;
    }
    
    if (!tokenURI.trim()) {
        showCustomModal('Error: Por favor, ingresa una URI para el Token (ej. un hash IPFS o URL).');
        return;
    }

    try {
      await writeContract({
        address: HPNFT_ERC721_ADDRESS, 
        abi: MyNFTABI.abi, // Asegúrate de que el ABI es correcto y se importa bien
        functionName: 'mint',
        args: [tokenURI],
        value: parseEther('0.01'), // Costo de acuñación en BNB
      });
    } catch (error) {
      console.error("Error al iniciar la transacción de acuñación:", error);
      showCustomModal(`Error al intentar acuñar el NFT: ${error.message || error.toString()}.
      Posibles causas:
      1. El contrato desplegado en la blockchain no coincide exactamente con el código que ha proporcionado.
      2. El contrato tiene restricciones internas (ej. límite de acuñación por billetera, suministro máximo alcanzado, acuñación pausada) que no se ven directamente en la función 'mint' principal.`);
    }
  }, [isConnected, tokenURI, showCustomModal, writeContract, HPNFT_ERC721_ADDRESS]); // Añadimos HPNFT_ERC721_ADDRESS a las dependencias


  useEffect(() => {
    if (isConfirmed) { 
      refetchNftBalance(); 
      showCustomModal('¡NFT acuñado con éxito! Tu balance se ha actualizado.');
      setTokenURI(''); 
    } else if (confirmError) { 
      showCustomModal(`Error al confirmar la acuñación: ${confirmError.message}. Por favor, verifica tu transacción en el explorador de bloques.`);
    }
  }, [isConfirmed, confirmError, refetchNftBalance, showCustomModal, setTokenURI]);

  return (
    <section id="nfts" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-6 border-2 border-[var(--secondary-blue)]">
      <h2 className="text-4xl font-bold text-[var(--accent-green)] mb-6">Galería de NFT y Marketplace</h2>

      <div className="space-y-6 text-[var(--light-gray-text)]">
        <section>
          <h3 className="text-3xl font-semibold text-[var(--off-white)] mb-4">9. Galería de NFT y Marketplace</h3>
          <p className="leading-relaxed">
            La Galería y Marketplace de NFT de HighPower será el epicentro de la creatividad altcoin en la BNB Chain. Es un espacio vibrante donde los usuarios pueden crear (mintear), comprar, vender y subastar NFTs de altcoins únicas.
          </p>
          <h4 className="text-2xl font-semibold text-[var(--off-white)] mt-4 mb-3">Funcionalidades Clave:</h4>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Minteo Sencillo:</strong> Herramientas amigables para que los usuarios minteen sus altcoins como NFTs (BEP-721 o BEP-1155).</li>
            <li><strong>Listado y Venta:</strong> Opciones flexibles para la venta a precio fijo y subastas.</li>
            <li><strong>Filtros y Búsqueda:</strong> Funcionalidades robustas para facilitar el descubrimiento y la navegación de NFTs.</li>
            <li><strong>Perfiles de Usuario:</strong> Espacios personalizados para que los usuarios muestren sus colecciones.</li>
            <li><strong>Soporte de Royalties:</strong> Sistema de regalías para asegurar que los creadores reciban un porcentaje en las ventas secundarias.</li>
            <li><strong>Integración con Wallets de BNB Chain:</strong> Compatibilidad total con billeteras populares como MetaMask y Trust Wallet.</li>
            <li><strong>Colecciones Oficiales de HGP NFTs:</strong> Lanzamientos periódicos de NFTs exclusivos.</li>
          </ul>
        </section>

        <section className="mt-8 pt-6 border-t border-[var(--primary-purple)]">
          <h3 className="text-3xl font-semibold text-[var(--accent-yellow)] mb-4">Acuñar tu Propio NFT HighPower</h3>
          <div className="mb-4">
            <label htmlFor="tokenURI" className="block text-[var(--light-gray-text)] text-sm font-bold mb-2">
              URI del Token (ej. IPFS hash/URL a los metadatos del NFT):
            </label>
            <input
              type="text"
              id="tokenURI"
              value={tokenURI}
              onChange={(e) => setTokenURI(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[var(--dark-gray)] leading-tight focus:outline-none focus:shadow-outline bg-[var(--off-white)]"
              placeholder="ipfs://Qme... o https://tu-nft.com/metadata.json"
              disabled={!isConnected}
            />
          </div>
          <button
            onClick={handleMintNFT}
            className={`w-full font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md
                        ${(!isConnected || isMinting || isConfirming || !tokenURI.trim())
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-[var(--secondary-blue)] hover:bg-[var(--primary-purple)] text-[var(--off-white)]'
                        }`}
            type="button"
            disabled={isMinting || isConfirming || !isConnected || !tokenURI.trim()} 
          >
            {isMinting ? 'Acuñando...' : isConfirming ? 'Confirmando Transacción...' : 'Acuñar NFT (0.01 BNB)'}
          </button>

          {hash && (
            <p className="mt-4 text-sm text-[var(--light-gray-text)] text-center">
              Transacción enviada: <a href={`https://testnet.bscscan.com/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="text-[var(--accent-yellow)] underline break-all">Ver en BSCScan (Testnet)</a>
            </p>
          )}
          {confirmError && <p className="mt-2 text-red-500 font-semibold text-center">Error al confirmar la acuñación: {confirmError.message}</p>}
        </section>
      </div>
    </section>
  );
}

export default NftGallerySection;
