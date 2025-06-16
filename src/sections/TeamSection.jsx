// src/sections/TeamSection.jsx
import React from 'react';

function TeamSection() {
  const teamMembers = [
    { name: 'Fundador Alpha', role: 'Visión y Estrategia', bio: 'Con años de experiencia en blockchain y DeFi, impulsando la visión de HighPower.', avatar: 'https://placehold.co/100x100/A020F0/FFFFFF?text=F' },
    { name: 'Desarrollador Beta', role: 'Contratos Inteligentes', bio: 'Experto en Solidity y seguridad de smart contracts, construyendo la infraestructura core.', avatar: 'https://placehold.co/100x100/FFD700/000000?text=D' },
    { name: 'Diseñador Gamma', role: 'Experiencia de Usuario', bio: 'Diseñando interfaces intuitivas y atractivas para una DApp fluida.', avatar: 'https://placehold.co/100x100/00FF7F/000000?text=Di' },
    { name: 'Marketing Delta', role: 'Comunidad y Adopción', bio: 'Estratega de marketing Web3 centrado en el crecimiento de la comunidad HighPower.', avatar: 'https://placehold.co/100x100/4169E1/FFFFFF?text=M' },
  ];

  return (
    <section id="team" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-6 text-center border-2 border-[var(--accent-yellow)]">
      <h2 className="text-4xl font-bold text-[var(--accent-yellow)] mb-6">Nuestro Equipo</h2>
      <p className="text-[var(--light-gray-text)] text-lg">
        El equipo fundador de HighPower está compuesto por profesionales dedicados con un compromiso a largo plazo con la visión del proyecto.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamMembers.map((member, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 flex flex-col items-center">
            {/* Avatar Placeholder. Reemplazar con imágenes reales si el equipo se hace público. */}
            <img src={member.avatar} alt={member.name} className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-purple-600 shadow-lg" 
                 onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/333333/FFFFFF?text=HP"; }}/>
            <h3 className="text-2xl font-semibold text-[var(--off-white)] mb-2">{member.name}</h3>
            <p className="text-purple-400 font-medium mb-3">{member.role}</p>
            <p className="text-gray-400 text-sm">{member.bio}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-gray-500 text-sm">
        "En las fases iniciales, el equipo mantiene el anonimato para proteger el desarrollo, enfatizando el compromiso con la comunidad y la promesa de una transparencia creciente a medida que el proyecto madure y gane tracción."
      </p>
    </section>
  );
}

export default TeamSection;
