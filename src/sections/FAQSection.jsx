// src/sections/FAQSection.jsx
import React, { useState } from 'react';

function FAQSection() {
  // Estado para controlar qué pregunta está expandida
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const faqItems = [
    {
      id: 1,
      question: '¿Qué es HighPower DApp ($HGP)?',
      answer: 'HighPower (HGP) es un ecosistema Web3 innovador construido sobre la BNB Smart Chain. Fusiona la cultura altcoin con funcionalidades DeFi robustas y una vibrante economía de Tokens No Fungibles (NFTs) para ofrecer utilidad real a los usuarios.'
    },
    {
      id: 2,
      question: '¿Cómo puedo obtener tokens $HGP?',
      answer: 'Actualmente, puedes obtener tokens $HGP participando en nuestra preventa (próximamente) o a través de exchanges descentralizados (DEX) como PancakeSwap una vez que el token sea listado. Te recomendamos mantenerte atento a nuestros anuncios para el lanzamiento oficial.'
    },
    {
      id: 3,
      question: '¿Qué tipo de NFTs se ofrecerán en el Metamarket?',
      answer: 'Nuestro Metamarket ofrecerá una variedad de NFTs coleccionables únicos relacionados con la cultura altcoin y el ecosistema HighPower. También habrá colecciones oficiales con utilidades especiales dentro de la DApp (ej. beneficios de staking, acceso exclusivo).'
    },
    {
      id: 4,
      question: '¿Cómo funciona el staking de $HGP?',
      answer: 'Puedes bloquear tus tokens $HGP en nuestro contrato de staking por períodos definidos para generar recompensas pasivas. Las recompensas se acumulan con el tiempo y pueden reclamarse en la sección "Recompensas" de la DApp.'
    },
    {
      id: 5,
      question: '¿Qué es la Gobernanza DAO de HighPower?',
      answer: 'La Gobernanza DAO (Organización Autónoma Descentralizada) permite a los holders de tokens $HGP votar en propuestas clave sobre el desarrollo, la tesorería y la dirección futura del proyecto, asegurando un control descentralizado y comunitario.'
    },
    {
      id: 6,
      question: '¿Cómo puedo reportar un error o sugerir una mejora?',
      answer: 'Puedes utilizar nuestro formulario de contacto en la sección "Contacto" o unirte a nuestro servidor de Discord para interactuar directamente con el equipo y la comunidad. Valoramos mucho tu feedback.'
    },
    {
      id: 7,
      question: '¿Cuándo se realizarán las auditorías de seguridad?',
      answer: 'La seguridad es primordial. Todos los contratos inteligentes críticos serán sometidos a auditorías exhaustivas por firmas de seguridad de blockchain de renombre antes de su despliegue en mainnet y en cada actualización importante. Los informes se publicarán en la sección "Auditorías".'
    }
  ];

  const toggleQuestion = (id) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  return (
    <section id="faq" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-8 text-center border-2 border-[var(--accent-yellow)]">
      <h2 className="text-4xl font-bold text-[var(--accent-yellow)] mb-6">Preguntas Frecuentes (FAQ)</h2>
      <p className="text-[var(--light-gray-text)] text-lg mb-8">
        Encuentra respuestas rápidas a las preguntas más comunes sobre HighPower DApp.
      </p>

      <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-[var(--primary-purple)]">
        {faqItems.map(item => (
          <div key={item.id} className="mb-4 last:mb-0 border-b border-gray-700 pb-4">
            <button
              className="flex justify-between items-center w-full text-left focus:outline-none py-2"
              onClick={() => toggleQuestion(item.id)}
            >
              <h3 className="text-xl font-semibold text-[var(--off-white)]">
                {item.question}
              </h3>
              <i className={`fas ${expandedQuestion === item.id ? 'fa-chevron-up' : 'fa-chevron-down'} text-gray-400 text-lg transition-transform duration-300`}></i>
            </button>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out
                          ${expandedQuestion === item.id ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}
            >
              <p className="text-gray-400 text-base leading-relaxed pl-4">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-gray-500 text-sm mt-8">
        ¿No encuentras tu respuesta? ¡No dudes en contactarnos directamente!
      </p>
    </section>
  );
}

export default FAQSection;
