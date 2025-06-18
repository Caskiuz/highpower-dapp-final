// src/sections/AuditSecuritySection.jsx
import React from 'react';

function AuditSecuritySection() {
  // Logos de firmas de auditoría simuladas (reemplaza con logos reales si tienes socios)
  const auditFirms = [
    { name: 'CertiK', logo: 'https://placehold.co/150x80/000000/FFFFFF?text=CertiK', link: '#' },
    { name: 'PeckShield', logo: 'https://placehold.co/150x80/000000/FFFFFF?text=PeckShield', link: '#' },
    { name: 'Hacken', logo: 'https://placehold.co/150x80/000000/FFFFFF?text=Hacken', link: '#' },
    { name: 'SlowMist', logo: 'https://placehold.co/150x80/000000/FFFFFF?text=SlowMist', link: '#' },
  ];

  return (
    <section id="audit-security" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-8 text-center border-2 border-[var(--primary-purple)]">
      <h2 className="text-4xl font-bold text-[var(--primary-purple)] mb-6">Auditorías y Seguridad</h2>
      <p className="text-[var(--light-gray-text)] text-lg mb-8">
        La seguridad es nuestra máxima prioridad. HighPower se compromete con auditorías rigurosas y las mejores prácticas para proteger los activos de nuestros usuarios.
      </p>

      {/* Logos de las firmas de auditoría */}
      <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-[var(--accent-yellow)] mb-8">
        <h3 className="text-3xl font-bold text-[var(--off-white)] mb-6">Nuestros Socios de Seguridad</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
          {auditFirms.map((firm, index) => (
            <a 
              key={index} 
              href={firm.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex flex-col items-center justify-center p-4 bg-gray-900 rounded-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:border-[var(--secondary-blue)]"
            >
              <img src={firm.logo} alt={firm.name} className="w-24 h-auto mb-2 filter grayscale hover:grayscale-0 transition-filter duration-300" />
              <p className="text-[var(--light-gray-text)] font-semibold text-sm">{firm.name}</p>
            </a>
          ))}
        </div>
        <p className="text-gray-500 text-sm mt-6">
          *Los logos y enlaces son simulados. Los informes de auditoría completos se publicarán aquí tras su finalización.
        </p>
      </div>

      {/* Compromiso con la seguridad */}
      <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-[var(--accent-green)]">
        <h3 className="text-3xl font-bold text-[var(--off-white)] mb-6">Nuestro Compromiso de Seguridad</h3>
        <ul className="text-left text-gray-400 list-disc list-inside space-y-3">
          <li>
            <strong className="text-[var(--accent-green)]">Auditorías Externas Constantes:</strong> Todos los contratos inteligentes críticos serán auditados por firmas de seguridad de blockchain reconocidas antes de su despliegue.
          </li>
          <li>
            <strong className="text-[var(--accent-green)]">Pruebas Rigurosas:</strong> Implementación de pruebas unitarias y de integración exhaustivas en todo el código base para asegurar la robustez y evitar vulnerabilidades.
          </li>
          <li>
            <strong className="text-[var(--accent-green)]">Programa de Bug Bounty:</strong> Una vez maduro, consideraremos la implementación de un programa de recompensas por errores para incentivar a la comunidad a reportar vulnerabilidades.
          </li>
          <li>
            <strong className="text-[var(--accent-green)]">Mejores Prácticas de Desarrollo:</strong> Adherencia estricta a los estándares de seguridad de Solidity y las mejores prácticas de desarrollo Web3.
          </li>
          <li>
            <strong className="text-[var(--accent-green)]">Gestión de Fondos Multi-sig:</strong> Los fondos de la tesorería serán gestionados con billeteras de firmas múltiples para mayor seguridad y transparencia.
          </li>
        </ul>
      </div>
    </section>
  );
}

export default AuditSecuritySection;
