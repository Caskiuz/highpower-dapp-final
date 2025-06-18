// src/sections/TokenomicsSection.jsx
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

function TokenomicsSection() {
  // Datos simulados para la distribución del token $HGP
  const data = [
    { name: 'Liquidez Inicial', value: 40, color: '#8A2BE2' }, // primary-purple
    { name: 'Recompensas Staking/Farming', value: 25, color: '#4169E1' }, // secondary-blue
    { name: 'Tesorería Comunitaria', value: 15, color: '#00FF7F' }, // accent-green
    { name: 'Equipo', value: 10, color: '#FFD700' }, // accent-yellow
    { name: 'Airdrop/Comunidad', value: 5, color: '#CDA4DE' }, // Morado más claro
    { name: 'Desarrollo/Asociaciones', value: 5, color: '#87CEEB' }, // Azul cielo
  ];

  // Datos simulados para el simulador de rendimiento
  const simulatedAPR = 0.25; // 25% anual
  const [stakeAmount, setStakeAmount] = useState(1000);
  const [holdingPeriod, setHoldingPeriod] = useState(12); // Meses

  const calculateYield = () => {
    const dailyRate = simulatedAPR / 365;
    const totalDays = holdingPeriod * 30; // Aproximación simple
    const finalAmount = stakeAmount * Math.pow((1 + dailyRate), totalDays);
    return (finalAmount - stakeAmount).toFixed(2);
  };

  return (
    <section id="tokenomics" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-8 text-center border-2 border-[var(--accent-yellow)]">
      <h2 className="text-4xl font-bold text-[var(--accent-yellow)] mb-6">Tokenomics del Token $HGP</h2>
      
      {/* Sección de Distribución del Token */}
      <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-[var(--primary-purple)]">
        <h3 className="text-3xl font-bold text-[var(--off-white)] mb-6 text-left">Distribución del Suministro Total ($HGP)</h3>
        <div className="w-full h-[300px] sm:h-[350px] md:h-[400px] flex flex-col items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius="80%"
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {
                  data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))
                }
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--dark-gray)', border: '1px solid var(--secondary-blue)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--light-gray-text)' }}
                formatter={(value, name, props) => [`${value}%`, props.payload.name]}
              />
              <Legend
                wrapperStyle={{ color: 'var(--light-gray-text)' }}
                formatter={(value, entry) => <span style={{ color: entry.color }}>{entry.payload.name} ({entry.payload.value}%)</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p className="text-gray-400 mt-4">Suministro Total: 21,000,000 HGP. Diseñado para la escasez y la sostenibilidad.</p>
      </div>
      
      {/* Sección de Flujo de Valor y Mecanismos Deflacionarios */}
      <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-[var(--secondary-blue)]">
        <h3 className="text-3xl font-bold text-[var(--off-white)] mb-6 text-left">Flujo de Valor y Deflación</h3>
        <p className="text-[var(--light-gray-text)] mb-4">El ecosistema HighPower está diseñado para crear un ciclo de valor autosostenible y deflacionario para el token $HGP:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left text-sm">
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <i className="fas fa-arrow-right-arrow-left text-blue-400 text-2xl mb-2"></i>
            <h4 className="font-semibold text-[var(--off-white)]">Tarifas de Transacción</h4>
            <p className="text-gray-400 text-xs">Un pequeño % de cada transacción de $HGP se quema o contribuye al pool de liquidez.</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <i className="fas fa-fire-burner text-red-400 text-2xl mb-2"></i>
            <h4 className="font-semibold text-[var(--off-white)]">Mecanismos de Quema</h4>
            <p className="text-gray-400 text-xs">Las tarifas del Marketplace de NFT se usan para quemar $HGP, reduciendo el suministro.</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <i className="fas fa-recycle text-green-400 text-2xl mb-2"></i>
            <h4 className="font-semibold text-[var(--off-white)]">Re-inversión en Liquidez</h4>
            <p className="text-gray-400 text-xs">Fondos del protocolo y tesorería se utilizan para fortalecer el pool de liquidez.</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <i className="fas fa-hand-holding-dollar text-purple-400 text-2xl mb-2"></i>
            <h4 className="font-semibold text-[var(--off-white)]">Recompensas a Holders</h4>
            <p className="text-gray-400 text-xs">Una parte del valor generado regresa a los stakers y LPs de $HGP.</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <i className="fas fa-landmark text-yellow-400 text-2xl mb-2"></i>
            <h4 className="font-semibold text-[var(--off-white)]">Tesorería de la DAO</h4>
            <p className="text-gray-400 text-xs">Fondos para desarrollo futuro, marketing y subvenciones, gobernados por la comunidad.</p>
          </div>
        </div>
      </div>
      
      {/* Simulador de Rendimiento de HGP (Ejemplo) */}
      <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-[var(--accent-green)]">
        <h3 className="text-3xl font-bold text-[var(--off-white)] mb-6 text-left">Calculadora de Rendimiento Estimado</h3>
        <p className="text-gray-400 mb-4">Estima tus ganancias potenciales de staking con un APR simulado del {simulatedAPR * 100}%.</p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
          <div className="w-full md:w-1/3">
            <label htmlFor="stakeAmount" className="block text-[var(--light-gray-text)] text-sm font-bold mb-2">
              Cantidad de $HGP a Stakear:
            </label>
            <input
              type="number"
              id="stakeAmount"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(Number(e.target.value))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-900 border-gray-700 text-[var(--off-white)]"
              placeholder="Ej. 1000 HGP"
              min="0"
            />
          </div>
          <div className="w-full md:w-1/3">
            <label htmlFor="holdingPeriod" className="block text-[var(--light-gray-text)] text-sm font-bold mb-2">
              Período de Bloqueo (Meses):
            </label>
            <input
              type="number"
              id="holdingPeriod"
              value={holdingPeriod}
              onChange={(e) => setHoldingPeriod(Number(e.target.value))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-900 border-gray-700 text-[var(--off-white)]"
              placeholder="Ej. 12 meses"
              min="1"
            />
          </div>
        </div>
        <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-[var(--accent-yellow)]">
          <p className="text-[var(--light-gray-text)] text-lg">
            Ganancias estimadas en $HGP después de {holdingPeriod} meses: <span className="text-[var(--accent-green)] font-bold text-2xl">{calculateYield()} HGP</span>
          </p>
        </div>
        <p className="text-gray-500 text-sm mt-4">
          *Este es un cálculo estimado basado en un APR fijo y no considera la capitalización compuesta diaria real ni los cambios en el valor del token. No es un consejo financiero.
        </p>
      </div>
    </section>
  );
}

export default TokenomicsSection;
