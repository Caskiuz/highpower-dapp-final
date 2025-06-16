// src/components/Sidebar.jsx
import React from 'react';
// Importa algunos iconos. Puedes usar Phosphor Icons (si ya los tienes) o inline SVGs.
// Para este ejemplo, usaremos Font Awesome si está en tu index.html, o iconos básicos/SVGs.
// Si Font Awesome no está en index.html, considera añadirlo:
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" xintegrity="sha512-..." crossorigin="anonymous" referrerpolicy="no-referrer" />

function Sidebar({ onNavigate, currentSection }) {
  const navItems = [
    { name: 'Dashboard', path: 'dashboard', icon: 'fa-gauge-high' }, // Icono de tablero
    { name: 'Rendimientos', path: 'yield', icon: 'fa-coins' }, // Icono de monedas/rendimiento
    { name: 'NFTs', path: 'nfts', icon: 'fa-image' }, // Icono de imagen/NFT
    { name: 'Swap', path: 'swap', icon: 'fa-right-left' }, // Icono de intercambio
    { name: 'Gobernanza', path: 'dao', icon: 'fa-gavel' }, // Icono de martillo (gobierno)
    // Otros enlaces que puedan ir en el sidebar
    { name: 'Token $HGP', path: 'tokenomics', icon: 'fa-atom' },
    { name: 'Roadmap', path: 'roadmap', icon: 'fa-road' },
    { name: 'Tech Stack', path: 'tech', icon: 'fa-gears' },
    { name: 'Acerca de', path: 'about', icon: 'fa-circle-info' },
    { name: 'Contacto', path: 'contact', icon: 'fa-envelope' },
  ];

  return (
    // Sidebar fijo a la izquierda, ocupa toda la altura, con un ancho definido
    // La altura se ajusta por padding-top para dejar espacio a la barra superior
    <div className="fixed left-0 top-0 h-full w-20 lg:w-24 bg-gray-900 border-r border-purple-700
                    flex flex-col items-center py-4 z-30 pt-[80px]"> {/* pt-20 para dejar espacio a la Navbar */}
      
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => onNavigate(item.path)}
          // Clases dinámicas para resaltar la sección activa
          className={`group flex flex-col items-center justify-center p-3 my-2 w-full rounded-lg
                      transition-colors duration-300 ease-in-out
                      ${currentSection === item.path 
                        ? 'bg-purple-800 text-white shadow-lg' 
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
          title={item.name} // Tooltip al pasar el mouse
        >
          {/* Icono */}
          <i className={`fas ${item.icon} text-2xl mb-1`}></i>
          {/* Nombre (visible solo en pantallas grandes o al pasar el mouse si se reduce el sidebar) */}
          <span className="text-xs font-semibold">
            {item.name}
          </span>
        </button>
      ))}
    </div>
  );
}

export default Sidebar;
