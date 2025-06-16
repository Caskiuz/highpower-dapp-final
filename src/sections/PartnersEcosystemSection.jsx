// src/sections/PartnersEcosystemSection.jsx
import React from 'react';

function PartnersEcosystemSection() {
  const partners = [
    { name: 'PancakeSwap', logo: 'https://placehold.co/100x50/FFFFFF/000000?text=PancakeSwap', description: 'Nuestro principal socio DEX para liquidez.' },
    { name: 'MetaMask', logo: 'https://placehold.co/100x50/FFFFFF/000000?text=MetaMask', description: 'Billetera Web3 recomendada para interactuar con la DApp.' },
    { name: 'Chainlink', logo: 'https://placehold.co/100x50/FFFFFF/000000?text=Chainlink', description: 'Integración de oráculos para datos confiables (futuro).' },
    { name: 'Trust Wallet', logo: 'https://placehold.co/100x50/FFFFFF/000000?text=TrustWallet', description: 'Soporte completo para dispositivos móviles.' },
    // Añade más socios a medida que HighPower crezca
  ];

  return (
    <section id="partners-ecosystem" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-6 text-center border-2 border-[var(--secondary-blue)]">
      <h2 className="text-4xl font-bold text-[var(--secondary-blue)] mb-6">Socios y Ecosistema</h2>
      <p className="text-[var(--light-gray-text)] text-lg">
        HighPower DApp crece y se fortalece a través de alianzas estratégicas y la integración con plataformas clave del ecosistema Web3.
      </p>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {partners.map((partner, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700 flex flex-col items-center justify-center">
            {/* Placeholder de imagen para logos de socios. Reemplazar con logos reales. */}
            <img src={partner.logo} alt={partner.name} className="h-12 w-auto object-contain mb-3 filter grayscale hover:grayscale-0 transition-all duration-300" 
                 onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x50/333333/FFFFFF?text=Logo"; }}/>
            <h3 className="text-xl font-semibold text-[var(--off-white)] mb-1">{partner.name}</h3>
            <p className="text-gray-400 text-sm">{partner.description}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 text-gray-500 text-sm">
        Construyendo un futuro descentralizado juntos.
      </div>
    </section>
  );
}

export default PartnersEcosystemSection;
