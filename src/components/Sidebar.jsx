// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
// Asegúrate de tener Font Awesome cargado en tu index.html para estos iconos.
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />

function Sidebar({ onNavigate, currentSection }) {
  // Estado para controlar si el sidebar está expandido o colapsado
  const [isExpanded, setIsExpanded] = useState(false);
  // Estado para detectar si el mouse está sobre el sidebar
  const [isHovered, setIsHovered] = useState(false);

  // Define todos los ítems de navegación con sus iconos
  // Agrupados lógicamente para una mejor organización visual
  const navItems = [
    // Secciones principales de la DApp
    { name: 'Dashboard', path: 'dashboard', icon: 'fa-gauge-high' },
    { name: 'Recompensas', path: 'yield', icon: 'fa-coins' }, 
    { name: 'Metamarket', path: 'nfts', icon: 'fa-store' }, 
    { name: 'Swap', path: 'swap', icon: 'fa-right-left' }, // Añadido de vuelta 'SwapSection'
    { name: 'Gobernanza', path: 'dao', icon: 'fa-gavel' }, 
    
    // Secciones informativas y de soporte
    { name: 'Roadmap', path: 'roadmap', icon: 'fa-road' }, 
    { name: 'Whitepaper', path: 'whitepaper', icon: 'fa-file-lines' },
    { name: 'Tokenomics', path: 'tokenomics', icon: 'fa-chart-pie' }, // Añadido de vuelta 'TokenomicsSection'
    { name: 'Auditorías', path: 'audit-security', icon: 'fa-shield-halved' },
    { name: 'Socios', path: 'partners-ecosystem', icon: 'fa-handshake' },
    { name: 'Equipo', path: 'team', icon: 'fa-users' },
    { name: 'FAQ', path: 'faq', icon: 'fa-circle-question' },
    { name: 'Noticias', path: 'news-announcements', icon: 'fa-newspaper' },
    { name: 'Tech Stack', path: 'tech', icon: 'fa-gears' }, // Añadido de vuelta 'TechStackSection'
    { name: 'Acerca de', path: 'about', icon: 'fa-circle-info' }, // Añadido de vuelta 'AboutSection'
    { name: 'Contacto', path: 'contact', icon: 'fa-envelope' }, // Añadido de vuelta 'ContactSection'
    { name: 'Soporte', path: 'support', icon: 'fa-headset' }, 
  ];

  // El estado 'isExpanded' se activará si el mouse está encima
  useEffect(() => {
    setIsExpanded(isHovered);
  }, [isHovered]);

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-gray-900 border-r border-purple-700
                  flex flex-col py-4 z-30 pt-[72px] transition-all duration-300 ease-in-out
                  ${isExpanded ? 'w-56 lg:w-64' : 'w-20 lg:w-24'}`} // Ancho dinámico
      onMouseEnter={() => setIsHovered(true)} // Expandir al pasar el mouse
      onMouseLeave={() => setIsHovered(false)} // Colapsar al quitar el mouse
    >
      <div className="flex flex-col items-center flex-grow overflow-y-auto custom-scrollbar"> {/* Contenedor para el scroll */}
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => onNavigate(item.path)}
            // Clases dinámicas para el estilo y resaltar la sección activa
            className={`group flex items-center justify-start p-3 my-1 w-full rounded-lg
                        transition-colors duration-300 ease-in-out
                        ${currentSection === item.path 
                          ? 'bg-purple-800 text-white shadow-lg' 
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }
                        ${isExpanded ? 'px-4' : 'justify-center'}`} // Padding y centrado condicional
            title={item.name} // Tooltip
          >
            {/* Icono */}
            <i className={`fas ${item.icon} text-2xl ${isExpanded ? 'mr-3' : ''}`}></i>
            {/* Nombre de la sección - visible solo si expandido o si es la sección activa */}
            {(isExpanded || currentSection === item.path) && ( // Muestra el nombre si está expandido O si es la sección activa
              <span 
                className={`font-semibold text-sm whitespace-nowrap overflow-hidden 
                            ${isExpanded ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'}
                            ${currentSection === item.path ? 'text-white' : 'text-gray-400 group-hover:text-white'}
                            transition-all duration-200 ease-in-out`}
              >
                {item.name}
              </span>
            )}
            {/* Si no está expandido y NO es la sección activa, muestra un espacio para mantener el tamaño del botón */}
            {(!isExpanded && currentSection !== item.path) && (
              <span className="text-xs font-semibold invisible absolute">{item.name}</span> // Invisible para accesibilidad/espacio
            )}
          </button>
        ))}
      </div>

      {/* Estilos para el scrollbar personalizado */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px; /* Ancho del scrollbar */
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--dark-gray); /* Color del fondo del track */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--primary-purple); /* Color del "pulgar" del scrollbar */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--secondary-blue); /* Color al pasar el mouse */
        }
      `}</style>
    </div>
  );
}

export default Sidebar;
