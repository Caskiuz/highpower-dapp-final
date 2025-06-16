// src/sections/WhitepaperSection.jsx
import React, { useState, useEffect } from 'react';

function WhitepaperSection() {
  const [whitepaperHtmlContent, setWhitepaperHtmlContent] = useState('');
  const [loadingError, setLoadingError] = useState(false);

  useEffect(() => {
    // CAMBIO CLAVE: Cargar el archivo .html estático
    fetch('/whitepaper/HighPowerWhitepaper.html')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(htmlText => {
        setWhitepaperHtmlContent(htmlText);
      })
      .catch(error => {
        console.error("Error al cargar el Whitepaper HTML:", error);
        setLoadingError(true);
      });
  }, []); // Se ejecuta solo una vez al montar el componente

  return (
    <section id="whitepaper" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-6 text-left border-2 border-[var(--primary-purple)]">
      <h2 className="text-4xl font-bold text-[var(--accent-green)] mb-6 text-center">Whitepaper de HighPower DApp</h2>
      
      {loadingError ? (
        <p className="text-red-500 text-center">Error al cargar el Whitepaper. Por favor, asegúrate de que el archivo 'public/whitepaper/HighPowerWhitepaper.html' existe y la ruta es correcta. Inténtalo de nuevo más tarde.</p>
      ) : whitepaperHtmlContent ? (
        <div 
          className="max-w-none leading-relaxed" 
          dangerouslySetInnerHTML={{ __html: whitepaperHtmlContent }} 
        />
      ) : (
        <p className="text-[var(--light-gray-text)] text-center">Cargando Whitepaper...</p>
      )}
    </section>
  );
}

export default WhitepaperSection;
