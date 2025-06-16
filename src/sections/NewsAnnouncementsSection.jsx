// src/sections/NewsAnnouncementsSection.jsx
import React from 'react';

function NewsAnnouncementsSection() {
  const announcements = [
    {
      id: 1,
      date: '15 de Junio de 2025',
      title: 'Lanzamiento Oficial del Whitepaper de HighPower DApp',
      content: 'Estamos emocionados de anunciar la publicación de nuestro Whitepaper oficial, detallando la visión, tokenomics y roadmap de HighPower.',
      link: '#whitepaper'
    },
    {
      id: 2,
      date: '10 de Junio de 2025',
      title: 'Integración de Nuevos Pools de Staking $HGP',
      content: 'Se han añadido nuevos pools de staking con APRs mejorados. ¡Invita a la comunidad a participar!',
      link: '#yield'
    },
    {
      id: 3,
      date: '01 de Junio de 2025',
      title: 'Hito de 10,000 Holders de $HGP',
      content: '¡Gracias a nuestra increíble comunidad por ayudarnos a alcanzar este importante hito! El ecosistema HighPower sigue creciendo.',
      link: '#'
    },
  ];

  return (
    <section id="news-announcements" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-6 text-left border-2 border-[var(--accent-green)]">
      <h2 className="text-4xl font-bold text-[var(--accent-green)] mb-6 text-center">Noticias y Anuncios</h2>
      <p className="text-[var(--light-gray-text)] text-lg text-center">
        Mantente al día con los últimos desarrollos, actualizaciones y noticias importantes del ecosistema HighPower.
      </p>
      <div className="mt-8 space-y-6">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 hover:border-purple-600 transition-all duration-300">
            <p className="text-gray-500 text-sm mb-2">{announcement.date}</p>
            <h3 className="text-2xl font-semibold text-[var(--off-white)] mb-3">{announcement.title}</h3>
            <p className="text-gray-400 mb-4">{announcement.content}</p>
            {announcement.link && (
              <a href={announcement.link} className="text-[var(--accent-green)] hover:text-purple-400 font-semibold text-lg transition duration-200">
                Leer más <i className="fas fa-arrow-right ml-2"></i>
              </a>
            )}
          </div>
        ))}
      </div>
      <div className="mt-8 text-gray-500 text-sm text-center">
        Para anuncios en tiempo real, únete a nuestras redes sociales.
      </div>
    </section>
  );
}

export default NewsAnnouncementsSection;
