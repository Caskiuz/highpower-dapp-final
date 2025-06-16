// src/sections/LibrarySection.jsx
import React from 'react';

function LibrarySection() {
  return (
    <section id="library" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-6 text-center border-2 border-[var(--secondary-blue)]">
      <h2 className="text-4xl font-bold text-[var(--accent-green)] mb-6">Biblioteca HighPower</h2>
      <p className="text-[var(--light-gray-text)] text-lg">
        Accede a una amplia gama de recursos educativos, guías, documentación y análisis del ecosistema blockchain y cripto.
      </p>
      <div className="mt-8 h-48 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 text-xl">
        [Contenido de la Biblioteca en desarrollo]
      </div>
    </section>
  );
}

export default LibrarySection;
