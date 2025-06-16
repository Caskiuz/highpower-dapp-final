// src/sections/NewsAnnouncementsSection.jsx
import React from 'react';

function NewsAnnouncementsSection() {
  const newsArticles = [
    {
      id: 1,
      title: 'HighPower Lanza su Dashboard Interactivo con Métricas Clave',
      date: '15 de Junio, 2025',
      summary: 'El nuevo Dashboard permite a los usuarios y potenciales inversores visualizar en tiempo real (simulado) el TVL, el volumen de trading y el crecimiento del ecosistema HighPower.',
      imageUrl: 'https://placehold.co/600x400/8A2BE2/FFFFFF/png?text=Dashboard+Launch',
      link: '#' // Enlace a un artículo completo simulado
    },
    {
      id: 2,
      title: 'El Metamarket NFT de HighPower Abre sus Puertas en Testnet',
      date: '10 de Junio, 2025',
      summary: 'Presentamos el Marketplace de NFTs totalmente funcional en la testnet, permitiendo la acuñación, compra, venta y listado de NFTs únicos del ecosistema.',
      imageUrl: 'https://placehold.co/600x400/4169E1/FFFFFF/png?text=NFT+Marketplace',
      link: '#'
    },
    {
      id: 3,
      title: 'Simulador de Rendimiento de Tokenomics $HGP Disponible',
      date: '05 de Junio, 2025',
      summary: 'La sección de Tokenomics ahora incluye un simulador interactivo para que los usuarios estimen sus ganancias potenciales en el staking de $HGP.',
      imageUrl: 'https://placehold.co/600x400/00FF7F/000000/png?text=Tokenomics+Simulator',
      link: '#'
    },
    {
      id: 4,
      title: 'Roadmap Interactivo de HighPower Desvelado: ¡Mira el Futuro!',
      date: '01 de Junio, 2025',
      summary: 'Nuestra hoja de ruta ha sido actualizada a un formato interactivo, mostrando hitos completados y futuros para la transparencia y seguimiento del progreso.',
      imageUrl: 'https://placehold.co/600x400/FFD700/000000/png?text=Roadmap+Update',
      link: '#'
    },
    {
      id: 5,
      title: 'HighPower se Prepara para su Auditoría de Contratos Inteligentes',
      date: '28 de Mayo, 2025',
      summary: 'La seguridad es primordial. Nos complace anunciar que nuestros contratos inteligentes están siendo preparados para una auditoría exhaustiva por una firma líder.',
      imageUrl: 'https://placehold.co/600x400/8A2BE2/FFFFFF/png?text=Audit+Preparation',
      link: '#'
    },
  ];

  return (
    <section id="news-announcements" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-8 text-center border-2 border-[var(--accent-green)]">
      <h2 className="text-4xl font-bold text-[var(--accent-green)] mb-6">Noticias y Anuncios de HighPower</h2>
      <p className="text-[var(--light-gray-text)] text-lg mb-8">
        Mantente al día con los últimos avances, hitos y actualizaciones del ecosistema HighPower.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {newsArticles.map(article => (
          <div key={article.id} className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden transform transition-transform duration-300 hover:scale-103 hover:border-[var(--primary-purple)]">
            <img src={article.imageUrl} alt={article.title} className="w-full h-56 object-cover" />
            <div className="p-6 text-left">
              <h3 className="text-xl font-bold text-[var(--off-white)] mb-2">{article.title}</h3>
              <p className="text-gray-400 text-sm mb-3">{article.date}</p>
              <p className="text-gray-300 text-base mb-4">{article.summary}</p>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[var(--accent-green)] hover:text-[var(--secondary-blue)] font-semibold transition-colors duration-200"
              >
                Leer más <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </div>
          </div>
        ))}
      </div>

      <p className="text-gray-500 text-sm mt-8">
        *Estos son artículos simulados para mostrar el tipo de contenido que publicaremos regularmente.
      </p>
    </section>
  );
}

export default NewsAnnouncementsSection;
