// src/sections/ContactSection.jsx
import React from 'react';

function ContactSection() {
  return (
    <section id="contact" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-6 text-center border-2 border-[var(--secondary-blue)]">
      <h2 className="text-4xl font-bold text-[var(--accent-green)] mb-6">Contacto y Redes Sociales</h2>

      <div className="space-y-6 text-[var(--light-gray-text)]">
        <section>
          <h3 className="text-3xl font-semibold text-[var(--off-white)] mb-4">14. Contacto y Redes Sociales</h3>
          <p className="leading-relaxed mb-6">
            Para una comunicación abierta y el fomento de la comunidad, HighPower mantendrá una presencia activa en:
          </p>
          <div className="flex justify-center items-center space-x-6 text-4xl">
            {/* Asegúrate de tener Font Awesome o similar importado en tu index.html o como módulo para ver estos iconos */}
            <a href="https://t.me/highpowerdapp" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-green-400 transition-colors duration-300" aria-label="Telegram">
              <i className="fab fa-telegram"></i>
            </a>
            <a href="https://discord.gg/highpowerdapp" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-green-400 transition-colors duration-300" aria-label="Discord">
              <i className="fab fa-discord"></i>
            </a>
            <a href="https://twitter.com/highpowerdapp" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300" aria-label="X (Twitter)">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://github.com/highpowerdapp" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300" aria-label="GitHub">
              <i className="fab fa-github"></i>
            </a>
          </div>
          <p className="text-sm mt-8 opacity-80">
            (Otros canales relevantes se añadirán según el crecimiento)
          </p>
        </section>

        <section className="mt-8 pt-6 border-t border-[var(--primary-purple)]">
          <h3 className="text-3xl font-semibold text-[var(--off-white)] mb-4">13. Equipo</h3>
          <p className="leading-relaxed">
            El equipo detrás de HighPower está comprometido con la visión del proyecto.
            En las fases iniciales, se mantendrá el anonimato, pero se enfatizará el compromiso con la comunidad y la promesa de transparencia creciente a medida que el proyecto madure y gane tracción.
          </p>
        </section>

        <section className="mt-8 pt-6 border-t border-[var(--primary-purple)]">
          <h3 className="text-3xl font-semibold text-[var(--off-white)] mb-4">12. Seguridad y Auditorías</h3>
          <p className="leading-relaxed">
            El compromiso con la seguridad es primordial para HighPower. Garantizar la integridad y la seguridad de los contratos inteligentes y la plataforma en su totalidad. Se realizarán auditorías de seguridad exhaustivas por parte de empresas de renombre antes del lanzamiento de cualquier componente crítico y de forma periódica.
          </p>
        </section>
      </div>
    </section>
  );
}

export default ContactSection;
