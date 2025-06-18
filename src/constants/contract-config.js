// Importa los ABIs de tus contratos.
// (¡Asegúrate de que estos archivos JSON existan y estén bien formateados!)
import SimpleTokenABI from '../abis/SimpleToken.json'; // Token HGP
import MyNFTABI from '../abis/MyNFT.json'; // NFT
import HighPowerStakingABI from '../abis/HighPowerStaking.json'; // Staking
import HighPowerLPFarmingABI from '../abis/HighPowerLPFarming.json'; // LP Farming
import SimpleCustomDAOABI from '../abis/SimpleCustomDAO.json'; // DAO (simulado)

// ==================== DIRECCIONES ====================
export const HGP_TOKEN_CONTRACT_ADDRESS = "0x04D365F0790a6bF8c4E351ae257482dAE15f543b";
export const MY_NFT_CONTRACT_ADDRESS = "0x7c1D09621c8824f464403a1134e8B94dC5D338f6";
export const STAKING_CONTRACT_ADDRESS = "0xCA1FCC743c2Af6d3794C0024A52f8fef630A41F5";
export const LP_FARMING_CONTRACT_ADDRESS = "0xFfb788864c07f1dCA672ee3CA35e50CC111FCC44";
export const DAO_CONTRACT_ADDRESS = ""; // DAO no desplegado (simulado para la UI)
export const LP_TOKEN_CONTRACT_ADDRESS = "0x66c729c1535e61d8a9e4726487e4125b292e0717";
export const WBNB_TESTNET_ADDRESS = "0xae13d989daC2f0dEgXbEa39D53dE0b2C9fB93C53";
export const PANCAKE_ROUTER_V2_ADDRESS = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5d5";

// ==================== CONFIGURACIÓN DE CONTRATOS ====================
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

export const LP_FARMING_CONTRACT_CONFIG = {
  address: LP_FARMING_CONTRACT_ADDRESS,
  abi: HighPowerLPFarmingABI.abi,
};

export const LP_TOKEN_CONFIG = {
  address: LP_TOKEN_CONTRACT_ADDRESS,
  abi: [
    {
      "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
      "name": "balanceOf",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "owner", "type": "address" },
        { "internalType": "address", "name": "spender", "type": "address" }
      ],
      "name": "allowance",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "spender", "type": "address" },
        { "internalType": "uint256", "name": "value", "type": "uint256" }
      ],
      "name": "approve",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
};

export const PANCAKE_PAIR_ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "getReserves",
    "outputs": [
      { "internalType": "uint112", "name": "_reserve0", "type": "uint112" },
      { "internalType": "uint112", "name": "_reserve1", "type": "uint112" },
      { "internalType": "uint32", "name": "_blockTimestampLast", "type": "uint32" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "sender", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount0In", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "amount1In", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "amount0Out", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "amount1Out", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "to", "type": "address" }
    ],
    "name": "Swap",
    "type": "event"
  }
];

export const PANCAKE_ROUTER_V2_ABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" },
      { "internalType": "address[]", "name": "path", "type": "address[]" },
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "deadline", "type": "uint256" }
    ],
    "name": "swapExactETHForTokens",
    "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "amountIn", "type": "uint256" },
      { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" },
      { "internalType": "address[]", "name": "path", "type": "address[]" },
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "deadline", "type": "uint256" }
    ],
    "name": "swapExactTokensForTokens",
    "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "amountOut", "type": "uint256" },
      { "internalType": "uint256", "name": "amountInMax", "type": "uint256" },
      { "internalType": "address[]", "name": "path", "type": "address[]" },
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "deadline", "type": "uint256" }
    ],
    "name": "swapTokensForExactTokens",
    "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "amountIn", "type": "uint256" },
      { "internalType": "address[]", "name": "path", "type": "address[]" }
    ],
    "name": "getAmountsOut",
    "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "amountOut", "type": "uint256" },
      { "internalType": "address[]", "name": "path", "type": "address[]" }
    ],
    "name": "getAmountsIn",
    "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  }
];

// ============ CONFIGURACIÓN DEL DAO (SOLO PARA EVITAR ERRORES, NO USAR REALMENTE) ============
export const DAO_CONTRACT_CONFIG = {
  address: DAO_CONTRACT_ADDRESS,
  abi: SimpleCustomDAOABI.abi,
};

// ==================== OTRAS CONSTANTES UI ====================
export const SIMULATED_APR_PERCENTAGE = 25; // APR de ejemplo para el Staking de HGP
export const SIMULATED_LP_FARMING_APR_PERCENTAGE = 75; // APR de ejemplo para LP Farming
export const UI_PROPOSAL_THRESHOLD_HGP = 1000; // Umbral de creación de propuesta para el DAO (UI)
