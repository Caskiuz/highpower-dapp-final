// src/sections/DaoSection.jsx
import React, { useState, useCallback } from 'react';

function DaoSection({
  isConnected,
  address,
  showCustomModal,
  mockCreateProposal,
  mockVoteProposal,
  isMinting, // Reutilizando para cualquier transacción pendiente
  isConfirming, // Reutilizando para cualquier transacción confirmando
}) {
  const [activeTab, setActiveTab] = useState('proposals'); // 'proposals', 'create-proposal', 'my-votes'
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');

  // Simulación de propuestas de la DAO
  const [proposals, setProposals] = useState([
    {
      id: 1,
      title: 'Aumentar Recompensas de Staking en 5%',
      description: 'Esta propuesta busca aumentar el APR de staking de $HGP en un 5% adicional para incentivar una mayor retención de tokens y recompensar a los holders a largo plazo.',
      status: 'Activa', // Activa, Aprobada, Rechazada
      votesFor: 500000,
      votesAgainst: 100000,
      ends: '2025-07-30',
      voted: null, // 'for', 'against', null
    },
    {
      id: 2,
      title: 'Integración de un Bridge Cross-Chain',
      description: 'Propuesta para financiar el desarrollo y la implementación de un bridge para permitir la transferencia de $HGP a otra blockchain principal (ej. Polygon o Arbitrum).',
      status: 'Activa',
      votesFor: 300000,
      votesAgainst: 5000,
      ends: '2025-08-15',
      voted: null,
    },
    {
      id: 3,
      title: 'Lanzamiento de la Serie NFT "HighPower Legends"',
      description: 'Esta propuesta es para destinar fondos de la tesorería de la DAO para desarrollar y lanzar una nueva colección de NFTs de edición limitada con utilidades exclusivas.',
      status: 'Aprobada',
      votesFor: 750000,
      votesAgainst: 25000,
      ends: '2025-06-01',
      voted: 'for',
    },
  ]);

  // Función simulada para crear una propuesta
  const handleCreateProposal = useCallback(async () => {
    if (!isConnected || !address) {
      showCustomModal("Por favor, conecta tu billetera para crear una propuesta.");
      return;
    }
    if (!proposalTitle || !proposalDescription) {
      showCustomModal("Por favor, rellena el título y la descripción de la propuesta.");
      return;
    }

    showCustomModal("Enviando propuesta a la DAO (simulado)...");
    try {
      const tx = await mockCreateProposal();
      console.log("Transacción de creación de propuesta simulada enviada:", tx.hash);
      showCustomModal(`Propuesta enviada: ${tx.hash.substring(0, 10)}... Confirmando...`);

      setTimeout(() => {
        const newProposal = {
          id: proposals.length + 1,
          title: proposalTitle,
          description: proposalDescription,
          status: 'Activa',
          votesFor: 0,
          votesAgainst: 0,
          ends: '2025-09-30', // Fecha simulada
          voted: null,
        };
        setProposals(prev => [...prev, newProposal]);
        setProposalTitle('');
        setProposalDescription('');
        showCustomModal("¡Propuesta creada con éxito! (Simulado)");
        setActiveTab('proposals'); // Volver a la lista de propuestas
      }, 3000);
    } catch (error) {
      console.error("Error al crear propuesta simulada:", error);
      showCustomModal(`Error al crear propuesta: ${error.message || "Transacción rechazada."}`);
    }
  }, [isConnected, address, proposalTitle, proposalDescription, showCustomModal, mockCreateProposal, proposals.length]);

  // Función simulada para votar
  const handleVote = useCallback(async (proposalId, voteType) => {
    if (!isConnected || !address) {
      showCustomModal("Por favor, conecta tu billetera para votar.");
      return;
    }

    // Verificar si ya ha votado
    const proposal = proposals.find(p => p.id === proposalId);
    if (proposal && proposal.voted) {
        showCustomModal(`Ya has votado en esta propuesta.`);
        return;
    }
    if (proposal && proposal.status !== 'Activa') {
        showCustomModal(`No se puede votar en una propuesta que no está activa.`);
        return;
    }

    showCustomModal(`Votando "${voteType}" en la propuesta #${proposalId} (simulado)...`);
    try {
      const tx = await mockVoteProposal();
      console.log("Transacción de votación simulada enviada:", tx.hash);
      showCustomModal(`Voto enviado: ${tx.hash.substring(0, 10)}... Confirmando...`);

      setTimeout(() => {
        setProposals(prev =>
          prev.map(p =>
            p.id === proposalId
              ? {
                  ...p,
                  votesFor: voteType === 'for' ? p.votesFor + 1000 : p.votesFor, // Simular votos
                  votesAgainst: voteType === 'against' ? p.votesAgainst + 1000 : p.votesAgainst,
                  voted: voteType,
                }
              : p
          )
        );
        showCustomModal(`¡Voto "${voteType}" registrado en propuesta #${proposalId}! (Simulado)`);
      }, 3000);
    } catch (error) {
      console.error("Error al votar en propuesta simulada:", error);
      showCustomModal(`Error al votar: ${error.message || "Transacción rechazada."}`);
    }
  }, [isConnected, address, showCustomModal, mockVoteProposal, proposals]);

  const getVoteStatus = (proposal) => {
      if (proposal.voted === 'for') return 'Votaste A FAVOR';
      if (proposal.voted === 'against') return 'Votaste EN CONTRA';
      return 'No has votado';
  };

  return (
    <section id="dao" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-8 text-center border-2 border-[var(--primary-purple)]">
      <h2 className="text-4xl font-bold text-[var(--primary-purple)] mb-6">Gobernanza Descentralizada (DAO)</h2>
      <p className="text-[var(--light-gray-text)] text-lg mb-8">
        Tu voz importa. Participa en las decisiones clave del futuro de HighPower votando en las propuestas.
      </p>

      {/* Pestañas de navegación */}
      <div className="flex justify-center mb-8 bg-gray-900 p-2 rounded-full shadow-inner border border-gray-700">
        <button
          className={`py-2 px-6 rounded-full font-semibold transition-all duration-300 
                      ${activeTab === 'proposals' ? 'bg-[var(--primary-purple)] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('proposals')}
        >
          Propuestas
        </button>
        <button
          className={`py-2 px-6 rounded-full font-semibold transition-all duration-300 
                      ${activeTab === 'create-proposal' ? 'bg-[var(--primary-purple)] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('create-proposal')}
        >
          Crear Propuesta
        </button>
        {isConnected && (
            <button
                className={`py-2 px-6 rounded-full font-semibold transition-all duration-300 
                            ${activeTab === 'my-votes' ? 'bg-[var(--primary-purple)] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('my-votes')}
            >
                Mis Votos
            </button>
        )}
      </div>

      {!isConnected && (
        <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-red-500 text-center">
          <p className="text-red-400 text-xl font-semibold">
            ¡Conecta tu billetera para participar en la Gobernanza!
          </p>
        </div>
      )}

      {isConnected && (
        <>
          {activeTab === 'proposals' && (
            <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-[var(--secondary-blue)]">
              <h3 className="text-3xl font-bold text-[var(--off-white)] mb-6">Propuestas de Gobernanza Activas y Pasadas</h3>
              <p className="text-gray-400 mb-6">Vota en las decisiones que moldearán el futuro de HighPower.</p>
              <div className="grid grid-cols-1 gap-6">
                {proposals.length > 0 ? (
                  proposals.map(proposal => (
                    <div key={proposal.id} className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700 text-left">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-2xl font-semibold text-[var(--accent-green)]">{proposal.title}</h4>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold 
                          ${proposal.status === 'Activa' ? 'bg-blue-600 text-white' : 
                             proposal.status === 'Aprobada' ? 'bg-green-600 text-white' : 
                             'bg-red-600 text-white'}`}>
                          {proposal.status}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">{proposal.description}</p>
                      <div className="flex justify-between items-center text-gray-500 text-sm mb-4">
                        <span>Termina: {proposal.ends}</span>
                        {proposal.status === 'Activa' && <span className="text-[var(--accent-yellow)] font-semibold">{getVoteStatus(proposal)}</span>}
                      </div>
                      <div className="mb-4">
                          <p className="text-[var(--off-white)] font-bold">Votos a favor: <span className="text-green-400">{proposal.votesFor.toLocaleString()}</span></p>
                          <p className="text-[var(--off-white)] font-bold">Votos en contra: <span className="text-red-400">{proposal.votesAgainst.toLocaleString()}</span></p>
                      </div>
                      {proposal.status === 'Activa' && !proposal.voted && (
                        <div className="flex space-x-4">
                          <button
                            onClick={() => handleVote(proposal.id, 'for')}
                            disabled={isMinting || isConfirming}
                            className={`flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center justify-center
                                        ${isMinting || isConfirming ? 'opacity-70 cursor-not-allowed' : ''}`}
                          >
                            <i className="fas fa-thumbs-up mr-2"></i> {isMinting || isConfirming ? 'Votando...' : 'Votar A Favor'}
                          </button>
                          <button
                            onClick={() => handleVote(proposal.id, 'against')}
                            disabled={isMinting || isConfirming}
                            className={`flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center justify-center
                                        ${isMinting || isConfirming ? 'opacity-70 cursor-not-allowed' : ''}`}
                          >
                            <i className="fas fa-thumbs-down mr-2"></i> {isMinting || isConfirming ? 'Votando...' : 'Votar En Contra'}
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500">No hay propuestas de gobernanza disponibles en este momento.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'create-proposal' && (
            <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-[var(--accent-green)]">
              <h3 className="text-3xl font-bold text-[var(--off-white)] mb-6">Crear Nueva Propuesta de Gobernanza</h3>
              <p className="text-gray-400 mb-6">
                Envía tu propuesta para el ecosistema HighPower. Requiere poseer tokens $HGP para someterla a votación.
              </p>
              <div className="flex flex-col space-y-4">
                <input
                  type="text"
                  placeholder="Título de la propuesta"
                  value={proposalTitle}
                  onChange={(e) => setProposalTitle(e.target.value)}
                  className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-purple-500"
                />
                <textarea
                  placeholder="Descripción detallada de la propuesta..."
                  value={proposalDescription}
                  onChange={(e) => setProposalDescription(e.target.value)}
                  rows="6"
                  className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-purple-500 resize-y"
                ></textarea>
                <button
                  onClick={handleCreateProposal}
                  disabled={isMinting || isConfirming || !proposalTitle || !proposalDescription}
                  className={`bg-[var(--accent-green)] hover:bg-[var(--secondary-blue)] text-[var(--dark-gray)] font-bold py-3 px-8 rounded-full text-xl
                             transition duration-300 ease-in-out transform hover:scale-105 shadow-xl flex items-center justify-center
                             ${isMinting || isConfirming || !proposalTitle || !proposalDescription ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isMinting || isConfirming ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-lightbulb mr-3"></i>}
                  {isMinting ? 'Enviando...' : isConfirming ? 'Confirmando...' : 'Crear Propuesta'}
                </button>
              </div>
            </div>
          )}

          {isConnected && activeTab === 'my-votes' && (
            <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-[var(--accent-yellow)]">
              <h3 className="text-3xl font-bold text-[var(--off-white)] mb-6">Mis Votos Registrados</h3>
              <p className="text-gray-400 mb-6">Un registro de todas las propuestas en las que has participado.</p>
              <div className="grid grid-cols-1 gap-6">
                  {proposals.filter(p => p.voted).length > 0 ? (
                      proposals.filter(p => p.voted).map(proposal => (
                          <div key={proposal.id} className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700 text-left">
                              <div className="flex justify-between items-center mb-2">
                                  <h4 className="text-2xl font-semibold text-[var(--accent-green)]">{proposal.title}</h4>
                                  <span className={`px-3 py-1 rounded-full text-sm font-bold 
                                    ${proposal.voted === 'for' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                                    {getVoteStatus(proposal)}
                                  </span>
                              </div>
                              <p className="text-gray-400 text-sm italic">"{proposal.description.substring(0, 100)}..."</p>
                              <div className="mt-4 text-gray-500 text-sm">
                                  <span>Votos A Favor: <span className="text-green-400">{proposal.votesFor.toLocaleString()}</span></span>
                                  <span className="ml-4">Votos En Contra: <span className="text-red-400">{proposal.votesAgainst.toLocaleString()}</span></span>
                              </div>
                          </div>
                      ))
                  ) : (
                      <p className="col-span-full text-center text-gray-500">Aún no has votado en ninguna propuesta.</p>
                  )}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default DaoSection;
