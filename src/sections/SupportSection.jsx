// src/sections/SupportSection.jsx
import React from 'react';

function SupportSection() {
  return (
    <section id="support" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-6 text-center border-2 border-[var(--primary-purple)]">
      <h2 className="text-4xl font-bold text-[var(--accent-yellow)] mb-6">Soporte HighPower</h2>
      <p className="text-[var(--light-gray-text)] text-lg">
        ¿Necesitas ayuda? Ponte en contacto con nuestro equipo de soporte a través de nuestros canales oficiales o busca respuestas en nuestra sección de preguntas frecuentes.
      </p>
      <div className="mt-8 h-48 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 text-xl">
        [Formulario de Contacto / FAQs en desarrollo]
      </div>
    </section>
  );
}

export default SupportSection;
