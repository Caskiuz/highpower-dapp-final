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
} from 'wagmi';
import { bsc, bscTestnet, mainnet, sepolia } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from '@wagmi/connectors';
import { formatEther } from 'viem';

// Importa el nuevo componente CursorTrail
import CursorTrail from './components/CursorTrail';

// Configuración de Wagmi con persistencia en localStorage
const config = createConfig({
  chains: [mainnet, sepolia, bsc, bscTestnet],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'HighPower DApp',
      preference: 'smartWalletOnly',
    }),
    walletConnect({ projectId: '56246e8df9c9151e77b7e93def28838e' }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
  },
  storage: localStorage,
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
const NFT_CONTRACT_ADDRESS = '0x11Cae128d6AD9A00ceAF179171321F2E0abE30a8';

// Componente para el modal personalizado
function CustomModal({ message, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center max-w-sm w-full border border-purple-600">
        <h3 className="text-xl font-bold text-purple-300 mb-4">Mensaje Importante</h3>
        <p className="text-gray-200 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}

// Componente para la barra de navegación
function Navbar({ onNavigate, isConnected, disconnect, address }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: 'dashboard' },
    { name: 'Acerca de HighPower', path: 'about' },
    { name: 'Token $HGP', path: 'token' },
    { name: 'Rendimientos', path: 'yield' },
    { name: 'NFTs', path: 'nfts' },
    { name: 'Swap', path: 'swap' },
    { name: 'Gobernanza DAO', path: 'dao' },
    { name: 'Roadmap', path: 'roadmap' },
    { name: 'Contacto', path: 'contact' },
  ];

  return (
    <nav className="bg-gray-900 shadow-lg p-4 sticky top-0 z-40 w-full">
      <div className="container mx-auto flex justify-between items-center flex-wrap">
        <div className="text-purple-400 text-3xl font-bold rounded-lg p-2 transition duration-300 hover:bg-purple-800 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          HighPower
        </div>

        {/* Botón de menú para móviles */}
        <div className="block lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-200 focus:outline-none focus:text-white"
          >
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              )}
            </svg>
          </button>
        </div>

        {/* Menú de navegación */}
        <div className={`w-full lg:flex lg:items-center lg:w-auto ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="text-xl lg:flex-grow lg:flex lg:justify-end">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={`#${item.path}`} // Enlaces ancla para desplazamiento suave
                onClick={() => {
                  onNavigate(item.path);
                  setIsMenuOpen(false);
                }}
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-gray-700 mx-2"
              >
                {item.name}
              </a>
            ))}
          </div>
          {isConnected && (
            <div className="mt-4 lg:mt-0 lg:ml-4 flex items-center">
              <span className="text-gray-400 text-sm hidden sm:block truncate max-w-[150px] mr-2">
                {address.substring(0, 6)}...{address.substring(address.length - 4)}
              </span>
              <button
                onClick={disconnect}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 text-lg"
              >
                Desconectar
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

// ==========================================================
// SECCIONES DEL DASHBOARD
// Cada sección ahora tiene un ID para el desplazamiento suave.
// ==========================================================

function DashboardSection({ address, balanceData, nftBalance, isLoadingNftBalance, nftBalanceError, isConnected, connect, connectors, pendingConnector, onNavigate }) {
  return (
    <section id="dashboard" className="p-6 bg-gray-800 rounded-lg shadow-xl text-center flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-5xl font-bold mb-8 text-purple-400">Dashboard HighPower</h2>
      {!isConnected ? (
        <div className="space-y-4 w-full max-w-sm">
          <h3 className="text-3xl font-semibold mb-6 text-gray-200">¡Conecta tu billetera!</h3>
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => connect({ connector, chainId: bscTestnet.id })}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 text-xl"
              type="button"
              disabled={pendingConnector?.id === connector.id} // <-- Deshabilita el botón mientras se conecta
            >
              {connector.name}
              {pendingConnector?.id === connector.id && ' (Conectando...)'}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-6 w-full max-w-2xl">
          <h3 className="text-4xl font-bold text-green-400 mb-6">¡Bienvenido, {address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : 'Usuario'}!</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700 p-6 rounded-lg shadow-md border border-purple-500">
              <p className="text-gray-400 text-sm mb-2">Balance ($HGP / BNB):</p>
              <p className="font-mono text-3xl text-yellow-300">
                {balanceData ? `${formatEther(balanceData.value)} ${balanceData.symbol}` : 'Cargando...'}
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg shadow-md border border-blue-500">
              <p className="text-gray-400 text-sm mb-2">Tu Balance de NFTs:</p>
              {isLoadingNftBalance ? (
                <p className="font-mono text-3xl text-blue-300">Cargando...</p>
              ) : nftBalanceError ? (
                <p className="font-mono text-xl text-red-400">Error: {nftBalanceError.message}</p>
              ) : (
                <p className="font-mono text-3xl text-blue-300">
                  {nftBalance !== undefined ? nftBalance.toString() : 'N/A'} NFTs
                </p>
              )}
            </div>
          </div>
          
          <div className="bg-gray-700 p-6 rounded-lg shadow-md border border-gray-600">
            <p className="text-gray-400 text-sm mb-2">Estado General del Ecosistema:</p>
            <ul className="list-disc list-inside text-left text-gray-300 text-lg space-y-2">
              <li>**Suministro Total $HGP:** 21,000,000</li>
              <li>**Volumen de Trading (24h):** $PENDIENTE_CONECTAR_API</li>
              <li>**Liquidez Total Bloqueada (TVL):** $PENDIENTE_CONECTAR_API</li>
              <li>**Último NFT acuñado:** #PENDIENTE_CONECTAR_API</li>
            </ul>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => onNavigate('swap')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 text-lg"
            >
              Ir a Swap
            </button>
            <button
              onClick={() => onNavigate('nfts')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 text-lg"
            >
              Explorar NFTs
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="p-8 bg-gray-800 rounded-lg shadow-xl space-y-6">
      <h2 className="text-4xl font-bold text-purple-400 mb-6">Acerca de HighPower: Elevando la Cultura Altcoin</h2>

      <section>
        <h3 className="text-3xl font-semibold text-gray-200 mb-4">1. Resumen Ejecutivo</h3>
        <p className="text-gray-300 leading-relaxed">
          HighPower (HGP) se posiciona como un ecosistema dual de altcoin y Tokens No Fungibles (NFTs) desarrollado sobre la BNB Chain. Nuestra propuesta de valor fundamental radica en la fusión del humor y la cultura altcoin con la tecnología blockchain, buscando generar valor real y fomentar una comunidad sostenible. Enfatizamos la potencia y la energía de un suministro de token estrictamente limitado y una economía sólida, aprovechando la eficiencia, las bajas tarifas y la alta escalabilidad que ofrece la BNB Chain.
        </p>
      </section>

      <section>
        <h3 className="text-3xl font-semibold text-gray-200 mb-4">2. Introducción al Problema y la Oportunidad</h3>
        <p className="text-gray-300 leading-relaxed">
          El panorama actual de las altcoins, si bien es popular, a menudo carece de sostenibilidad a largo plazo. Paralelamente, los NFTs han emergido como una poderosa forma de expresión artística y activos coleccionables digitales. HighPower identifica la necesidad imperante de una plataforma que logre combinar estos dos mundos de manera innovadora y sostenible, trascendiendo la volatilidad inherente para aportar valor y utilidad duraderos.
        </p>
      </section>

      <section>
        <h3 className="text-3xl font-semibold text-gray-200 mb-4">3. HighPower (HGP) - Visión y Misión Detalladas</h3>
        <p className="text-gray-300 leading-relaxed">
          <strong className="text-purple-300">Visión:</strong> Redefinir la percepción del valor de las altcoins, transformándolos en activos digitales apreciables y fomentando una comunidad vibrante, activa y empoderada.
        </p>
        <p className="text-gray-300 leading-relaxed mt-2">
          <strong className="text-purple-300">Misión:</strong> Construir una plataforma descentralizada y robusta que democratice la creación, el intercambio y la monetización de altcoins como activos digitales. Nos enfocamos en ofrecer herramientas intuitivas a la comunidad, mecanismos de rendimiento transparentes y un modelo de autofinanciamiento que asegure la longevidad y el impacto positivo del proyecto.
        </p>
      </section>
    </section>
  );
}

function TokenomicsSection() {
  return (
    <section id="token" className="p-8 bg-gray-800 rounded-lg shadow-xl space-y-6">
      <h2 className="text-4xl font-bold text-purple-400 mb-6">El Token $HGP y su Economía</h2>

      <section>
        <h3 className="text-3xl font-semibold text-gray-200 mb-4">5. El Token $HGP</h3>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li><strong className="text-yellow-300">Nombre:</strong> HighPower</li>
          <li><strong className="text-yellow-300">Símbolo:</strong> $HGP</li>
          <li><strong className="text-yellow-300">Tipo:</strong> BEP-20 Token (Estándar de token fungible de la BNB Chain, utilizado para la economía y gobernanza del ecosistema, complementando los NFTs BEP-721/BEP-1155 de la plataforma).</li>
        </ul>
        <p className="text-gray-300 leading-relaxed mt-4">
          El token $HGP está diseñado para ser el motor económico y de gobernanza que impulsa cada segmento del proyecto, garantizando su funcionalidad, crecimiento y sostenibilidad a largo plazo. Su utilidad abarca:
        </p>
        <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
          <li><strong>Gobernanza:</strong> Fundamental para la toma de decisiones descentralizada a través de la DAO.</li>
          <li><strong>Staking y Recompensas:</strong> Base para todos los mecanismos de rendimiento.</li>
          <li><strong>Medio de Intercambio:</strong> Facilitador de transacciones dentro del Marketplace de NFTs y para el acceso a funciones exclusivas.</li>
          <li><strong>Eficiencia de Capital:</strong> Permite la participación en préstamos, empréstitos y agregación de rendimiento.</li>
          <li><strong>Potencial de Valor:</strong> Suministro estrictamente limitado y mecanismos deflacionarios.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-3xl font-semibold text-gray-200 mb-4">6. Tokenomics (Economía del Token)</h3>
        <p className="text-gray-300 leading-relaxed">
          La economía de $HGP está meticulosamente diseñada para fomentar la escasez, la participación comunitaria, la sostenibilidad operativa y la alineación de incentivos en todos los segmentos del proyecto.
        </p>
        <p className="text-yellow-300 font-bold text-2xl mt-4">Suministro Total: 21,000,000 HGP</p>

        <h4 className="text-2xl font-semibold text-gray-200 mt-6 mb-3">Distribución:</h4>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li><strong>Liquidez Inicial (40%):</strong> Provisión de liquidez robusta en DEXs clave (PancakeSwap, Biswap).</li>
          <li><strong>Recompensas de Staking/Farming (25%):</strong> Incentivar la participación en Mecanismos de Rendimiento.</li>
          <li><strong>Tesorería Comunitaria (15%):</strong> Fondo descentralizado para crecimiento orgánico, marketing, desarrollo y auditorías.</li>
          <li><strong>Equipo (10%):</strong> Sujeto a un calendario de vesting significativo (ej. 2-3 años con cliff).</li>
          <li><strong>Airdrop/Comunidad (5%):</strong> Adopción inicial y recompensas a los primeros usuarios.</li>
          <li><strong>Fondo de Desarrollo/Asociaciones (5%):</strong> Expansión del ecosistema e integración de nuevas funcionalidades.</li>
        </ul>

        <h4 className="text-2xl font-semibold text-gray-200 mt-6 mb-3">Mecanismos de Deflación/Quema:</h4>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li><strong>Quema por Transacción:</strong> Una pequeña tarifa (ej. 0.5%) de cada transacción de HGP.</li>
          <li><strong>Quema por Actividad del Marketplace:</strong> Un porcentaje (ej. 25-50%) de las tarifas del Marketplace de NFTs.</li>
        </ul>
      </section>
    </section>
  );
}

function YieldMechanismsSection() {
  return (
    <section id="yield" className="p-8 bg-gray-800 rounded-lg shadow-xl space-y-6">
      <h2 className="text-4xl font-bold text-purple-400 mb-6">Mecanismos de Rendimiento HighPower</h2>

      <section>
        <h3 className="text-3xl font-semibold text-gray-200 mb-4">7. Mecanismos de Rendimiento</h3>
        <p className="text-gray-300 leading-relaxed">
          HighPower ofrecerá diversas vías para que los holders de $HGP obtengan recompensas por su participación, inspiradas en los modelos más exitosos del espacio DeFi.
        </p>
        <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
          <li><strong>Staking Pool:</strong> Bloquea $HGP por periodos definidos para obtener recompensas adicionales y una porción de las tarifas.</li>
          <li><strong>Liquidity Mining (Farmear):</strong> Recompensas en $HGP por aportar liquidez a pools de $HGP/BNB o $HGP/BUSD en DEXs.</li>
          <li><strong>NFT Staking:</strong> Staking de NFTs específicos de HighPower para generar rendimientos en $HGP o acceder a beneficios exclusivos.</li>
          <li><strong>Préstamos y Empréstitos (Lending & Borrowing):</strong> Deposita $HGP y otros activos para obtener rendimiento pasivo o toma préstamos colateralizados.</li>
          <li><strong>Agregación de Rendimiento y Bóvedas (Yield Aggregation & Vaults):</strong> Estrategias automatizadas para optimizar ganancias en yield farming de la BNB Chain.</li>
          <li><strong>Participación en Ingresos del Protocolo:</strong> Distribución directa de una porción significativa de las comisiones y tarifas del protocolo a los holders de $HGP en staking.</li>
          <li><strong>Recompensas por Participación en Gobernanza:</strong> Incentivos explícitos (airdrops, distribución de comisiones) por participar activamente en la DAO.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-3xl font-semibold text-gray-200 mb-4">8. Autofinanciamiento del Pool de Liquidez</h3>
        <p className="text-gray-300 leading-relaxed">
          El proyecto HighPower implementará un modelo de autofinanciamiento robusto para asegurar la profundidad y el crecimiento continuo de su pool de liquidez.
        </p>
        <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
          <li><strong>Tarifas de Transacción Internas:</strong> Un pequeño porcentaje (ej. 1-2%) de cada transacción del token a través del swap interno.</li>
          <li><strong>Tarifas del Marketplace de NFT:</strong> Un porcentaje significativo (ej. 25-50%) de las tarifas de transacción generadas en el marketplace de NFTs.</li>
          <li><strong>Asignación Estratégica de Tesorería:</strong> La DAO podrá utilizar una porción de los fondos de la tesorería para aportar liquidez.</li>
          <li><strong>Recompensas de Incentivo para LP (Liquidity Providers):</strong> Recompensas adicionales en $HGP a los proveedores de liquidez externos.</li>
        </ul>
      </section>
    </section>
  );
}

function NftGallerySection({ isConnected, writeContract, isMinting, isConfirming, hash, confirmError, showCustomModal, refetchNftBalance, isConfirmed }) {
  const [tokenURI, setTokenURI] = useState('');

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

  useEffect(() => {
    if (isConfirmed) { // Solo si la transacción es exitosa
      refetchNftBalance(); // Vuelve a leer el balance después de una acuñación exitosa
      showCustomModal('¡NFT acuñado con éxito! Tu balance se ha actualizado.');
      setTokenURI(''); // Limpia el campo de entrada
    } else if (confirmError) { // Si hay un error en la confirmación
      showCustomModal(`Error al confirmar la acuñación: ${confirmError.message}. Por favor, verifica tu transacción en el explorador de bloques.`);
    }
    // No mostramos modal para 'isMinting' o 'isConfirming' aquí, ya que el estado del botón lo maneja.
  }, [isConfirmed, confirmError, refetchNftBalance, showCustomModal]);


  return (
    <section id="nfts" className="p-8 bg-gray-800 rounded-lg shadow-xl space-y-6">
      <h2 className="text-4xl font-bold text-purple-400 mb-6">Galería de NFT y Marketplace</h2>

      <section>
        <h3 className="text-3xl font-semibold text-gray-200 mb-4">9. Galería de NFT y Marketplace</h3>
        <p className="text-gray-300 leading-relaxed">
          La Galería y Marketplace de NFT de HighPower será el epicentro de la creatividad altcoin en la BNB Chain. Es un espacio vibrante donde los usuarios pueden crear (mintear), comprar, vender y subastar NFTs de altcoins únicas.
        </p>
        <h4 className="text-2xl font-semibold text-gray-200 mt-4 mb-3">Funcionalidades Clave:</h4>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li><strong>Minteo Sencillo:</strong> Herramientas amigables para que los usuarios minteen sus altcoins como NFTs (BEP-721 o BEP-1155).</li>
          <li><strong>Listado y Venta:</strong> Opciones flexibles para la venta a precio fijo y subastas.</li>
          <li><strong>Filtros y Búsqueda:</strong> Funcionalidades robustas para facilitar el descubrimiento y la navegación de NFTs.</li>
          <li><strong>Perfiles de Usuario:</strong> Espacios personalizados para que los usuarios muestren sus colecciones.</li>
          <li><strong>Soporte de Royalties:</strong> Sistema de regalías para asegurar que los creadores reciban un porcentaje en las ventas secundarias.</li>
          <li><strong>Integración con Wallets de BNB Chain:</strong> Compatibilidad total con billeteras populares como MetaMask y Trust Wallet.</li>
          <li><strong>Colecciones Oficiales de HGP NFTs:</strong> Lanzamientos periódicos de NFTs exclusivos.</li>
        </ul>
      </section>

      <section className="mt-8 pt-6 border-t border-gray-700">
        <h3 className="text-3xl font-semibold text-blue-400 mb-4">Acuñar tu Propio NFT HighPower</h3>
        <div className="mb-4">
          <label htmlFor="tokenURI" className="block text-gray-300 text-sm font-bold mb-2">
            URI del Token (ej. IPFS hash/URL a los metadatos del NFT):
          </label>
          <input
            type="text"
            id="tokenURI"
            value={tokenURI}
            onChange={(e) => setTokenURI(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
            placeholder="ipfs://Qme... o https://tu-nft.com/metadata.json"
          />
        </div>
        <button
          onClick={handleMintNFT}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          type="button"
          disabled={isMinting || isConfirming}
        >
          {isMinting ? 'Acuñando...' : isConfirming ? 'Confirmando Transacción...' : 'Acuñar NFT'}
        </button>

        {hash && (
          <p className="mt-4 text-sm text-gray-300">
            Transacción enviada: <a href={`https://testnet.bscscan.com/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline break-all">Ver en BSCScan (Testnet)</a>
          </p>
        )}
        {confirmError && <p className="mt-2 text-red-500 font-semibold">Error al confirmar la acuñación: {confirmError.message}</p>}
      </section>
    </section>
  );
}

function SwapSection() {
  return (
    <section id="swap" className="p-8 bg-gray-800 rounded-lg shadow-xl space-y-6">
      <h2 className="text-4xl font-bold text-purple-400 mb-6">Swap (Intercambio en la Web)</h2>

      <section>
        <h3 className="text-3xl font-semibold text-gray-200 mb-4">10. Swap (Intercambio en la Web)</h3>
        <p className="text-gray-300 leading-relaxed">
          HighPower contará con un módulo de intercambio directo para facilitar la adquisición y venta de tokens $HGP.
        </p>
        <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
          <li><strong>Integración Directa:</strong> Módulo de swap integrado directamente en la plataforma web para una experiencia fluida.</li>
          <li><strong>Funcionalidad:</strong> Permitirá a los usuarios intercambiar BNB (o BUSD/USDT) por $HGP y viceversa, interactuando con pools de liquidez en DEXs clave como PancakeSwap.</li>
          <li><strong>Interfaz Sencilla:</strong> Diseño intuitivo para una experiencia de usuario fluida, incluso para aquellos nuevos en DeFi.</li>
          <li><strong>Gráficas de Precios y Tendencias:</strong> Integración con herramientas de gráficos para mostrar el precio en tiempo real del token $HGP, volumen de trading y capitalización de mercado.</li>
        </ul>
      </section>

      <section className="mt-8 pt-6 border-t border-gray-700">
        <h3 className="text-3xl font-semibold text-green-400 mb-4">Simulador de Swap (Ejemplo)</h3>
        <div className="bg-gray-700 p-6 rounded-lg shadow-md">
          <p className="text-gray-300 mb-4">Aquí se integraría una interfaz de swap real, conectada a los contratos inteligentes de DEXs. Por ahora, es una simulación visual.</p>
          <div className="mb-4">
            <label htmlFor="amountToSwap" className="block text-gray-400 text-lg font-bold mb-2">
              Cantidad a Intercambiar:
            </label>
            <input
              type="number"
              id="amountToSwap"
              placeholder="Ej. 1 BNB"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 text-xl"
            />
          </div>
          <div className="text-center my-4">
            <span className="text-blue-400 text-4xl">↓</span>
          </div>
          <div className="mb-6">
            <label htmlFor="receivedAmount" className="block text-gray-400 text-lg font-bold mb-2">
              Cantidad Recibida ($HGP):
            </label>
            <input
              type="text"
              id="receivedAmount"
              readOnly
              placeholder="Calculado automáticamente"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-gray-300 cursor-not-allowed text-xl"
            />
          </div>
          <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 text-xl">
            Realizar Swap
          </button>
          <p className="text-gray-400 text-sm mt-4">
            *Las gráficas de precios en tiempo real se mostrarían aquí, utilizando APIs de datos de mercado.*
          </p>
          <div className="h-64 bg-gray-700 mt-6 rounded-lg flex items-center justify-center text-gray-500">
            [Gráfica de Precios $HGP - Placeholder]
          </div>
        </div>
      </section>
    </section>
  );
}

function DaoSection() {
  return (
    <section id="dao" className="p-8 bg-gray-800 rounded-lg shadow-xl space-y-6">
      <h2 className="text-4xl font-bold text-purple-400 mb-6">Gobernanza Descentralizada (DAO)</h2>

      <section>
        <h3 className="text-3xl font-semibold text-gray-200 mb-4">11. Gobernanza Descentralizada (DAO)</h3>
        <p className="text-gray-300 leading-relaxed">
          La descentralización es un pilar fundamental de HighPower, empoderando a su comunidad a través de una Organización Autónoma Descentralizada (DAO).
        </p>
        <p className="text-gray-300 leading-relaxed mt-4">
          Se establecerá una DAO donde los holders de $HGP podrán votar sobre decisiones críticas del proyecto, incluyendo:
        </p>
        <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
          <li>Distribución de fondos de la tesorería comunitaria.</li>
          <li>Modificaciones a los tokenomics.</li>
          <li>Propuestas para nuevas características de la plataforma.</li>
          <li>Establecimiento de asociaciones estratégicas.</li>
        </ul>
      </section>

      <section className="mt-8 pt-6 border-t border-gray-700">
        <h3 className="text-3xl font-semibold text-indigo-400 mb-4">Propuestas Activas de la DAO</h3>
        <div className="bg-gray-700 p-6 rounded-lg shadow-md">
          <p className="text-gray-300 mb-4">
            Aquí se listarían las propuestas activas de la DAO, permitiendo a los holders de $HGP revisar los detalles y emitir su voto.
          </p>
          <div className="border border-indigo-500 rounded-lg p-4 mb-4">
            <h4 className="text-xl font-bold text-indigo-300 mb-2">Propuesta #001: Aumentar el porcentaje de quema por transacción</h4>
            <p className="text-gray-300 text-sm">Estado: Abierta</p>
            <p className="text-gray-400 text-sm">Fecha de cierre: 2025-07-15</p>
            <button className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg text-sm">
              Ver Detalles y Votar
            </button>
          </div>
          <div className="border border-indigo-500 rounded-lg p-4">
            <h4 className="text-xl font-bold text-indigo-300 mb-2">Propuesta #002: Financiamiento de campaña de marketing global</h4>
            <p className="text-gray-300 text-sm">Estado: Abierta</p>
            <p className="text-gray-400 text-sm">Fecha de cierre: 2025-07-20</p>
            <button className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg text-sm">
              Ver Detalles y Votar
            </button>
          </div>
        </div>
      </section>
    </section>
  );
}

function RoadmapSection() {
  return (
    <section id="roadmap" className="p-8 bg-gray-800 rounded-lg shadow-xl space-y-6">
      <h2 className="text-4xl font-bold text-purple-400 mb-6">Roadmap de HighPower</h2>

      <section>
        <h3 className="text-3xl font-semibold text-gray-200 mb-4">15. Roadmap (Línea de Tiempo Sugerida para BNB Chain)</h3>
        <p className="text-gray-300 leading-relaxed">
          El roadmap de HighPower es una guía estratégica para el desarrollo y expansión del ecosistema.
        </p>

        <div className="relative mt-8">
          <div className="border-l-4 border-purple-500 absolute h-full left-1/2 transform -translate-x-1/2"></div> {/* Línea central */}

          {/* Fase 1 */}
          <div className="mb-8 flex items-center justify-between flex-row-reverse md:flex-row">
            <div className="order-1 w-5/12 text-right">
              <h4 className="text-2xl font-bold text-yellow-300">Fase 1: Concepción y Lanzamiento Inicial (Q3 2025)</h4>
              <ul className="list-disc list-inside text-gray-300 mt-2 text-left md:text-right">
                <li>Diseño y desarrollo de contratos inteligentes $HGP (BEP-20) y NFTs (BEP-721).</li>
                <li>Auditoría inicial del contrato del token y NFT.</li>
                <li>Desarrollo del sitio web principal con Whitepaper, Tokenomics y Roadmap interactivo.</li>
                <li>Lanzamiento del token $HGP en la BNB Chain.</li>
                <li>Provisión de liquidez inicial en un DEX (PancakeSwap/Biswap).</li>
                <li>Lanzamiento de la campaña de marketing inicial y construcción de comunidad.</li>
              </ul>
            </div>
            <div className="z-10 flex items-center order-1 bg-purple-500 shadow-xl w-10 h-10 rounded-full">
              <h1 className="mx-auto font-semibold text-lg text-white">1</h1>
            </div>
            <div className="order-1 w-5/12"></div> {/* Espacio vacío para balancear */}
          </div>

          {/* Fase 2 */}
          <div className="mb-8 flex items-center justify-between md:flex-row-reverse">
            <div className="order-1 w-5/12 text-left">
              <h4 className="text-2xl font-bold text-yellow-300">Fase 2: Expansión de Utilidad y Rendimientos (Q4 2025)</h4>
              <ul className="list-disc list-inside text-gray-300 mt-2">
                <li>Implementación y auditoría del contrato inteligente de Staking para $HGP.</li>
                <li>Lanzamiento del Staking Pool en la plataforma web.</li>
                <li>Desarrollo y lanzamiento del módulo de Swap integrado en la web.</li>
                <li>Integración de gráficas de precios del token en tiempo real en la web.</li>
                <li>Lanzamiento de la primera colección de NFTs "HighPower Originals".</li>
              </ul>
            </div>
            <div className="z-10 flex items-center order-1 bg-purple-500 shadow-xl w-10 h-10 rounded-full">
              <h1 className="mx-auto font-semibold text-lg text-white">2</h1>
            </div>
            <div className="order-1 w-5/12"></div>
          </div>

          {/* Fase 3 */}
          <div className="mb-8 flex items-center justify-between flex-row-reverse md:flex-row">
            <div className="order-1 w-5/12 text-right">
              <h4 className="text-2xl font-bold text-yellow-300">Fase 3: Ecosistema NFT y Gobernanza (Q1 2026)</h4>
              <ul className="list-disc list-inside text-gray-300 mt-2 text-left md:text-right">
                <li>Desarrollo y auditoría del contrato inteligente del Marketplace de NFTs.</li>
                <li>Lanzamiento del Marketplace de NFTs en la plataforma web.</li>
                <li>Implementación del sistema de regalías para creadores en el marketplace.</li>
                <li>Lanzamiento de la DAO de HighPower (contrato de gobernanza).</li>
                <li>Primera propuesta de gobernanza votada por la comunidad.</li>
              </ul>
            </div>
            <div className="z-10 flex items-center order-1 bg-purple-500 shadow-xl w-10 h-10 rounded-full">
              <h1 className="mx-auto font-semibold text-lg text-white">3</h1>
            </div>
            <div className="order-1 w-5/12"></div>
          </div>

          {/* Fase 4 */}
          <div className="mb-8 flex items-center justify-between md:flex-row-reverse">
            <div className="order-1 w-5/12 text-left">
              <h4 className="text-2xl font-bold text-yellow-300">Fase 4: Crecimiento y Sostenibilidad (Q2 2026 en adelante)</h4>
              <ul className="list-disc list-inside text-gray-300 mt-2">
                <li>Establecimiento de asociaciones estratégicas con otros proyectos de la BNB Chain.</li>
                <li>Integración de herramientas de creación de altcoins / NFTs directamente en la plataforma.</li>
                <li>Expansión del sistema de rendimientos (ej. farming de liquidez, staking de NFTs).</li>
                <li>Optimización continua de la plataforma y mejora de la experiencia de usuario.</li>
                <li>Campañas de marketing globales y expansión a nuevos mercados.</li>
              </ul>
            </div>
            <div className="z-10 flex items-center order-1 bg-purple-500 shadow-xl w-10 h-10 rounded-full">
              <h1 className="mx-auto font-semibold text-lg text-white">4</h1>
            </div>
            <div className="order-1 w-5/12"></div>
          </div>
        </div>
      </section>
    </section>
  );
}

function TechStackSection() {
  return (
    <section id="tech" className="p-8 bg-gray-800 rounded-lg shadow-xl space-y-6">
      <h2 className="text-4xl font-bold text-purple-400 mb-6">Arquitectura e Implementación Tecnológica</h2>

      <section>
        <h3 className="text-3xl font-semibold text-gray-200 mb-4">16. Arquitectura e Implementación Tecnológica</h3>
        <p className="text-gray-300 leading-relaxed">
          HighPower se construirá sobre una base tecnológica sólida y escalable, utilizando un entorno de desarrollo eficiente y herramientas modernas.
        </p>

        <h4 className="text-2xl font-semibold text-gray-200 mt-6 mb-3">Blockchain Principal:</h4>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li><strong>BNB Chain:</strong> Seleccionada por su velocidad, bajo costo transaccional, alta escalabilidad y compatibilidad con la Máquina Virtual de Ethereum (EVM).</li>
        </ul>

        <h4 className="text-2xl font-semibold text-gray-200 mt-6 mb-3">Contratos Inteligentes:</h4>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li><strong>Lenguaje:</strong> Solidity.</li>
          <li><strong>Framework:</strong> Hardhat (simplifica el desarrollo y despliegue de contratos en EVM).</li>
          <li><strong>Estándares:</strong> BEP-20 para el token HGP, y BEP-721/BEP-1155 para los NFTs.</li>
          <li><strong>Herramientas:</strong> hardhat-cli.</li>
        </ul>

        <h4 className="text-2xl font-semibold text-gray-200 mt-6 mb-3">Frontend (DApp):</h4>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li><strong>Framework JS:</strong> React (con Next.js para Server-Side Rendering/Static Site Generation y optimización).</li>
          <li><strong>Lenguaje:</strong> JavaScript/TypeScript (TypeScript es altamente recomendado para robustez y escalabilidad).</li>
          <li><strong>Estilos:</strong> Tailwind CSS (para eficiencia y diseño responsivo).</li>
          <li><strong>Manejo de Estado:</strong> Opciones como Zustand, Jotai o React Context API.</li>
          <li><strong>Conectividad BNB Chain:</strong> Librerías como wagmi, viem y MetaMask SDK/web3.js para la interacción con billeteras EVM.</li>
          <li><strong>Gráficos:</strong> Librerías como Chart.js o Recharts, alimentadas por APIs de datos de precios.</li>
        </ul>

        <h4 className="text-2xl font-semibold text-gray-200 mt-6 mb-3">Backend (APIs Auxiliares/Indexadores - si es necesario):</h4>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li><strong>Lenguaje:</strong> Node.js.</li>
          <li><strong>Framework:</strong> Express.js o Fastify.</li>
          <li><strong>Base de Datos:</strong> PostgreSQL, MongoDB (para datos no blockchain).</li>
          <li><strong>Despliegue Serverless:</strong> Plataformas como Vercel, o servicios cloud como AWS Lambda/Google Cloud Functions.</li>
        </ul>

        <h4 className="text-2xl font-semibold text-gray-200 mt-6 mb-3">Base de Datos Descentralizada (Opcional/IPFS):</h4>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>Para almacenar metadatos inmutables de NFTs y otros datos de la galería. Se priorizarán soluciones como Arweave o IPFS.</li>
        </ul>

        <h4 className="text-2xl font-semibold text-gray-200 mt-6 mb-3">Entorno de Desarrollo Integrado (IDE) y Extensiones:</h4>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li><strong>VS Code:</strong> IDE principal.</li>
          <li><strong>Extensiones Recomendadas:</strong> Solidity Visual Developer, Prettier, ESLint, Tailwind CSS IntelliSense, GitHub Copilot.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-3xl font-semibold text-gray-200 mb-4">17. Ideas Adicionales para Profesionalidad y Escalabilidad</h3>
        <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
          <li><strong>Auditorías de Seguridad Continuas:</strong> Auditorías periódicas a medida que se implementen nuevas funcionalidades.</li>
          <li><strong>Programa de Bug Bounty:</strong> Incentivar a la comunidad de seguridad a identificar vulnerabilidades.</li>
          <li><strong>Asociaciones Estratégicas:</strong> Colaboraciones con proyectos consolidados en la BNB Chain.</li>
          <li><strong>Incentivos para Creadores de Altcoins:</strong> Programas de subvenciones o concursos para artistas y creadores.</li>
          <li><strong>Gamificación:</strong> Introducción de elementos de juego.</li>
          <li><strong>Expansión Cross-Chain (Futuro):</strong> Explorar puentes a otras blockchains relevantes.</li>
          <li><strong>Desarrollo de una Aplicación Móvil (Futuro):</strong> Aplicación nativa para iOS y Android.</li>
          <li><strong>Educación y Recursos:</strong> Desarrollo de una "Academia HighPower".</li>
          <li><strong>Herramientas de Análisis Avanzadas:</strong> Provisión de dashboards y análisis detallados.</li>
          <li><strong>Comunidad Activa y Moderada:</strong> Establecimiento de canales de comunicación bien moderados.</li>
          <li><strong>Transparencia Financiera:</strong> Publicación regular de informes.</li>
        </ul>
      </section>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="p-8 bg-gray-800 rounded-lg shadow-xl space-y-6 text-center">
      <h2 className="text-4xl font-bold text-purple-400 mb-6">Contacto y Redes Sociales</h2>

      <section>
        <h3 className="text-3xl font-semibold text-gray-200 mb-4">14. Contacto y Redes Sociales</h3>
        <p className="text-gray-300 leading-relaxed mb-6">
          Para una comunicación abierta y el fomento de la comunidad, HighPower mantendrá una presencia activa en:
        </p>
        <div className="flex justify-center items-center space-x-6 text-4xl">
          <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors duration-300" aria-label="Telegram">
            <i className="fab fa-telegram"></i> {/* Placeholder for Telegram icon */}
          </a>
          <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors duration-300" aria-label="Discord">
            <i className="fab fa-discord"></i> {/* Placeholder for Discord icon */}
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300" aria-label="X (Twitter)">
            <i className="fab fa-twitter"></i> {/* Placeholder for Twitter icon */}
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300" aria-label="GitHub">
            <i className="fab fa-github"></i> {/* Placeholder for GitHub icon */}
          </a>
        </div>
        <p className="text-gray-400 text-sm mt-8">
          (Otros canales relevantes se añadirán según el crecimiento)
        </p>
      </section>

      <section className="mt-8 pt-6 border-t border-gray-700">
        <h3 className="text-3xl font-semibold text-gray-200 mb-4">13. Equipo</h3>
        <p className="text-gray-300 leading-relaxed">
          El equipo detrás de HighPower está comprometido con la visión del proyecto.
          En las fases iniciales, se mantendrá el anonimato, pero se enfatizará el compromiso con la comunidad y la promesa de transparencia creciente a medida que el proyecto madure y gane tracción.
        </p>
      </section>

      <section className="mt-8 pt-6 border-t border-gray-700">
        <h3 className="text-3xl font-semibold text-gray-200 mb-4">12. Seguridad y Auditorías</h3>
        <p className="text-gray-300 leading-relaxed">
          El compromiso con la seguridad es primordial para HighPower. Garantizar la integridad y la seguridad de los contratos inteligentes y la plataforma en su totalidad. Se realizarán auditorías de seguridad exhaustivas por parte de empresas de renombre antes del lanzamiento de cualquier componente crítico y de forma periódica.
        </p>
      </section>
    </section>
  );
}


// ==========================================================
// COMPONENTE PRINCIPAL DE LA APLICACIÓN (AppContent y App)
// ==========================================================
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

  const [currentSection, setCurrentSection] = useState('dashboard');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Manejador para el modal personalizado
  const showCustomModal = (msg) => {
    setMessage(msg);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setMessage('');
  };

  // Función para renderizar la sección actual
  const renderSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return (
          <DashboardSection
            address={address}
            balanceData={balanceData}
            nftBalance={nftBalance}
            isLoadingNftBalance={isLoadingNftBalance}
            nftBalanceError={nftBalanceError}
            isConnected={isConnected}
            connect={connect}
            connectors={connectors}
            pendingConnector={pendingConnector}
            onNavigate={setCurrentSection}
          />
        );
      case 'about':
        return <AboutSection />;
      case 'token':
        return <TokenomicsSection />;
      case 'yield':
        return <YieldMechanismsSection />;
      case 'nfts':
        return (
          <NftGallerySection
            isConnected={isConnected}
            writeContract={writeContract}
            isMinting={isMinting}
            isConfirming={isConfirming}
            hash={hash}
            confirmError={confirmError}
            showCustomModal={showCustomModal}
            refetchNftBalance={refetchNftBalance}
            isConfirmed={isConfirmed}
          />
        );
      case 'swap':
        return <SwapSection />;
      case 'dao':
        return <DaoSection />;
      case 'roadmap':
        return <RoadmapSection />;
      case 'tech':
        return <TechStackSection />;
      case 'contact':
        return <ContactSection />;
      default:
        return <DashboardSection
            address={address}
            balanceData={balanceData}
            nftBalance={nftBalance}
            isLoadingNftBalance={isLoadingNftBalance}
            nftBalanceError={nftBalanceError}
            isConnected={isConnected}
            connect={connect}
            connectors={connectors}
            pendingConnector={pendingConnector}
            onNavigate={setCurrentSection}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col font-inter">
      {/* Modal personalizado */}
      {showModal && <CustomModal message={message} onClose={closeModal} />}

      {/* Cursor Trail - ¡Añadido aquí! */}
      <CursorTrail />

      {/* Navbar siempre visible */}
      <Navbar
        onNavigate={setCurrentSection}
        isConnected={isConnected}
        disconnect={disconnect}
        address={address}
      />

      {/* Contenido principal con padding superior para evitar que se superponga con el navbar */}
      <main className="flex-grow container mx-auto p-4 py-8">
        {renderSection()}
      </main>

      <footer className="bg-gray-900 shadow-inner p-6 text-center text-gray-500 text-sm mt-8">
        <p>© 2025 HighPower DApp. Todos los derechos reservados.</p>
      </footer>
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
