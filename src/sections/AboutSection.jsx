// src/sections/AboutSection.jsx
import React from 'react';

function AboutSection() {
  return (
    <section id="about" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-6 border-2 border-[var(--primary-purple)]">
      <h2 className="text-4xl font-bold text-[var(--accent-green)] mb-6">Acerca de HighPower: Elevando la Cultura Altcoin</h2>

      <div className="space-y-6 text-[var(--light-gray-text)]">
        <section>
          <h3 className="text-3xl font-semibold text-[var(--off-white)] mb-4">1. Resumen Ejecutivo</h3>
          <p className="leading-relaxed">
            HighPower (HGP) se posiciona como un ecosistema dual de altcoin y Tokens No Fungibles (NFTs) desarrollado sobre la BNB Chain. Nuestra propuesta de valor fundamental radica en la fusión del humor y la cultura altcoin con la tecnología blockchain, buscando generar valor real y fomentar una comunidad sostenible. Enfatizamos la potencia y la energía de un suministro de token estrictamente limitado y una economía sólida, aprovechando la eficiencia, las bajas tarifas y la alta escalabilidad que ofrece la BNB Chain.
          </p>
        </section>

        <section>
          <h3 className="text-3xl font-semibold text-[var(--off-white)] mb-4">2. Introducción al Problema y la Oportunidad</h3>
          <p className="leading-relaxed">
            El panorama actual de las altcoins, si bien es popular, a menudo carece de sostenibilidad a largo plazo. Paralelamente, los NFTs han emergido como una poderosa forma de expresión artística y activos coleccionables digitales. HighPower identifica la necesidad imperante de una plataforma que logre combinar estos dos mundos de manera innovadora y sostenible, trascendiendo la volatilidad inherente para aportar valor y utilidad duraderos.
          </p>
        </section>

        <section>
          <h3 className="text-3xl font-semibold text-[var(--off-white)] mb-4">3. HighPower (HGP) - Visión y Misión Detalladas</h3>
          <p className="leading-relaxed">
            <strong className="text-[var(--accent-yellow)]">Visión:</strong> Redefinir la percepción del valor de las altcoins, transformándolos en activos digitales apreciables y fomentando una comunidad vibrante, activa y empoderada.
          </p>
          <p className="leading-relaxed mt-2">
            <strong className="text-[var(--accent-yellow)]">Misión:</strong> Construir una plataforma descentralizada y robusta que democratice la creación, el intercambio y la monetización de altcoins como activos digitales. Nos enfocamos en ofrecer herramientas intuitivas a la comunidad, mecanismos de rendimiento transparentes y un modelo de autofinanciamiento que asegure la longevidad y el impacto positivo del proyecto.
          </p>
        </section>
      </div>
    </section>
  );
}

export default AboutSection;
