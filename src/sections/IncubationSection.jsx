// src/sections/IncubationSection.jsx
import React from 'react';

function IncubationSection() {
  return (
    <section id="incubation" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-6 text-center border-2 border-[var(--accent-green)]">
      <h2 className="text-4xl font-bold text-[var(--accent-yellow)] mb-6">Incubación HighPower</h2>
      <p className="text-[var(--light-gray-text)] text-lg">
        Aquí podrás encontrar oportunidades para incubar nuevos proyectos o activos dentro del ecosistema HighPower.
        ¡Próximamente más detalles!
      </p>
      <div className="mt-8 h-48 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 text-xl">
        [Contenido de Incubación en desarrollo]
      </div>
    </section>
  );
}

export default IncubationSection;
