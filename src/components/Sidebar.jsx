// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';

function Sidebar({ onNavigate, currentSection, onExpandChange }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // Determinar con useEffect para precisión

  useEffect(() => {
    // Función para actualizar el estado de isMobile basado en el ancho de la ventana
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // `md` breakpoint de Tailwind CSS
    };

    // Establecer el estado inicial
    handleResize();
    // Añadir el event listener para redimensionamiento
    window.addEventListener('resize', handleResize);
    // Limpiar el event listener al desmontar el componente
    return () => window.removeEventListener('resize', handleResize);
  }, []); // El array vacío asegura que este efecto solo se ejecute una vez al montar

  // La barra lateral se expande si NO es móvil Y el ratón está sobre ella.
  const actualIsExpanded = !isMobile && isHovered;

  // Notificar al componente padre (App.jsx) sobre el ancho del sidebar actual en píxeles.
  // Esto permitirá que el contenido principal ajuste su margen correctamente.
  useEffect(() => {
    let sidebarWidthPx;
    if (isMobile) {
      // En móvil, el ancho es fijo w-14 (56px)
      sidebarWidthPx = 14 * 4; // 1 unit = 4px
    } else if (actualIsExpanded) {
      // En desktop y expandido (hover), puede ser w-56 (224px) o lg:w-64 (256px)
      // Usamos el max para asegurar que si hay una clase lg:w-64, se refleje.
      sidebarWidthPx = Math.max(56, window.innerWidth >= 1024 ? 64 : 56) * 4;
    } else {
      // En desktop y colapsado (no hover), es w-20 (80px)
      sidebarWidthPx = 20 * 4;
    }
    onExpandChange(sidebarWidthPx);
  }, [actualIsExpanded, isMobile, onExpandChange]);


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
      // Clases para el contenedor principal de la barra lateral
      // w-14 por defecto (56px, para móviles)
      // md:w-20 (80px, para tablets/desktop colapsado)
      // lg:w-56 (224px, para desktop expandido) o lg:w-64 (256px) si actualIsExpanded es true.
      className={`fixed left-0 top-0 h-full bg-gray-900 border-r border-purple-700
                  flex flex-col py-4 z-30 pt-[72px] transition-all duration-300 ease-in-out
                  ${isMobile ? 'w-14' : (actualIsExpanded ? 'w-56 lg:w-64' : 'w-20')}`} 
      // Los eventos de hover solo se activan si NO es una pantalla móvil.
      onMouseEnter={() => { if (!isMobile) setIsHovered(true); }} 
      onMouseLeave={() => { if (!isMobile) setIsHovered(false); }} 
    >
      <div className="flex flex-col items-center flex-grow overflow-y-auto custom-scrollbar"> 
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => onNavigate(item.path)}
            // Estilos para cada botón:
            // justify-center y p-3 por defecto (íconos centrados y pequeños)
            // md:justify-start y md:px-4 si actualIsExpanded es true (texto visible y padding para escritorio)
            className={`group flex items-center p-3 my-1 w-full rounded-lg
                        transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-800 hover:shadow-lg
                        ${currentSection === item.path 
                          ? 'bg-purple-800 text-white shadow-lg' 
                          : 'text-gray-400 hover:text-white'
                        }
                        ${actualIsExpanded ? 'justify-start px-4' : 'justify-center'}`} 
            title={item.name}
          >
            {/* Icono del elemento de navegación */}
            <i className={`fas ${item.icon} text-2xl ${actualIsExpanded ? 'mr-3' : ''}`}></i>
            {/* Mostrar el texto del nombre solo si actualIsExpanded es true */}
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
