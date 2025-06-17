import React, { useState, useEffect, useCallback } from 'react';
import { formatUnits, parseUnits, maxUint256 } from 'viem'; // <-- ¡Asegúrate de que maxUint256 esté importado aquí!
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useBalance } from 'wagmi'; // Añadido useBalance

// Importa las configuraciones de tus contratos desde el archivo centralizado
import {
  HGP_TOKEN_CONFIG,
  STAKING_CONTRACT_CONFIG,
  LP_FARMING_CONTRACT_CONFIG, // ¡IMPORTANTE! Nueva importación para LP Farming
  LP_TOKEN_CONFIG,             // ¡IMPORTANTE! Nueva importación para el LP Token
  SIMULATED_APR_PERCENTAGE,
  // DAO_CONTRACT_CONFIG // Ya no necesitamos importarla aquí si no se usa directamente en este componente
} from '../constants/contract-config.js'; // Ruta correcta relativa a src/sections/

// -----------------------------------------------------------------------------
// Componente de la Sección de Mecanismos de Rendimiento (Yield)
// -----------------------------------------------------------------------------
function YieldMechanismsSection({
  isConnected,
  userAddress,
  hgpBalance, // Esto ahora es un BigInt, se formateará aquí
  refetchHGPBalance,
  setActiveSection,
  showCustomModal // Importa la función del modal para usarla
}) {
  const [activeTab, setActiveTab] = useState('staking');
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [farmingLpAmount, setFarmingLpAmount] = useState('');

  // --- LECTURA DE DATOS REALES DE STAKING ---
  const { data: hgpAllowance, refetch: refetchHGPAllowance } = useReadContract({
    ...HGP_TOKEN_CONFIG,
    functionName: 'allowance',
    args: [userAddress, STAKING_CONTRACT_CONFIG.address], // Aprobación del token para el contrato de Staking
    query: {
      enabled: isConnected && !!userAddress && !!STAKING_CONTRACT_CONFIG.address,
      watch: true,
    }
  });

  const { data: totalStaked, refetch: refetchTotalStaked } = useReadContract({
    ...STAKING_CONTRACT_CONFIG,
    functionName: 'totalStaked',
    query: {
      enabled: isConnected && !!STAKING_CONTRACT_CONFIG.address,
      watch: true,
    }
  });

  const { data: userStakedAmount, refetch: refetchUserStakedAmount } = useReadContract({
    ...STAKING_CONTRACT_CONFIG,
    functionName: 'stakedAmount',
    args: [userAddress],
    query: {
      enabled: isConnected && !!userAddress && !!STAKING_CONTRACT_CONFIG.address,
      watch: true,
    }
  });

  const { data: pendingRewards, refetch: refetchPendingRewards } = useReadContract({
    ...STAKING_CONTRACT_CONFIG,
    functionName: 'earned',
    args: [userAddress],
    query: {
      enabled: isConnected && !!userAddress && !!STAKING_CONTRACT_CONFIG.address,
      watch: true,
    }
  });

  // --- LECTURA DE DATOS REALES DE LP FARMING ---
  const { data: lpBalanceRaw, refetch: refetchLpBalance } = useBalance({ // Obtiene el balance de LP token del usuario
    address: userAddress,
    token: LP_TOKEN_CONFIG.address,
    query: {
        enabled: isConnected && !!userAddress && !!LP_TOKEN_CONFIG.address,
        watch: true,
    }
  });
  const lpBalance = lpBalanceRaw?.value || 0n; // Asegura que sea BigInt o 0n

  const { data: lpAllowanceRaw, refetch: refetchLpAllowance } = useReadContract({
    ...LP_TOKEN_CONFIG,
    functionName: 'allowance',
    args: [userAddress, LP_FARMING_CONTRACT_CONFIG.address], // Aprobación del LP token para el contrato de LP Farming
    query: {
      enabled: isConnected && !!userAddress && !!LP_TOKEN_CONFIG.address && !!LP_FARMING_CONTRACT_CONFIG.address,
      watch: true,
    }
  });
  const lpAllowance = lpAllowanceRaw || 0n; // Asegura que sea BigInt o 0n

  const { data: userStakedLpAmount, refetch: refetchUserStakedLpAmount } = useReadContract({
    ...LP_FARMING_CONTRACT_CONFIG,
    functionName: 'lpStakedAmount',
    args: [userAddress],
    query: {
      enabled: isConnected && !!userAddress && !!LP_FARMING_CONTRACT_CONFIG.address,
      watch: true,
    }
  });

  const { data: pendingLPRewards, refetch: refetchPendingLPRewards } = useReadContract({
    ...LP_FARMING_CONTRACT_CONFIG,
    functionName: 'lpEarned',
    args: [userAddress],
    query: {
      enabled: isConnected && !!userAddress && !!LP_FARMING_CONTRACT_CONFIG.address,
      watch: true,
    }
  });

  const { data: lpRewardRate, refetch: refetchLPRewardRate } = useReadContract({
    ...LP_FARMING_CONTRACT_CONFIG,
    functionName: 'lpRewardRate',
    query: {
      enabled: isConnected && !!LP_FARMING_CONTRACT_CONFIG.address,
      watch: true,
    }
  });


  // --- FUNCIONES DE ESCRITURA REALES (WAGMI) ---
  const { writeContract: writeApprove, isPending: approvePending, error: approveError } = useWriteContract();
  const { writeContract: writeStake, isPending: stakePending, error: stakeError } = useWriteContract();
  const { writeContract: writeUnstake, isPending: unstakePending, error: unstakeError } = useWriteContract();
  const { writeContract: writeClaimRewards, isPending: claimPending, error: claimError } = useWriteContract();

  // Para LP Farming
  const { writeContract: writeApproveLp, isPending: approveLpPending, error: approveLpError } = useWriteContract();
  const { writeContract: writeStakeLp, isPending: stakeLpPending, error: stakeLpError } = useWriteContract();
  const { writeContract: writeUnstakeLp, isPending: unstakeLpPending, error: unstakeLpError } = useWriteContract();
  const { writeContract: writeClaimLpRewards, isPending: claimLpRewardsPending, error: claimLpRewardsError } = useWriteContract();

  // --- ESTADOS DE TRANSACCIONES (HASH Y CONFIRMACIÓN) ---
  const [approveTxHash, setApproveTxHash] = useState(null);
  const [stakeTxHash, setStakeTxHash] = useState(null);
  const [unstakeTxHash, setUnstakeTxHash] = useState(null);
  const [claimTxHash, setClaimTxHash] = useState(null);

  const [approveLpTxHash, setApproveLpTxHash] = useState(null);
  const [stakeLpTxHash, setStakeLpTxHash] = useState(null);
  const [unstakeLpTxHash, setUnstakeLpTxHash] = useState(null);
  const [claimLpRewardsTxHash, setClaimLpRewardsTxHash] = useState(null);


  const { isLoading: isApproving, isSuccess: isApprovedSuccess, isError: isApproveError } = useWaitForTransactionReceipt({ hash: approveTxHash, });
  const { isLoading: isStaking, isSuccess: isStakedSuccess, isError: isStakeError } = useWaitForTransactionReceipt({ hash: stakeTxHash, });
  const { isLoading: isUnstaking, isSuccess: isUnstakedSuccess, isError: isUnstakeError } = useWaitForTransactionReceipt({ hash: unstakeTxHash, });
  const { isLoading: isClaiming, isSuccess: isClaimedSuccess, isError: isClaimError } = useWaitForTransactionReceipt({ hash: claimTxHash, });

  const { isLoading: isApprovingLp, isSuccess: isLpApprovedSuccess, isError: isApproveLpError } = useWaitForTransactionReceipt({ hash: approveLpTxHash, });
  const { isLoading: isStakingLp, isSuccess: isLpStakedSuccess, isError: isStakeLpError } = useWaitForTransactionReceipt({ hash: stakeLpTxHash, });
  const { isLoading: isUnstakingLp, isSuccess: isLpUnstakedSuccess, isError: isUnstakeLpError } = useWaitForTransactionReceipt({ hash: unstakeLpTxHash, });
  const { isLoading: isClaimingLpRewards, isSuccess: isLpRewardsClaimedSuccess, isError: isClaimLpRewardsError } = useWaitForTransactionReceipt({ hash: claimLpRewardsTxHash, });


  // --- MANEJO DE EFECTOS POST-TRANSACCIÓN Y ERRORES CON CUSTOM MODAL ---
  useEffect(() => {
    if (approveError) showCustomModal(`Error al aprobar HGP: ${approveError.message}`);
    if (stakeError) showCustomModal(`Error al stakear HGP: ${stakeError.message}`);
    if (unstakeError) showCustomModal(`Error al des-stakear HGP: ${unstakeError.message}`);
    if (claimError) showCustomModal(`Error al reclamar recompensas HGP: ${claimError.message}`);

    if (approveLpError) showCustomModal(`Error al aprobar LP: ${approveLpError.message}`);
    if (stakeLpError) showCustomModal(`Error al stakear LP: ${stakeLpError.message}`);
    if (unstakeLpError) showCustomModal(`Error al des-stakear LP: ${unstakeLpError.message}`);
    if (claimLpRewardsError) showCustomModal(`Error al reclamar recompensas LP: ${claimLpRewardsError.message}`);

  }, [approveError, stakeError, unstakeError, claimError, approveLpError, stakeLpError, unstakeLpError, claimLpRewardsError, showCustomModal]);

  // Efectos para recargar datos tras transacciones exitosas
  useEffect(() => {
    if (isApprovedSuccess) {
      showCustomModal('Aprobación HGP exitosa!');
      refetchHGPAllowance();
      setApproveTxHash(null);
    }
    if (isStakedSuccess) {
      showCustomModal('Staking HGP exitoso!');
      setStakeAmount('');
      refetchHGPBalance();
      refetchUserStakedAmount();
      refetchTotalStaked();
      refetchPendingRewards(); // Refetch por si se actualizó el earned
      setStakeTxHash(null);
    }
    if (isUnstakedSuccess) {
      showCustomModal('Unstaking HGP exitoso!');
      setUnstakeAmount('');
      refetchHGPBalance();
      refetchUserStakedAmount();
      refetchTotalStaked();
      refetchPendingRewards();
      setUnstakeTxHash(null);
    }
    if (isClaimedSuccess) {
      showCustomModal('Recompensas HGP reclamadas exitosamente!');
      refetchHGPBalance();
      refetchPendingRewards();
      setClaimTxHash(null);
    }

    if (isLpApprovedSuccess) {
      showCustomModal('Aprobación LP exitosa!');
      refetchLpAllowance();
      setApproveLpTxHash(null);
    }
    if (isLpStakedSuccess) {
      showCustomModal('LP Farming exitoso!');
      setFarmingLpAmount('');
      refetchLpBalance();
      refetchUserStakedLpAmount();
      refetchPendingLPRewards();
      setStakeLpTxHash(null);
    }
    if (isLpUnstakedSuccess) {
      showCustomModal('LP Unfarming exitoso!');
      setFarmingLpAmount(''); // Usamos el mismo input para unstake
      refetchLpBalance();
      refetchUserStakedLpAmount();
      refetchPendingLPRewards();
      setUnstakeLpTxHash(null);
    }
    if (isLpRewardsClaimedSuccess) {
      showCustomModal('Recompensas LP reclamadas exitosamente!');
      refetchHGPBalance(); // Se reclama HGP
      refetchPendingLPRewards();
      setClaimLpRewardsTxHash(null);
    }
  }, [
    isApprovedSuccess, isStakedSuccess, isUnstakedSuccess, isClaimedSuccess,
    isLpApprovedSuccess, isLpStakedSuccess, isLpUnstakedSuccess, isLpRewardsClaimedSuccess,
    refetchHGPAllowance, refetchHGPBalance, refetchUserStakedAmount, refetchTotalStaked, refetchPendingRewards,
    refetchLpAllowance, refetchLpBalance, refetchUserStakedLpAmount, refetchPendingLPRewards,
    showCustomModal
  ]);


  // --- HANDLERS DE INTERACCIÓN REAL (STAKING HGP) ---

  const handleApprove = useCallback(async () => {
    if (!isConnected || !userAddress || !HGP_TOKEN_CONFIG.address || !STAKING_CONTRACT_CONFIG.address) {
      showCustomModal('Por favor, conecta tu billetera y asegúrate de que las direcciones de los contratos estén configuradas.');
      return;
    }
    try {
      const hash = await writeApprove({
        address: HGP_TOKEN_CONFIG.address,
        abi: HGP_TOKEN_CONFIG.abi,
        functionName: 'approve',
        args: [STAKING_CONTRACT_CONFIG.address, maxUint256], // Aprobar la cantidad máxima
      });
      setApproveTxHash(hash);
      showCustomModal(`Transacción de aprobación HGP enviada! Hash: ${hash.substring(0, 10)}...`);
    } catch (error) {
      console.error("Error al aprobar HGP:", error);
      showCustomModal(`Error al aprobar HGP: ${error.message}`);
    }
  }, [isConnected, userAddress, writeApprove, showCustomModal]);

  const handleStakeHGP = useCallback(async () => {
    if (!isConnected || !userAddress || !stakeAmount || parseFloat(stakeAmount) <= 0) {
      showCustomModal('Por favor, conecta tu billetera e introduce una cantidad válida para stakear.');
      return;
    }
    if (!STAKING_CONTRACT_CONFIG.address) {
        showCustomModal('La dirección del contrato de Staking no está configurada.');
        return;
    }
    try {
      const amount = parseUnits(stakeAmount, 18);
      if (amount > (hgpAllowance || 0n)) {
        showCustomModal('Necesitas aprobar el contrato de Staking para esta cantidad o una mayor. Por favor, aprueba primero.');
        return;
      }
      const hash = await writeStake({
        address: STAKING_CONTRACT_CONFIG.address,
        abi: STAKING_CONTRACT_CONFIG.abi,
        functionName: 'stake',
        args: [amount],
      });
      setStakeTxHash(hash);
      showCustomModal(`Transacción de staking HGP enviada! Hash: ${hash.substring(0, 10)}...`);
    } catch (error) {
      console.error("Error al stakear HGP:", error);
      showCustomModal(`Error al stakear HGP: ${error.message}`);
    }
  }, [isConnected, userAddress, stakeAmount, hgpAllowance, writeStake, showCustomModal]);

  const handleUnstakeHGP = useCallback(async () => {
    if (!isConnected || !userAddress || !unstakeAmount || parseFloat(unstakeAmount) <= 0) {
      showCustomModal('Por favor, conecta tu billetera e introduce una cantidad válida para des-stakear.');
      return;
    }
    if (!STAKING_CONTRACT_CONFIG.address) {
        showCustomModal('La dirección del contrato de Staking no está configurada.');
        return;
    }
    try {
      const amount = parseUnits(unstakeAmount, 18);
      const hash = await writeUnstake({
        address: STAKING_CONTRACT_CONFIG.address,
        abi: STAKING_CONTRACT_CONFIG.abi,
        functionName: 'unstake',
        args: [amount],
      });
      setUnstakeTxHash(hash);
      showCustomModal(`Transacción de unstaking HGP enviada! Hash: ${hash.substring(0, 10)}...`);
    } catch (error) {
      console.error("Error al des-stakear HGP:", error);
      showCustomModal(`Error al des-stakear HGP: ${error.message}`);
    }
  }, [isConnected, userAddress, unstakeAmount, writeUnstake, showCustomModal]);

  const handleClaimHGP = useCallback(async () => {
    if (!isConnected || !userAddress) {
      showCustomModal('Por favor, conecta tu billetera.');
      return;
    }
    if (!STAKING_CONTRACT_CONFIG.address) {
        showCustomModal('La dirección del contrato de Staking no está configurada.');
        return;
    }
    try {
      const hash = await writeClaimRewards({
        address: STAKING_CONTRACT_CONFIG.address,
        abi: STAKING_CONTRACT_CONFIG.abi,
        functionName: 'claimRewards',
      });
      setClaimTxHash(hash);
      showCustomModal(`Transacción de reclamación de recompensas HGP enviada! Hash: ${hash.substring(0, 10)}...`);
    } catch (error) {
      console.error("Error al reclamar recompensas HGP:", error);
      showCustomModal(`Error al reclamar recompensas HGP: ${error.message}`);
    }
  }, [isConnected, userAddress, writeClaimRewards, showCustomModal]);


  // --- HANDLERS DE INTERACCIÓN REAL (LP FARMING) ---

  const handleApproveLp = useCallback(async () => {
    if (!isConnected || !userAddress || !LP_TOKEN_CONFIG.address || !LP_FARMING_CONTRACT_CONFIG.address) {
      showCustomModal('Por favor, conecta tu billetera y asegúrate de que las direcciones de los contratos estén configuradas.');
      return;
    }
    try {
      const hash = await writeApproveLp({
        address: LP_TOKEN_CONFIG.address,
        abi: LP_TOKEN_CONFIG.abi, // Usar el ABI del LP Token para aprobar
        functionName: 'approve',
        args: [LP_FARMING_CONTRACT_CONFIG.address, maxUint256], // Aprobar la cantidad máxima al contrato de farming
      });
      setApproveLpTxHash(hash);
      showCustomModal(`Transacción de aprobación LP enviada! Hash: ${hash.substring(0, 10)}...`);
    } catch (error) {
      console.error("Error al aprobar LP:", error);
      showCustomModal(`Error al aprobar LP: ${error.message}`);
    }
  }, [isConnected, userAddress, writeApproveLp, showCustomModal]);

  const handleFarmLp = useCallback(async () => {
    if (!isConnected || !userAddress || !farmingLpAmount || parseFloat(farmingLpAmount) <= 0) {
      showCustomModal('Por favor, conecta tu billetera e introduce una cantidad válida de LP para farmear.');
      return;
    }
    if (!LP_FARMING_CONTRACT_CONFIG.address) {
        showCustomModal('La dirección del contrato de LP Farming no está configurada.');
        return;
    }
    try {
      const amount = parseUnits(farmingLpAmount, 18); // LP tokens también con 18 decimales
      if (amount > (lpAllowance || 0n)) {
        showCustomModal('Necesitas aprobar el contrato de LP Farming para esta cantidad o una mayor. Por favor, aprueba primero.');
        return;
      }
      const hash = await writeStakeLp({
        address: LP_FARMING_CONTRACT_CONFIG.address,
        abi: LP_FARMING_CONTRACT_CONFIG.abi,
        functionName: 'stakeLP',
        args: [amount],
      });
      setStakeLpTxHash(hash);
      showCustomModal(`Transacción de LP Farming enviada! Hash: ${hash.substring(0, 10)}...`);
    } catch (error) {
      console.error("Error al farmear LP:", error);
      showCustomModal(`Error al farmear LP: ${error.message}`);
    }
  }, [isConnected, userAddress, farmingLpAmount, lpAllowance, writeStakeLp, showCustomModal]);

  const handleUnfarmLp = useCallback(async () => {
    if (!isConnected || !userAddress || !farmingLpAmount || parseFloat(farmingLpAmount) <= 0) {
      showCustomModal('Por favor, conecta tu billetera e introduce una cantidad válida de LP para retirar.');
      return;
    }
    if (!LP_FARMING_CONTRACT_CONFIG.address) {
        showCustomModal('La dirección del contrato de LP Farming no está configurada.');
        return;
    }
    try {
      const amount = parseUnits(farmingLpAmount, 18);
      const hash = await writeUnstakeLp({
        address: LP_FARMING_CONTRACT_CONFIG.address,
        abi: LP_FARMING_CONTRACT_CONFIG.abi,
        functionName: 'unstakeLP',
        args: [amount],
      });
      setUnstakeLpTxHash(hash);
      showCustomModal(`Transacción de retirada de LP Farming enviada! Hash: ${hash.substring(0, 10)}...`);
    } catch (error) {
      console.error("Error al retirar LP de farming:", error);
      showCustomModal(`Error al retirar LP de farming: ${error.message}`);
    }
  }, [isConnected, userAddress, farmingLpAmount, writeUnstakeLp, showCustomModal]);

  const handleClaimLp = useCallback(async () => {
    if (!isConnected || !userAddress) {
      showCustomModal('Por favor, conecta tu billetera.');
      return;
    }
    if (!LP_FARMING_CONTRACT_CONFIG.address) {
        showCustomModal('La dirección del contrato de LP Farming no está configurada.');
        return;
    }
    try {
      const hash = await writeClaimLpRewards({
        address: LP_FARMING_CONTRACT_CONFIG.address,
        abi: LP_FARMING_CONTRACT_CONFIG.abi,
        functionName: 'claimLPRewards',
      });
      setClaimLpRewardsTxHash(hash);
      showCustomModal(`Transacción de reclamación de recompensas LP enviada! Hash: ${hash.substring(0, 10)}...`);
    } catch (error) {
      console.error("Error al reclamar recompensas LP:", error);
      showCustomModal(`Error al reclamar recompensas LP: ${error.message}`);
    }
  }, [isConnected, userAddress, writeClaimLpRewards, showCustomModal]);


  // Función para formatear BigInts a números legibles (con 18 decimales)
  const formatTokenAmount = (amount, decimals = 18) => {
    return amount ? parseFloat(formatUnits(amount, decimals)).toFixed(2) : '0.00';
  };

  const isAnyTxPending = approvePending || stakePending || unstakePending || claimPending ||
                         isApproving || isStaking || isUnstaking || isClaiming ||
                         approveLpPending || stakeLpPending || unstakeLpPending || claimLpRewardsPending ||
                         isApprovingLp || isStakingLp || isUnstakingLp || isClaimingLpRewards;

  return (
    <section id="yield" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-8 text-center border-2 border-[var(--primary-purple)]">
      <h2 className="text-4xl font-bold text-[var(--primary-purple)] mb-6">Mecanismos de Rendimiento HighPower</h2>
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
              <p className="text-gray-400 mb-4">Bloquea tus tokens $HGP para ganar recompensas pasivas. APR estimado: {SIMULATED_APR_PERCENTAGE}%</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-6">
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <p className="text-gray-400 text-sm">Tu Saldo $HGP Disponible:</p>
                  <p className="text-xl font-bold text-[var(--off-white)]">{formatTokenAmount(hgpBalance)} HGP</p>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <p className="text-gray-400 text-sm">Tu $HGP Stakeado:</p>
                  <p className="text-xl font-bold text-[var(--off-white)]">{formatTokenAmount(userStakedAmount)} HGP</p>
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
                  {formatTokenAmount(hgpAllowance) === '0.00' || parseFloat(formatTokenAmount(hgpAllowance)) < parseFloat(stakeAmount || '0') ? (
                    <button
                      onClick={handleApprove}
                      disabled={isAnyTxPending || !stakeAmount || parseFloat(stakeAmount) <= 0}
                      className={`w-full md:w-1/3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center justify-center
                                ${isAnyTxPending || !stakeAmount || parseFloat(stakeAmount) <= 0 ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isApproving || approvePending ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-check-circle mr-2"></i>}
                      {isApproving || approvePending ? 'Aprobando HGP...' : 'Aprobar HGP'}
                    </button>
                  ) : (
                    <button
                      onClick={handleStakeHGP}
                      disabled={isAnyTxPending || !stakeAmount || parseFloat(stakeAmount) <= 0}
                      className={`w-full md:w-1/3 bg-[var(--primary-purple)] hover:bg-[var(--secondary-blue)] text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center justify-center
                                ${isAnyTxPending || !stakeAmount || parseFloat(stakeAmount) <= 0 ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isStaking || stakePending ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-arrow-up mr-2"></i>}
                      {isStaking || stakePending ? 'Depositando...' : 'Stakear HGP'}
                    </button>
                  )}
                </div>
              </div>

              {/* Sección de Retiro */}
              <div className="bg-gray-900 p-6 rounded-lg border border-red-600 mb-6">
                <h4 className="text-2xl font-bold text-[var(--accent-green)] mb-4">Retirar HGP</h4>
                <input
                  type="number"
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                  placeholder="Cantidad de HGP a des-stakear"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500 mb-4"
                />
                <button
                  onClick={handleUnstakeHGP}
                  disabled={isAnyTxPending || !unstakeAmount || parseFloat(unstakeAmount) <= 0 || formatTokenAmount(userStakedAmount) === '0.00'}
                  className={`w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center justify-center
                                ${isAnyTxPending || !unstakeAmount || parseFloat(unstakeAmount) <= 0 || formatTokenAmount(userStakedAmount) === '0.00' ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isAnyTxPending ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-arrow-down mr-2"></i>}
                  {isUnstaking || unstakePending ? 'Retirando...' : 'Des-stakear HGP'}
                </button>
              </div>

              {/* Sección de Recompensas */}
              <div className="bg-gray-900 p-6 rounded-lg border border-[var(--accent-yellow)]">
                <h4 className="text-2xl font-bold text-[var(--accent-green)] mb-4">Tus Recompensas de Staking</h4>
                <p className="text-[var(--off-white)] text-3xl font-bold mb-4">{formatTokenAmount(pendingRewards)} HGP</p>
                <button
                  onClick={handleClaimHGP}
                  disabled={isAnyTxPending || formatTokenAmount(pendingRewards) === '0.00'}
                  className={`w-full bg-[var(--accent-green)] hover:bg-[var(--primary-purple)] text-[var(--dark-gray)] font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center justify-center
                                ${isAnyTxPending || formatTokenAmount(pendingRewards) === '0.00' ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isAnyTxPending ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-gift mr-2"></i>}
                  {isClaiming || claimPending ? 'Reclamando...' : 'Reclamar Recompensas'}
                </button>
              </div>
            </div>
          )}

          {/* Sección de Liquidity Farming (AHORA REAL) */}
          {activeTab === 'farming' && (
            <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-[var(--accent-yellow)]">
              <h3 className="text-3xl font-bold text-[var(--off-white)] mb-6">Liquidity Farming (LP Tokens)</h3>
              {/* <p className="text-red-400 text-lg mb-4 font-semibold">
                ¡Esta sección es actualmente una SIMULACIÓN! Para una funcionalidad real, se requiere un contrato de Farming de LP.
              </p> */} {/* ¡Comentamos o eliminamos el mensaje de simulación! */}
              <p className="text-gray-400 mb-4">Aporta tus LP Tokens para ganar recompensas HGP.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-6">
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <p className="text-gray-400 text-sm">Tu Saldo LP Tokens Disponible:</p>
                  <p className="text-xl font-bold text-[var(--off-white)]">{formatTokenAmount(lpBalance)} LP</p>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <p className="text-gray-400 text-sm">Tus LP Tokens en Farming:</p>
                  <p className="text-xl font-bold text-[var(--off-white)]">{formatTokenAmount(userStakedLpAmount)} LP</p>
                </div>
              </div>

              {/* Sección de Farmear LP */}
              <div className="bg-gray-900 p-6 rounded-lg border border-[var(--primary-purple)] mb-6">
                <h4 className="text-2xl font-bold text-[var(--accent-green)] mb-4">Aportar LP Tokens al Farming</h4>
                <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
                  <input
                    type="number"
                    value={farmingLpAmount}
                    onChange={(e) => setFarmingLpAmount(e.target.value)}
                    placeholder="Cantidad de LP Tokens"
                    className="w-full md:w-2/3 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-purple-500"
                  />
                  {formatTokenAmount(lpAllowance) === '0.00' || parseFloat(formatTokenAmount(lpAllowance)) < parseFloat(farmingLpAmount || '0') ? (
                    <button
                      onClick={handleApproveLp}
                      disabled={isAnyTxPending || !farmingLpAmount || parseFloat(farmingLpAmount) <= 0}
                      className={`w-full md:w-1/3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center justify-center
                                  ${isAnyTxPending || !farmingLpAmount || parseFloat(farmingLpAmount) <= 0 ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isApprovingLp || approveLpPending ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-check-circle mr-2"></i>}
                      {isApprovingLp || approveLpPending ? 'Aprobando LP...' : 'Aprobar LP'}
                    </button>
                  ) : (
                    <button
                      onClick={handleFarmLp}
                      disabled={isAnyTxPending || !farmingLpAmount || parseFloat(farmingLpAmount) <= 0}
                      className={`w-full md:w-1/3 bg-[var(--primary-purple)] hover:bg-[var(--secondary-blue)] text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center justify-center
                                  ${isAnyTxPending || !farmingLpAmount || parseFloat(farmingLpAmount) <= 0 ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isStakingLp || stakeLpPending ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-hand-holding-usd mr-2"></i>}
                      {isStakingLp || stakeLpPending ? 'Farmear LP...' : 'Farmear LP'}
                    </button>
                  )}
                </div>
              </div>

              {/* Sección de Retirar LP de Farming */}
              <div className="bg-gray-900 p-6 rounded-lg border border-red-600 mb-6">
                <h4 className="text-2xl font-bold text-[var(--accent-green)] mb-4">Retirar LP Tokens de Farming</h4>
                <input
                  type="number"
                  value={farmingLpAmount} // Reutilizamos el input
                  onChange={(e) => setFarmingLpAmount(e.target.value)}
                  placeholder="Cantidad de LP Tokens a retirar"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500 mb-4"
                />
                <button
                  onClick={handleUnfarmLp}
                  disabled={isAnyTxPending || !farmingLpAmount || parseFloat(farmingLpAmount) <= 0 || formatTokenAmount(userStakedLpAmount) === '0.00'}
                  className={`w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center justify-center
                                ${isAnyTxPending || !farmingLpAmount || parseFloat(farmingLpAmount) <= 0 || formatTokenAmount(userStakedLpAmount) === '0.00' ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isAnyTxPending ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-wallet mr-2"></i>}
                  {isUnstakingLp || unstakeLpPending ? 'Retirando...' : 'Retirar LP de Farming'}
                </button>
              </div>

              {/* Sección de Reclamar Recompensas de Farming */}
              <div className="bg-gray-900 p-6 rounded-lg border border-[var(--accent-green)]">
                <h4 className="text-2xl font-bold text-[var(--accent-green)] mb-4">Tus Recompensas de Farming</h4>
                <p className="text-[var(--off-white)] text-3xl font-bold mb-4">{formatTokenAmount(pendingLPRewards)} HGP</p>
                <button
                  onClick={handleClaimLp}
                  disabled={isAnyTxPending || formatTokenAmount(pendingLPRewards) === '0.00'}
                  className={`w-full bg-[var(--accent-green)] hover:bg-[var(--primary-purple)] text-[var(--dark-gray)] font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center justify-center
                                ${isAnyTxPending || formatTokenAmount(pendingLPRewards) === '0.00' ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isAnyTxPending ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-gift mr-2"></i>}
                  {isClaimingLpRewards || claimLpRewardsPending ? 'Reclamando...' : 'Reclamar Recompensas LP'}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Infografía Animada de Mecanismos de Rendimiento */}
      <div className="bg-gray-800 p-6 rounded-3xl shadow-xl space-y-8 text-center border-2 border-[var(--primary-purple)]">
        <h3 className="text-3xl font-bold text-[var(--off-white)] mb-6">Mecanismos de Rendimiento en Acción</h3>
        <p className="text-[var(--light-gray-text)] mb-8">
          Visualiza cómo tus activos crecen a través de nuestros innovadores mecanismos de Staking y Farming.
        </p>
        <div className="relative w-full h-96 bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400">
            {/* Fondo gradiente sutil */}
            <defs>
              <linearGradient id="yieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: 'var(--primary-purple)', stopOpacity: 0.8}} />
                <stop offset="50%" style={{stopColor: 'var(--secondary-blue)', stopOpacity: 0.8}} />
                <stop offset="100%" style={{stopColor: 'var(--accent-green)', stopOpacity: 0.8}} />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="800" height="400" fill="url(#yieldGradient)" opacity="0.1" />

            {/* Iconos centrales */}
            <circle cx="200" cy="200" r="40" fill="var(--primary-purple)" opacity="0.9" stroke="var(--off-white)" strokeWidth="2" />
            <text x="200" y="205" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">Tus Activos</text>

            <circle cx="600" cy="200" r="40" fill="var(--accent-green)" opacity="0.9" stroke="var(--off-white)" strokeWidth="2" />
            <text x="600" y="205" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">Recompensas</text>

            {/* Pool de Staking/Farming */}
            <rect x="300" y="150" width="200" height="100" rx="15" ry="15" fill="var(--dark-gray)" stroke="var(--secondary-blue)" strokeWidth="3" opacity="0.9" />
            <text x="400" y="200" textAnchor="middle" fill="var(--light-gray-text)" fontSize="18" fontWeight="bold">Pool de Rendimiento</text>

            {/* Animación de Flujo: Activos al Pool */}
            <path id="path1" d="M240 200 H300" stroke="var(--primary-purple)" strokeWidth="4" fill="none" opacity="0.7">
              <animateMotion
                path="M240 200 H300"
                dur="2s"
                repeatCount="indefinite"
                rotate="auto"
                begin="0s"
              >
                <mpath href="#path1" />
              </animateMotion>
            </path>
            <circle r="8" fill="var(--accent-yellow)">
              <animateMotion
                path="M240 200 H300"
                dur="2s"
                repeatCount="indefinite"
                rotate="auto"
                begin="0s"
              />
            </circle>

            {/* Animación de Flujo: Pool a Recompensas */}
            <path id="path2" d="M500 200 H560" stroke="var(--accent-green)" strokeWidth="4" fill="none" opacity="0.7">
              <animateMotion
                path="M500 200 H560"
                dur="2s"
                repeatCount="indefinite"
                rotate="auto"
                begin="1s"
              >
                <mpath href="#path2" />
              </animateMotion>
            </path>
            <circle r="8" fill="var(--accent-yellow)">
              <animateMotion
                path="M500 200 H560"
                dur="2s"
                repeatCount="indefinite"
                rotate="auto"
                begin="1s"
              />
            </circle>

            {/* Pequeñas partículas de flujo alrededor del pool */}
            {Array.from({ length: 15 }).map((_, i) => (
              <circle key={i} r="3" fill="white" opacity="0.5">
                <animateMotion
                  path={`M${350 + Math.random() * 100} ${170 + Math.random() * 60} Q${400 + Math.random() * 50} ${100 + Math.random() * 200}, ${450 + Math.random() * 100} ${170 + Math.random() * 60}`}
                  dur={`${2 + Math.random() * 2}s`}
                  repeatCount="indefinite"
                  rotate="auto"
                  begin={`${Math.random() * 2}s`}
                />
              </circle>
            ))}

            {/* Leyenda */}
            <g transform="translate(10, 360)">
              <rect x="0" y="0" width="180" height="30" fill="rgba(0,0,0,0.5)" rx="5" ry="5" />
              <rect x="5" y="8" width="10" height="10" fill="var(--primary-purple)" />
              <text x="20" y="17" fill="white" fontSize="12">Activos Depositados</text>
            </g>
            <g transform="translate(200, 360)">
              <rect x="0" y="0" width="160" height="30" fill="rgba(0,0,0,0.5)" rx="5" ry="5" />
              <rect x="5" y="8" width="10" height="10" fill="var(--accent-green)" />
              <text x="20" y="17" fill="white" fontSize="12">Recompensas Generadas</text>
            </g>

          </svg>
        </div>
        <p className="text-gray-500 text-sm mt-4">
          *Esta infografía ilustra el flujo de activos y recompensas en el ecosistema HighPower.
        </p>
      </div>
    </section>
  );
}

export default YieldMechanismsSection;
