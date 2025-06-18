// src/sections/PartnersEcosystemSection.jsx
import React from "react";

function PartnersEcosystemSection() {
  const partners = [
    {
      name: "BNB Chain",
      desc: "Blockchain principal para el despliegue de $HGP y el core de nuestro ecosistema.",
      logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png?v=025", // Reemplaza por un logo propio si lo tienes
      url: "https://www.bnbchain.org/"
    },
    {
      name: "PancakeSwap",
      desc: "DEX clave donde $HGP obtiene liquidez, swaps y yield-farming.",
      logo: "https://cryptologos.cc/logos/pancakeswap-cake-logo.png?v=025",
      url: "https://pancakeswap.finance/"
    },
    {
      name: "CertiK (Auditoría)",
      desc: "Auditoría de contratos inteligentes para máxima seguridad.",
      logo: "https://cryptologos.cc/logos/certik-ctk-logo.png?v=025",
      url: "https://www.certik.com/"
    },
    {
      name: "Chainlink",
      desc: "Oráculos para precios y feeds descentralizados en la DApp.",
      logo: "https://cryptologos.cc/logos/chainlink-link-logo.png?v=025",
      url: "https://chain.link/"
    }
  ];

  return (
    <section id="partners-ecosystem" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-10 text-center border-2 border-[var(--accent-yellow)]">
      <h2 className="text-4xl font-bold text-[var(--accent-yellow)] mb-6">
        Partners & Ecosistema
      </h2>
      <p className="text-[var(--light-gray-text)] text-lg mb-8">
        Colaboramos con líderes globales para potenciar el crecimiento, la seguridad y la innovación en HighPower.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-stretch">
        {partners.map((partner, idx) => (
          <a
            key={partner.name}
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gray-800 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center p-6 transition-transform duration-200 hover:scale-105 hover:border-[var(--accent-yellow)]"
          >
            <img
              src={partner.logo}
              alt={`Logo ${partner.name}`}
              className="h-16 w-16 object-contain mb-4 rounded-full bg-white p-2"
            />
            <h3 className="text-xl font-semibold text-[var(--off-white)] group-hover:text-[var(--accent-yellow)] mb-2">
              {partner.name}
            </h3>
            <p className="text-gray-400 text-sm">{partner.desc}</p>
          </a>
        ))}
      </div>
      <p className="text-gray-500 text-sm mt-8">
        ¿Quieres formar parte del ecosistema? <a href="mailto:partners@highpower.finance" className="text-[var(--accent-yellow)] underline hover:text-yellow-300">Contáctanos</a>
      </p>
    </section>
  );
}

export default PartnersEcosystemSection;
