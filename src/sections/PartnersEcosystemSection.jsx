// src/sections/PartnersEcosystemSection.jsx
import React from 'react';

function PartnersEcosystemSection() {
  const partners = [
    { 
      name: 'PancakeSwap', 
      logo: 'https://placehold.co/150x80/280B5C/FFFFFF?text=PancakeSwap', // Simula logo oscuro
      description: 'Nuestro principal socio DEX para el trading de $HGP y provisión de liquidez.',
      link: '#' 
    },
    { 
      name: 'MetaMask', 
      logo: 'https://placehold.co/150x80/2C2C2C/F6851B?text=MetaMask', // Simula logo oscuro
      description: 'Una de las billeteras Web3 más populares, esencial para la interacción del usuario.',
      link: '#' 
    },
    { 
      name: 'BNB Smart Chain', 
      logo: 'https://placehold.co/150x80/000000/F0B90B?text=BNB+Chain', // Simula logo oscuro
      description: 'La blockchain subyacente que potencia el ecosistema HighPower.',
      link: '#' 
    },
    { 
      name: 'CoinGecko', 
      logo: 'https://placehold.co/150x80/000000/2CD297?text=CoinGecko', // Simula logo oscuro
      description: 'Plataforma líder para seguimiento de precios y datos de criptomonedas.',
      link: '#' 
    },
    { 
      name: 'BscScan', 
      logo: 'https://placehold.co/150x80/000000/3A6CF4?text=BscScan', // Simula logo oscuro
      description: 'Explorador de bloques para monitorear todas las transacciones en la BNB Chain.',
      link: '#' 
    },
    { 
      name: 'WalletConnect', 
      logo: 'https://placehold.co/150x80/000000/4096EE?text=WalletConnect', // Simula logo oscuro
      description: 'Permite la conexión segura de diversas billeteras móviles y de escritorio.',
      link: '#' 
    },
  ];

  return (
    <section id="partners-ecosystem" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-8 text-center border-2 border-[var(--secondary-blue)]">
      <h2 className="text-4xl font-bold text-[var(--secondary-blue)] mb-6">Nuestros Socios y Ecosistema</h2>
      <p className="text-[var(--light-gray-text)] text-lg mb-8">
        Construyendo un futuro descentralizado con aliados estratégicos que comparten nuestra visión.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {partners.map((partner, index) => (
          <a 
            key={index} 
            href={partner.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg shadow-md border border-gray-700 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:border-[var(--accent-green)]"
          >
            <img src={partner.logo} alt={partner.name} className="w-28 h-auto object-contain mb-3 filter grayscale hover:grayscale-0 transition-filter duration-300" />
            <h3 className="text-xl font-bold text-[var(--off-white)] mb-2">{partner.name}</h3>
            <p className="text-gray-400 text-sm">{partner.description}</p>
          </a>
        ))}
      </div>

      <p className="text-gray-500 text-sm mt-8">
        *Estos socios son simulados. La lista se actualizará con nuestras colaboraciones reales a medida que el proyecto avance.
      </p>
    </section>
  );
}

export default PartnersEcosystemSection;
