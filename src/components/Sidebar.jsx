// src/components/Sidebar.jsx
import React from 'react';
// Asegúrate de tener Font Awesome cargado en tu index.html para estos iconos.
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />

function Sidebar({ onNavigate, currentSection }) {
  const navItems = [
    { name: 'Dashboard', path: 'dashboard', icon: 'fa-gauge-high' },
    { name: 'Roadmap', path: 'roadmap', icon: 'fa-road' }, // <-- CAMBIO AQUÍ: 'Incubación' reemplazado por 'Roadmap'
    { name: 'Recompensas', path: 'yield', icon: 'fa-coins' }, 
    { name: 'Gobernanza', path: 'dao', icon: 'fa-gavel' }, 
    { name: 'Metamarket', path: 'nfts', icon: 'fa-store' }, 
    { name: 'Whitepaper', path: 'whitepaper', icon: 'fa-file-lines' },
    { name: 'Soporte', path: 'support', icon: 'fa-headset' }, 
  ];

  return (
    // Sidebar fijo a la izquierda, ocupa toda la altura, con un ancho definido
    // La altura se ajusta por padding-top para dejar espacio a la barra superior
    <div className="fixed left-0 top-0 h-full w-20 lg:w-24 bg-gray-900 border-r border-purple-700
                    flex flex-col items-center py-4 z-30 pt-[72px]"> {/* pt-[72px] para dejar espacio a la Navbar superior */}
      
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
          {/* Nombre */}
          <span className="text-xs font-semibold">
            {item.name}
          </span>
        </button>
      ))}
    </div>
  );
}

export default Sidebar;
