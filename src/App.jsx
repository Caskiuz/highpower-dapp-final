// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  useAccount,
  useBalance,
  useReadContract,
  useConnect,
  useDisconnect,
} from 'wagmi';
import { bscTestnet } from 'wagmi/chains';

import { formatUnits, createPublicClient, http } from 'viem';

import {
  HGP_TOKEN_CONFIG,
  NFT_CONTRACT_CONFIG,
  STAKING_CONTRACT_CONFIG,
  DAO_CONTRACT_CONFIG,
  UI_PROPOSAL_THRESHOLD_HGP,
} from "./constants/contract-config.js";

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
import TradingAndAnalyticsSection from './sections/TradingAndAnalyticsSection';


const publicClient = createPublicClient({
  chain: bscTestnet,
  transport: http(bscTestnet.rpcUrls.default.http[0]),
});


function AppContent() {
  const [currentSection, setCurrentSection] = useState('home');
  // Ahora el estado guarda el ancho REAL del sidebar en píxeles, recibido de Sidebar.jsx
  const [sidebarWidthPx, setSidebarWidthPx] = useState(56); // Valor inicial para w-14 (56px)
  const [showVideoModal, setShowVideoModal] = useState(false);

  const { address, isConnected, chain } = useAccount();
  const { data: balanceData, refetch: refetchBNBBalance } = useBalance({
    address: address,
    query: {
      enabled: isConnected && !!address,
    },
  });

  const { connect, connectors, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();

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


  const { data: hgpTokenBalanceData, refetch: refetchHGPBalance } = useReadContract({
    ...HGP_TOKEN_CONFIG,
    functionName: 'balanceOf',
    args: [address],
    query: {
      enabled: isConnected && !!address,
      watch: true,
    },
  });

  const { data: hgpDecimalsData } = useReadContract({
    ...HGP_TOKEN_CONFIG,
    functionName: 'decimals',
    query: {
      enabled: isConnected && !!address,
      staleTime: Infinity,
    },
  });

  const { data: hgpTotalSupplyData } = useReadContract({
    ...HGP_TOKEN_CONFIG,
    functionName: 'totalSupply',
    query: {
      enabled: isConnected,
      staleTime: Infinity,
    },
  });

  const { data: nftBalanceData, refetch: refetchNftBalance } = useReadContract({
    ...NFT_CONTRACT_CONFIG,
    functionName: 'balanceOf',
    args: [address],
    query: {
      enabled: isConnected && !!address,
      watch: true,
    },
  });

  useEffect(() => {
    console.log("Estado de la conexión (desde AppContent):", { address, isConnected, chain });
    console.log("   Dirección de HGP ERC20 configurada:", HGP_TOKEN_CONFIG.address);
    console.log("   Dirección de HPNFT ERC721 configurada:", NFT_CONTRACT_CONFIG.address);
    console.log("   Dirección de HGP Staking configurada:", STAKING_CONTRACT_CONFIG.address);
    console.log("   Dirección de HGP DAO configurada:", DAO_CONTRACT_CONFIG.address);

    if (isConnected && address) {
      refetchHGPBalance();
      refetchNftBalance();
      refetchBNBBalance();
    }
  }, [address, isConnected, chain, refetchHGPBalance, refetchNftBalance, refetchBNBBalance]);

  const decimals = hgpDecimalsData !== undefined ? Number(hgpDecimalsData) : 18;
  const formattedHgpBalance = hgpTokenBalanceData !== undefined ? formatUnits(hgpTokenBalanceData, decimals) : '0.0';
  const formattedTotalHGPSupply = hgpTotalSupplyData !== undefined ? formatUnits(hgpTotalSupplyData, decimals) : 'Cargando...';
  const formattedNftCount = nftBalanceData !== undefined ? nftBalanceData.toString() : '0';

  const formattedBNBBalance = balanceData?.value !== undefined ? formatUnits(balanceData.value, 18) : '0.0';


  const handleLaunchDapp = useCallback(() => {
    setCurrentSection('news-announcements');
  }, []);

  const renderCurrentSection = () => {
    const commonSectionProps = {
      isConnected,
      userAddress: address,
      onNavigate: setCurrentSection,
      showCustomModal,
      publicClient,
      hgpTokenConfig: HGP_TOKEN_CONFIG,
      nftContractConfig: NFT_CONTRACT_CONFIG,
      stakingContractConfig: STAKING_CONTRACT_CONFIG,
      daoContractConfig: DAO_CONTRACT_CONFIG,
      uiProposalThreshold: UI_PROPOSAL_THRESHOLD_HGP,
    };

    const balanceProps = {
      hgpBalance: hgpTokenBalanceData,
      refetchHGPBalance,
      bnbBalance: balanceData?.value,
      refetchBNBBalance,
      nftCount: nftBalanceData,
      refetchNftBalance,
      totalHGPSupply: formattedTotalHGPSupply,
      formattedHgpBalance,
      formattedBNBBalance,
    };

    switch (currentSection) {
      case 'home':
        return <HomePage onLaunchDapp={handleLaunchDapp} onShowVideo={() => setShowVideoModal(true)} />;
      case 'news-announcements':
        return <NewsAnnouncementsSection {...commonSectionProps} {...balanceProps} />;
      case 'dashboard':
        return <DashboardSection {...commonSectionProps} {...balanceProps} />;
      case 'whitepaper':
        return <WhitepaperSection {...commonSectionProps} />;
      case 'roadmap':
        return <RoadmapSection {...commonSectionProps} />;
      case 'audit-security':
        return <AuditSecuritySection {...commonSectionProps} />;
      case 'tokenomics':
        return <TokenomicsSection {...commonSectionProps} {...balanceProps} />;
      case 'yield':
        return <YieldMechanismsSection {...commonSectionProps} {...balanceProps} />;
      case 'nfts':
        return <NftGallerySection {...commonSectionProps} {...balanceProps} />;
      case 'dao':
        return <DaoSection {...commonSectionProps} {...balanceProps} />;
      case 'incubation':
        return <IncubationSection {...commonSectionProps} />;
      case 'partners-ecosystem':
        return <PartnersEcosystemSection {...commonSectionProps} />;
      case 'team':
        return <TeamSection {...commonSectionProps} />;
      case 'faq':
        return <FAQSection {...commonSectionProps} />;
      case 'support':
        return <SupportSection {...commonSectionProps} />;
      case 'contact':
        return <ContactSection {...commonSectionProps} />;
      case 'about':
        return <AboutSection {...commonSectionProps} />;
      case 'tech':
        return <TechStackSection {...commonSectionProps} />;

      case 'trading-analytics':
        return <TradingAndAnalyticsSection
                  isConnected={isConnected}
                  userAddress={address}
                  hgpBalance={hgpTokenBalanceData}
                  bnbBalance={balanceData?.value}
                  showCustomModal={showCustomModal}
                />;
      default:
        return <NewsAnnouncementsSection {...commonSectionProps} {...balanceProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--dark-gray)] text-[var(--light-gray-text)] flex flex-col font-sans">
      {showModal && <CustomModal message={message} onClose={closeModal} />}

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

          <div className="flex flex-1 pt-[72px]">
            {/* Sidebar Lateral */}
            <Sidebar onNavigate={setCurrentSection} currentSection={currentSection} onExpandChange={setSidebarWidthPx} />

            {/* Área de Contenido Principal
                Aplicamos el padding-left dinámicamente usando el estado `sidebarWidthPx`.
                Esto asegura que el contenido siempre empiece después del sidebar,
                sin importar el ancho de la pantalla o si el sidebar está colapsado/expandido.
                Sumamos un padding adicional (p-4 = 16px) a la izquierda para una mejor separación.
            */}
            <main
              className={`flex-grow p-4 md:p-6 lg:p-8 transition-all duration-300 ease-in-out`}
              style={{ paddingLeft: `${sidebarWidthPx + 16}px` }} // Agrega un padding base de 16px
            >
              {renderCurrentSection()}
            </main>
          </div>

          {/* Footer */}
          <footer
            className={`bg-gray-900 shadow-inner p-6 text-center text-gray-300 text-sm border-t border-purple-700 transition-all duration-300 ease-in-out`}
            style={{ paddingLeft: `${sidebarWidthPx + 16}px` }} // El footer también necesita el padding
          >
            <p>© 2025 HighPower DApp. Todos los derechos reservados.</p>
          </footer>
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppContent />
  );
}
