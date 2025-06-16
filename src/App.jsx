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
import AboutSection from './sections/AboutSection'; // MANTENER IMPORTACIÓN
import TokenomicsSection from './sections/TokenomicsSection';
import YieldMechanismsSection from './sections/YieldMechanismsSection';
import NftGallerySection from './sections/NftGallerySection';
import SwapSection from './sections/SwapSection';
import DaoSection from './sections/DaoSection';
import RoadmapSection from './sections/RoadmapSection'; 
import TechStackSection from './sections/TechStackSection'; // MANTENER IMPORTACIÓN
import ContactSection from './sections/ContactSection';
import WhitepaperSection from './sections/WhitepaperSection'; 
import SupportSection from './sections/SupportSection';
import AuditSecuritySection from './sections/AuditSecuritySection';
import PartnersEcosystemSection from './sections/PartnersEcosystemSection';
import TeamSection from './sections/TeamSection';
import FAQSection from './sections/FAQSection';
import NewsAnnouncementsSection from './sections/NewsAnnouncementsSection';
import IncubationSection from './sections/IncubationSection'; // Se mantiene si se usa internamente

// --- Constantes de Contratos ---
const HGP_ERC20_ADDRESS = '0x03Fd2cE62B4BB54f09716f9588A5E13bC0756773'; 
const HPNFT_ERC721_ADDRESS = '0x11Cae128d6AD9A00ceAF179171321F2E0abE30a8'; 
const HGP_STAKING_ADDRESS = '0x3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E'; 


function AppContent() {
  const [currentSection, setCurrentSection] = useState('home'); 
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

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
    setCurrentSection('news-announcements'); // Sigue siendo el punto de entrada para inversores
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
    };

    // ORDEN DEL SWITCH QUE COINCIDE CON LA NAVEGACIÓN DEL SIDEBAR
    switch (currentSection) {
      // 1. Atracción y Dinamismo
      case 'news-announcements':
        return <NewsAnnouncementsSection />;
      
      // 2. Visión General Rápida
      case 'dashboard':
        return <DashboardSection {...commonSectionProps} />;

      // 3. Fundamentos y Credibilidad
      case 'whitepaper':
        return <WhitepaperSection />;
      case 'roadmap':
        return <RoadmapSection />;
      case 'audit-security':
        return <AuditSecuritySection />;
      case 'tokenomics':
        return <TokenomicsSection />; 

      // 4. Utilidad y Oportunidades
      case 'yield':
        return <YieldMechanismsSection {...commonSectionProps} />;
      case 'nfts':
        return <NftGallerySection {...commonSectionProps} />;
      case 'dao':
        return <DaoSection />;
      case 'swap':
        return <SwapSection />;
      
      // 5. Transparencia y Soporte
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
      
      // Secciones que ya no están en el sidebar pero se mantienen por compatibilidad
      case 'about':
        return <AboutSection />;
      case 'tech':
        return <TechStackSection />;
      case 'incubation':
        return <IncubationSection />;
      default:
        // Fallback a Noticias si la sección no se encuentra o es la primera carga
        return <NewsAnnouncementsSection />; 
    }
  };

  return (
    <div className="min-h-screen bg-[var(--dark-gray)] text-[var(--light-gray-text)] flex flex-col font-sans"> 
      {showModal && <CustomModal message={message} onClose={closeModal} />}

      <CursorTrail />

      {currentSection === 'home' ? (
        <HomePage onLaunchDapp={handleLaunchDapp} />
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
            {/* Sidebar Lateral - le pasamos la función para cambiar el estado de expansión */}
            <Sidebar onNavigate={setCurrentSection} currentSection={currentSection} onExpandChange={setIsSidebarExpanded} />

            {/* Área de Contenido Principal: Ocupa el resto del espacio horizontal */}
            <main className={`flex-grow p-4 md:p-6 lg:p-8 transition-all duration-300 ease-in-out
                              ${isSidebarExpanded ? 'ml-56 lg:ml-64' : 'ml-20 lg:ml-24'}`}> 
              {renderCurrentSection()}
            </main>
          </div>

          {/* Footer también con margen izquierdo dinámico */}
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
