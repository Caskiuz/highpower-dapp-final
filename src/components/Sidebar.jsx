import React, { useState, useEffect } from 'react';

function Sidebar({ onNavigate, currentSection, onExpandChange }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setDrawerOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const actualIsExpanded = !isMobile && isHovered;

  useEffect(() => {
    let sidebarWidthPx;
    if (isMobile) {
      sidebarWidthPx = drawerOpen ? Math.min(window.innerWidth * 0.8, 320) : 0;
    } else if (actualIsExpanded) {
      sidebarWidthPx = window.innerWidth >= 1024 ? 256 : 224;
    } else {
      sidebarWidthPx = 80;
    }
    onExpandChange(sidebarWidthPx);
  }, [actualIsExpanded, isMobile, drawerOpen, onExpandChange]);

  const navItems = [
    { name: 'Inicio', path: 'home', icon: 'fa-house' },
    { name: 'Noticias', path: 'news-announcements', icon: 'fa-newspaper' },
    { name: 'Dashboard', path: 'dashboard', icon: 'fa-gauge-high' },
    { name: 'Whitepaper', path: 'whitepaper', icon: 'fa-file-lines' },
    { name: 'Roadmap', path: 'roadmap', icon: 'fa-road' },
    { name: 'Auditorías', path: 'audit-security', icon: 'fa-shield-halved' },
    { name: 'Tokenomics', path: 'tokenomics', icon: 'fa-chart-pie' },
    { name: 'Recompensas', path: 'yield', icon: 'fa-coins' },
    { name: 'Metamarket', path: 'nfts', icon: 'fa-store' },
    { name: 'Gobernanza', path: 'dao', icon: 'fa-gavel' },
    { name: 'Trading & Analíticas', path: 'trading-analytics', icon: 'fa-chart-line' },
    { name: 'Incubadora', path: 'incubation', icon: 'fa-seedling' },
    { name: 'Socios', path: 'partners-ecosystem', icon: 'fa-handshake' },
    { name: 'Equipo', path: 'team', icon: 'fa-users' },
    { name: 'FAQ', path: 'faq', icon: 'fa-circle-question' },
    { name: 'Soporte', path: 'support', icon: 'fa-headset' },
    { name: 'Contacto', path: 'contact', icon: 'fa-envelope' },
    { name: 'Nosotros', path: 'about', icon: 'fa-info-circle' },
    { name: 'Tech Stack', path: 'tech', icon: 'fa-microchip' },
  ];

  const NavList = ({ expanded, onItemClick }) => (
    <div className="flex flex-col items-center flex-grow overflow-y-auto custom-scrollbar">
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => {
            onItemClick(item.path);
            if (isMobile) setDrawerOpen(false);
          }}
          className={`group flex items-center p-3 my-1 w-full rounded-lg
            transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-800 hover:shadow-lg
            ${currentSection === item.path
              ? 'bg-primary-purple text-white shadow-lg'
              : 'text-gray-400 hover:text-white'}
            ${expanded ? 'justify-start px-4' : 'justify-center'}`}
          title={item.name}
        >
          <i className={`fas ${item.icon} text-2xl ${expanded ? 'mr-3' : ''}`}></i>
          {expanded && (
            <span
              className={`font-semibold text-sm whitespace-nowrap overflow-hidden 
                opacity-100 max-w-full 
                ${currentSection === item.path ? 'text-white' : 'text-gray-400 group-hover:text-white'}
                transition-all duration-200 ease-in-out`}
            >
              {item.name}
            </span>
          )}
        </button>
      ))}
    </div>
  );

  // Desktop
  if (!isMobile) {
    return (
      <div
        className={`fixed left-0 top-0 h-full bg-gray-900 border-r border-primary-purple
          flex flex-col py-4 z-30 pt-[72px] transition-all duration-300 ease-in-out
          ${actualIsExpanded ? 'w-56 lg:w-64' : 'w-20'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <NavList expanded={actualIsExpanded} onItemClick={onNavigate} />
        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 8px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: var(--dark-gray); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--primary-purple); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--secondary-blue); }
        `}</style>
      </div>
    );
  }

  // Mobile
  return (
    <>
      <button
        className="fixed top-4 left-3 z-40 bg-black/80 border border-primary-purple rounded-full p-2 text-white shadow-lg md:hidden"
        onClick={() => setDrawerOpen(true)}
        aria-label="Abrir menú lateral"
        style={{ width: 44, height: 44 }}
      >
        <i className="fas fa-bars text-2xl" />
      </button>

      <div
        className={`fixed inset-0 z-50 transition-all duration-300 md:hidden
          ${drawerOpen ? "visible opacity-100" : "invisible opacity-0"}`}
        style={{ pointerEvents: drawerOpen ? "auto" : "none" }}
      >
        <div
          className={`absolute inset-0 bg-black/80 transition-opacity duration-300 ${drawerOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setDrawerOpen(false)}
        />
        <nav
          className={`absolute top-0 left-0 h-full bg-gray-900 border-r border-primary-purple pt-[72px] shadow-2xl
            transition-transform duration-300 w-[80vw] max-w-xs flex flex-col
            ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <button
            className="absolute top-4 right-4 text-3xl text-primary-purple focus:outline-none"
            onClick={() => setDrawerOpen(false)}
            aria-label="Cerrar menú lateral"
          >
            &times;
          </button>
          <NavList expanded={true} onItemClick={onNavigate} />
        </nav>
        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 8px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: var(--dark-gray); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--primary-purple); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--secondary-blue); }
        `}</style>
      </div>
    </>
  );
}

export default Sidebar;
