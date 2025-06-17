// src/constants/contract-config.js

// Importa los ABIs de tus contratos.
// Asegúrate de que estos archivos JSON existan en tu carpeta src/abis/
import SimpleTokenABI from '../abis/SimpleToken.json';        // ABI de tu token HGP
import MyNFTABI from '../abis/MyNFT.json';                    // ABI de tu contrato NFT
import HighPowerStakingABI from '../abis/HighPowerStaking.json'; // ABI de tu contrato de Staking
import HighPowerLPFarmingABI from '../abis/HighPowerLPFarming.json'; // ABI de tu contrato de LP Farming (¡Importa el correcto!)
import SimpleCustomDAOABI from '../abis/SimpleCustomDAO.json'; // ABI de tu contrato DAO (para placeholder)

// =========================================================================
// Direcciones de Contrato (BNB Smart Chain Testnet)
// ¡Tus direcciones RECOLECTADAS del despliegue!
// =========================================================================

export const HGP_TOKEN_CONTRACT_ADDRESS = "0x04D365F0790a6bF8c4E351ae257482dAE15f543b";
export const MY_NFT_CONTRACT_ADDRESS = "0x7c1D09621c8824f464403a1134e8B94dC5D338f6";
export const STAKING_CONTRACT_ADDRESS = "0xCA1FCC743c2Af6d3794C0024A52f8fef630A41F5";
export const LP_FARMING_CONTRACT_ADDRESS = "0xFfb788864c07f1dCA672ee3CA35e50CC111FCC44";
export const DAO_CONTRACT_ADDRESS = ""; // DAO no desplegado en este intento.

// ¡NUEVO! Dirección del LP Token de PancakeSwap (el que obtuviste al añadir liquidez)
export const LP_TOKEN_CONTRACT_ADDRESS = "0x07ae57892b49bcca70635bd11d99bd77e77b99e2";

// =========================================================================
// Configuración de Contratos para Wagmi (con ABI y Dirección)
// =========================================================================

export const HGP_TOKEN_CONFIG = {
  address: HGP_TOKEN_CONTRACT_ADDRESS,
  abi: SimpleTokenABI.abi,
};

export const NFT_CONTRACT_CONFIG = {
  address: MY_NFT_CONTRACT_ADDRESS,
  abi: MyNFTABI.abi,
};

export const STAKING_CONTRACT_CONFIG = {
  address: STAKING_CONTRACT_ADDRESS,
  abi: HighPowerStakingABI.abi,
};

// ¡CORREGIDO! Ahora usa el ABI correcto para HighPowerLPFarming
export const LP_FARMING_CONTRACT_CONFIG = {
  address: LP_FARMING_CONTRACT_ADDRESS,
  abi: HighPowerLPFarmingABI.abi,
};

// ¡NUEVO! Configuración para el LP Token (usando un ABI ERC20 genérico solo para 'approve' y 'balanceOf')
export const LP_TOKEN_CONFIG = {
  address: LP_TOKEN_CONTRACT_ADDRESS,
  abi: [
    // Mínimo ABI para funciones básicas de ERC20
    {
      "constant": true,
      "inputs": [{"name":"_owner","type":"address"}],
      "name":"balanceOf",
      "outputs":[{"name":"balance","type":"uint256"}],
      "payable":false,
      "stateMutability":"view",
      "type":"function"
    },
    {
      "constant": true,
      "inputs": [
        {"name":"_owner","type":"address"},
        {"name":"_spender","type":"address"}
      ],
      "name":"allowance",
      "outputs":[{"name":"","type":"uint256"}],
      "payable":false,
      "stateMutability":"view",
      "type":"function"
    },
    {
      "constant": false,
      "inputs": [
        {"name":"_spender","type":"address"},
        {"name":"_value","type":"uint256"}
      ],
      "name":"approve",
      "outputs":[{"name":"","type":"bool"}],
      "payable":false,
      "stateMutability":"nonpayable",
      "type":"function"
    }
  ],
};


// CONFIGURACIÓN DEL DAO - Mantenida para evitar errores de importación en la DApp
export const DAO_CONTRACT_CONFIG = {
  address: DAO_CONTRACT_ADDRESS,
  abi: SimpleCustomDAOABI.abi,
};

// =========================================================================
// Otras Constantes Específicas de la UI
// =========================================================================

export const SIMULATED_APR_PERCENTAGE = 25; // APR de ejemplo para la UI (se mantiene simulado por ahora)
export const UI_PROPOSAL_THRESHOLD_HGP = 1000; // Umbral de creación de propuesta para el DAO (UI)
