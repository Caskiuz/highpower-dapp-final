import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
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

import HeroSection from './sections/HeroSection';
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
  const [showVideoModal, setShowVideoModal] = useState(false);

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
    if (isConnected && address) {
      refetchHGPBalance();
      refetchNftBalance();
      refetchBNBBalance();
    }
  }, [address, isConnected, chain, refetchHGPBalance, refetchNftBalance, refetchBNBBalance]);

  const decimals = hgpDecimalsData !== undefined ? Number(hgpDecimalsData) : 18;
  const formattedHgpBalance = hgpTokenBalanceData !== undefined ? formatUnits(hgpTokenBalanceData, decimals) : '0.0';
  const formattedTotalHGPSupply = hgpTotalSupplyData !== undefined ? formatUnits(hgpTotalSupplyData, decimals) : 'Loading...';
  const formattedNftCount = nftBalanceData !== undefined ? nftBalanceData.toString() : '0';
  const formattedBNBBalance = balanceData?.value !== undefined ? formatUnits(balanceData.value, 18) : '0.0';

  // Responsive sidebar width
  const [sidebarWidthPx, setSidebarWidthPx] = useState(56);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Common props for sections
  const commonSectionProps = {
    isConnected,
    userAddress: address,
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

  // Sidebar for mobile
  const SidebarDrawer = ({ children }) => (
    <aside className={`fixed z-50 top-0 left-0 w-56 h-full bg-gray-900 flex-col md:hidden transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
      {children}
      <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-white text-2xl">&times;</button>
    </aside>
  );

  return (
    <Router>
      <div className="min-h-screen bg-[var(--dark-gray)] text-[var(--light-gray-text)] flex flex-col font-sans">
        {showModal && <CustomModal message={message} onClose={closeModal} />}

        {showVideoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="relative bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl h-[60vh] md:h-[70vh] flex flex-col">
              <button
                onClick={() => setShowVideoModal(false)}
                className="absolute -top-4 -right-4 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center text-xl font-bold z-10 shadow-lg"
                aria-label="Close video"
              >
                &times;
              </button>
              <iframe
                src="https://www.youtube.com/embed/GNh0i7Sg_p4?autoplay=1&mute=0"
                title="Web3, Blockchain and DeFi Explanation"
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

        {/* Routes */}
        <Routes>
          {/* Landing */}
          <Route
            path="/"
            element={
              <HeroSection
                onLaunchDapp={() => { window.location.href = "/news"; }}
                onShowVideo={() => setShowVideoModal(true)}
              />
            }
          />

          {/* App layout (all except landing) */}
          <Route
            path="*"
            element={
              <div className="flex flex-1 flex-col md:flex-row pt-[0px]">
                {/* Mobile hamburger navbar */}
                <nav className="flex items-center justify-between px-4 py-3 bg-gray-800 md:hidden">
                  <button onClick={() => setSidebarOpen(true)}>
                    <i className="fas fa-bars text-xl text-white"></i>
                  </button>
                  <span className="ml-2 text-lg font-bold text-green-400">HighPower</span>
                </nav>

                {/* Sidebar drawer mobile */}
                <SidebarDrawer>
                  <Sidebar onExpandChange={setSidebarWidthPx} closeSidebar={() => setSidebarOpen(false)} />
                </SidebarDrawer>
                {/* Sidebar permanent desktop */}
                <aside className="hidden md:flex w-56 bg-gray-900 flex-col">
                  <Sidebar onExpandChange={setSidebarWidthPx} />
                </aside>
                {/* Main layout */}
                <div className="flex-1 flex flex-col">
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
                    HGP_TOKEN_CONFIG={HGP_TOKEN_CONFIG}
                  />
                  <main className="flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300 ease-in-out">
                    <Routes>
                      <Route path="/news" element={<NewsAnnouncementsSection {...commonSectionProps} {...balanceProps} />} />
                      <Route path="/dashboard" element={<DashboardSection {...commonSectionProps} {...balanceProps} />} />
                      <Route path="/whitepaper" element={<WhitepaperSection {...commonSectionProps} />} />
                      <Route path="/roadmap" element={<RoadmapSection {...commonSectionProps} />} />
                      <Route path="/audit-security" element={<AuditSecuritySection {...commonSectionProps} />} />
                      <Route path="/tokenomics" element={<TokenomicsSection {...commonSectionProps} {...balanceProps} />} />
                      <Route path="/yield" element={<YieldMechanismsSection {...commonSectionProps} {...balanceProps} />} />
                      <Route path="/nfts" element={<NftGallerySection {...commonSectionProps} {...balanceProps} />} />
                      <Route path="/governance" element={<DaoSection {...commonSectionProps} {...balanceProps} />} />
                      <Route path="/incubation" element={<IncubationSection {...commonSectionProps} />} />
                      <Route path="/partners" element={<PartnersEcosystemSection {...commonSectionProps} />} />
                      <Route path="/team" element={<TeamSection {...commonSectionProps} />} />
                      <Route path="/faq" element={<FAQSection {...commonSectionProps} />} />
                      <Route path="/support" element={<SupportSection {...commonSectionProps} />} />
                      <Route path="/contact" element={<ContactSection {...commonSectionProps} />} />
                      <Route path="/about" element={<AboutSection {...commonSectionProps} />} />
                      <Route path="/tech" element={<TechStackSection {...commonSectionProps} />} />
                      <Route path="/trading-analytics" element={
                        <TradingAndAnalyticsSection
                          isConnected={isConnected}
                          userAddress={address}
                          hgpBalance={hgpTokenBalanceData}
                          bnbBalance={balanceData?.value}
                          showCustomModal={showCustomModal}
                        />
                      } />
                      {/* Fallback to news */}
                      <Route path="*" element={<Navigate to="/news" replace />} />
                    </Routes>
                  </main>
                  {/* Bottom nav mobile */}
                  <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 flex md:hidden justify-around py-2 border-t border-purple-800 z-40">
                    <NavButton to="/news" icon="fa-bolt" label="News" />
                    <NavButton to="/dashboard" icon="fa-tachometer-alt" label="Dashboard" />
                    <NavButton to="/nfts" icon="fa-image" label="NFTs" />
                    <NavButton to="/governance" icon="fa-users" label="DAO" />
                  </nav>
                  {/* Footer */}
                  <footer
                    className={`bg-gray-900 shadow-inner p-6 text-center text-gray-300 text-sm border-t border-purple-700 transition-all duration-300 ease-in-out`}
                  >
                    <p>© 2025 HighPower DApp. All rights reserved.</p>
                  </footer>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

// NavButton for mobile bottom nav
function NavButton({ to, icon, label }) {
  const navigate = useNavigate();
  return (
    <button className="text-white flex flex-col items-center text-sm" onClick={() => navigate(to)}>
      <i className={`fas ${icon}`}></i>
      <span>{label}</span>
    </button>
  );
}

export default function App() {
  return <AppContent />;
}
