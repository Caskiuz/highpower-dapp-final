// src/sections/FAQSection.jsx
import React, { useState } from 'react';

function FAQSection() {
  const faqs = [
    {
      question: "¿Qué es HighPower DApp?",
      answer: "HighPower es un ecosistema Web3 innovador en la BNB Smart Chain que combina tokenomics ($HGP), NFTs únicos, mecanismos de rendimiento (staking, farming) y gobernanza descentralizada para construir una economía sostenible."
    },
    {
      question: "¿Cómo puedo adquirir tokens $HGP?",
      answer: "Puedes adquirir tokens $HGP a través de nuestro módulo de Swap integrado una vez que conectes tu billetera, o en DEXs listados como PancakeSwap."
    },
    {
      question: "¿Qué tipos de rendimientos ofrece HighPower?",
      answer: "Ofrecemos pools de Staking para $HGP, oportunidades de Liquidity Mining (Farming) y staking de NFTs, todos diseñados para maximizar tus activos."
    },
    {
      question: "¿Qué son los NFTs de HighPower?",
      answer: "Los NFTs de HighPower son activos digitales únicos, desde coleccionables de arte hasta activos con utilidad dentro del ecosistema, que puedes mintear, comprar y vender en nuestro Metamarket."
    },
    {
      question: "¿Cómo funciona la Gobernanza DAO?",
      answer: "Los holders de tokens $HGP tienen el poder de votar en propuestas clave sobre el desarrollo y la dirección del proyecto, asegurando que la comunidad tenga voz y voto en el futuro de HighPower."
    },
    {
      question: "¿Es seguro invertir en HighPower?",
      answer: "La seguridad es nuestra prioridad. Todos nuestros contratos inteligentes serán auditados por firmas de seguridad de renombre, y seguimos las mejores prácticas de desarrollo Web3. Siempre investiga por tu cuenta antes de invertir."
    }
  ];

  const [openIndex, setOpenIndex] = useState(null); // Estado para controlar qué FAQ está abierto

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index); // Cierra si ya está abierto, abre si está cerrado
  };

  return (
    <section id="faq" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-6 text-left border-2 border-[var(--primary-purple)]">
      <h2 className="text-4xl font-bold text-[var(--accent-yellow)] mb-6 text-center">Preguntas Frecuentes (FAQ)</h2>
      <p className="text-[var(--light-gray-text)] text-lg text-center">
        Encuentra respuestas rápidas a las preguntas más comunes sobre HighPower DApp, sus funcionalidades y su ecosistema.
      </p>
      <div className="mt-8 space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-gray-800 rounded-lg shadow-md border border-gray-700 overflow-hidden">
            <button
              className="flex justify-between items-center w-full p-5 text-xl font-semibold text-[var(--off-white)] hover:bg-gray-700 transition-colors duration-200"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <i className={`fas ${openIndex === index ? 'fa-minus' : 'fa-plus'} text-purple-400`}></i>
            </button>
            {openIndex === index && (
              <div className="p-5 border-t border-gray-700 bg-gray-900 text-gray-400">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-8 text-gray-500 text-sm text-center">
        ¿No encuentras lo que buscas? Visita nuestra sección de Soporte o únete a nuestra comunidad.
      </div>
    </section>
  );
}

export default FAQSection;
