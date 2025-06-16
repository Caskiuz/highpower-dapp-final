// src/sections/TeamSection.jsx
import React from 'react';

function TeamSection() {
  const teamMembers = [
    { 
      name: 'Visionario Principal', 
      role: 'Fundador y Estratega Principal', 
      bio: 'Líder con una profunda experiencia en el espacio blockchain y DeFi, impulsando la visión y dirección estratégica de HighPower. Especializado en diseño de ecosistemas y crecimiento sostenible.', 
      avatar: 'https://placehold.co/150x150/8A2BE2/FFFFFF/png?text=VP' // Violeta
    },
    { 
      name: 'Arquitecto de Contratos', 
      role: 'Líder de Desarrollo Blockchain', 
      bio: 'Ingeniero de software senior con años de experiencia en Solidity y contratos inteligentes. Responsable de la arquitectura segura y optimizada de todos los contratos de HighPower.', 
      avatar: 'https://placehold.co/150x150/4169E1/FFFFFF/png?text=AC' // Azul
    },
    { 
      name: 'Maestro de la Experiencia', 
      role: 'Diseñador Principal de Producto', 
      bio: 'Especialista en UX/UI con un enfoque en interfaces intuitivas y atractivas para DApps. Garantiza que HighPower sea accesible y fácil de usar para todos los usuarios.', 
      avatar: 'https://placehold.co/150x150/00FF7F/000000/png?text=ME' // Verde
    },
    { 
      name: 'Estratega de Crecimiento', 
      role: 'Director de Marketing y Comunidad', 
      bio: 'Experto en marketing Web3 con un historial probado en la construcción y escalado de comunidades. Lidera las iniciativas de crecimiento y adopción de HighPower.', 
      avatar: 'https://placehold.co/150x150/FFD700/000000/png?text=EC' // Amarillo
    },
    { 
      name: 'Analista de Tokenomics', 
      role: 'Economista de Protocolo', 
      bio: 'Con un fuerte bagaje en economía y diseño de sistemas, asegura la robustez y sostenibilidad de la tokenomía de $HGP a largo plazo.', 
      avatar: 'https://placehold.co/150x150/A020F0/FFFFFF/png?text=AT' // Púrpura oscuro
    },
    { 
      name: 'Científico de Datos', 
      role: 'Investigador Cuantitativo', 
      bio: 'Especialista en análisis de datos on-chain y métricas de protocolo. Su trabajo es clave para optimizar los rendimientos y la toma de decisiones basada en datos.', 
      avatar: 'https://placehold.co/150x150/ADD8E6/000000/png?text=CD' // Azul claro
    },
  ];

  return (
    <section id="team" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-6 text-center border-2 border-[var(--accent-yellow)]">
      <h2 className="text-4xl font-bold text-[var(--accent-yellow)] mb-6">Conoce a Nuestro Equipo Central</h2>
      <p className="text-[var(--light-gray-text)] text-lg mb-8">
        Detrás de HighPower, hay un equipo global y multidisciplinario de profesionales dedicados, con profunda experiencia en el espacio Web3.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 flex flex-col items-center transform transition-transform duration-300 hover:scale-105 hover:border-purple-600">
            {/* Avatar - usar placehold.co para generar imágenes con texto y colores */}
            <img 
              src={member.avatar} 
              alt={`Avatar de ${member.name}`} 
              className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-purple-600 shadow-lg" 
              // Fallback en caso de que la imagen no cargue
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x150/333333/FFFFFF?text=HP"; }}
            />
            <h3 className="text-2xl font-semibold text-[var(--off-white)] mb-2">{member.name}</h3>
            <p className="text-purple-400 font-medium mb-3 text-lg">{member.role}</p>
            <p className="text-gray-400 text-sm italic">{member.bio}</p>
            {/* Opcional: Enlaces a redes sociales simulados */}
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors"><i className="fab fa-twitter text-xl"></i></a>
              <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors"><i className="fab fa-linkedin-in text-xl"></i></a>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-8 text-gray-500 text-sm">
        "En las fases iniciales, el equipo mantiene el anonimato para proteger el desarrollo, enfatizando el compromiso con la comunidad y la promesa de una transparencia creciente a medida que el proyecto madure y gane tracción. La experiencia descrita es colectiva y representativa de las capacidades del equipo."
      </p>
    </section>
  );
}

export default TeamSection;
