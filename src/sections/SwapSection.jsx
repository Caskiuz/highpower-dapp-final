// src/sections/SwapSection.jsx
import React from 'react';

function SwapSection() {
  return (
    <section id="swap" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-6 border-2 border-[var(--primary-purple)]">
      <h2 className="text-4xl font-bold text-[var(--accent-green)] mb-6">Swap (Intercambio en la Web)</h2>

      <div className="space-y-6 text-[var(--light-gray-text)]">
        <section>
          <h3 className="text-3xl font-semibold text-[var(--off-white)] mb-4">10. Swap (Intercambio en la Web)</h3>
          <p className="leading-relaxed">
            HighPower contará con un módulo de intercambio directo para facilitar la adquisición y venta de tokens $HGP.
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li><strong>Integración Directa:</strong> Módulo de swap integrado directamente en la plataforma web para una experiencia fluida.</li>
            <li><strong>Funcionalidad:</strong> Permitirá a los usuarios intercambiar BNB (o BUSD/USDT) por $HGP y viceversa, interactuando con pools de liquidez en DEXs clave como PancakeSwap.</li>
            <li><strong>Interfaz Sencilla:</strong> Diseño intuitivo para una experiencia de usuario fluida, incluso para aquellos nuevos en DeFi.</li>
            <li><strong>Gráficas de Precios y Tendencias:</strong> Integración con herramientas de gráficos para mostrar el precio en tiempo real del token $HGP, volumen de trading y capitalización de mercado.</li>
          </ul>
        </section>

        <section className="mt-8 pt-6 border-t border-[var(--primary-purple)]">
          <h3 className="text-3xl font-semibold text-[var(--accent-yellow)] mb-4">Simulador de Swap (Ejemplo)</h3>
          <div className="bg-[var(--dark-gray)] p-6 rounded-2xl shadow-md border border-[var(--accent-green)]">
            <p className="text-[var(--light-gray-text)] mb-4">Aquí se integraría una interfaz de swap real, conectada a los contratos inteligentes de DEXs. Por ahora, es una simulación visual.</p>
            <div className="mb-4">
              <label htmlFor="amountToSwap" className="block text-[var(--light-gray-text)] text-lg font-bold mb-2">
                Cantidad a Intercambiar:
              </label>
              <input
                type="number"
                id="amountToSwap"
                placeholder="Ej. 1 BNB"
                className="shadow appearance-none border rounded w-full py-3 px-4 text-[var(--dark-gray)] leading-tight focus:outline-none focus:shadow-outline bg-[var(--off-white)] text-xl"
              />
            </div>
            <div className="text-center my-4">
              <span className="text-[var(--secondary-blue)] text-4xl">↓</span>
            </div>
            <div className="mb-6">
              <label htmlFor="receivedAmount" className="block text-[var(--light-gray-text)] text-lg font-bold mb-2">
                Cantidad Recibida ($HGP):
              </label>
              <input
                type="text"
                id="receivedAmount"
                readOnly
                placeholder="Calculado automáticamente"
                className="shadow appearance-none border rounded w-full py-3 px-4 text-[var(--dark-gray)] leading-tight focus:outline-none focus:shadow-outline bg-gray-300 cursor-not-allowed text-xl"
              />
            </div>
            <button className="w-full bg-[var(--accent-green)] hover:bg-[var(--secondary-blue)] text-[var(--dark-gray)] font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md">
              Realizar Swap
            </button>
            <p className="text-[var(--light-gray-text)] text-sm mt-4 opacity-80">
              *Las gráficas de precios en tiempo real se mostrarían aquí, utilizando APIs de datos de mercado.*
            </p>
            <div className="h-64 bg-[var(--primary-purple)] mt-6 rounded-lg flex items-center justify-center text-[var(--off-white)] opacity-70">
              [Gráfica de Precios $HGP - Placeholder]
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default SwapSection;
