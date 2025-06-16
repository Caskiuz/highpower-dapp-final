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

// Importa los componentes y secciones refactorizadas
import CursorTrail from './components/CursorTrail';
import CustomModal from './components/CustomModal';
import Navbar from './components/Navbar'; 
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

// --- Constantes de Contratos ---
const HGP_ERC20_ADDRESS = '0x03Fd2cE62B4BB54f09716f9588A5E13bC0756773'; 
const HPNFT_ERC721_ADDRESS = '0x11Cae128d6AD9A00ceAF179171321F2E0abE30a8'; 
const HGP_STAKING_ADDRESS = '0x3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E'; 


function AppContent() {
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

  const [currentSection, setCurrentSection] = useState('dashboard');
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

  const renderSection = () => {
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

    switch (currentSection) {
      case 'dashboard':
        return <DashboardSection {...commonSectionProps} />;
      case 'about':
        return <AboutSection />;
      case 'tokenomics':
        return <TokenomicsSection />;
      case 'yield':
        return <YieldMechanismsSection />;
      case 'nfts':
        return <NftGallerySection {...commonSectionProps} />;
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
        return <DashboardSection {...commonSectionProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--dark-gray)] text-[var(--light-gray-text)] flex flex-col font-sans"> 
      {showModal && <CustomModal message={message} onClose={closeModal} />}

      <CursorTrail />

      <Navbar
        onNavigate={setCurrentSection}
        isConnected={isConnected}
        disconnect={disconnect}
        address={address}
        balanceData={balanceData}
        hgpBalance={hgpTokenBalanceData !== undefined && hgpDecimalsData !== undefined ? formatUnits(hgpTokenBalanceData, Number(hgpDecimalsData)) : '0.0'}
        connect={connect}
        connectors={connectors}
        pendingConnector={pendingConnector}
      />

      {/* CAMBIO CLAVE AQUÍ: Añadimos padding-top al main para evitar que el contenido se oculte bajo el Navbar fijo */}
      <main className="flex-grow container mx-auto p-4 py-8 pt-28"> 
        {renderSection()}
      </main>

      <footer className="bg-gray-900 shadow-inner p-6 text-center text-gray-300 text-sm mt-8 border-t border-purple-700">
        <p>© 2025 HighPower DApp. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

// exportamos el componente principal
export default function App() {
  return (
    <AppContent />
  );
}
