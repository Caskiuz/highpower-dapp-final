// src/sections/DaoSection.jsx
import React from 'react';

function DaoSection() {
  return (
    <section id="dao" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-6 border-2 border-[var(--primary-purple)]">
      <h2 className="text-4xl font-bold text-[var(--accent-green)] mb-6">Gobernanza Descentralizada (DAO)</h2>

      <div className="space-y-6 text-[var(--light-gray-text)]">
        <section>
          <h3 className="text-3xl font-semibold text-[var(--off-white)] mb-4">11. Gobernanza Descentralizada (DAO)</h3>
          <p className="leading-relaxed">
            La descentralización es un pilar fundamental de HighPower, empoderando a su comunidad a través de una Organización Autónoma Descentralizada (DAO).
          </p>
          <p className="leading-relaxed mt-4">
            Se establecerá una DAO donde los holders de $HGP podrán votar sobre decisiones críticas del proyecto, incluyendo:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Distribución de fondos de la tesorería comunitaria.</li>
            <li>Modificaciones a los tokenomics.</li>
            <li>Propuestas para nuevas características de la plataforma.</li>
            <li>Establecimiento de asociaciones estratégicas.</li>
          </ul>
        </section>

        <section className="mt-8 pt-6 border-t border-[var(--primary-purple)]">
          <h3 className="text-3xl font-semibold text-[var(--accent-yellow)] mb-4">Propuestas Activas de la DAO</h3>
          <div className="bg-[var(--dark-gray)] p-6 rounded-2xl shadow-md border border-[var(--accent-green)]">
            <p className="text-[var(--light-gray-text)] mb-4">
              Aquí se listarían las propuestas activas de la DAO, permitiendo a los holders de $HGP revisar los detalles y emitir su voto.
            </p>
            <div className="border border-[var(--secondary-blue)] rounded-lg p-4 mb-4">
              <h4 className="text-xl font-bold text-[var(--accent-green)] mb-2">Propuesta #001: Aumentar el porcentaje de quema por transacción</h4>
              <p className="text-[var(--light-gray-text)] text-sm">Estado: Abierta</p>
              <p className="text-[var(--light-gray-text)] text-sm">Fecha de cierre: 2025-07-15</p>
              <button className="mt-3 bg-[var(--primary-purple)] hover:bg-[var(--secondary-blue)] text-[var(--off-white)] font-bold py-2 px-4 rounded-lg text-sm transition duration-300 ease-in-out transform hover:scale-105">
                Ver Detalles y Votar
              </button>
            </div>
            <div className="border border-[var(--secondary-blue)] rounded-lg p-4">
              <h4 className="text-xl font-bold text-[var(--accent-green)] mb-2">Propuesta #002: Financiamiento de campaña de marketing global</h4>
              <p className="text-[var(--light-gray-text)] text-sm">Estado: Abierta</p>
              <p className="text-[var(--light-gray-text)] text-sm">Fecha de cierre: 2025-07-20</p>
              <button className="mt-3 bg-[var(--primary-purple)] hover:bg-[var(--secondary-blue)] text-[var(--off-white)] font-bold py-2 px-4 rounded-lg text-sm transition duration-300 ease-in-out transform hover:scale-105">
                Ver Detalles y Votar
              </button>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default DaoSection;
