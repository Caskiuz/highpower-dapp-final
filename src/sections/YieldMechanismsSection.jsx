// src/sections/YieldMechanismsSection.jsx
import React from 'react';

function YieldMechanismsSection() {
  return (
    <section id="yield" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-6 border-2 border-[var(--primary-purple)]">
      <h2 className="text-4xl font-bold text-[var(--accent-green)] mb-6">Mecanismos de Rendimiento HighPower</h2>

      <div className="space-y-6 text-[var(--light-gray-text)]">
        <section>
          <h3 className="text-3xl font-semibold text-[var(--off-white)] mb-4">7. Mecanismos de Rendimiento</h3>
          <p className="leading-relaxed">
            HighPower ofrecerá diversas vías para que los holders de $HGP obtengan recompensas por su participación, inspiradas en los modelos más exitosos del espacio DeFi.
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li><strong>Staking Pool:</strong> Bloquea $HGP por periodos definidos para obtener recompensas adicionales y una porción de las tarifas.</li>
            <li><strong>Liquidity Mining (Farmear):</strong> Recompensas en $HGP por aportar liquidez a pools de $HGP/BNB o $HGP/BUSD en DEXs.</li>
            <li><strong>NFT Staking:</strong> Staking de NFTs específicos de HighPower para generar rendimientos en $HGP o acceder a beneficios exclusivos.</li>
            <li><strong>Préstamos y Empréstitos (Lending & Borrowing):</strong> Deposita $HGP y otros activos para obtener rendimiento pasivo o toma préstamos colateralizados.</li>
            <li><strong>Agregación de Rendimiento y Bóvedas (Yield Aggregation & Vaults):):</strong> Estrategias automatizadas para optimizar ganancias en yield farming de la BNB Chain.</li>
            <li><strong>Participación en Ingresos del Protocolo:</strong> Distribución directa de una porción significativa de las comisiones y tarifas del protocolo a los holders de $HGP en staking.</li>
            <li><strong>Recompensas por Participación en Gobernanza:</strong> Incentivos explícitos (airdrops, distribución de comisiones) por participar activamente en la DAO.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-3xl font-semibold text-[var(--off-white)] mb-4">8. Autofinanciamiento del Pool de Liquidez</h3>
          <p className="leading-relaxed">
            El proyecto HighPower implementará un modelo de autofinanciamiento robusto para asegurar la profundidad y el crecimiento continuo de su pool de liquidez.
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li><strong>Tarifas de Transacción Internas:</strong> Un pequeño porcentaje (ej. 1-2%) de cada transacción del token a través del swap interno.</li>
            <li><strong>Tarifas del Marketplace de NFT:</strong> Un porcentaje significativo (ej. 25-50%) de las tarifas de transacción generadas en el marketplace de NFTs.</li>
            <li><strong>Asignación Estratégica de Tesorería:</strong> La DAO podrá utilizar una porción de los fondos de la tesorería para aportar liquidez.</li>
            <li><strong>Recompensas de Incentivo para LP (Liquidity Providers):</strong> Recompensas adicionales en $HGP a los proveedores de liquidez externos.</li>
          </ul>
        </section>
      </div>
    </section>
  );
}

export default YieldMechanismsSection;
