// src/sections/AuditSecuritySection.jsx
import React from 'react';

function AuditSecuritySection() {
  return (
    <section id="audit-security" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-6 text-center border-2 border-[var(--accent-green)]">
      <h2 className="text-4xl font-bold text-[var(--accent-green)] mb-6">Auditorías y Seguridad</h2>
      <p className="text-[var(--light-gray-text)] text-lg">
        La seguridad es nuestra máxima prioridad. HighPower DApp se compromete a mantener los más altos estándares de seguridad para proteger los activos y la confianza de nuestros usuarios.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <i className="fas fa-file-contract text-5xl text-blue-400 mb-4"></i>
          <h3 className="text-2xl font-semibold text-[var(--off-white)] mb-3">Informes de Auditoría de Contratos</h3>
          <p className="text-gray-400 mb-4">Accede a los informes completos de auditorías realizadas por firmas de seguridad externas.</p>
          <a href="#" target="_blank" rel="noopener noreferrer" className="bg-[var(--primary-purple)] hover:bg-[var(--secondary-blue)] text-white font-bold py-2 px-4 rounded-lg transition duration-300">
            Ver Auditorías (Próximamente)
          </a>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <i className="fas fa-bug text-5xl text-red-400 mb-4"></i>
          <h3 className="text-2xl font-semibold text-[var(--off-white)] mb-3">Programa de Recompensas por Bugs</h3>
          <p className="text-gray-400 mb-4">Invitamos a la comunidad de seguridad a identificar y reportar vulnerabilidades.</p>
          <a href="#" target="_blank" rel="noopener noreferrer" className="bg-[var(--primary-purple)] hover:bg-[var(--secondary-blue)] text-white font-bold py-2 px-4 rounded-lg transition duration-300">
            Más Información (Próximamente)
          </a>
        </div>
      </div>
      <div className="mt-8 text-gray-500 text-sm">
        Comprometidos con la transparencia y las mejores prácticas de seguridad en Web3.
      </div>
    </section>
  );
}

export default AuditSecuritySection;
