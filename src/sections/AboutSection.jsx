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
            HighPower (HGP) se posiciona como un ecosistema dual de altcoin y Tokens No Fungibles (NFTs) desarrollado sobre la BNB Chain. Nuestra propuesta de valor fundamental radica en la fusión de la cultura altcoin con la innovación NFT, buscando crear una comunidad vibrante, sostenible y empoderada.
          </p>
        </section>

        <section>
          <h3 className="text-3xl font-semibold text-[var(--off-white)] mb-4">2. Introducción al Problema y la Oportunidad</h3>
          <p className="leading-relaxed">
            El panorama actual de las altcoins, si bien es popular, a menudo carece de sostenibilidad a largo plazo. Paralelamente, los NFTs han emergido como una poderosa forma de expresión artística y de pertenencia. Sin embargo, la integración efectiva de ambos mundos presenta una oportunidad única para dar longevidad, identidad y valor real a las comunidades.
          </p>
        </section>

        <section>
          <h3 className="text-3xl font-semibold text-[var(--off-white)] mb-4">3. HighPower (HGP) - Visión y Misión Detalladas</h3>
          <p className="leading-relaxed">
            <strong className="text-[var(--accent-yellow)]">Visión:</strong> Redefinir la percepción del valor de las altcoins, transformándolos en activos digitales apreciables y fomentando una cultura de colaboración, creatividad y prosperidad.
          </p>
          <p className="leading-relaxed mt-2">
            <strong className="text-[var(--accent-yellow)]">Misión:</strong> Construir una plataforma descentralizada y robusta que democratice la creación, el intercambio y la monetización de NFTs, mientras impulsa el crecimiento de un token utilitario sólido y atractivo para todos los participantes.
          </p>
        </section>
      </div>
    </section>
  );
}

export default AboutSection;
