import React, { useState, useEffect } from "react";
import { parseUnits, formatUnits } from "viem";
import { useAccount, useBalance, usePublicClient, useWalletClient, useChainId } from "wagmi";
import toast, { Toaster } from "react-hot-toast";
import {
  HGP_TOKEN_CONTRACT_ADDRESS,
  HGP_TOKEN_CONFIG,
  PANCAKE_ROUTER_V2_ADDRESS,
  PANCAKE_ROUTER_V2_ABI,
  WBNB_TESTNET_ADDRESS,
} from "../constants/contract-config.js";

// Parámetros
const HGP_DECIMALS = 18;
const BNB_DECIMALS = 18;
const DEADLINE_MINUTES = 15; // Tiempo máximo tx

export default function SwapSection({
  hgpBalance,
  formattedHgpBalance,
  bnbBalance,
  formattedBNBBalance,
  isConnected,
  userAddress,
  refetchHGPBalance,
  refetchBNBBalance,
}) {
  const [amountIn, setAmountIn] = useState("");
  const [estimatedOut, setEstimatedOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // wagmi v2 hooks
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();

  // ========== PATH de swap: BNB -> HGP ==========
  const path = [WBNB_TESTNET_ADDRESS, HGP_TOKEN_CONTRACT_ADDRESS];

  // ========== Cálculo en tiempo real (getAmountsOut) ==========
  useEffect(() => {
    const fetchAmountsOut = async () => {
      setError("");
      setEstimatedOut("");
      if (!amountIn || isNaN(Number(amountIn)) || Number(amountIn) <= 0) {
        setEstimatedOut("");
        return;
      }
      try {
        const result = await publicClient.readContract({
          address: PANCAKE_ROUTER_V2_ADDRESS,
          abi: PANCAKE_ROUTER_V2_ABI,
          functionName: "getAmountsOut",
          args: [parseUnits(amountIn, BNB_DECIMALS), path],
        });
        setEstimatedOut(formatUnits(result[1], HGP_DECIMALS));
      } catch (err) {
        setEstimatedOut("");
        setError("No hay liquidez suficiente o error al simular el swap.");
      }
    };
    fetchAmountsOut();
    // eslint-disable-next-line
  }, [amountIn, isConnected]);

  // ========== Ejecutar el Swap ==========
  const handleSwap = async () => {
    setLoading(true);
    setError("");
    setSuccessMsg("");
    setTxHash("");
    try {
      if (!isConnected || !walletClient) throw new Error("Conecta tu wallet.");
      if (!amountIn || isNaN(Number(amountIn)) || Number(amountIn) <= 0) throw new Error("Ingresa un monto válido.");
      if (Number(amountIn) > Number(formattedBNBBalance)) throw new Error("Saldo insuficiente.");

      // Calcular amountOutMin respetando slippage
      const result = await publicClient.readContract({
        address: PANCAKE_ROUTER_V2_ADDRESS,
        abi: PANCAKE_ROUTER_V2_ABI,
        functionName: "getAmountsOut",
        args: [parseUnits(amountIn, BNB_DECIMALS), path],
      });
      const rawAmountOut = result[1]; // [BNB-in, HGP-out]
      const slippageFrac = (100 - Number(slippage)) / 100;
      const amountOutMin = BigInt(
        BigInt(rawAmountOut) * BigInt(Math.floor(slippageFrac * 10000)) / BigInt(10000)
      );

      // Deadline
      const deadline = Math.floor(Date.now() / 1000) + DEADLINE_MINUTES * 60;

      // Ejecutar swapExactETHForTokens
      const tx = await walletClient.writeContract({
        address: PANCAKE_ROUTER_V2_ADDRESS,
        abi: PANCAKE_ROUTER_V2_ABI,
        functionName: "swapExactETHForTokens",
        args: [
          amountOutMin,
          path,
          address,
          deadline
        ],
        value: parseUnits(amountIn, BNB_DECIMALS),
        chainId,
        account: address,
      });

      setTxHash(tx);
      toast("Transacción enviada. Esperando confirmación...");
      await publicClient.waitForTransactionReceipt({ hash: tx });
      setSuccessMsg("Swap realizado con éxito.");
      refetchHGPBalance?.();
      refetchBNBBalance?.();
    } catch (err) {
      setError(err.shortMessage || err.message || "Error al hacer swap.");
    } finally {
      setLoading(false);
    }
  };

  // ========== UI ==========
  return (
    <section id="swap" className="p-8 bg-[var(--dark-gray)] rounded-3xl shadow-xl space-y-6 border-2 border-[var(--primary-purple)] max-w-xl mx-auto">
      <Toaster position="top-right" />
      <h2 className="text-4xl font-bold text-[var(--accent-green)] mb-6 flex items-center gap-3">
        <i className="fa fa-sync-alt" /> Swap $HGP
        <span className="ml-auto text-base font-normal bg-[var(--primary-purple)]/70 px-3 py-1 rounded-full">Testnet</span>
      </h2>
      {/* Balances */}
      {isConnected && (
        <div className="flex flex-wrap gap-4 items-center bg-[var(--primary-purple)]/10 p-4 rounded-lg mb-4">
          <div>
            <span className="font-semibold text-[var(--accent-yellow)]">Wallet:</span>
            <span className="ml-2 text-[var(--off-white)]">{userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}</span>
          </div>
          <div>
            <span className="font-semibold text-[var(--accent-yellow)]">BNB:</span>
            <span className="ml-1 text-[var(--off-white)]">{formattedBNBBalance ?? '0.0'}</span>
          </div>
          <div>
            <span className="font-semibold text-[var(--accent-yellow)]">HGP:</span>
            <span className="ml-1 text-[var(--off-white)]">{formattedHgpBalance ?? '0.0'}</span>
          </div>
        </div>
      )}

      {/* Swap UI */}
      <div className="bg-[var(--dark-gray)] p-6 rounded-2xl shadow-md border border-[var(--accent-green)]">
        <label className="block text-lg font-bold mb-2">Cantidad a intercambiar:</label>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="number"
            min="0"
            value={amountIn}
            onChange={e => setAmountIn(e.target.value)}
            placeholder="Ej: 1"
            className="shadow border rounded py-3 px-4 w-full text-xl bg-[var(--off-white)] text-[var(--dark-gray)]"
            disabled={loading}
          />
          <button
            className="bg-[var(--primary-purple)] text-white px-3 py-2 rounded font-bold"
            onClick={() => setAmountIn(formattedBNBBalance)}
            type="button"
            disabled={loading || !formattedBNBBalance}
          >
            Max
          </button>
          <span className="ml-2 font-semibold text-[var(--accent-yellow)]">BNB</span>
        </div>

        <div className="text-center my-4">
          <span className="text-[var(--secondary-blue)] text-4xl">↓</span>
        </div>

        <label className="block text-lg font-bold mb-2">Recibirás (estimado):</label>
        <input
          type="text"
          value={estimatedOut}
          readOnly
          placeholder="Calculando..."
          className="shadow border rounded py-3 px-4 w-full text-xl bg-gray-300 cursor-not-allowed text-[var(--dark-gray)]"
        />
        <span className="ml-2 font-semibold text-[var(--accent-green)]">$HGP</span>

        {/* Slippage */}
        <div className="my-4 flex items-center gap-2">
          <label className="font-bold">Slippage:</label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            max="5"
            value={slippage}
            onChange={e => setSlippage(e.target.value)}
            className="w-16 text-center rounded border px-2 py-1"
            disabled={loading}
          />
          <span>%</span>
        </div>

        {error && <div className="text-red-400 mb-2">{error}</div>}
        {successMsg && <div className="text-green-400 mb-2">{successMsg}</div>}

        <button
          className="w-full bg-[var(--accent-green)] hover:bg-[var(--secondary-blue)] text-[var(--dark-gray)] font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md mt-4 disabled:opacity-70"
          disabled={!isConnected || !amountIn || loading}
          onClick={handleSwap}
          type="button"
        >
          {loading ? "Procesando..." : "Realizar Swap"}
        </button>
        {txHash && (
          <div className="mt-3 text-center">
            <a href={`https://testnet.bscscan.com/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
              Ver transacción en BscScan
            </a>
          </div>
        )}
      </div>
      {/* Gráfica y datos */}
      <div className="mt-6">
        <p className="text-base text-[var(--light-gray-text)] mb-2 opacity-90">
          *Precio y liquidez en tiempo real, powered by PancakeSwap Testnet.*
        </p>
        <div className="h-64 bg-[var(--primary-purple)] rounded-lg flex items-center justify-center text-[var(--off-white)] opacity-70">
          [Embed TradingView / DEXTools / Poocoin aquí]
        </div>
      </div>
      {/* Footer legal y auditoría */}
      <div className="mt-8 flex flex-col gap-2 items-center text-sm text-[var(--light-gray-text)] opacity-70">
        <span>
          <i className="fa fa-shield-alt text-[var(--accent-green)] mr-2" />
          Smart contract audit:{" "}
          <a href="/audit-security" className="underline text-[var(--accent-yellow)]">ver auditoría</a>
        </span>
        <span>
          <i className="fa fa-info-circle mr-2" />
          Usa bajo tu propio riesgo. Protocolo auditado, pero DeFi implica riesgos.
        </span>
      </div>
    </section>
  );
}
