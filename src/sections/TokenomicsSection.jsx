// src/sections/TokenomicsSection.jsx
import React from 'react';

function TokenomicsSection() {
  return (
    <section id="tokenomics" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-6 border-2 border-[var(--secondary-blue)]">
      <h2 className="text-4xl font-bold text-[var(--accent-green)] mb-6">El Token $HGP y su Economía</h2>

      <div className="space-y-6 text-[var(--light-gray-text)]">
        <section>
          <h3 className="text-3xl font-semibold text-[var(--off-white)] mb-4">5. El Token $HGP</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong className="text-[var(--accent-yellow)]">Nombre:</strong> HighPower</li>
            <li><strong className="text-[var(--accent-yellow)]">Símbolo:</strong> $HGP</li>
            <li><strong className="text-[var(--accent-yellow)]">Tipo:</strong> BEP-20 Token (Estándar de token fungible de la BNB Chain, utilizado para la economía y gobernanza del ecosistema, complementando los NFTs BEP-721/BEP-1155 de la plataforma).</li>
          </ul>
          <p className="leading-relaxed mt-4">
            El token $HGP está diseñado para ser el motor económico y de gobernanza que impulsa cada segmento del proyecto, garantizando su funcionalidad, crecimiento y sostenibilidad a largo plazo. Su utilidad abarca:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong>Gobernanza:</strong> Fundamental para la toma de decisiones descentralizada a través de la DAO.</li>
            <li><strong>Staking y Recompensas:</strong> Base para todos los mecanismos de rendimiento.</li>
            <li><strong>Medio de Intercambio:</strong> Facilitador de transacciones dentro del Marketplace de NFTs y para el acceso a funciones exclusivas.</li>
            <li><strong>Eficiencia de Capital:</strong> Permite la participación en préstamos, empréstitoos y agregación de rendimiento.</li>
            <li><strong>Potencial de Valor:</strong> Suministro estrictamente limitado y mecanismos deflacionarios.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-3xl font-semibold text-[var(--off-white)] mb-4">6. Tokenomics (Economía del Token)</h3>
          <p className="leading-relaxed">
            La economía de $HGP está meticulosamente diseñada para fomentar la escasez, la participación comunitaria, la sostenibilidad operativa y la alineación de incentivos en todos los segmentos del proyecto.
          </p>
          <p className="text-[var(--accent-yellow)] font-bold text-2xl mt-4">Suministro Total: 21,000,000 HGP</p>

          <h4 className="text-2xl font-semibold text-[var(--off-white)] mt-6 mb-3">Distribución:</h4>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Liquidez Inicial (40%):</strong> Provisión de liquidez robusta en DEXs clave (PancakeSwap, Biswap).</li>
            <li><strong>Recompensas de Staking/Farming (25%):):</strong> Incentivar la participación en Mecanismos de Rendimiento.</li>
            <li><strong>Tesorería Comunitaria (15%):):</strong> Fondo descentralizado para crecimiento orgánico, marketing, desarrollo y auditorías.</li>
            <li><strong>Equipo (10%):):</strong> Sujeto a un calendario de vesting significativo (ej. 2-3 años con cliff).</li>
            <li><strong>Airdrop/Comunidad (5%):):</strong> Adopción inicial y recompensas a los primeros usuarios.</li>
            <li><strong>Fondo de Desarrollo/Asociaciones (5%):):</strong> Expansión del ecosistema e integración de nuevas funcionalidades.</li>
          </ul>

          <h4 className="text-2xl font-semibold text-[var(--off-white)] mt-6 mb-3">Mecanismos de Deflación/Quema:</h4>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Quema por Transacción:</strong> Una pequeña tarifa (ej. 0.5%) de cada transacción de HGP.</li>
            <li><strong>Quema por Actividad del Marketplace:</strong> Un porcentaje (ej. 25-50%) de las tarifas del Marketplace de NFTs.</li>
          </ul>
        </section>
      </div>
    </section>
  );
}

export default TokenomicsSection;
