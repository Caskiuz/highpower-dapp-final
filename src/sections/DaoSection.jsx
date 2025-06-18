import React, { useState, useEffect, useCallback } from 'react';
import { formatUnits, parseUnits, encodeFunctionData, decodeFunctionResult } from 'viem';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

// Importa las configuraciones de tus contratos desde el archivo centralizado
import {
  DAO_CONTRACT_CONFIG,
  UI_PROPOSAL_THRESHOLD_HGP // Umbral para la UI
} from '../constants/contract-config.js'; // Ruta correcta relativa a src/sections/

function DaoSection({
  isConnected,
  userAddress,
  showCustomModal,
  publicClient, // Pasamos el publicClient para las llamadas de lectura
  hgpBalance, // El balance HGP del usuario (como BigInt)
}) {
  const [activeTab, setActiveTab] = useState('proposals'); // 'proposals', 'create-proposal', 'my-votes'
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');
  const [voteProposalId, setVoteProposalId] = useState(''); // Para votar por ID
  const [executeProposalId, setExecuteProposalId] = useState(''); // Para ejecutar por ID

  // --- LECTURA DE DATOS REALES DE LA DAO ---
  const { data: nextProposalIdData, refetch: refetchNextProposalId } = useReadContract({
    ...DAO_CONTRACT_CONFIG,
    functionName: 'nextProposalId',
    query: {
      enabled: isConnected && !!DAO_CONTRACT_CONFIG.address,
      watch: true, // Observar cambios en el siguiente ID de propuesta
    }
  });
  const nextProposalId = nextProposalIdData ? Number(nextProposalIdData) : 1;

  const [proposals, setProposals] = useState([]);
  const [fetchingProposals, setFetchingProposals] = useState(false);

  // Función para obtener todas las propuestas (útil si hay un número limitado)
  const fetchProposals = useCallback(async () => {
    if (!DAO_CONTRACT_CONFIG.address || !publicClient || nextProposalId <= 1) {
      setProposals([]);
      return;
    }

    setFetchingProposals(true);
    const fetchedProposals = [];
    for (let i = 1; i < nextProposalId; i++) {
      try {
        // Codificar la llamada a la función getProposal
        const callData = encodeFunctionData({
          abi: DAO_CONTRACT_CONFIG.abi,
          functionName: 'getProposal',
          args: [BigInt(i)],
        });

        // Realizar la llamada de lectura al contrato
        const result = await publicClient.call({
          to: DAO_CONTRACT_CONFIG.address,
          data: callData,
        });

        if (result.data) {
          // Decodificar el resultado de la llamada
          const decoded = decodeFunctionResult({
            abi: DAO_CONTRACT_CONFIG.abi,
            functionName: 'getProposal',
            data: result.data,
          });

          if (decoded && decoded.length === 10) { 
            fetchedProposals.push({
              id: Number(decoded[0]),
              title: decoded[1],
              description: decoded[2],
              proposer: decoded[3],
              voteStartTime: Number(decoded[4]),
              voteEndTime: Number(decoded[5]),
              votesFor: formatUnits(decoded[6], 18), // Asumiendo 18 decimales para votos
              votesAgainst: formatUnits(decoded[7], 18),
              executed: decoded[8],
              // Mapeo de estado basado en el enum del contrato (si el contrato devuelve un uint)
              // Asegúrate de que este mapeo coincida con tu contrato DAO
              state: ['Pending', 'Active', 'Succeeded', 'Defeated', 'Executed', 'Canceled'][Number(decoded[9])]
            });
          } else {
            console.warn(`Unexpected decoding result for proposal ${i}:`, decoded);
          }
        } else {
          console.warn(`No data returned for proposal ${i} call. Result:`, result);
        }
      } catch (error) {
        console.error(`Error fetching proposal ${i}:`, error);
      }
    }
    setProposals(fetchedProposals.sort((a, b) => b.id - a.id)); // Ordenar por ID descendente
    setFetchingProposals(false);
  }, [nextProposalId, publicClient]); 

  // Ejecutar la búsqueda de propuestas al cargar el componente o cuando cambia nextProposalId
  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  // --- FUNCIONES DE ESCRITURA REALES (WAGMI) ---
  const { writeContract: writeCreateProposal, isPending: createProposalPending, error: createProposalError } = useWriteContract();
  const { writeContract: writeVote, isPending: votePending, error: voteError } = useWriteContract();
  const { writeContract: writeExecuteProposal, isPending: executeProposalPending, error: executeProposalError } = useWriteContract();

  // --- ESTADOS DE TRANSACCIONES (HASH Y CONFIRMACIÓN) ---
  const [createProposalTxHash, setCreateProposalTxHash] = useState(null);
  const [voteTxHash, setVoteTxHash] = useState(null);
  const [executeProposalTxHash, setExecuteProposalTxHash] = useState(null);

  const { isLoading: isCreatingProposal, isSuccess: isCreateProposalSuccess, isError: isCreateProposalError } = useWaitForTransactionReceipt({
    hash: createProposalTxHash,
  });
  const { isLoading: isVoting, isSuccess: isVoteSuccess, isError: isVoteError } = useWaitForTransactionReceipt({
    hash: voteTxHash,
  });
  const { isLoading: isExecutingProposal, isSuccess: isExecuteProposalSuccess, isError: isExecuteProposalError } = useWaitForTransactionReceipt({
    hash: executeProposalTxHash,
  });

  // --- MANEJO DE EFECTOS POST-TRANSACCIÓN Y ERRORES CON CUSTOM MODAL ---
  useEffect(() => {
    if (createProposalError) showCustomModal(`Error al crear propuesta: ${createProposalError.message}`);
    if (voteError) showCustomModal(`Error al votar: ${voteError.message}`);
    if (executeProposalError) showCustomModal(`Error al ejecutar propuesta: ${executeProposalError.message}`);
  }, [createProposalError, voteError, executeProposalError, showCustomModal]);

  useEffect(() => {
    if (isCreateProposalSuccess) {
      showCustomModal('Propuesta creada exitosamente!');
      setProposalTitle('');
      setProposalDescription('');
      refetchNextProposalId(); // Refetch el ID de la siguiente propuesta
      fetchProposals(); // Refetch todas las propuestas para actualizar la lista
      setCreateProposalTxHash(null);
    }
    if (isVoteSuccess) {
      showCustomModal('Voto registrado exitosamente!');
      setVoteProposalId('');
      fetchProposals(); // Refetch para actualizar el estado de la propuesta y los votos
      setVoteTxHash(null);
    }
    if (isExecuteProposalSuccess) {
      showCustomModal('Propuesta ejecutada exitosamente!');
      setExecuteProposalId('');
      fetchProposals(); // Refetch para actualizar el estado de la propuesta
      setExecuteProposalTxHash(null);
    }
  }, [isCreateProposalSuccess, isVoteSuccess, isExecuteProposalSuccess, refetchNextProposalId, fetchProposals, showCustomModal]);


  // --- HANDLERS DE INTERACCIÓN REAL ---

  const handleCreateProposal = useCallback(async () => {
    if (!isConnected || !userAddress || !proposalTitle || !proposalDescription) {
      showCustomModal('Por favor, conecta tu billetera y completa todos los campos de la propuesta.');
      return;
    }
    if (!DAO_CONTRACT_CONFIG.address) {
        showCustomModal('La dirección del contrato DAO no está configurada.');
        return;
    }
    // Convertir hgpBalance (BigInt) a número para comparar con UI_PROPOSAL_THRESHOLD_HGP
    const userHGPBalanceNum = parseFloat(formatUnits(hgpBalance || 0n, 18)); // Asumiendo 18 decimales
    if (userHGPBalanceNum < UI_PROPOSAL_THRESHOLD_HGP) {
        showCustomModal(`Necesitas al menos ${UI_PROPOSAL_THRESHOLD_HGP} HGP para crear una propuesta.`);
        return;
    }

    try {
      writeCreateProposal({
        address: DAO_CONTRACT_CONFIG.address,
        abi: DAO_CONTRACT_CONFIG.abi,
        functionName: 'createProposal',
        args: [proposalTitle, proposalDescription],
      }, {
        onSuccess: (hash) => {
          setCreateProposalTxHash(hash);
          showCustomModal(`Transacción de creación de propuesta enviada! Hash: ${hash.substring(0, 10)}...`);
        },
        onError: (err) => {
          console.error("Error al crear propuesta:", err);
          showCustomModal(`Error al crear propuesta: ${err.message}`);
        }
      });
    } catch (error) {
      console.error("Error inesperado al crear propuesta:", error);
      showCustomModal(`Error inesperado al crear propuesta: ${error.message}`);
    }
  }, [isConnected, userAddress, proposalTitle, proposalDescription, hgpBalance, writeCreateProposal, showCustomModal]);

  const handleVote = useCallback(async (proposalId, support) => {
    if (!isConnected || !userAddress) {
      showCustomModal('Por favor, conecta tu billetera.');
      return;
    }
    if (!DAO_CONTRACT_CONFIG.address) {
        showCustomModal('La dirección del contrato DAO no está configurada.');
        return;
    }
    // Verifica si la propuesta existe y está activa
    const proposal = proposals.find(p => p.id === proposalId);
    if (!proposal) {
        showCustomModal('Propuesta no encontrada.');
        return;
    }
    if (proposal.state !== 'Active') {
        showCustomModal('Solo se puede votar en propuestas activas.');
        return;
    }

    try {
      writeVote({
        address: DAO_CONTRACT_CONFIG.address,
        abi: DAO_CONTRACT_CONFIG.abi,
        functionName: 'vote',
        args: [BigInt(proposalId), support], // 'support' es un booleano: true para A FAVOR, false para EN CONTRA
      }, {
        onSuccess: (hash) => {
          setVoteTxHash(hash);
          showCustomModal(`Transacción de voto enviada! Hash: ${hash.substring(0, 10)}...`);
        },
        onError: (err) => {
          console.error("Error al votar:", err);
          showCustomModal(`Error al votar: ${err.message}`);
        }
      });
    } catch (error) {
      console.error("Error inesperado al votar:", error);
      showCustomModal(`Error inesperado al votar: ${error.message}`);
    }
  }, [isConnected, userAddress, proposals, writeVote, showCustomModal]);

  const handleExecuteProposal = useCallback(async (proposalId) => {
    if (!isConnected || !userAddress) {
      showCustomModal('Por favor, conecta tu billetera.');
      return;
    }
    if (!DAO_CONTRACT_CONFIG.address) {
        showCustomModal('La dirección del contrato DAO no está configurada.');
        return;
    }
    // Verifica si la propuesta existe y está en estado "Succeeded" y no ejecutada
    const proposal = proposals.find(p => p.id === proposalId);
    if (!proposal) {
        showCustomModal('Propuesta no encontrada.');
        return;
    }
    if (proposal.state !== 'Succeeded' || proposal.executed) {
        showCustomModal('Solo se pueden ejecutar propuestas exitosas y no ejecutadas.');
        return;
    }

    try {
      writeExecuteProposal({
        address: DAO_CONTRACT_CONFIG.address,
        abi: DAO_CONTRACT_CONFIG.abi,
        functionName: 'executeProposal',
        args: [BigInt(proposal.id)], // Asegúrate de pasar el ID correcto
      }, {
        onSuccess: (hash) => {
          setExecuteProposalTxHash(hash);
          showCustomModal(`Transacción de ejecución enviada! Hash: ${hash.substring(0, 10)}...`);
        },
        onError: (err) => {
          console.error("Error al ejecutar propuesta:", err);
          showCustomModal(`Error al ejecutar propuesta: ${err.message}`);
        }
      });
    } catch (error) {
      console.error("Error inesperado al ejecutar propuesta:", error);
      showCustomModal(`Error inesperado al ejecutar propuesta: ${error.message}`);
    }
  }, [isConnected, userAddress, proposals, writeExecuteProposal, showCustomModal]);


  const isAnyTxPending = createProposalPending || votePending || executeProposalPending ||
                         isCreatingProposal || isVoting || isExecutingProposal;

  return (
    <section id="dao" className="p-4 sm:p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-8 text-center border-2 border-[var(--primary-purple)]">
      <h2 className="text-2xl sm:text-4xl font-bold text-[var(--primary-purple)] mb-4 sm:mb-6">Gobernanza Descentralizada (DAO)</h2>
      <p className="text-[var(--light-gray-text)] text-base sm:text-lg mb-6 sm:mb-8">
        Tu voz importa. Participa en las decisiones clave del futuro de HighPower votando en las propuestas.
      </p>

      {/* Pestañas de navegación */}
      <div className="flex justify-center mb-6 sm:mb-8 bg-gray-900 p-2 rounded-full shadow-inner border border-gray-700">
        <button
          className={`py-2 px-4 sm:px-6 rounded-full font-semibold transition-all duration-300 
                      ${activeTab === 'proposals' ? 'bg-[var(--primary-purple)] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('proposals')}
        >
          Propuestas
        </button>
        <button
          className={`py-2 px-4 sm:px-6 rounded-full font-semibold transition-all duration-300 
                      ${activeTab === 'create-proposal' ? 'bg-[var(--primary-purple)] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('create-proposal')}
        >
          Crear Propuesta
        </button>
      </div>

      {!isConnected && (
        <div className="bg-gray-800 p-4 sm:p-6 rounded-3xl shadow-xl border border-red-500 text-center">
          <p className="text-red-400 text-lg sm:text-xl font-semibold">
            ¡Conecta tu billetera para participar en la Gobernanza!
          </p>
        </div>
      )}

      {isConnected && (
        <>
          {activeTab === 'proposals' && (
            <div className="bg-gray-800 p-4 sm:p-6 rounded-3xl shadow-xl border border-[var(--secondary-blue)]">
              <h3 className="text-2xl sm:text-3xl font-bold text-[var(--off-white)] mb-4 sm:mb-6">Propuestas de Gobernanza Activas y Pasadas</h3>
              <p className="text-gray-400 mb-4 sm:mb-6">Vota en las decisiones que moldearán el futuro de HighPower.</p>
              {fetchingProposals ? (
                <div className="flex justify-center items-center h-32 sm:h-48">
                  <i className="fas fa-spinner fa-spin text-[var(--accent-green)] text-2xl sm:text-4xl"></i>
                  <p className="ml-2 sm:ml-4 text-[var(--off-white)]">Cargando propuestas...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  {proposals.length > 0 ? (
                    proposals.map(proposal => (
                      <div key={proposal.id} className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-md border border-gray-700 text-left">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                          <h4 className="text-xl sm:text-2xl font-semibold text-[var(--accent-green)]">ID {proposal.id}: {proposal.title}</h4>
                          <span className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-xs sm:text-sm font-bold 
                            ${proposal.state === 'Active' ? 'bg-blue-600 text-white' : 
                              proposal.state === 'Succeeded' ? 'bg-green-600 text-white' : 
                              proposal.state === 'Executed' ? 'bg-purple-600 text-white' : 
                              'bg-red-600 text-white'}`}>
                            {proposal.state}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-4">{proposal.description}</p>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-gray-500 text-xs sm:text-sm mb-2 sm:mb-4">
                          <span>Finaliza: {new Date(proposal.voteEndTime * 1000).toLocaleString()}</span>
                          <span className="text-[var(--accent-yellow)] font-semibold">Proponente: {proposal.proposer.substring(0,6)}...{proposal.proposer.substring(proposal.proposer.length - 4)}</span>
                        </div>
                        <div className="mb-2 sm:mb-4">
                          <p className="text-[var(--off-white)] font-bold">Votos a favor: <span className="text-green-400">{proposal.votesFor} HGP</span></p>
                          <p className="text-[var(--off-white)] font-bold">Votos en contra: <span className="text-red-400">{proposal.votesAgainst} HGP</span></p>
                        </div>
                        {proposal.state === 'Active' && (
                          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                            <button
                              onClick={() => handleVote(proposal.id, true)} // true para 'for'
                              disabled={isAnyTxPending}
                              className={`flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center justify-center
                                         ${isAnyTxPending ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                              <i className="fas fa-thumbs-up mr-2"></i> {isVoting ? 'Votando...' : 'Votar A Favor'}
                            </button>
                            <button
                              onClick={() => handleVote(proposal.id, false)} // false para 'against'
                              disabled={isAnyTxPending}
                              className={`flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center justify-center
                                         ${isAnyTxPending ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                              <i className="fas fa-thumbs-down mr-2"></i> {isVoting ? 'Votando...' : 'Votar En Contra'}
                            </button>
                          </div>
                        )}
                        {proposal.state === 'Succeeded' && !proposal.executed && (
                          <div className="mt-2 sm:mt-4">
                            <button
                              onClick={() => handleExecuteProposal(proposal.id)}
                              disabled={isAnyTxPending}
                              className={`w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center justify-center
                                         ${isAnyTxPending ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                              <i className="fas fa-hammer mr-2"></i> {isExecutingProposal ? 'Ejecutando...' : 'Ejecutar Propuesta'}
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="col-span-full text-center text-gray-500">No hay propuestas de gobernanza disponibles en este momento.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'create-proposal' && (
            <div className="bg-gray-800 p-4 sm:p-6 rounded-3xl shadow-xl border border-[var(--accent-green)]">
              <h3 className="text-2xl sm:text-3xl font-bold text-[var(--off-white)] mb-4 sm:mb-6">Crear Nueva Propuesta de Gobernanza</h3>
              <p className="text-gray-400 mb-4 sm:mb-6">
                Envía tu propuesta para el ecosistema HighPower. Necesitas un mínimo de <span className="font-semibold text-white">{UI_PROPOSAL_THRESHOLD_HGP} HGP</span> para someterla a votación.
              </p>
              <div className="flex flex-col space-y-2 sm:space-y-4">
                <input
                  type="text"
                  placeholder="Título de la propuesta"
                  value={proposalTitle}
                  onChange={(e) => setProposalTitle(e.target.value)}
                  className="p-2 sm:p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-purple-500"
                />
                <textarea
                  placeholder="Descripción detallada de la propuesta..."
                  value={proposalDescription}
                  onChange={(e) => setProposalDescription(e.target.value)}
                  rows="4"
                  className="p-2 sm:p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-purple-500 resize-y"
                ></textarea>
                <button
                  onClick={handleCreateProposal}
                  disabled={isAnyTxPending || !proposalTitle || !proposalDescription || parseFloat(formatUnits(hgpBalance || 0n, 18)) < UI_PROPOSAL_THRESHOLD_HGP}
                  className={`bg-[var(--accent-green)] hover:bg-[var(--secondary-blue)] text-[var(--dark-gray)] font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full text-lg sm:text-xl
                              transition duration-300 ease-in-out transform hover:scale-105 shadow-xl flex items-center justify-center
                              ${isAnyTxPending || !proposalTitle || !proposalDescription || parseFloat(formatUnits(hgpBalance || 0n, 18)) < UI_PROPOSAL_THRESHOLD_HGP ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isCreatingProposal ? <i className="fas fa-spinner fa-spin mr-2 sm:mr-3"></i> : <i className="fas fa-lightbulb mr-2 sm:mr-3"></i>}
                  {isCreatingProposal ? 'Enviando...' : 'Crear Propuesta'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default DaoSection;
