// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  useAccount,
  useBalance,
  useReadContract,
  useConnect,
  useDisconnect,
} from 'wagmi';
import { bscTestnet } from 'wagmi/chains'; // Solo necesitamos bscTestnet para el publicClient

// Importa todas las configuraciones de contratos desde nuestro archivo centralizado
import {
  HGP_TOKEN_CONFIG,
  NFT_CONTRACT_CONFIG,
  STAKING_CONTRACT_CONFIG,
  DAO_CONTRACT_CONFIG,
  UI_PROPOSAL_THRESHOLD_HGP // También se exporta para uso general si es necesario en la UI
} from "./constants/contract-config.js"; // Ruta correcta: ./constants/contract-config.js

import { formatUnits, createPublicClient, http } from 'viem';

// Importa tus componentes y secciones (tal como los tenías)
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


// Configuración de un cliente público de Viem para llamadas de lectura directas
// Útil para llamadas que no necesitan un wallet conectado (ej: total supply, propuestas DAO)
const publicClient = createPublicClient({
  chain: bscTestnet,
  transport: http(bscTestnet.rpcUrls.default.http[0]),
});


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

  // Estados y funciones para el modal personalizado
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


  // --- Lectura de datos de contrato (HGP Token y NFT) directamente en App.jsx para pasar a Navbar/Dashboard ---
  // HGP Token Balance del usuario
  const { data: hgpTokenBalanceData, refetch: refetchHGPBalance } = useReadContract({
    ...HGP_TOKEN_CONFIG, // Usa la configuración del archivo centralizado
    functionName: 'balanceOf',
    args: [address],
    query: {
      enabled: isConnected && !!address,
      watch: true, 
    },
  });

  // Decimals del token HGP
  const { data: hgpDecimalsData } = useReadContract({
    ...HGP_TOKEN_CONFIG,
    functionName: 'decimals',
    query: {
      enabled: isConnected && !!address,
      staleTime: Infinity, 
    },
  });

  // Total Supply del token HGP
  const { data: hgpTotalSupplyData } = useReadContract({
    ...HGP_TOKEN_CONFIG,
    functionName: 'totalSupply',
    query: {
      enabled: isConnected, // No necesita address conectado, solo que haya conexión a la red
      staleTime: Infinity, 
    },
  });

  // Balance de NFTs del usuario
  const { data: nftBalanceData, refetch: refetchNftBalance } = useReadContract({
    ...NFT_CONTRACT_CONFIG, // Usa la configuración del archivo centralizado
    functionName: 'balanceOf',
    args: [address],
    query: {
      enabled: isConnected && !!address,
      watch: true, 
    },
  });

  useEffect(() => {
    console.log("Estado de la conexión (desde AppContent):", { address, isConnected, chain });
    // Aquí puedes loguear las direcciones desde HGP_TOKEN_CONFIG, etc.
    console.log("  Dirección de HGP ERC20 configurada:", HGP_TOKEN_CONFIG.address);
    console.log("  Dirección de HPNFT ERC721 configurada:", NFT_CONTRACT_CONFIG.address);
    console.log("  Dirección de HGP Staking configurada:", STAKING_CONTRACT_CONFIG.address);
    console.log("  Dirección de HGP DAO configurada:", DAO_CONTRACT_CONFIG.address);

    if (isConnected && address) {
      refetchHGPBalance();
      refetchNftBalance();
    }
  }, [address, isConnected, chain, refetchHGPBalance, refetchNftBalance]);

  // Formatear los datos para la UI
  const decimals = hgpDecimalsData !== undefined ? Number(hgpDecimalsData) : 18;
  const formattedHgpBalance = hgpTokenBalanceData !== undefined ? formatUnits(hgpTokenBalanceData, decimals) : '0.0';
  const formattedTotalHGPSupply = hgpTotalSupplyData !== undefined ? formatUnits(hgpTotalSupplyData, decimals) : 'Cargando...';
  const formattedNftCount = nftBalanceData !== undefined ? nftBalanceData.toString() : '0';


  const handleLaunchDapp = useCallback(() => {
    setCurrentSection('news-announcements'); 
  }, []);

  const renderCurrentSection = () => {
    // Props comunes para todas las secciones que interactúan con la blockchain
    const commonSectionProps = {
      isConnected,
      userAddress: address, // Renombrado a userAddress para mayor claridad en secciones
      onNavigate: setCurrentSection,
      showCustomModal,
      // Pasa las configuraciones completas de los contratos
      hgpTokenConfig: HGP_TOKEN_CONFIG,
      nftContractConfig: NFT_CONTRACT_CONFIG,
      stakingContractConfig: STAKING_CONTRACT_CONFIG,
      daoContractConfig: DAO_CONTRACT_CONFIG,
      uiProposalThreshold: UI_PROPOSAL_THRESHOLD_HGP,
      publicClient, // Pasa el cliente público para llamadas de lectura
      
      // Datos de balance y recarga (pasados como BigInt, las secciones los formatearán si es necesario)
      hgpBalance: hgpTokenBalanceData, 
      refetchHGPBalance,
      nftCount: nftBalanceData, 
      refetchNftBalance,

      // Otros datos generales de la DApp
      balanceData, // Balance nativo de la cadena (BNB)
      totalHGPSupply: formattedTotalHGPSupply, // Total supply ya formateado
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
      case 'incubation': 
        return <IncubationSection />;
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
            hgpBalance={formattedHgpBalance} 
            nftCount={formattedNftCount} 
            connect={connect}
            connectors={connectors}
            pendingConnector={pendingConnector}
            disconnect={disconnect} 
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
