// Stakes.tsx (relevant parts)
import { type Abi, formatUnits } from "viem";
import { useAccount, usePublicClient, useBlockNumber } from "wagmi";
import { useEffect, useState } from "react";
import {
  JUDGE_STAKING_ADDRESS,
  JUDGE_STAKING_ABI,
  JUDGE_TOKEN_ADDRESS,
  JUDGE_TOKEN_ABI,
} from "../config/contracts";

type UserStake = {
  id: bigint;
  amountStaked: bigint;
  lockUpPeriod: bigint;
  lockUpRatio: bigint;
  stakeWeight: bigint;
  depositBlockNumber: bigint;
  rewardDebt: bigint;
  bonusRewardDebt: bigint;
  maturityBlockNumber: bigint;
};

export function Stakes() {
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const [isOpen, setIsOpen] = useState(false);
  const [myStakes, setMyStakes] = useState<UserStake[]>([]);
  const [decimals, setDecimals] = useState<number>(18);
  const [pendingByIndex, setPendingByIndex] = useState<Record<number, bigint>>(
    {}
  );
  const [pendingErr, setPendingErr] = useState<Record<number, string>>({});
  const { data: blockNumber } = useBlockNumber({ watch: true });

  // 1) Load stakes & token decimals
  useEffect(() => {
    (async () => {
      if (!publicClient || !address) return;

      const [stakes, tokenDecimals] = await Promise.all([
        publicClient.readContract({
          address: JUDGE_STAKING_ADDRESS as `0x${string}`,
          abi: JUDGE_STAKING_ABI as Abi,
          functionName: "viewMyStakes",
          account: address,
        }) as Promise<UserStake[]>,
        publicClient.readContract({
          address: JUDGE_TOKEN_ADDRESS as `0x${string}`,
          abi: JUDGE_TOKEN_ABI as Abi,
          functionName: "decimals",
        }) as Promise<number | bigint>,
      ]);

      setMyStakes(stakes ?? []);
      setDecimals(Number(tokenDecimals ?? 18));
    })().catch(console.error);
  }, [address, publicClient]);

  // 2) Load pending rewards per *index* with correct sender
  useEffect(() => {
    (async () => {
      if (!publicClient || !address || !myStakes?.length) return;

      const entries = await Promise.all(
        myStakes.map(async (_stake, i) => {
          try {
            const res = await publicClient.readContract({
              address: JUDGE_STAKING_ADDRESS as `0x${string}`,
              abi: JUDGE_STAKING_ABI as Abi,
              functionName: "viewMyPendingRewards",
              args: [i], // ✅ index, not stake.id
              account: address, // ✅ msg.sender
            });
            return { i, ok: true as const, val: res as bigint };
          } catch (err: unknown) {
            let reason = "reverted";
            if (err && typeof err === "object") {
              const e = err as { shortMessage?: string; message?: string };
              reason = e.shortMessage ?? e.message ?? reason;
            }
            return { i, ok: false as const, reason };
          }
        })
      );

      const okMap: Record<number, bigint> = {};
      const errMap: Record<number, string> = {};
      entries.forEach((e) => {
        if (e.ok) okMap[e.i] = e.val;
        else errMap[e.i] = e.reason;
      });
      setPendingByIndex(okMap);
      setPendingErr(errMap);
    })().catch(console.error);
  }, [address, myStakes, publicClient]);

  // helper: withdrawable date from maturity vs current block
  const getWithdrawDate = (maturityBlock: bigint, currentBlock?: bigint) => {
    if (!currentBlock) return "…";
    if (maturityBlock === currentBlock) return "Now";
    const diff =
      maturityBlock > currentBlock
        ? maturityBlock - currentBlock
        : currentBlock - maturityBlock;
    const ms = Number(diff) * 12 * 1000; // approx 12s per block
    const d = new Date(Date.now() + (maturityBlock > currentBlock ? ms : -ms));
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <h2 className="flex justify-center item-center text-center text-2xl font-bold mt-4 mb-2 text-gray-800">
        Stakes Interaction
      </h2>
      <div
        className="flex-1 flex flex-col justify-center items-center rounded-2xl 
                      bg-gradient-to-r from-cyan-100 via-cyan-50 to-cyan-100 
                      dark:bg-none bg-white p-6 border-none"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-cyan-700 hover:bg-cyan-500 text-white rounded-full dark:bg-yellow-500 dark:hover:bg-yellow-400 
                     text-l"
        >
          VIEW STAKES
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-2xl shadow-lg relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-white mb-4">My Stakes</h2>

            <div className="space-y-4">
              {myStakes.map((stake, i) => (
                <details
                  key={stake.id.toString()}
                  className="bg-gray-800 rounded-xl p-4 text-sm"
                >
                  <summary className="cursor-pointer text-white font-semibold">
                    Stake ID: {stake.id.toString()}
                  </summary>
                  <div className="mt-3 space-y-2 text-gray-300">
                    <p>
                      <span className="font-semibold">Amount Staked:</span>{" "}
                      {formatUnits(stake.amountStaked, decimals)} JUDGE
                    </p>

                    <p>
                      <span className="font-semibold">Pending Rewards:</span>{" "}
                      {pendingErr[i]
                        ? "N/A (reverted)"
                        : pendingByIndex[i] !== undefined
                        ? `${formatUnits(pendingByIndex[i], decimals)} JUDGE`
                        : "…"}
                    </p>

                    <p>
                      <span className="font-semibold">Withdrawable From:</span>{" "}
                      {getWithdrawDate(stake.maturityBlockNumber, blockNumber)}
                    </p>

                    <div className="flex gap-2 pt-2">
                      <button
                        disabled
                        className="px-3 py-2 rounded bg-green-600 text-white disabled:opacity-60"
                      >
                        Claim Rewards
                      </button>
                      <button
                        disabled
                        className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
                      >
                        Withdraw
                      </button>
                      <button
                        disabled
                        className="px-3 py-2 rounded bg-amber-600 text-white disabled:opacity-60"
                      >
                        Early Withdraw
                      </button>
                      <button
                        disabled
                        className="px-3 py-2 rounded bg-purple-600 text-white disabled:opacity-60"
                      >
                        Withdraw All
                      </button>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
