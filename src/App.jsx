// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useConnect,
  useDisconnect,
} from 'wagmi';
import { bsc, bscTestnet, mainnet, sepolia } from 'wagmi/chains'; 
import { formatUnits } from 'viem'; 

// Importa los ABIs de tus contratos
import MyNFTABI from './abis/MyNFT.json';
import SimpleTokenABI from './abis/SimpleToken.json';

// Importa los componentes y secciones
import CursorTrail from './components/CursorTrail';
import CustomModal from './components/CustomModal';
import Navbar from './components/Navbar'; 
import Sidebar from './components/Sidebar'; 
import HomePage from './sections/HomePage'; 
import DashboardSection from './sections/DashboardSection';
import AboutSection from './sections/AboutSection';
import TokenomicsSection from './sections/TokenomicsSection';
import YieldMechanismsSection from './sections/YieldMechanismsSection';
import NftGallerySection from './sections/NftGallerySection';
import SwapSection from './sections/SwapSection';
import DaoSection from './sections/DaoSection';
import RoadmapSection from './sections/RoadmapSection'; 
import TechStackSection from './sections/TechStackSection';
import ContactSection from './sections/ContactSection';
import WhitepaperSection from './sections/WhitepaperSection'; 
import SupportSection from './sections/SupportSection';
import AuditSecuritySection from './sections/AuditSecuritySection';
import PartnersEcosystemSection from './sections/PartnersEcosystemSection';
import TeamSection from './sections/TeamSection';
import FAQSection from './sections/FAQSection';
import NewsAnnouncementsSection from './sections/NewsAnnouncementsSection';
import IncubationSection from './sections/IncubationSection';

// --- Constantes de Contratos ---
// Asumiendo que estas son las direcciones de la testnet que quieres usar
const HGP_ERC20_ADDRESS = '0x03Fd2cE62B4BB54f09716f9588A5E13bC0756773'; 
const HPNFT_ERC721_ADDRESS = '0x11Cae128d6AD9A00ceAF179171321F2E0abE30a8'; 
// Las direcciones de Staking y DAO se mantendrán como placeholders por ahora, ya que no están desplegadas.
const HGP_STAKING_ADDRESS = '0x3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E'; 
const HGP_DAO_ADDRESS = '0x4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2F';


function AppContent() {
  const [currentSection, setCurrentSection] = useState('home'); 
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const { address, isConnected, chain } = useAccount();
  const { data: balanceData } = useBalance({
    address: address,
    query: {
      enabled: isConnected && !!address,
    },
  });

  const { connect, connectors, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    console.log("Estado de la conexión (desde AppContent):", { address, isConnected, chain });
    if (address) {
      console.log("  Dirección de HGP ERC20 configurada:", HGP_ERC20_ADDRESS);
      console.log("  Dirección de HPNFT ERC721 configurada:", HPNFT_ERC721_ADDRESS);
    }
  }, [address, isConnected, chain]);

  const mockNftMint = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log("Simulando minting de NFT...");
        resolve({ hash: '0xmocknftmint123' + Math.random().toString(16).substring(2, 10) });
      }, 2000);
    });
  };

  const mockStakeHGP = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log("Simulando staking de HGP...");
        resolve({ hash: '0xmockstakehgp123' + Math.random().toString(16).substring(2, 10) });
      }, 2000);
    });
  };

  const mockUnstakeHGP = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log("Simulando unstaking de HGP...");
        resolve({ hash: '0xmockunstakehgp123' + Math.random().toString(16).substring(2, 10) });
      }, 2000);
    });
  };

  const mockClaimRewards = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log("Simulando reclamación de recompensas...");
        resolve({ hash: '0xmockclaimrewards123' + Math.random().toString(16).substring(2, 10) });
      }, 2000);
    });
  };

  const mockCreateProposal = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log("Simulando creación de propuesta DAO...");
        resolve({ hash: '0xmockproposaal123' + Math.random().toString(16).substring(2, 10) });
      }, 2000);
    });
  };

  const mockVoteProposal = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log("Simulando votación de propuesta DAO...");
        resolve({ hash: '0xmockvote123' + Math.random().toString(16).substring(2, 10) });
      }, 2000);
    });
  };


  const { data: nftBalanceData, refetch: refetchNftBalance } = useReadContract({
    abi: MyNFTABI.abi, 
    address: HPNFT_ERC721_ADDRESS, 
    functionName: 'balanceOf',
    args: [address],
    query: {
      enabled: isConnected && !!address,
      watch: true, 
    },
  });

  const { data: hgpTokenBalanceData, refetch: refetchHGPBalance } = useReadContract({
    abi: SimpleTokenABI.abi, 
    address: HGP_ERC20_ADDRESS, 
    functionName: 'balanceOf',
    args: [address],
    query: {
      enabled: isConnected && !!address,
      watch: true, 
    },
  });

  const { data: hgpDecimalsData } = useReadContract({
    abi: SimpleTokenABI.abi,
    address: HGP_ERC20_ADDRESS,
    functionName: 'decimals',
    query: {
      enabled: isConnected && !!address,
      staleTime: Infinity, 
    },
  });

  const { data: hgpTotalSupplyData } = useReadContract({
    abi: SimpleTokenABI.abi,
    address: HGP_ERC20_ADDRESS,
    functionName: 'totalSupply',
    query: {
      enabled: isConnected && !!address,
      staleTime: Infinity, 
    },
  });

  useEffect(() => {
    console.log("Datos de Contratos (después de Wagmi hooks):", { balanceData, hgpTokenBalanceData, hgpDecimalsData, hgpTotalSupplyData, nftBalanceData });
  }, [balanceData, hgpTokenBalanceData, nftBalanceData, hgpDecimalsData, hgpTotalSupplyData]);

  const { data: hash, isPending: isMinting, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: confirmError } = useWaitForTransactionReceipt({
    hash: hash,
  });

  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const showCustomModal = useCallback((msg) => {
    setMessage(msg);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setMessage('');
  }, []);

  useEffect(() => {
    if (isConfirmed) {
      showCustomModal('¡Transacción completada con éxito!');
    } else if (confirmError) {
      showCustomModal(`Error en la transacción: ${confirmError.shortMessage || confirmError.message}`);
    }
  }, [isConfirmed, confirmError, showCustomModal]);

  useEffect(() => {
    if (isConnected && address) {
      refetchHGPBalance();
      refetchNftBalance();
    }
  }, [isConnected, address, refetchHGPBalance, refetchNftBalance]);

  const handleLaunchDapp = useCallback(() => {
    setCurrentSection('news-announcements'); 
  }, []);

  const renderCurrentSection = () => {
    const decimals = hgpDecimalsData !== undefined ? Number(hgpDecimalsData) : 18;
    const formattedHgpBalance = hgpTokenBalanceData !== undefined ? formatUnits(hgpTokenBalanceData, decimals) : '0.0';
    const formattedTotalHGPSupply = hgpTotalSupplyData !== undefined ? formatUnits(hgpTotalSupplyData, decimals) : 'Cargando...';
    const formattedNftCount = nftBalanceData !== undefined ? nftBalanceData.toString() : '0';

    const commonSectionProps = {
      isConnected,
      onNavigate: setCurrentSection,
      showCustomModal,
      writeContract,
      isMinting,
      isConfirming,
      hash,
      confirmError,
      refetchNftBalance,
      isConfirmed,
      address,
      balanceData,
      hgpBalance: formattedHgpBalance,
      nftCount: formattedNftCount,
      totalHGPSupply: formattedTotalHGPSupply,
      HGP_ERC20_ADDRESS,
      HPNFT_ERC721_ADDRESS,
      mockMintNFT: mockNftMint,
      mockStakeHGP,
      mockUnstakeHGP,
      mockClaimRewards,
      mockCreateProposal,
      mockVoteProposal,
    };

    switch (currentSection) {
      case 'news-announcements':
        return <NewsAnnouncementsSection />;
      case 'dashboard':
        return <DashboardSection {...commonSectionProps} />;
      case 'whitepaper':
        return <WhitepaperSection />;
      case 'roadmap':
        return <RoadmapSection />;
      case 'audit-security':
        return <AuditSecuritySection />;
      case 'tokenomics':
        return <TokenomicsSection />; 
      case 'yield':
        return <YieldMechanismsSection {...commonSectionProps} />;
      case 'nfts':
        return <NftGallerySection {...commonSectionProps} />;
      case 'dao':
        return <DaoSection {...commonSectionProps} />; 
      case 'swap':
        return <SwapSection {...commonSectionProps} />; 
      case 'partners-ecosystem':
        return <PartnersEcosystemSection />;
      case 'team':
        return <TeamSection />;
      case 'faq':
        return <FAQSection />;
      case 'support':
        return <SupportSection />;
      case 'contact':
        return <ContactSection />;
      case 'about':
        return <AboutSection />;
      case 'tech':
        return <TechStackSection />;
      case 'incubation':
        return <IncubationSection />;
      default:
        return <NewsAnnouncementsSection />; 
    }
  };

  return (
    <div className="min-h-screen bg-[var(--dark-gray)] text-[var(--light-gray-text)] flex flex-col font-sans"> 
      {/* Modal de Mensajes */}
      {showModal && <CustomModal message={message} onClose={closeModal} />}

      {/* Modal de Video */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl h-[60vh] md:h-[70vh] flex flex-col">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute -top-4 -right-4 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center text-xl font-bold z-10 shadow-lg"
              aria-label="Cerrar video"
            >
              &times;
            </button>
            <iframe
              src="https://www.youtube.com/embed/GNh0i7Sg_p4?autoplay=1&mute=0"
              title="Explicación de Web3, Blockchain y Finanzas Descentralizadas"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="flex-grow rounded-lg"
            ></iframe>
          </div>
        </div>
      )}

      <CursorTrail />

      {currentSection === 'home' ? (
        <HomePage onLaunchDapp={handleLaunchDapp} onShowVideo={() => setShowVideoModal(true)} />
      ) : (
        <>
          {/* Barra Superior */}
          <Navbar
            isConnected={isConnected}
            address={address}
            balanceData={balanceData}
            hgpBalance={hgpTokenBalanceData !== undefined && hgpDecimalsData !== undefined ? formatUnits(hgpTokenBalanceData, Number(hgpDecimalsData)) : '0.0'}
            connect={connect}
            connectors={connectors}
            pendingConnector={pendingConnector}
          />
          
          {/* Layout principal: Sidebar a la izquierda y Contenido Principal a la derecha */}
          <div className="flex flex-1 pt-[72px]"> 
            {/* Sidebar Lateral */}
            <Sidebar onNavigate={setCurrentSection} currentSection={currentSection} onExpandChange={setIsSidebarExpanded} />

            {/* Área de Contenido Principal */}
            <main className={`flex-grow p-4 md:p-6 lg:p-8 transition-all duration-300 ease-in-out
                              ${isSidebarExpanded ? 'ml-56 lg:ml-64' : 'ml-20 lg:ml-24'}`}> 
              {renderCurrentSection()}
            </main>
          </div>

          {/* Footer */}
          <footer className={`bg-gray-900 shadow-inner p-6 text-center text-gray-300 text-sm border-t border-purple-700 transition-all duration-300 ease-in-out
                              ${isSidebarExpanded ? 'ml-56 lg:ml-64' : 'ml-20 lg:ml-24'}`}> 
            <p>© 2025 HighPower DApp. Todos los derechos reservados.</p>
          </footer>
        </>
      )}
    </div>
  );
}

// exportamos el componente principal
export default function App() {
  return (
    <AppContent />
  );
}
