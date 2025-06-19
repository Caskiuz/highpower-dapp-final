import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const modules = [
  {
    label: 'Main',
    items: [
      { name: 'News', path: '/news', icon: 'fa-newspaper' },
      { name: 'Dashboard', path: '/dashboard', icon: 'fa-gauge-high' },
    ],
  },
  {
    label: 'Trading & Yield',
    items: [
      { name: 'Trading & Analytics', path: '/trading-analytics', icon: 'fa-chart-line' },
      { name: 'Yield', path: '/yield', icon: 'fa-coins' },
      { name: 'NFTs', path: '/nfts', icon: 'fa-store' },
    ],
  },
  {
    label: 'Ecosystem',
    items: [
      { name: 'Roadmap', path: '/roadmap', icon: 'fa-road' },
      { name: 'Tokenomics', path: '/tokenomics', icon: 'fa-chart-pie' },
      { name: 'Incubation', path: '/incubation', icon: 'fa-seedling' },
      { name: 'Partners', path: '/partners', icon: 'fa-handshake' },
      { name: 'Team', path: '/team', icon: 'fa-users' },
      { name: 'Governance', path: '/governance', icon: 'fa-gavel' },
    ],
  },
  {
    label: 'Utilities',
    items: [
      { name: 'FAQ', path: '/faq', icon: 'fa-circle-question' },
      { name: 'Whitepaper', path: '/whitepaper', icon: 'fa-file-lines' },
      { name: 'Audit', path: '/audit-security', icon: 'fa-shield-halved' },
      { name: 'Tech Stack', path: '/tech', icon: 'fa-microchip' },
      { name: 'About', path: '/about', icon: 'fa-info-circle' },
    ],
  },
  {
    label: 'Support & Community',
    items: [
      { name: 'Support', path: '/support', icon: 'fa-headset' },
      { name: 'Contact', path: '/contact', icon: 'fa-envelope' },
    ],
  },
];

function Sidebar({ onExpandChange, closeSidebar }) {
  const [isHovered, setIsHovered] = useState(false);
  const [expandedModules, setExpandedModules] = useState([0]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const actualIsExpanded = !isMobile && isHovered;
  useEffect(() => {
    let sidebarWidthPx;
    if (isMobile) {
      sidebarWidthPx = 0;
    } else if (actualIsExpanded) {
      sidebarWidthPx = window.innerWidth >= 1024 ? 256 : 224;
    } else {
      sidebarWidthPx = 80;
    }
    if (onExpandChange) onExpandChange(sidebarWidthPx);
  }, [actualIsExpanded, isMobile, onExpandChange]);

  // Sidebar cerrado: muestra todos los íconos de todas las secciones, sin texto. 
  // Sidebar abierto: muestra módulos y sus secciones con texto.
  const allItems = modules.flatMap(m => m.items);

  // Sidebar expandido (hover):
  const NavListExpanded = () => (
    <nav className="flex flex-col flex-grow overflow-y-auto custom-scrollbar">
      {modules.map((mod, idx) => (
        <div key={mod.label} className="mb-2">
          <button
            className="flex items-center w-full px-3 py-2 text-left font-bold text-xs uppercase tracking-wider text-primary-purple transition-colors"
            onClick={() =>
              setExpandedModules((prev) =>
                prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
              )
            }
            tabIndex={0}
          >
            <i className={`fas fa-caret-${expandedModules.includes(idx) ? "down" : "right"} mr-2`} />
            {mod.label}
          </button>
          <div className={`transition-all duration-200 ml-1 ${expandedModules.includes(idx) ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
            {mod.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  group flex items-center p-3 my-1 w-full rounded-lg
                  transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-800 hover:shadow-lg
                  ${isActive ? 'bg-primary-purple text-white shadow-lg neon-glow' : 'text-gray-400 hover:text-white'}
                  justify-start px-4
                `}
                title={item.name}
                onClick={() => {
                  if (isMobile && closeSidebar) closeSidebar();
                }}
              >
                <i
                  className={`fas ${item.icon} text-2xl sidebar-icon-glow mr-3`}
                  style={{
                    color: '#fff',
                    filter: 'drop-shadow(0 0 3px #a259ff80) drop-shadow(0 0 8px #a259ff40)',
                  }}
                />
                <span className="font-semibold text-sm whitespace-nowrap overflow-hidden">
                  {item.name}
                </span>
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );

  // Sidebar colapsado (hover fuera): muestra solo íconos de TODAS las secciones, sin módulos, solo vertical.
  const NavListCollapsed = () => (
    <nav className="flex flex-col flex-grow items-center py-2 custom-scrollbar">
      {allItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `
            group flex items-center justify-center my-2 w-12 h-12 rounded-lg
            transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-gray-800 hover:shadow-lg
            ${isActive ? 'bg-primary-purple text-white shadow-lg neon-glow' : 'text-gray-300 hover:text-white'}
          `}
          title={item.name}
          onClick={() => {
            if (isMobile && closeSidebar) closeSidebar();
          }}
        >
          <i
            className={`fas ${item.icon} text-2xl sidebar-icon-glow`}
            style={{
              color: '#fff',
              filter: isMobile
                ? 'drop-shadow(0 0 2px #a259ff99) drop-shadow(0 0 6px #a259ff44)'
                : 'drop-shadow(0 0 2px #a259ff70) drop-shadow(0 0 4px #a259ff33)',
              opacity: 0.92
            }}
          />
        </NavLink>
      ))}
    </nav>
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
        {actualIsExpanded ? <NavListExpanded /> : <NavListCollapsed />}
        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 8px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: var(--dark-gray); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--primary-purple); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--secondary-blue); }
          .sidebar-icon-glow {
            text-shadow:
              0 0 4px #a259ff77,
              0 0 10px #a259ff33;
            transition: text-shadow 0.3s, color 0.3s;
          }
          .neon-glow {
            box-shadow:
              0 0 8px 2px #a259ff55,
              0 0 16px 4px #a259ff22;
          }
        `}</style>
      </div>
    );
  }

  // Mobile (igual que antes: todos los íconos + texto)
  return (
    <div className="pt-[72px] bg-gray-900 h-full w-full flex flex-col">
      <NavListExpanded />
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: var(--dark-gray); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--primary-purple); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--secondary-blue); }
        .sidebar-icon-glow {
          text-shadow:
            0 0 4px #a259ff77,
            0 0 10px #a259ff33;
          transition: text-shadow 0.3s, color 0.3s;
        }
        .neon-glow {
          box-shadow:
            0 0 8px 2px #a259ff55,
            0 0 16px 4px #a259ff22;
        }
      `}</style>
    </div>
  );
}

export default Sidebar;
