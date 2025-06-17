// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';

function Sidebar({ onNavigate, currentSection, onExpandChange }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Detecta si la pantalla es móvil (< 768px)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // La barra lateral se expande si NO es móvil Y el ratón está sobre ella.
  const actualIsExpanded = !isMobile && isHovered;

  // Notifica al componente padre (App.jsx) el ancho actual del sidebar para el padding del contenido.
  useEffect(() => {
    // Si está expandido (desktop hover), el ancho es 56 (o 64 en lg).
    // Si está colapsado (desktop sin hover o móvil), el ancho es 16.
    const sidebarWidth = actualIsExpanded ? 56 : 16; // Tailwind w-56 (224px), w-16 (64px)
    onExpandChange(sidebarWidth); // Envía el ancho en unidades de Tailwind para cálculo
  }, [actualIsExpanded, onExpandChange]);

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

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-gray-900 border-r border-purple-700
                  flex flex-col py-4 z-30 pt-[72px] transition-all duration-300 ease-in-out
                  ${actualIsExpanded ? 'w-56 lg:w-64' : 'w-16'}`} /* w-16 (64px) por defecto, más pequeño en móvil */
      onMouseEnter={() => { if (!isMobile) setIsHovered(true); }}
      onMouseLeave={() => { if (!isMobile) setIsHovered(false); }}
    >
      <div className="flex flex-col items-center flex-grow overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => onNavigate(item.path)}
            className={`group flex items-center p-3 my-1 w-full rounded-lg
                        transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-800 hover:shadow-lg
                        ${currentSection === item.path
                          ? 'bg-purple-800 text-white shadow-lg'
                          : 'text-gray-400 hover:text-white'
                        }
                        ${actualIsExpanded ? 'justify-start px-4' : 'justify-center'}`}
            title={item.name}
          >
            <i className={`fas ${item.icon} text-2xl ${actualIsExpanded ? 'mr-3' : ''}`}></i>
            {actualIsExpanded && (
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

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--dark-gray);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--primary-purple);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--secondary-blue);
        }
      `}</style>
    </div>
  );
}

export default Sidebar;
