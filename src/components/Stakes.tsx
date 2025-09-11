// Stakes.tsx (relevant parts)
import { type Abi, formatUnits } from "viem";
import {
  useAccount,
  useWriteContract,
  usePublicClient,
  useBlockNumber,
} from "wagmi";
import { useEffect, useState } from "react";
import {
  JUDGE_STAKING_ADDRESS,
  JUDGE_STAKING_ABI,
  JUDGE_TOKEN_ADDRESS,
  JUDGE_TOKEN_ABI,
} from "../config/contracts";
import { WithdrawalForm } from "./WithdrawalForm.tsx";
import { EarlyWithdrawalForm } from "./EarlyWithdrawForm.tsx";

type userStake = {
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
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const [isOpen, setIsOpen] = useState(false);
  const [myStakes, setMyStakes] = useState<userStake[]>([]);
  const [decimals, setDecimals] = useState<number>(18);
  const [pendingByIndex, setPendingByIndex] = useState<Record<number, bigint>>(
    {}
  );
  const [pendingErr, setPendingErr] = useState<Record<number, string>>({});
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [fadedButton, setFadedButton] = useState(false);
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
  const [isEarlyWithdrawalOpen, setIsEarlyWithdrawalOpen] = useState(false);
  const [selectedStakeIndex, setSelectedStakeIndex] = useState<number | null>(
    null
  );

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
        }) as Promise<userStake[]>,
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

  const getWithdrawTimestamp = (
    maturityBlock: bigint,
    currentBlock?: bigint
  ) => {
    if (!currentBlock) return null;
    const diff =
      maturityBlock > currentBlock ? maturityBlock - currentBlock : 0n; // if already matured, no wait
    const ms = Number(diff) * 12 * 1000; // approx 12s per block
    return Date.now() + ms;
  };

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

  const handleClaim = async (i: number) => {
    try {
      setLoadingMessage("Claim transaction in progress...");
      setFadedButton(true);
      const txHash = await writeContractAsync({
        address: JUDGE_STAKING_ADDRESS,
        abi: JUDGE_STAKING_ABI,
        functionName: "claimRewards",
        args: [i],
        account: address,
      });

      const receipt = await publicClient!.waitForTransactionReceipt({
        hash: txHash,
      });

      if (receipt.status === "success") {
        alert("Claim Successful✅");
      } else {
        alert("Claim Failed❌ (reverted on-chain)");
      }
    } catch (err) {
      console.error(err);
      alert("Claim Failed❌ (tx not sent or rejected)");
    } finally {
      setLoadingMessage(null);
      setFadedButton(false);
    }
  };

  const handleWithdrawAll = async (i: number) => {
    try {
      setLoadingMessage("Withdrawal transaction in progress...");
      setFadedButton(true);
      const txHash = await writeContractAsync({
        address: JUDGE_STAKING_ADDRESS,
        abi: JUDGE_STAKING_ABI,
        functionName: "withdrawAll",
        args: [i],
        account: address,
      });

      const receipt = await publicClient!.waitForTransactionReceipt({
        hash: txHash,
      });

      if (receipt.status === "success") {
        alert("Withdrawal Successful✅");
      } else {
        alert("Withdrawal Failed❌ (reverted on-chain)");
      }
    } catch (err) {
      console.error(err);
      alert("Withdrawal Failed❌ (tx not sent or rejected)");
    } finally {
      setLoadingMessage(null);
      setFadedButton(false);
    }
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
          <div className="bg-gray-900 rounded-2xl w-full max-w-2xl shadow-lg max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-700 top-0 bg-gray-900 z-10">
              <h2 className="text-xl font-bold text-white mb-4">My Stakes</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-white"
              >
                ✕
              </button>
            </div>
            {loadingMessage && (
              <div className="p-6 items-center justify-center">
                <p className="text-cyan-700 dark:text-yellow-400 font-semibold">
                  {loadingMessage}
                </p>
              </div>
            )}

            <div className="overflow-y-auto p-4 space-y-4">
              {myStakes.map((stake, i) => {
                const isMatured =
                  getWithdrawTimestamp(
                    stake.maturityBlockNumber,
                    blockNumber
                  )! <= Date.now();

                const isNotMatured =
                  getWithdrawTimestamp(
                    stake.maturityBlockNumber,
                    blockNumber
                  )! > Date.now();
                const isDisabled = !isMatured || fadedButton;
                const isDisabled2 = !isNotMatured || fadedButton;

                return (
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
                        {Math.floor(
                          Number(formatUnits(stake.amountStaked, decimals)) *
                            100
                        ) / 100}{" "}
                        JUDGE
                      </p>

                      <p>
                        <span className="font-semibold">Pending Rewards:</span>{" "}
                        {pendingErr[i]
                          ? "N/A (reverted)"
                          : pendingByIndex[i] !== undefined
                          ? `${
                              Math.floor(
                                Number(
                                  formatUnits(
                                    pendingByIndex[i],
                                    Number(decimals)
                                  )
                                ) * 100
                              ) / 100
                            } JUDGE`
                          : "…"}
                      </p>

                      <p>
                        <span className="font-semibold">
                          Withdrawable From:
                        </span>{" "}
                        {getWithdrawDate(
                          stake.maturityBlockNumber,
                          blockNumber
                        )}
                      </p>

                      <div className="flex gap-2 pt-2">
                        {!fadedButton ? (
                          <button
                            onClick={() => handleClaim(i)}
                            className="px-3 py-2 rounded bg-green-600 text-white"
                          >
                            Claim Rewards
                          </button>
                        ) : (
                          <button
                            disabled
                            className="px-3 py-2 rounded bg-green-600 text-white disabled:opacity-60 cursor-not-allowed"
                          >
                            Claim Rewards
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setSelectedStakeIndex(i);
                            setIsWithdrawalOpen(true);
                          }}
                          disabled={isDisabled}
                          className={`px-3 py-2 rounded text-white ${
                            isDisabled
                              ? "bg-blue-600 opacity-60 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-500"
                          }`}
                        >
                          Withdraw
                        </button>

                        <button
                          onClick={() => setIsEarlyWithdrawalOpen(true)}
                          disabled={isDisabled2}
                          className={`px-3 py-2 rounded text-white ${
                            isDisabled2
                              ? "bg-amber-600 opacity-60 cursor-not-allowed"
                              : "bg-amber-600 hover:bg-amber-500"
                          }`}
                        >
                          Early Withdraw
                        </button>
                        <button
                          onClick={() => handleWithdrawAll(i)}
                          disabled={isDisabled}
                          className={`px-3 py-2 rounded text-white ${
                            isDisabled
                              ? "bg-purple-600 opacity-60 cursor-not-allowed"
                              : "bg-purple-600 hover:bg-purple-500"
                          }`}
                        >
                          Withdraw All
                        </button>
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {isWithdrawalOpen && selectedStakeIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-2xl w-full max-w-lg shadow-lg">
            <button
              onClick={() => setIsWithdrawalOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              ✕
            </button>
            <WithdrawalForm
              stake={myStakes[selectedStakeIndex]}
              stakeIndex={selectedStakeIndex}
              decimals={decimals}
            />
          </div>
        </div>
      )}

      {isEarlyWithdrawalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-2xl w-full max-w-lg shadow-lg">
            <button
              onClick={() => setIsWithdrawalOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              ✕
            </button>
            <EarlyWithdrawalForm />
          </div>
        </div>
      )}
    </>
  );
}
