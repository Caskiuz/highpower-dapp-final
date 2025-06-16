// src/sections/YieldMechanismsSection.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { formatUnits, parseUnits } from 'viem'; // Para formatear y parsear cantidades

function YieldMechanismsSection({
  isConnected,
  address,
  hgpBalance, // Saldo actual de HGP del usuario
  showCustomModal,
  mockStakeHGP,
  mockUnstakeHGP,
  mockClaimRewards,
  isMinting, // reutilizando este nombre de App.jsx para cualquier transacción pendiente
  isConfirming, // reutilizando este nombre de App.jsx para cualquier transacción confirmando
  hash, // Hash de la transacción
  confirmError, // Error de la transacción
  refetchHGPBalance // Para simular un refetch después de la interacción
}) {
  const [activeTab, setActiveTab] = useState('staking'); // 'staking' o 'farming'
  const [stakeAmount, setStakeAmount] = useState('');
  const [farmingLpAmount, setFarmingLpAmount] = useState(''); // Cantidad simulada de LP tokens

  // Simulación de estados internos de staking y recompensas
  const [stakedHGP, setStakedHGP] = useState(0);
  const [stakedLpTokens, setStakedLpTokens] = useState(0);
  const [hgpRewards, setHgpRewards] = useState(0);
  const [lpRewards, setLpRewards] = useState(0);

  // APRs simulados
  const hgpStakingAPR = 0.25; // 25% anual
  const lpFarmingAPR = 0.50;  // 50% anual

  // Simular el crecimiento de las recompensas con el tiempo
  useEffect(() => {
    const rewardInterval = setInterval(() => {
      if (stakedHGP > 0) {
        setHgpRewards(prev => prev + (stakedHGP * hgpStakingAPR / (365 * 24))); // Crecimiento por hora simulado
      }
      if (stakedLpTokens > 0) {
        setLpRewards(prev => prev + (stakedLpTokens * lpFarmingAPR / (365 * 24))); // Crecimiento por hora simulado
      }
    }, 3600000); // Cada hora (3.6 millones de ms)

    return () => clearInterval(rewardInterval);
  }, [stakedHGP, stakedLpTokens, hgpStakingAPR, lpFarmingAPR]);


  // --- Funciones simuladas de interacción ---

  const handleStakeHGP = useCallback(async () => {
    if (!isConnected || !address) {
      showCustomModal("Por favor, conecta tu billetera para hacer staking.");
      return;
    }
    const amount = parseFloat(stakeAmount);
    if (isNaN(amount) || amount <= 0) {
      showCustomModal("Por favor, introduce una cantidad válida.");
      return;
    }
    const currentHGPBalance = parseFloat(hgpBalance);
    if (amount > currentHGPBalance) {
      showCustomModal("Saldo insuficiente de $HGP.");
      return;
    }

    showCustomModal(`Aprobando y depositando ${amount} HGP para staking (simulado)...`);
    try {
      const tx = await mockStakeHGP();
      console.log("Transacción de staking simulada enviada:", tx.hash);
      showCustomModal(`Transacción enviada: ${tx.hash.substring(0, 10)}... Confirmando...`);

      setTimeout(() => {
        setStakedHGP(prev => prev + amount);
        setHgpRewards(0); // Reiniciar recompensas al stakear más si se desea
        setStakeAmount(''); // Limpiar input
        showCustomModal("¡HGP stakeado con éxito! (Simulado)");
        if (refetchHGPBalance) refetchHGPBalance(); // Simular refetch
      }, 3000); // Simula confirmación
    } catch (error) {
      console.error("Error al stakear HGP simulado:", error);
      showCustomModal(`Error al stakear HGP: ${error.message || "Transacción rechazada."}`);
    }
  }, [isConnected, address, stakeAmount, hgpBalance, showCustomModal, mockStakeHGP, refetchHGPBalance]);

  const handleUnstakeHGP = useCallback(async () => {
    if (!isConnected || !address) {
      showCustomModal("Por favor, conecta tu billetera.");
      return;
    }
    if (stakedHGP <= 0) {
      showCustomModal("No tienes HGP stakeado para des-stakear.");
      return;
    }

    showCustomModal(`Des-stakeando ${stakedHGP} HGP (simulado)...`);
    try {
      const tx = await mockUnstakeHGP();
      console.log("Transacción de unstake simulada enviada:", tx.hash);
      showCustomModal(`Transacción enviada: ${tx.hash.substring(0, 10)}... Confirmando...`);

      setTimeout(() => {
        setStakedHGP(0); // Des-stakeamos todo por simplicidad
        setHgpRewards(0);
        showCustomModal("¡HGP des-stakeado con éxito! (Simulado)");
        if (refetchHGPBalance) refetchHGPBalance(); // Simular refetch
      }, 3000); // Simula confirmación
    } catch (error) {
      console.error("Error al des-stakear HGP simulado:", error);
      showCustomModal(`Error al des-stakear HGP: ${error.message || "Transacción rechazada."}`);
    }
  }, [isConnected, address, stakedHGP, showCustomModal, mockUnstakeHGP, refetchHGPBalance]);

  const handleClaimHGP = useCallback(async () => {
    if (!isConnected || !address) {
      showCustomModal("Por favor, conecta tu billetera.");
      return;
    }
    if (hgpRewards <= 0) {
      showCustomModal("No hay recompensas de HGP para reclamar.");
      return;
    }

    showCustomModal(`Reclamando ${hgpRewards.toFixed(4)} HGP de recompensas (simulado)...`);
    try {
      const tx = await mockClaimRewards();
      console.log("Transacción de reclamación simulada enviada:", tx.hash);
      showCustomModal(`Transacción enviada: ${tx.hash.substring(0, 10)}... Confirmando...`);

      setTimeout(() => {
        setHgpRewards(0);
        showCustomModal("¡Recompensas de HGP reclamadas con éxito! (Simulado)");
        if (refetchHGPBalance) refetchHGPBalance(); // Simular refetch
      }, 3000); // Simula confirmación
    } catch (error) {
      console.error("Error al reclamar recompensas HGP simuladas:", error);
      showCustomModal(`Error al reclamar recompensas HGP: ${error.message || "Transacción rechazada."}`);
    }
  }, [isConnected, address, hgpRewards, showCustomModal, mockClaimRewards, refetchHGPBalance]);

  const handleFarmLp = useCallback(async () => {
    if (!isConnected || !address) {
      showCustomModal("Por favor, conecta tu billetera para hacer farming.");
      return;
    }
    const amount = parseFloat(farmingLpAmount);
    if (isNaN(amount) || amount <= 0) {
      showCustomModal("Por favor, introduce una cantidad válida.");
      return;
    }

    showCustomModal(`Aprobando y depositando ${amount} LP Tokens para farming (simulado)...`);
    // Aquí se usaría mockFarmLP si existiera, o se simula directamente.
    try {
      // Como no tenemos una mockFarmLP, simulamos la espera y el resultado.
      const txHash = '0xmockfarmlp' + Math.random().toString(16).substring(2, 10);
      console.log("Transacción de farming simulada enviada:", txHash);
      showCustomModal(`Transacción enviada: ${txHash.substring(0, 10)}... Confirmando...`);

      setTimeout(() => {
        setStakedLpTokens(prev => prev + amount);
        setLpRewards(0);
        setFarmingLpAmount('');
        showCustomModal("¡LP Tokens depositados en farming con éxito! (Simulado)");
      }, 3000); // Simula confirmación
    } catch (error) {
      console.error("Error al farmear LP simulado:", error);
      showCustomModal(`Error al farmear LP: ${error.message || "Transacción rechazada."}`);
    }
  }, [isConnected, address, farmingLpAmount, showCustomModal]);

  const handleUnfarmLp = useCallback(async () => {
    if (!isConnected || !address) {
      showCustomModal("Por favor, conecta tu billetera.");
      return;
    }
    if (stakedLpTokens <= 0) {
      showCustomModal("No tienes LP Tokens en farming para retirar.");
      return;
    }

    showCustomModal(`Retirando ${stakedLpTokens} LP Tokens de farming (simulado)...`);
    try {
      const txHash = '0xmockunfarmlp' + Math.random().toString(16).substring(2, 10);
      showCustomModal(`Transacción enviada: ${txHash.substring(0, 10)}... Confirmando...`);

      setTimeout(() => {
        setStakedLpTokens(0);
        setLpRewards(0);
        showCustomModal("¡LP Tokens retirados de farming con éxito! (Simulado)");
      }, 3000);
    } catch (error) {
      console.error("Error al retirar LP simulado:", error);
      showCustomModal(`Error al retirar LP: ${error.message || "Transacción rechazada."}`);
    }
  }, [isConnected, address, stakedLpTokens, showCustomModal]);

  const handleClaimLp = useCallback(async () => {
    if (!isConnected || !address) {
      showCustomModal("Por favor, conecta tu billetera.");
      return;
    }
    if (lpRewards <= 0) {
      showCustomModal("No hay recompensas de LP para reclamar.");
      return;
    }

    showCustomModal(`Reclamando ${lpRewards.toFixed(4)} HGP de recompensas de farming (simulado)...`);
    try {
      const tx = await mockClaimRewards(); // Usamos la misma mock para simplicidad
      showCustomModal(`Transacción enviada: ${tx.hash.substring(0, 10)}... Confirmando...`);

      setTimeout(() => {
        setLpRewards(0);
        showCustomModal("¡Recompensas de LP reclamadas con éxito! (Simulado)");
      }, 3000);
    } catch (error) {
      console.error("Error al reclamar recompensas LP simuladas:", error);
      showCustomodal(`Error al reclamar recompensas LP: ${error.message || "Transacción rechazada."}`);
    }
  }, [isConnected, address, lpRewards, showCustomModal, mockClaimRewards]);


  return (
    <section id="yield" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-8 text-center border-2 border-[var(--accent-green)]">
      <h2 className="text-4xl font-bold text-[var(--accent-green)] mb-6">Mecanismos de Rendimiento HighPower</h2>
      <p className="text-[var(--light-gray-text)] text-lg mb-8">
        Maximiza tus activos digitales en el ecosistema HighPower a través de Staking y Liquidity Farming.
      </p>

      {/* Pestañas de navegación */}
      <div className="flex justify-center mb-8 bg-gray-900 p-2 rounded-full shadow-inner border border-gray-700">
        <button
          className={`py-2 px-6 rounded-full font-semibold transition-all duration-300 
                      ${activeTab === 'staking' ? 'bg-[var(--primary-purple)] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('staking')}
        >
          Staking HGP
        </button>
        <button
          className={`py-2 px-6 rounded-full font-semibold transition-all duration-300 
                      ${activeTab === 'farming' ? 'bg-[var(--primary-purple)] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('farming')}
        >
          Liquidity Farming (LP)
        </button>
      </div>

      {!isConnected && (
        <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-red-500 text-center">
          <p className="text-red-400 text-xl font-semibold">
            ¡Conecta tu billetera para participar en los Mecanismos de Rendimiento!
          </p>
        </div>
      )}

      {isConnected && (
        <>
          {activeTab === 'staking' && (
            <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-[var(--secondary-blue)]">
              <h3 className="text-3xl font-bold text-[var(--off-white)] mb-6">Staking de $HGP</h3>
              <p className="text-gray-400 mb-4">Bloquea tus tokens $HGP para ganar recompensas pasivas. APR estimado: {hgpStakingAPR * 100}%</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-6">
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <p className="text-gray-400 text-sm">Tu Saldo $HGP Disponible:</p>
                  <p className="text-xl font-bold text-[var(--off-white)]">{hgpBalance} HGP</p>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <p className="text-gray-400 text-sm">Tu $HGP Stakeado:</p>
                  <p className="text-xl font-bold text-[var(--off-white)]">{stakedHGP.toFixed(4)} HGP</p>
                </div>
              </div>

              {/* Sección de Staking */}
              <div className="bg-gray-900 p-6 rounded-lg border border-[var(--primary-purple)] mb-6">
                <h4 className="text-2xl font-bold text-[var(--accent-green)] mb-4">Stakear $HGP</h4>
                <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="Cantidad de HGP"
                    className="w-full md:w-2/3 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={handleStakeHGP}
                    disabled={isMinting || isConfirming || !stakeAmount || parseFloat(stakeAmount) <= 0}
                    className={`w-full md:w-1/3 bg-[var(--primary-purple)] hover:bg-[var(--secondary-blue)] text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center justify-center
                                ${isMinting || isConfirming || !stakeAmount || parseFloat(stakeAmount) <= 0 ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isMinting || isConfirming ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-arrow-up mr-2"></i>}
                    {isMinting ? 'Depositando...' : isConfirming ? 'Confirmando...' : 'Stakear HGP'}
                  </button>
                </div>
                <button
                  onClick={handleUnstakeHGP}
                  disabled={isMinting || isConfirming || stakedHGP <= 0}
                  className={`mt-2 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center justify-center
                              ${isMinting || isConfirming || stakedHGP <= 0 ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                   {isMinting || isConfirming ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-arrow-down mr-2"></i>}
                  {isMinting ? 'Retirando...' : isConfirming ? 'Confirmando...' : 'Des-stakear Todo'}
                </button>
              </div>

              {/* Sección de Recompensas */}
              <div className="bg-gray-900 p-6 rounded-lg border border-[var(--accent-yellow)]">
                <h4 className="text-2xl font-bold text-[var(--accent-green)] mb-4">Tus Recompensas de Staking</h4>
                <p className="text-[var(--off-white)] text-3xl font-bold mb-4">{hgpRewards.toFixed(4)} HGP</p>
                <button
                  onClick={handleClaimHGP}
                  disabled={isMinting || isConfirming || hgpRewards <= 0}
                  className={`w-full bg-[var(--accent-green)] hover:bg-[var(--primary-purple)] text-[var(--dark-gray)] font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center justify-center
                              ${isMinting || isConfirming || hgpRewards <= 0 ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isMinting || isConfirming ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-gift mr-2"></i>}
                  {isMinting ? 'Reclamando...' : isConfirming ? 'Confirmando...' : 'Reclamar Recompensas'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'farming' && (
            <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-[var(--accent-yellow)]">
              <h3 className="text-3xl font-bold text-[var(--off-white)] mb-6">Liquidity Farming (LP Tokens)</h3>
              <p className="text-gray-400 mb-4">Aporta liquidez a los pools $HGP para ganar recompensas adicionales en HGP. APR estimado: {lpFarmingAPR * 100}%</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-6">
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <p className="text-gray-400 text-sm">Tu Saldo LP Tokens Disponible (simulado):</p>
                  <p className="text-xl font-bold text-[var(--off-white)]">10.50 LP</p>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <p className="text-gray-400 text-sm">Tus LP Tokens en Farming:</p>
                  <p className="text-xl font-bold text-[var(--off-white)]">{stakedLpTokens.toFixed(2)} LP</p>
                </div>
              </div>

              {/* Sección de Farming */}
              <div className="bg-gray-900 p-6 rounded-lg border border-[var(--primary-purple)] mb-6">
                <h4 className="text-2xl font-bold text-[var(--accent-green)] mb-4">Aportar LP Tokens</h4>
                <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
                  <input
                    type="number"
                    value={farmingLpAmount}
                    onChange={(e) => setFarmingLpAmount(e.target.value)}
                    placeholder="Cantidad de LP Tokens"
                    className="w-full md:w-2/3 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={handleFarmLp}
                    disabled={isMinting || isConfirming || !farmingLpAmount || parseFloat(farmingLpAmount) <= 0}
                    className={`w-full md:w-1/3 bg-[var(--primary-purple)] hover:bg-[var(--secondary-blue)] text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center justify-center
                                ${isMinting || isConfirming || !farmingLpAmount || parseFloat(farmingLpAmount) <= 0 ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isMinting || isConfirming ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-hand-holding-usd mr-2"></i>}
                    {isMinting ? 'Depositando...' : isConfirming ? 'Confirmando...' : 'Farmear LP'}
                  </button>
                </div>
                <button
                  onClick={handleUnfarmLp}
                  disabled={isMinting || isConfirming || stakedLpTokens <= 0}
                  className={`mt-2 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center justify-center
                              ${isMinting || isConfirming || stakedLpTokens <= 0 ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isMinting || isConfirming ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-wallet mr-2"></i>}
                  {isMinting ? 'Retirando...' : isConfirming ? 'Confirmando...' : 'Retirar LP'}
                </button>
              </div>

              {/* Sección de Recompensas de Farming */}
              <div className="bg-gray-900 p-6 rounded-lg border border-[var(--accent-green)]">
                <h4 className="text-2xl font-bold text-[var(--accent-green)] mb-4">Tus Recompensas de Farming</h4>
                <p className="text-[var(--off-white)] text-3xl font-bold mb-4">{lpRewards.toFixed(4)} HGP</p>
                <button
                  onClick={handleClaimLp}
                  disabled={isMinting || isConfirming || lpRewards <= 0}
                  className={`w-full bg-[var(--accent-green)] hover:bg-[var(--primary-purple)] text-[var(--dark-gray)] font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center justify-center
                              ${isMinting || isConfirming || lpRewards <= 0 ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isMinting || isConfirming ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-gift mr-2"></i>}
                  {isMinting ? 'Reclamando...' : isConfirming ? 'Confirmando...' : 'Reclamar Recompensas LP'}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Infografía Animada de Mecanismos de Rendimiento Placeholder */}
      <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-[var(--primary-purple)]">
        <h3 className="text-3xl font-bold text-[var(--off-white)] mb-6">Mecanismos de Rendimiento en Acción</h3>
        <p className="text-[var(--light-gray-text)] mb-4">
          Visualiza cómo tus activos crecen a través de nuestros innovadores mecanismos de Staking y Farming.
        </p>
        <div className="relative w-full h-80 bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
          {/* Placeholder para la infografía animada */}
          <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-xl font-bold animate-pulse">
            [Infografía Animada de Mecanismos de Rendimiento - PRÓXIMAMENTE]
          </div>
          {/* Ejemplo de animación de partículas de fondo (simple) */}
          <style>{`
            @keyframes yieldFlowPulse {
              0% { box-shadow: 0 0 15px var(--accent-green); }
              50% { box-shadow: 0 0 30px var(--accent-yellow); }
              100% { box-shadow: 0 0 15px var(--accent-green); }
            }
            .yield-flow-pulse {
              animation: yieldFlowPulse 3s infinite ease-in-out;
            }
          `}</style>
          <div className="absolute w-24 h-24 rounded-full bg-[var(--accent-green)] opacity-20 yield-flow-pulse"></div>
          <div className="absolute w-16 h-16 rounded-full bg-[var(--accent-yellow)] opacity-20 yield-flow-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute w-12 h-12 rounded-full bg-[var(--primary-purple)] opacity-20 yield-flow-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        <p className="text-gray-500 text-sm mt-4">
          *Esta sección se actualizará con una infografía interactiva para ilustrar el flujo de recompensas.
        </p>
      </div>
    </section>
  );
}

export default YieldMechanismsSection;
