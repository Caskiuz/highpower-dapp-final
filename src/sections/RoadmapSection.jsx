// src/sections/RoadmapSection.jsx
import React from 'react';

function RoadmapSection() {
  return (
    <section id="roadmap" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-6 border-2 border-[var(--secondary-blue)]">
      <h2 className="text-4xl font-bold text-[var(--accent-green)] mb-6">Hoja de Ruta de HighPower</h2>

      <div className="space-y-6 text-[var(--light-gray-text)]">
        <section>
          <h3 className="text-3xl font-semibold text-[var(--off-white)] mb-4">15. Roadmap (Línea de Tiempo Sugerida para BNB Chain)</h3>
          <p className="leading-relaxed">
            El roadmap de HighPower es una guía estratégica para el desarrollo y expansión del ecosistema.
          </p>

          <div className="relative mt-8">
            <div className="border-l-4 border-[var(--primary-purple)] absolute h-full left-1/2 transform -translate-x-1/2"></div> {/* Línea central */}

            {/* Fase 1 */}
            <div className="mb-8 flex items-center justify-between flex-row-reverse md:flex-row">
              <div className="order-1 w-5/12 text-right p-2 rounded-lg bg-[var(--primary-purple)] bg-opacity-20 backdrop-filter backdrop-blur-sm border border-[var(--secondary-blue)]">
                <h4 className="text-2xl font-bold text-[var(--accent-yellow)]">Fase 1: Concepción y Lanzamiento Inicial (Q3 2025)</h4>
                <ul className="list-disc list-inside text-[var(--light-gray-text)] mt-2 text-left md:text-right space-y-1">
                  <li>Diseño y desarrollo de contratos inteligentes $HGP (BEP-20) y NFTs (BEP-721).</li>
                  <li>Auditoría inicial del contrato del token y NFT.</li>
                  <li>Desarrollo del sitio web principal con Whitepaper, Tokenomics y Roadmap interactivo.</li>
                  <li>Lanzamiento del token $HGP en la BNB Chain.</li>
                  <li>Provisión de liquidez inicial en un DEX (PancakeSwap/Biswap).</li>
                  <li>Lanzamiento de la campaña de marketing inicial y construcción de comunidad.</li>
                </ul>
              </div>
              <div className="z-10 flex items-center order-1 bg-[var(--accent-green)] shadow-xl w-10 h-10 rounded-full">
                <h1 className="mx-auto font-semibold text-lg text-[var(--dark-gray)]">1</h1>
              </div>
              <div className="order-1 w-5/12"></div> {/* Espacio vacío para balancear */}
            </div>

            {/* Fase 2 */}
            <div className="mb-8 flex items-center justify-between md:flex-row-reverse">
              <div className="order-1 w-5/12 text-left p-2 rounded-lg bg-[var(--secondary-blue)] bg-opacity-20 backdrop-filter backdrop-blur-sm border border-[var(--primary-purple)]">
                <h4 className="text-2xl font-bold text-[var(--accent-yellow)]">Fase 2: Expansión de Utilidad y Rendimientos (Q4 2025)</h4>
                <ul className="list-disc list-inside text-[var(--light-gray-text)] mt-2 space-y-1">
                  <li>Implementación y auditoría del contrato inteligente de Staking para $HGP.</li>
                  <li>Lanzamiento del Staking Pool en la plataforma web.</li>
                  <li>Desarrollo y lanzamiento del módulo de Swap integrado en la web.</li>
                  <li>Integración de gráficas de precios del token en tiempo real en la web.</li>
                  <li>Lanzamiento de la primera colección de NFTs "HighPower Originals".</li>
                </ul>
              </div>
              <div className="z-10 flex items-center order-1 bg-[var(--accent-green)] shadow-xl w-10 h-10 rounded-full">
                <h1 className="mx-auto font-semibold text-lg text-[var(--dark-gray)]">2</h1>
              </div>
              <div className="order-1 w-5/12"></div>
            </div>

            {/* Fase 3 */}
            <div className="mb-8 flex items-center justify-between flex-row-reverse md:flex-row">
              <div className="order-1 w-5/12 text-right p-2 rounded-lg bg-[var(--primary-purple)] bg-opacity-20 backdrop-filter backdrop-blur-sm border border-[var(--secondary-blue)]">
                <h4 className="text-2xl font-bold text-[var(--accent-yellow)]">Fase 3: Ecosistema NFT y Gobernanza (Q1 2026)</h4>
                <ul className="list-disc list-inside text-[var(--light-gray-text)] mt-2 text-left md:text-right space-y-1">
                  <li>Desarrollo y auditoría del contrato inteligente del Marketplace de NFTs.</li>
                  <li>Implementación del sistema de regalías para creadores en el marketplace.</li>
                  <li>Lanzamiento de la DAO de HighPower (contrato de gobernanza).</li>
                  <li>Primera propuesta de gobernanza votada por la comunidad.</li>
                  <li>Expansión del sistema de rendimientos (ej. farming de liquidez, staking de NFTs).</li>
                </ul>
              </div>
              <div className="z-10 flex items-center order-1 bg-[var(--accent-green)] shadow-xl w-10 h-10 rounded-full">
                <h1 className="mx-auto font-semibold text-lg text-[var(--dark-gray)]">3</h1>
              </div>
              <div className="order-1 w-5/12"></div>
            </div>

            {/* Fase 4 */}
            <div className="mb-8 flex items-center justify-between md:flex-row-reverse">
              <div className="order-1 w-5/12 text-left p-2 rounded-lg bg-[var(--secondary-blue)] bg-opacity-20 backdrop-filter backdrop-blur-sm border border-[var(--primary-purple)]">
                <h4 className="text-2xl font-bold text-[var(--accent-yellow)]">Fase 4: Crecimiento y Sostenibilidad (Q2 2026 en adelante)</h4>
                <ul className="list-disc list-inside text-[var(--light-gray-text)] mt-2 space-y-1">
                  <li>Establecimiento de asociaciones estratégicas con otros proyectos de la BNB Chain.</li>
                  <li>Integración de herramientas de creación de altcoins / NFTs directamente en la plataforma.</li>
                  <li>Optimización continua de la plataforma y mejora de la experiencia de usuario.</li>
                  <li>Campañas de marketing globales y expansión a nuevos mercados.</li>
                </ul>
              </div>
              <div className="z-10 flex items-center order-1 bg-[var(--accent-green)] shadow-xl w-10 h-10 rounded-full">
                <h1 className="mx-auto font-semibold text-lg text-[var(--dark-gray)]">4</h1>
              </div>
              <div className="order-1 w-5/12"></div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default RoadmapSection;
