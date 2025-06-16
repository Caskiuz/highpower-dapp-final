// src/sections/IncubationSection.jsx
import React from 'react';

function IncubationSection() {
  const incubatedProjects = [
    {
      id: 1,
      name: 'HighPower Lending Protocol',
      description: 'Un protocolo de préstamos y empréstitos descentralizado que permitirá a los usuarios prestar y tomar prestado $HGP y otros activos, generando rendimiento adicional.',
      status: 'En Concepto', // 'En Concepto', 'En Desarrollo', 'Próximo Lanzamiento'
      focus: 'DeFi',
      imageUrl: 'https://placehold.co/400x250/6B46C1/FFFFFF/png?text=Lending+Protocol',
      link: '#' // Enlace a un whitepaper o página conceptual simulada
    },
    {
      id: 2,
      name: 'NFT Gamification Platform',
      description: 'Una plataforma que integrará los NFTs de HighPower en experiencias de juego Web3, añadiendo utilidad y diversión a tus coleccionables.',
      status: 'En Desarrollo',
      focus: 'NFT Gaming',
      imageUrl: 'https://placehold.co/400x250/4299E1/FFFFFF/png?text=NFT+Gaming',
      link: '#'
    },
    {
      id: 3,
      name: 'HighPower Launchpad',
      description: 'Una plataforma para nuevos proyectos innovadores construidos sobre la BNB Chain, con participación exclusiva para holders de $HGP.',
      status: 'En Concepto',
      focus: 'Launchpad',
      imageUrl: 'https://placehold.co/400x250/6EE7B7/000000/png?text=Launchpad',
      link: '#'
    },
    {
      id: 4,
      name: 'Web3 Identity & Reputation System',
      description: 'Un sistema descentralizado para construir y gestionar la identidad y reputación on-chain de los usuarios dentro del ecosistema HighPower.',
      status: 'Investigación',
      focus: 'Infraestructura',
      imageUrl: 'https://placehold.co/400x250/FBBF24/000000/png?text=Web3+ID',
      link: '#'
    },
  ];

  return (
    <section id="incubation" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-8 text-center border-2 border-[var(--accent-green)]">
      <h2 className="text-4xl font-bold text-[var(--accent-green)] mb-6">HighPower Incubation Lab</h2>
      <p className="text-[var(--light-gray-text)] text-lg mb-8">
        El futuro de HighPower es expansivo. Nuestro laboratorio de incubación está explorando y desarrollando la próxima generación de innovaciones Web3.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {incubatedProjects.map(project => (
          <div key={project.id} className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden transform transition-transform duration-300 hover:scale-103 hover:border-[var(--primary-purple)]">
            <img src={project.imageUrl} alt={project.name} className="w-full h-48 object-cover" />
            <div className="p-6 text-left">
              <h3 className="text-xl font-bold text-[var(--off-white)] mb-2">{project.name}</h3>
              <p className="text-gray-400 text-sm mb-3">Foco: <span className="font-semibold text-[var(--accent-green)]">{project.focus}</span></p>
              <p className="text-gray-300 text-base mb-4 overflow-hidden h-20">{project.description}</p>
              <div className="flex justify-between items-center mt-auto">
                <span className={`px-3 py-1 rounded-full text-xs font-bold 
                  ${project.status === 'En Concepto' ? 'bg-blue-600 text-white' : 
                     project.status === 'En Desarrollo' ? 'bg-yellow-600 text-white' : 
                     'bg-green-600 text-white'}`}>
                  {project.status}
                </span>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[var(--secondary-blue)] hover:text-[var(--accent-yellow)] font-semibold transition-colors duration-200"
                >
                  Saber más <i className="fas fa-external-link-alt ml-2 text-sm"></i>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-gray-500 text-sm mt-8">
        *Estos proyectos son iniciativas en exploración o desarrollo. Los detalles y lanzamientos están sujetos a cambios.
      </p>
    </section>
  );
}

export default IncubationSection;
