// src/sections/RoadmapSection.jsx
import React, { useState } from 'react';

function RoadmapSection() {
  // Estado para controlar qué hito está expandido/colapsado
  const [expandedMilestone, setExpandedMilestone] = useState(null);

  // Datos para el Roadmap
  const roadmapMilestones = [
    {
      id: 'q3-2025',
      quarter: 'Q3 2025',
      title: 'Concepción y Lanzamiento Inicial',
      status: 'completed', // 'completed', 'in-progress', 'upcoming'
      details: [
        'Diseño y desarrollo de contratos inteligentes $HGP (BEP-20) y NFTs (BEP-721).',
        'Auditoría inicial del contrato del token y NFT por firmas de seguridad de renombre.',
        'Desarrollo y lanzamiento del sitio web principal (landing page y secciones informativas: Whitepaper, Tokenomics, Roadmap).',
        'Lanzamiento oficial del token $HGP en la BNB Chain.',
        'Provisión de liquidez inicial robusta en un DEX clave (ej. PancakeSwap).',
        'Lanzamiento de la campaña de marketing inicial y construcción de comunidad en plataformas clave.'
      ]
    },
    {
      id: 'q4-2025',
      quarter: 'Q4 2025',
      title: 'Expansión de Utilidad y Rendimientos',
      status: 'in-progress',
      details: [
        'Implementación y auditoría del contrato inteligente de Staking para $HGP.',
        'Lanzamiento del Staking Pool en la plataforma web.',
        'Desarrollo y lanzamiento del módulo de Swap integrado en la DApp para intercambio $HGP/BNB.',
        'Integración de gráficas de precios del token $HGP en tiempo real en la DApp.',
        'Lanzamiento de la primera colección oficial de NFTs "HighPower Originals".'
      ]
    },
    {
      id: 'q1-2026',
      quarter: 'Q1 2026',
      title: 'Ecosistema NFT y Gobernanza',
      status: 'upcoming',
      details: [
        'Desarrollo y auditoría del contrato inteligente del Marketplace de NFTs.',
        'Implementación del sistema de regalías para creadores en el marketplace de NFTs.',
        'Lanzamiento completo de la DAO de HighPower (contrato de gobernanza on-chain).',
        'Ejecución de la primera propuesta de gobernanza votada por la comunidad.',
        'Expansión del sistema de rendimientos (ej. farming de liquidez, staking de NFTs).'
      ]
    },
    {
      id: 'q2-2026-onwards',
      quarter: 'Q2 2026 en adelante',
      title: 'Crecimiento y Sostenibilidad',
      status: 'upcoming',
      details: [
        'Establecimiento de asociaciones estratégicas con otros proyectos líderes en la BNB Chain y ecosistemas inter-cadena.',
        'Exploración e integración de herramientas avanzadas para la creación de activos digitales (altcoins / NFTs) directamente en la plataforma.',
        'Optimización continua de la DApp basada en el feedback de la comunidad y la evolución tecnológica.',
        'Lanzamiento de campañas de marketing globales para una mayor adopción y expansión a nuevos mercados.',
        'Investigación y desarrollo para futuras integraciones cross-chain.'
      ]
    }
  ];

  // Función para alternar la expansión de un hito
  const toggleMilestone = (id) => {
    setExpandedMilestone(expandedMilestone === id ? null : id);
  };

  // Determina el color del icono de estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'in-progress': return 'text-yellow-500';
      case 'upcoming': return 'text-blue-500';
      default: return 'text-gray-400';
    }
  };

  // Determina el icono de estado
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'fa-circle-check';
      case 'in-progress': return 'fa-hourglass-half';
      case 'upcoming': return 'fa-circle-dot';
      default: return 'fa-circle';
    }
  };

  return (
    <section id="roadmap" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-8 text-center border-2 border-[var(--secondary-blue)]">
      <h2 className="text-4xl font-bold text-[var(--secondary-blue)] mb-6">Hoja de Ruta (Roadmap) de HighPower</h2>
      <p className="text-[var(--light-gray-text)] text-lg mb-8">
        Nuestra guía estratégica que delinea los hitos clave para el desarrollo y expansión del ecosistema.
      </p>

      <div className="relative flex flex-col items-center">
        {/* Línea vertical del roadmap */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-purple-700 h-full rounded-full"></div>

        {roadmapMilestones.map((milestone, index) => (
          <div 
            key={milestone.id} 
            className="relative w-full py-6 flex items-start md:items-center justify-center"
          >
            {/* Contenedor del hito */}
            <div 
              className={`bg-gray-800 p-6 rounded-2xl shadow-lg border-2 
                          ${milestone.status === 'completed' ? 'border-green-600' : 
                            milestone.status === 'in-progress' ? 'border-yellow-600' : 'border-blue-600'}
                          w-full md:w-3/4 lg:w-2/3 xl:w-1/2 text-left z-10 
                          transform transition-transform duration-300 ease-in-out
                          ${expandedMilestone === milestone.id ? 'scale-105' : 'scale-100'}
                          `}
            >
              <div className="flex items-center mb-4 cursor-pointer" onClick={() => toggleMilestone(milestone.id)}>
                {/* Icono de estado en la izquierda del título */}
                <i className={`fas ${getStatusIcon(milestone.status)} ${getStatusColor(milestone.status)} text-2xl mr-4`}></i>
                <div>
                  <h3 className="text-2xl font-bold text-[var(--off-white)]">{milestone.title}</h3>
                  <p className="text-purple-400 font-semibold">{milestone.quarter}</p>
                </div>
                {/* Icono de expandir/colapsar en la derecha */}
                <i className={`fas ${expandedMilestone === milestone.id ? 'fa-chevron-up' : 'fa-chevron-down'} 
                                 text-lg text-gray-400 ml-auto transition-transform duration-300`}></i>
              </div>

              {/* Detalles del hito (se expanden/colapsan) */}
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out
                            ${expandedMilestone === milestone.id ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
              >
                <ul className="list-disc list-inside text-gray-400 space-y-2">
                  {milestone.details.map((detail, dIndex) => (
                    <li key={dIndex}>{detail}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Círculo en la línea de tiempo */}
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                            w-8 h-8 rounded-full border-4 ${milestone.status === 'completed' ? 'border-green-500 bg-green-700' : 
                                                            milestone.status === 'in-progress' ? 'border-yellow-500 bg-yellow-700' : 'border-blue-500 bg-blue-700'} 
                            z-20 flex items-center justify-center`}>
              <i className={`fas ${getStatusIcon(milestone.status)} text-white text-base`}></i>
            </div>
          </div>
        ))}
      </div>
      <p className="text-gray-500 text-sm mt-8">
        La hoja de ruta es una visión dinámica y puede ajustarse para adaptarse a las necesidades del mercado y las prioridades de la comunidad.
      </p>
    </section>
  );
}

export default RoadmapSection;
