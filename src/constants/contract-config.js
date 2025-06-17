// src/constants/contract-config.js

// Importa los ABIs de tus contratos.
// Asegúrate de que estos archivos JSON existan en tu carpeta src/abis/
import SimpleTokenABI from '../abis/SimpleToken.json';      // ABI de tu token HGP
import MyNFTABI from '../abis/MyNFT.json';                  // ABI de tu contrato NFT
import HighPowerStakingABI from '../abis/HighPowerStaking.json'; // ABI de tu contrato de Staking
import SimpleCustomDAOABI from '../abis/SimpleCustomDAO.json'; // ABI de tu contrato DAO simplificado

// =========================================================================
// Direcciones de Contrato (BNB Smart Chain Testnet)
// ¡Tus direcciones RECOLECTADAS del despliegue!
// =========================================================================

export const HGP_ERC20_ADDRESS = '0x03Fd2cE62B4BB54f09716f9588A5E13bC0756773';
export const HPNFT_ERC721_ADDRESS = '0x11Cae128d6AD9A00ceAF179171321F2E0abE30a8';
export const HGP_STAKING_ADDRESS = '0xdB3BCACeE4E141AC8161d67063B8CA3071d13175';
export const HGP_DAO_ADDRESS = '0xeD255F622159ae2c515e7Ae10dc8d7f344aC2A88';


// =========================================================================
// Configuración de Contratos para Wagmi (con ABI y Dirección)
// =========================================================================

export const HGP_TOKEN_CONFIG = {
  address: HGP_ERC20_ADDRESS,
  abi: SimpleTokenABI.abi, // Accede a la propiedad 'abi' del objeto JSON
};

export const NFT_CONTRACT_CONFIG = {
  address: HPNFT_ERC721_ADDRESS,
  abi: MyNFTABI.abi, // Accede a la propiedad 'abi'
};

export const STAKING_CONTRACT_CONFIG = {
  address: HGP_STAKING_ADDRESS,
  abi: HighPowerStakingABI.abi, // Accede a la propiedad 'abi'
};

export const DAO_CONTRACT_CONFIG = {
  address: HGP_DAO_ADDRESS,
  abi: SimpleCustomDAOABI.abi, // Accede a la propiedad 'abi'
};

// =========================================================================
// Otras Constantes Específicas de la UI
// =========================================================================

export const SIMULATED_APR_PERCENTAGE = 25; // APR de ejemplo para la UI (se mantiene simulado por ahora)
export const UI_PROPOSAL_THRESHOLD_HGP = 1000; // Umbral de creación de propuesta para el DAO (UI)
