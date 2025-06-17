import React, { useState, useEffect, useCallback } from 'react';
import { formatUnits, parseUnits, maxUint256 } from 'viem';
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount
} from 'wagmi';

import {
  HGP_TOKEN_CONFIG,
  STAKING_CONTRACT_CONFIG,
  LP_TOKEN_CONFIG, // Ahora con el ABI real
  LP_FARMING_CONTRACT_CONFIG, // Ahora con el ABI real
  SIMULATED_APR_PERCENTAGE,
  SIMULATED_LP_FARMING_APR_PERCENTAGE
} from '../constants/contract-config';

const HGP_DECIMALS = 18;
const LP_TOKEN_DECIMALS = 18;

function YieldMechanismsSection({ isConnected, userAddress, showCustomModal }) {
  const { address } = useAccount();

  // Helper para formatear números BigInt con precisión para la UI
  const formatBigIntToDisplay = useCallback((value, decimals, minPrecision = 2, maxPrecision = 8) => {
    if (typeof value === 'bigint') {
      const formatted = formatUnits(value, decimals);
      const num = parseFloat(formatted);
      if (num === 0) return '0.00'; // Siempre mostrar 0.00 si es cero
      
      // Ajusta la precisión dinámicamente. Usa toPrecision para manejar números muy pequeños.
      // Si el número es muy pequeño pero no cero, muestra más decimales.
      if (num > 0 && num < 0.000001) { // Por ejemplo, si es menor a 0.000001
        return num.toPrecision(maxPrecision); // Muestra la cantidad de dígitos significativos
      }
      const options = {
        minimumFractionDigits: minPrecision,
        maximumFractionDigits: maxPrecision
      };
      return num.toLocaleString(undefined, options);
    }
    return '0.00'; // Valor predeterminado para no conectado o sin datos
  }, []);

  // DEBUG LOG: Verificar que la dirección del LP Token se carga correctamente
  useEffect(() => {
    console.log("LP_TOKEN_CONFIG.address en YieldMechanismsSection:", LP_TOKEN_CONFIG.address);
  }, []);


  // --- Staking de HGP ---
  const [hgpStakeAmount, setHgpStakeAmount] = useState('');
  const [hgpUnstakeAmount, setHgpUnstakeAmount] = useState('');

  const { data: userHgpBalanceRaw, refetch: refetchUserHgpBalance } = useReadContract({
    ...HGP_TOKEN_CONFIG,
    functionName: 'balanceOf',
    args: [userAddress],
    query: { enabled: isConnected && !!userAddress, watch: true }
  });
  const userHgpBalance = formatBigIntToDisplay(userHgpBalanceRaw, HGP_DECIMALS);
  console.log("HGP Balance Raw:", userHgpBalanceRaw, "Formatted:", userHgpBalance);

  // CORRECTO: 'stakedAmount' para balance stakeado de HGP
  const { data: hgpStakedAmountRaw, refetch: refetchHgpStakedAmount } = useReadContract({
    ...STAKING_CONTRACT_CONFIG,
    functionName: 'stakedAmount',
    args: [userAddress],
    query: { enabled: isConnected && !!userAddress, watch: true }
  });
  const hgpStakedAmount = formatBigIntToDisplay(hgpStakedAmountRaw, HGP_DECIMALS);
  console.log("HGP Staked Raw:", hgpStakedAmountRaw, "Formatted:", hgpStakedAmount);

  // CORRECTO: 'earned' para recompensas reclamables de HGP
  const { data: hgpClaimableRewardsRaw, refetch: refetchHgpClaimableRewards } = useReadContract({
    ...STAKING_CONTRACT_CONFIG,
    functionName: 'earned',
    args: [userAddress],
    query: { enabled: isConnected && !!userAddress, watch: true }
  });
  const hgpClaimableRewards = formatBigIntToDisplay(hgpClaimableRewardsRaw, HGP_DECIMALS);
  console.log("HGP Claimable Rewards Raw:", hgpClaimableRewardsRaw, "Formatted:", hgpClaimableRewards);

  // Wagmi Hooks para escribir en el contrato de Staking HGP
  const { writeContract: writeApproveHgp, data: approveHgpTxHash } = useWriteContract();
  const { writeContract: writeStakeHgp, data: stakeHgpTxHash } = useWriteContract();
  const { writeContract: writeUnstakeHgp, data: unstakeHgpTxHash } = useWriteContract();
  const { writeContract: writeClaimHgpRewards, data: claimHgpTxHash } = useWriteContract();

  const { isLoading: isApprovingHgp, isSuccess: isApprovedHgpSuccess } = useWaitForTransactionReceipt({ hash: approveHgpTxHash });
  const { isLoading: isStakingHgp, isSuccess: isStakedHgpSuccess } = useWaitForTransactionReceipt({ hash: stakeHgpTxHash });
  const { isLoading: isUnstakingHgp, isSuccess: isUnstakedHgpSuccess } = useWaitForTransactionReceipt({ hash: unstakeHgpTxHash });
  const { isLoading: isClaimingHgp, isSuccess: isClaimedHgpSuccess } = useWaitForTransactionReceipt({ hash: claimHgpTxHash });


  // --- LP Farming ---
  const [lpStakeAmount, setLpStakeAmount] = useState('');
  const [lpUnstakeAmount, setLpUnstakeAmount] = useState('');

  // Balance de LP Tokens del usuario
  const { data: userLpBalanceRaw, refetch: refetchUserLpBalance } = useReadContract({
    ...LP_TOKEN_CONFIG, // Usamos LP_TOKEN_CONFIG aquí
    functionName: 'balanceOf',
    args: [userAddress],
    query: { enabled: isConnected && !!userAddress, watch: true }
  });
  const userLpBalance = formatBigIntToDisplay(userLpBalanceRaw, LP_TOKEN_DECIMALS);
  console.log("LP Balance Raw:", userLpBalanceRaw, "Formatted:", userLpBalance);


  // Cantidad de LP Tokens stakeados por el usuario en el contrato de farming
  const { data: lpStakedAmountRaw, refetch: refetchLpStakedAmount } = useReadContract({
    ...LP_FARMING_CONTRACT_CONFIG, // Usamos LP_FARMING_CONTRACT_CONFIG aquí
    functionName: 'userLPStaked', // Ya corregido
    args: [userAddress],
    query: { enabled: isConnected && !!userAddress, watch: true }
  });
  const lpStakedAmount = formatBigIntToDisplay(lpStakedAmountRaw, LP_TOKEN_DECIMALS);
  console.log("LP Staked Raw:", lpStakedAmountRaw, "Formatted:", lpStakedAmount);


  // Recompensas de HGP reclamables del LP Farming
  const { data: lpClaimableRewardsRaw, refetch: refetchLpClaimableRewards } = useReadContract({
    ...LP_FARMING_CONTRACT_CONFIG, // Usamos LP_FARMING_CONTRACT_CONFIG aquí
    functionName: 'earned', // Ya corregido
    args: [userAddress],
    query: { enabled: isConnected && !!userAddress, watch: true }
  });
  const lpClaimableRewards = formatBigIntToDisplay(lpClaimableRewardsRaw, HGP_DECIMALS); // Las recompensas son en HGP
  console.log("LP Claimable Rewards Raw:", lpClaimableRewardsRaw, "Formatted:", lpClaimableRewards);


  // Wagmi Hooks para escribir en el contrato de LP Farming
  const { writeContract: writeApproveLp, data: approveLpTxHash } = useWriteContract();
  const { writeContract: writeStakeLp, data: stakeLpTxHash } = useWriteContract();
  const { writeContract: writeUnstakeLp, data: unstakeLpTxHash } = useWriteContract();
  const { writeContract: writeClaimLpRewards, data: claimLpTxHash } = useWriteContract();

  const { isLoading: isApprovingLp, isSuccess: isApprovedLpSuccess } = useWaitForTransactionReceipt({ hash: approveLpTxHash });
  const { isLoading: isStakingLp, isSuccess: isStakedLpSuccess } = useWaitForTransactionReceipt({ hash: stakeLpTxHash });
  const { isLoading: isUnstakingLp, isSuccess: isUnstakedLpSuccess } = useWaitForTransactionReceipt({ hash: unstakeLpTxHash });
  const { isLoading: isClaimingLp, isSuccess: isClaimedLpSuccess } = useWaitForTransactionReceipt({ hash: claimLpTxHash });


  // --- Efecto para refetchear balances y estados tras transacciones o cambios de conexión ---
  useEffect(() => {
    if (isConnected && userAddress) {
      refetchUserHgpBalance();
      refetchHgpStakedAmount();
      refetchHgpClaimableRewards();

      refetchUserLpBalance();
      refetchLpStakedAmount();
      refetchLpClaimableRewards();
    }
  }, [
    isConnected, userAddress,
    isApprovedHgpSuccess, isStakedHgpSuccess, isUnstakedHgpSuccess, isClaimedHgpSuccess,
    isApprovedLpSuccess, isStakedLpSuccess, isUnstakedLpSuccess, isClaimedLpSuccess,
    refetchUserHgpBalance, refetchHgpStakedAmount, refetchHgpClaimableRewards,
    refetchUserLpBalance, refetchLpStakedAmount, refetchLpClaimableRewards
  ]);


  // --- Handlers de Staking HGP ---
  const handleApproveHgp = useCallback(async () => {
    if (!userAddress || !hgpStakeAmount || parseFloat(hgpStakeAmount) <= 0) {
      showCustomModal("Por favor, introduce una cantidad válida para aprobar.");
      return;
    }
    try {
      showCustomModal("Aprobando tokens HGP...");
      const amountToApprove = parseUnits(hgpStakeAmount, HGP_DECIMALS);
      const tx = await writeApproveHgp({
        address: HGP_TOKEN_CONFIG.address,
        abi: HGP_TOKEN_CONFIG.abi,
        functionName: 'approve',
        args: [STAKING_CONTRACT_CONFIG.address, amountToApprove],
      });
      console.log("Approve HGP Tx:", tx);
      showCustomModal(`Transacción de aprobación enviada. Hash: ${tx.hash.substring(0, 10)}...`);
    } catch (error) {
      console.error("Error al aprobar HGP:", error);
      showCustomModal(`Error al aprobar HGP: ${error.message}`);
    }
  }, [userAddress, hgpStakeAmount, writeApproveHgp, showCustomModal]);

  const handleStakeHgp = useCallback(async () => {
    if (!userAddress || !hgpStakeAmount || parseFloat(hgpStakeAmount) <= 0) {
      showCustomModal("Por favor, introduce una cantidad válida para stake.");
      return;
    }
    try {
      showCustomModal("Depositando HGP en staking...");
      const amountToStake = parseUnits(hgpStakeAmount, HGP_DECIMALS);
      const tx = await writeStakeHgp({
        address: STAKING_CONTRACT_CONFIG.address,
        abi: STAKING_CONTRACT_CONFIG.abi,
        functionName: 'stake',
        args: [amountToStake],
      });
      console.log("Stake HGP Tx:", tx);
      showCustomModal(`Transacción de staking enviada. Hash: ${tx.hash.substring(0, 10)}...`);
    } catch (error) {
      console.error("Error al stake HGP:", error);
      showCustomModal(`Error al stake HGP: ${error.message}`);
    }
  }, [userAddress, hgpStakeAmount, writeStakeHgp, showCustomModal]);

  const handleUnstakeHgp = useCallback(async () => {
    if (!userAddress || !hgpUnstakeAmount || parseFloat(hgpUnstakeAmount) <= 0) {
      showCustomModal("Por favor, introduce una cantidad válida para unstake.");
      return;
    }
    try {
      showCustomModal("Retirando HGP del staking...");
      const amountToUnstake = parseUnits(hgpUnstakeAmount, HGP_DECIMALS);
      const tx = await writeUnstakeHgp({
        address: STAKING_CONTRACT_CONFIG.address,
        abi: STAKING_CONTRACT_CONFIG.abi,
        functionName: 'unstake',
        args: [amountToUnstake],
      });
      console.log("Unstake HGP Tx:", tx);
      showCustomModal(`Transacción de unstaking enviada. Hash: ${tx.hash.substring(0, 10)}...`);
    } catch (error) {
      console.error("Error al unstake HGP:", error);
      showCustomModal(`Error al unstake HGP: ${error.message}`);
    }
  }, [userAddress, hgpUnstakeAmount, writeUnstakeHgp, showCustomModal]);

  const handleClaimHgpRewards = useCallback(async () => {
    if (!userAddress) {
      showCustomModal("Conecta tu billetera para reclamar recompensas.");
      return;
    }
    try {
      showCustomModal("Reclamando recompensas HGP...");
      const tx = await writeClaimHgpRewards({
        address: STAKING_CONTRACT_CONFIG.address,
        abi: STAKING_CONTRACT_CONFIG.abi,
        functionName: 'claimRewards',
        args: [],
      });
      console.log("Claim HGP Rewards Tx:", tx);
      showCustomModal(`Transacción de reclamación enviada. Hash: ${tx.hash.substring(0, 10)}...`);
    } catch (error) {
      console.error("Error al reclamar recompensas HGP:", error);
      showCustomModal(`Error al reclamar recompensas HGP: ${error.message}`);
    }
  }, [userAddress, writeClaimHgpRewards, showCustomModal]);


  // --- Handlers de LP Farming ---
  const handleApproveLp = useCallback(async () => {
    if (!userAddress || !lpStakeAmount || parseFloat(lpStakeAmount) <= 0) {
      showCustomModal("Por favor, introduce una cantidad válida de LP para aprobar.");
      return;
    }
    try {
      showCustomModal("Aprobando tokens LP...");
      const amountToApprove = parseUnits(lpStakeAmount, LP_TOKEN_DECIMALS);
      const tx = await writeApproveLp({
        address: LP_TOKEN_CONFIG.address,
        abi: LP_TOKEN_CONFIG.abi,
        functionName: 'approve',
        args: [LP_FARMING_CONTRACT_CONFIG.address, amountToApprove],
      });
      console.log("Approve LP Tx:", tx);
      showCustomModal(`Transacción de aprobación de LP enviada. Hash: ${tx.hash.substring(0, 10)}...`);
    } catch (error) {
      console.error("Error al aprobar LP:", error);
      showCustomModal(`Error al aprobar LP: ${error.message}`);
    }
  }, [userAddress, lpStakeAmount, writeApproveLp, showCustomModal]);

  const handleStakeLp = useCallback(async () => {
    if (!userAddress || !lpStakeAmount || parseFloat(lpStakeAmount) <= 0) {
      showCustomModal("Por favor, introduce una cantidad válida de LP para stake.");
      return;
    }
    try {
      showCustomModal("Depositando LP en farming...");
      const amountToStake = parseUnits(lpStakeAmount, LP_TOKEN_DECIMALS);
      const tx = await writeStakeLp({
        address: LP_FARMING_CONTRACT_CONFIG.address,
        abi: LP_FARMING_CONTRACT_CONFIG.abi,
        functionName: 'stakeLP',
        args: [amountToStake],
      });
      console.log("Stake LP Tx:", tx);
      showCustomModal(`Transacción de staking de LP enviada. Hash: ${tx.hash.substring(0, 10)}...`);
    } catch (error) {
      console.error("Error al stake LP:", error);
      showCustomModal(`Error al stake LP: ${error.message}`);
    }
  }, [userAddress, lpStakeAmount, writeStakeLp, showCustomModal]);

  const handleUnstakeLp = useCallback(async () => {
    if (!userAddress || !lpUnstakeAmount || parseFloat(lpUnstakeAmount) <= 0) {
      showCustomModal("Por favor, introduce una cantidad válida de LP para unstake.");
      return;
    }
    try {
      showCustomModal("Retirando LP del farming...");
      const amountToUnstake = parseUnits(lpUnstakeAmount, LP_TOKEN_DECIMALS);
      const tx = await writeUnstakeLp({
        address: LP_FARMING_CONTRACT_CONFIG.address,
        abi: LP_FARMING_CONTRACT_CONFIG.abi,
        functionName: 'unstakeLP',
        args: [amountToUnstake],
      });
      console.log("Unstake LP Tx:", tx);
      showCustomModal(`Transacción de unstaking de LP enviada. Hash: ${tx.hash.substring(0, 10)}...`);
    } catch (error) {
      console.error("Error al unstake LP:", error);
      showCustomModal(`Error al unstake LP: ${error.message}`);
    }
  }, [userAddress, lpUnstakeAmount, writeUnstakeLp, showCustomModal]);

  const handleClaimLpRewards = useCallback(async () => {
    if (!userAddress) {
      showCustomModal("Conecta tu billetera para reclamar recompensas.");
      return;
    }
    try {
      showCustomModal("Reclamando recompensas LP...");
      const tx = await writeClaimLpRewards({
        address: LP_FARMING_CONTRACT_CONFIG.address,
        abi: LP_FARMING_CONTRACT_CONFIG.abi,
        functionName: 'claimRewards',
        args: [],
      });
      console.log("Claim LP Rewards Tx:", tx);
      showCustomModal(`Transacción de reclamación de LP enviada. Hash: ${tx.hash.substring(0, 10)}...`);
    } catch (error) {
      console.error("Error al reclamar recompensas LP:", error);
      showCustomModal(`Error al reclamar recompensas LP: ${error.message}`);
    }
  }, [userAddress, writeClaimLpRewards, showCustomModal]);


  if (!isConnected) {
    return (
      <section id="yield" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-8 text-center border-2 border-[var(--primary-purple)]">
        <h2 className="text-4xl font-bold text-[var(--primary-purple)] mb-6">Mecanismos de Rendimiento</h2>
        <p className="text-[var(--light-gray-text)] text-lg mb-8">
          ¡Conecta tu billetera para explorar las oportunidades de staking de $HGP y LP Farming!
        </p>
      </section>
    );
  }

  return (
    <section id="yield" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-8 text-center border-2 border-[var(--primary-purple)]">
      <h2 className="text-4xl font-bold text-[var(--primary-purple)] mb-6">Mecanismos de Rendimiento</h2>
      <p className="text-[var(--light-gray-text)] text-lg mb-8">
        Potencia tus activos $HGP y LP Tokens para obtener recompensas pasivas.
      </p>

      {/* Staking de HGP (Token nativo) */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-xl border border-[var(--accent-green)] mb-8">
        <h3 className="text-3xl font-bold text-[var(--accent-green)] mb-4">Staking de $HGP</h3>
        <p className="text-gray-400 text-lg mb-4">
          Stakea tus tokens $HGP para ganar más $HGP.
        </p>
        <p className="text-2xl font-bold text-white mb-4">
          APR Estimado: <span className="text-[var(--accent-green)]">{SIMULATED_APR_PERCENTAGE}%</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-left">
          <div className="bg-gray-800 p-4 rounded-lg shadow-inner border border-gray-700">
            <h4 className="text-xl font-semibold text-gray-300">Tu Balance de $HGP</h4>
            <p className="text-3xl font-bold text-[var(--off-white)]">{userHgpBalance} HGP</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-inner border border-gray-700">
            <h4 className="text-xl font-semibold text-gray-300">HGP Staked</h4>
            <p className="text-3xl font-bold text-[var(--secondary-blue)]">{hgpStakedAmount} HGP</p>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-inner border border-gray-700 mb-6 text-left">
          <h4 className="text-xl font-semibold text-gray-300">Recompensas $HGP Reclamables</h4>
          <p className="text-3xl font-bold text-[var(--accent-yellow)]">{hgpClaimableRewards} HGP</p>
          <button
            onClick={handleClaimHgpRewards}
            className="mt-4 w-full bg-[var(--accent-yellow)] hover:bg-yellow-700 text-[var(--dark-gray)] font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md"
            disabled={isClaimingHgp || parseFloat(hgpClaimableRewards) <= 0} // Deshabilitar si no hay recompensas
          >
            {isClaimingHgp ? 'Reclamando...' : 'Reclamar Recompensas HGP'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="number"
            value={hgpStakeAmount}
            onChange={(e) => setHgpStakeAmount(e.target.value)}
            placeholder="Cantidad de HGP para stake"
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleApproveHgp}
            className="w-full md:w-auto bg-[var(--primary-purple)] hover:bg-[var(--secondary-blue)] text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md"
            disabled={isApprovingHgp || parseFloat(hgpStakeAmount) <= 0} // Deshabilitar si no hay cantidad
          >
            {isApprovingHgp ? 'Aprobando...' : 'Aprobar HGP'}
          </button>
          <button
            onClick={handleStakeHgp}
            className="w-full md:w-auto bg-[var(--accent-green)] hover:bg-green-700 text-[var(--dark-gray)] font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md"
            disabled={isStakingHgp || parseFloat(hgpStakeAmount) <= 0} // Deshabilitar si no hay cantidad
          >
            {isStakingHgp ? 'Staking...' : 'Stake HGP'}
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="number"
            value={hgpUnstakeAmount}
            onChange={(e) => setHgpUnstakeAmount(e.target.value)}
            placeholder="Cantidad de HGP para unstake"
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleUnstakeHgp}
            className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md"
            disabled={isUnstakingHgp || parseFloat(hgpUnstakeAmount) <= 0 || parseFloat(hgpUnstakeAmount) > parseFloat(hgpStakedAmount)} // Validar cantidad
          >
            {isUnstakingHgp ? 'Unstaking...' : 'Unstake HGP'}
          </button>
        </div>
      </div>

      {/* LP Farming (Nuevo Panel) */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-xl border border-[var(--secondary-blue)]">
        <h3 className="text-3xl font-bold text-[var(--secondary-blue)] mb-4">LP Farming (HGP-BNB LP)</h3>
        <p className="text-gray-400 text-lg mb-4">
          Provee liquidez en PancakeSwap para el par HGP-BNB y stakea tus LP tokens aquí para ganar recompensas adicionales en $HGP.
        </p>
        <p className="text-2xl font-bold text-white mb-4">
          APR Estimado: <span className="text-[var(--secondary-blue)]">{SIMULATED_LP_FARMING_APR_PERCENTAGE}%</span>
        </p>

        <a
          href={`https://pancakeswap.finance/add/BNB/${HGP_TOKEN_CONFIG.address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition duration-300 transform hover:scale-105 shadow-lg mb-6"
        >
          <i className="fas fa-plus-circle mr-3"></i> Añadir Liquidez en PancakeSwap
        </a>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-left">
          <div className="bg-gray-800 p-4 rounded-lg shadow-inner border border-gray-700">
            <h4 className="text-xl font-semibold text-gray-300">Tu Balance de LP Tokens</h4>
            <p className="text-3xl font-bold text-[var(--off-white)]">{userLpBalance} LP</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-inner border border-gray-700">
            <h4 className="text-xl font-semibold text-gray-300">LP Tokens Staked</h4>
            <p className="text-3xl font-bold text-[var(--accent-green)]">{lpStakedAmount} LP</p>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-inner border border-gray-700 mb-6 text-left">
          <h4 className="text-xl font-semibold text-gray-300">Recompensas $HGP Reclamables (LP Farming)</h4>
          <p className="text-3xl font-bold text-[var(--accent-yellow)]">{lpClaimableRewards} HGP</p>
          <button
            onClick={handleClaimLpRewards}
            className="mt-4 w-full bg-[var(--accent-yellow)] hover:bg-yellow-700 text-[var(--dark-gray)] font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md"
            disabled={isClaimingLp || parseFloat(lpClaimableRewards) <= 0}
          >
            {isClaimingLp ? 'Reclamando...' : 'Reclamar Recompensas LP'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="number"
            value={lpStakeAmount}
            onChange={(e) => setLpStakeAmount(e.target.value)}
            placeholder="Cantidad de LP para stake"
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleApproveLp}
            className="w-full md:w-auto bg-[var(--primary-purple)] hover:bg-[var(--secondary-blue)] text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md"
            disabled={isApprovingLp || parseFloat(lpStakeAmount) <= 0}
          >
            {isApprovingLp ? 'Aprobando...' : 'Aprobar LP'}
          </button>
          <button
            onClick={handleStakeLp}
            className="w-full md:w-auto bg-[var(--accent-green)] hover:bg-green-700 text-[var(--dark-gray)] font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md"
            disabled={isStakingLp || parseFloat(lpStakeAmount) <= 0}
          >
            {isStakingLp ? 'Staking...' : 'Stake LP'}
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="number"
            value={lpUnstakeAmount}
            onChange={(e) => setLpUnstakeAmount(e.target.value)}
            placeholder="Cantidad de LP para unstake"
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleUnstakeLp}
            className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md"
            disabled={isUnstakingLp || parseFloat(lpUnstakeAmount) <= 0 || parseFloat(lpUnstakeAmount) > parseFloat(lpStakedAmount)}
          >
            {isUnstakingLp ? 'Unstaking...' : 'Unstake LP'}
          </button>
        </div>
      </div>
    </section>
  );
}

export default YieldMechanismsSection;
