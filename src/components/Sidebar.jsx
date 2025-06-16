// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
// Asegúrate de tener Font Awesome cargado en tu index.html para estos iconos.
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />

function Sidebar({ onNavigate, currentSection, onExpandChange }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsExpanded(isHovered);
    onExpandChange(isHovered); // Notificar a App.jsx sobre el cambio de expansión
  }, [isHovered, onExpandChange]);

  // ORDEN DE SECCIONES OPTIMIZADO PARA INVERSORES
  const navItems = [
    // 1. Atracción y Dinamismo
    { name: 'Noticias', path: 'news-announcements', icon: 'fa-newspaper' }, 
    
    // 2. Visión General Rápida
    { name: 'Dashboard', path: 'dashboard', icon: 'fa-gauge-high' },

    // 3. Fundamentos y Credibilidad
    { name: 'Whitepaper', path: 'whitepaper', icon: 'fa-file-lines' },
    { name: 'Roadmap', path: 'roadmap', icon: 'fa-road' }, 
    { name: 'Auditorías', path: 'audit-security', icon: 'fa-shield-halved' }, // Icono confirmado
    { name: 'Tokenomics', path: 'tokenomics', icon: 'fa-chart-pie' },

    // 4. Utilidad y Oportunidades (Funcionalidades Clave)
    { name: 'Recompensas', path: 'yield', icon: 'fa-coins' }, 
    { name: 'Metamarket', path: 'nfts', icon: 'fa-store' }, 
    { name: 'Gobernanza', path: 'dao', icon: 'fa-gavel' }, 
    { name: 'Swap', path: 'swap', icon: 'fa-right-left' }, 
    
    // 5. Transparencia y Soporte
    { name: 'Socios', path: 'partners-ecosystem', icon: 'fa-handshake' },
    { name: 'Equipo', path: 'team', icon: 'fa-users' },
    { name: 'FAQ', path: 'faq', icon: 'fa-circle-question' },
    { name: 'Soporte', path: 'support', icon: 'fa-headset' }, 
    { name: 'Contacto', path: 'contact', icon: 'fa-envelope' },
    // 'Acerca de' y 'Tech Stack' eliminados del sidebar para evitar redundancia y simplificar
  ];

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-gray-900 border-r border-purple-700
                  flex flex-col py-4 z-30 pt-[72px] transition-all duration-300 ease-in-out
                  ${isExpanded ? 'w-56 lg:w-64' : 'w-20 lg:w-24'}`} 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)} 
    >
      <div className="flex flex-col items-center flex-grow overflow-y-auto custom-scrollbar"> 
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => onNavigate(item.path)}
            className={`group flex items-center justify-start p-3 my-1 w-full rounded-lg
                        transition-colors duration-300 ease-in-out
                        ${currentSection === item.path 
                          ? 'bg-purple-800 text-white shadow-lg' 
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }
                        ${isExpanded ? 'px-4' : 'justify-center'}`} 
            title={item.name} 
          >
            <i className={`fas ${item.icon} text-2xl ${isExpanded ? 'mr-3' : ''}`}></i>
            {(isExpanded || currentSection === item.path) && ( 
              <span 
                className={`font-semibold text-sm whitespace-nowrap overflow-hidden 
                            ${isExpanded ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'}
                            ${currentSection === item.path ? 'text-white' : 'text-gray-400 group-hover:text-white'}
                            transition-all duration-200 ease-in-out`}
              >
                {item.name}
              </span>
            )}
            {(!isExpanded && currentSection !== item.path) && (
              <span className="text-xs font-semibold invisible absolute">{item.name}</span> 
            )}
          </button>
        ))}
      </div>

      {/* Estilos para el scrollbar personalizado */}
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
