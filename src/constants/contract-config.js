// src/constants/contract-config.js

// Importa los ABIs de tus contratos.
// Asegúrate de que estos archivos JSON existan en tu carpeta src/abis/
import SimpleTokenABI from '../abis/SimpleToken.json';        // ABI de tu token HGP
// import MyNFTABI from '../abis/MyNFT.json';                    // ABI de tu contrato NFT (mantener si usas NFTs)
// import HighPowerStakingABI from '../abis/HighPowerStaking.json'; // Reemplazado por ABI inline real del contrato
// import HighPowerLPFarmingABI from '../abis/HighPowerLPFarming.json'; // Reemplazado por ABI inline real del contrato
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

// =========================================================================
// !!! CRÍTICO: LP_TOKEN_CONTRACT_ADDRESS para tu pool HGP/WBNB en BSC Testnet !!!
// Esta dirección proviene del análisis de tu transacción: 0x5dfce39e3ad3b346ebae1411f90b24d412a9dcf096642f2b48a4238e53338cc7
export const LP_TOKEN_CONTRACT_ADDRESS = "0x66c729c1535e61d8a9e4726487e4125b292e0717";

// Dirección del WBNB Token en BSC Testnet (Wrapped BNB) - Aunque se usa BNB nativo en la UI de PancakeSwap, el pool es WBNB
export const WBNB_TESTNET_ADDRESS = "0xae13d989daC2f0dEgXbEa39D53dE0b2C9fB93C53";

// PancakeSwap V2 Router Address para BSC Testnet (usado para swaps)
export const PANCAKE_ROUTER_V2_ADDRESS = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5d5";


// =========================================================================
// ABIs y Configuración de Contratos para Wagmi (con ABI y Dirección)
// =========================================================================

export const HGP_TOKEN_CONFIG = {
  address: HGP_TOKEN_CONTRACT_ADDRESS,
  abi: SimpleTokenABI.abi,
};

export const NFT_CONTRACT_CONFIG = {
  address: MY_NFT_CONTRACT_ADDRESS,
  // Asegúrate de que el ABI de MyNFT.json exista y sea correcto si lo estás utilizando
  abi: [
    {"inputs": [], "stateMutability": "nonpayable", "type": "constructor"},
    {"anonymous": false, "inputs": [{"indexed": true, "internalType": "address", "name": "owner", "type": "address"}, {"indexed": true, "internalType": "address", "name": "approved", "type": "address"}, {"indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256"}], "name": "Approval", "type": "event"},
    {"anonymous": false, "inputs": [{"indexed": true, "internalType": "address", "name": "owner", "type": "address"}, {"indexed": true, "internalType": "address", "name": "operator", "type": "address"}, {"indexed": false, "internalType": "bool", "name": "approved", "type": "bool"}], "name": "ApprovalForAll", "type": "event"},
    {"anonymous": false, "inputs": [{"indexed": true, "internalType": "address", "name": "from", "type": "address"}, {"indexed": true, "internalType": "address", "name": "to", "type": "address"}, {"indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256"}], "name": "Transfer", "type": "event"},
    {"inputs": [{"internalType": "address", "name": "to", "type": "address"}, {"internalType": "uint256", "name": "tokenId", "type": "uint256"}], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function"},
    {"inputs": [{"internalType": "address", "name": "owner", "type": "address"}], "name": "balanceOf", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
    {"inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}], "name": "getApproved", "outputs": [{"internalType": "address", "name": "", "type": "address"}], "stateMutability": "view", "type": "function"},
    {"inputs": [{"internalType": "address", "name": "owner", "type": "address"}, {"internalType": "address", "name": "operator", "type": "address"}], "name": "isApprovedForAll", "outputs": [{"internalType": "bool", "name": "", "type": "bool"}], "stateMutability": "view", "type": "function"},
    {"inputs": [{"internalType": "address", "name": "to", "type": "address"}], "name": "mint", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "nonpayable", "type": "function"},
    {"inputs": [], "name": "name", "outputs": [{"internalType": "string", "name": "", "type": "string"}], "stateMutability": "view", "type": "function"},
    {"inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}], "name": "ownerOf", "outputs": [{"internalType": "address", "name": "", "type": "address"}], "stateMutability": "view", "type": "function"},
    {"inputs": [{"internalType": "address", "name": "from", "type": "address"}, {"internalType": "address", "name": "to", "type": "address"}, {"internalType": "uint256", "name": "tokenId", "type": "uint256"}], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function"},
    {"inputs": [{"internalType": "address", "name": "from", "type": "address"}, {"internalType": "address", "name": "to", "type": "address"}, {"internalType": "uint256", "name": "tokenId", "type": "uint256"}, {"internalType": "bytes", "name": "data", "type": "bytes"}], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function"},
    {"inputs": [{"internalType": "address", "name": "operator", "type": "address"}, {"internalType": "bool", "name": "approved", "type": "bool"}], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function"},
    {"inputs": [{"internalType": "bytes4", "name": "interfaceId", "type": "bytes4"}], "name": "supportsInterface", "outputs": [{"internalType": "bool", "name": "", "type": "bool"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "symbol", "outputs": [{"internalType": "string", "name": "", "type": "string"}], "stateMutability": "view", "type": "function"},
    {"inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}], "name": "tokenURI", "outputs": [{"internalType": "string", "name": "", "type": "string"}], "stateMutability": "view", "type": "function"},
    {"inputs": [{"internalType": "address", "name": "from", "type": "address"}, {"internalType": "address", "name": "to", "type": "address"}, {"internalType": "uint256", "name": "tokenId", "type": "uint256"}], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function"}
  ]
};

// ABI de HighPowerStaking.sol (copiado de tu ABI real)
export const STAKING_CONTRACT_CONFIG = {
  address: STAKING_CONTRACT_ADDRESS,
  abi: [
    {
      "inputs": [
        { "internalType": "contract IERC20", "name": "_hgpTokenAddress", "type": "address" },
        { "internalType": "uint256", "name": "_initialRewardRate", "type": "uint256" }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "oldRate", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "newRate", "type": "uint256" }], "name": "RewardRateUpdated", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "RewardsClaimed", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "funder", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "RewardsFunded", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Staked", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Unstaked", "type": "event" },
    { "inputs": [], "name": "claimRewards", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "earned", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "fundRewards", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "hgpToken", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "lastUpdateTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "rewardPerTokenStored", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "rewardRate", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "rewards", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "_newRate", "type": "uint256" }], "name": "setRewardRate", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "stake", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "stakedAmount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "totalStaked", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "unstake", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "userRewardPerTokenPaid", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "contract IERC20", "name": "_token", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "withdrawAccidentalTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
  ],
};

// ABI de HighPowerLPFarming.sol (copiado de tu ABI real)
export const LP_FARMING_CONTRACT_CONFIG = {
  address: LP_FARMING_CONTRACT_ADDRESS,
  abi: [
    {
      "inputs": [
        { "internalType": "address", "name": "_lpTokenAddress", "type": "address" },
        { "internalType": "address", "name": "_rewardTokenAddress", "type": "address" },
        { "internalType": "uint256", "name": "_initialRewardRate", "type": "uint256" }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "EmergencyWithdrawal", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "LPStaked", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "LPUnstaked", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "newRate", "type": "uint256" }], "name": "RewardRateUpdated", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "RewardsClaimed", "type": "event" },
    { "inputs": [], "name": "claimRewards", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "_account", "type": "address" }], "name": "earned", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "emergencyWithdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "lastUpdateTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "lpToken", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "rewardPerTokenStored", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "rewardRate", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "rewardToken", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "_newRate", "type": "uint256" }], "name": "setRewardRate", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "stakeLP", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "totalLPStaked", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "unstakeLP", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "updateRewardPerToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "userLPStaked", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "userRewardPerTokenPaid", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "userRewards", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
  ],
};


// ABI de LP Token (PancakeSwap V2 Pair ABI, funciones relevantes)
export const LP_TOKEN_CONFIG = {
  address: LP_TOKEN_CONTRACT_ADDRESS,
  abi: [
    // Función balanceOf del contrato LP Token
    {
      "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
      "name": "balanceOf",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    // Función allowance del contrato LP Token
    {
      "inputs": [{"internalType": "address", "name": "owner", "type": "address"}, {"internalType": "address", "name": "spender", "type": "address"}],
      "name": "allowance",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    // Función approve del contrato LP Token
    {
      "inputs": [{"internalType": "address", "name": "spender", "type": "address"}, {"internalType": "uint256", "name": "value", "type": "uint256"}],
      "name": "approve",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
};

// ABI del contrato PancakeSwap V2 Pair (minimalista para getReserves y Swap event)
export const PANCAKE_PAIR_ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "getReserves",
    "outputs": [
      {"internalType":"uint112","name":"_reserve0","type":"uint112"},
      {"internalType":"uint112","name":"_reserve1","type":"uint112"},
      {"internalType":"uint32","name":"_blockTimestampLast","type":"uint32"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed":true,"internalType":"address","name":"sender","type":"address"},
      {"indexed":false,"internalType":"uint256","name":"amount0In","type":"uint256"},
      {"indexed":false,"internalType":"uint256","name":"amount1In","type":"uint256"},
      {"indexed":false,"internalType":"uint256","name":"amount0Out","type":"uint256"},
      {"indexed":false,"internalType":"uint256","name":"amount1Out","type":"uint256"},
      {"indexed":true,"internalType":"address","name":"to","type":"address"}
    ],
    "name": "Swap",
    "type": "event"
  }
];

// ABI minimalista del PancakeSwap V2 Router para trading
export const PANCAKE_ROUTER_V2_ABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "amountOutMin", "type": "uint256"}, {"internalType": "address[]", "name": "path", "type": "address[]"}, {"internalType": "address", "name": "to", "type": "address"}, {"internalType": "uint256", "name": "deadline", "type": "uint256"}],
    "name": "swapExactETHForTokens",
    "outputs": [{"internalType": "uint256[]", "name": "amounts", "type": "uint256[]"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "amountIn", "type": "uint256"}, {"internalType": "uint256", "name": "amountOutMin", "type": "uint256"}, {"internalType": "address[]", "name": "path", "type": "address[]"}, {"internalType": "address", "name": "to", "type": "address"}, {"internalType": "uint256", "name": "deadline", "type": "uint256"}],
    "name": "swapExactTokensForTokens",
    "outputs": [{"internalType": "uint256[]", "name": "amounts", "type": "uint256[]"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "amountOut", "type": "uint256"}, {"internalType": "uint256", "name": "amountInMax", "type": "uint256"}, {"internalType": "address[]", "name": "path", "type": "address[]"}, {"internalType": "address", "name": "to", "type": "address"}, {"internalType": "uint256", "name": "deadline", "type": "uint256"}],
    "name": "swapTokensForExactTokens",
    "outputs": [{"internalType": "uint256[]", "name": "amounts", "type":"uint256[]"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "amountIn", "type": "uint256"}, {"internalType": "address[]", "name": "path", "type": "address[]"}],
    "name": "getAmountsOut",
    "outputs": [{"internalType": "uint256[]", "name": "amounts", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "amountOut", "type": "uint256"}, {"internalType": "address[]", "name": "path", "type": "address[]"}],
    "name": "getAmountsIn",
    "outputs": [{"internalType": "uint256[]", "name": "amounts", "type":"uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// CONFIGURACIÓN DEL DAO - Mantenida para evitar errores de importación en la DApp
export const DAO_CONTRACT_CONFIG = {
  address: DAO_CONTRACT_ADDRESS,
  abi: SimpleCustomDAOABI.abi,
};

// =========================================================================
// Otras Constantes Específicas de la UI
// =========================================================================

export const SIMULATED_APR_PERCENTAGE = 25; // APR de ejemplo para el Staking de HGP
export const SIMULATED_LP_FARMING_APR_PERCENTAGE = 75; // APR de ejemplo para LP Farming
export const UI_PROPOSAL_THRESHOLD_HGP = 1000; // Umbral de creación de propuesta para el DAO (UI)
