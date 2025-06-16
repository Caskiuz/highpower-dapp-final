// src/sections/WhitepaperSection.jsx
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

function WhitepaperSection() {
  const [whitepaperContent, setWhitepaperContent] = useState('');
  const [loadingError, setLoadingError] = useState(false);

  useEffect(() => {
    // Carga el archivo Markdown usando fetch
    fetch('/src/whitepaper/HighPowerWhitepaper.md')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(text => {
        setWhitepaperContent(text);
      })
      .catch(error => {
        console.error("Error al cargar el Whitepaper:", error);
        setLoadingError(true);
      });
  }, []); // Se ejecuta solo una vez al montar el componente

  return (
    <section id="whitepaper" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-6 text-left border-2 border-[var(--primary-purple)]">
      <h2 className="text-4xl font-bold text-[var(--accent-green)] mb-6 text-center">Whitepaper de HighPower DApp</h2>
      
      {loadingError ? (
        <p className="text-red-500 text-center">Error al cargar el Whitepaper. Por favor, inténtalo de nuevo más tarde.</p>
      ) : whitepaperContent ? (
        <div className="prose prose-invert max-w-none text-[var(--light-gray-text)] leading-relaxed">
          {/* Usamos ReactMarkdown para renderizar el contenido Markdown */}
          <ReactMarkdown>{whitepaperContent}</ReactMarkdown>
        </div>
      ) : (
        <p className="text-[var(--light-gray-text)] text-center">Cargando Whitepaper...</p>
      )}
    </section>
  );
}

export default WhitepaperSection;
