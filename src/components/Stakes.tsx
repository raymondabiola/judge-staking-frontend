import { useState, useMemo } from "react";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { formatUnits } from "viem";

import {
  JUDGE_STAKING_ADDRESS,
  JUDGE_STAKING_ABI,
  JUDGE_TOKEN_ABI,
  JUDGE_TOKEN_ADDRESS,
} from "../config/contracts";

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
  const [isOpen, setIsOpen] = useState(false);

  // Load stakes
  const { data: myStakes } = useReadContract({
    address: JUDGE_STAKING_ADDRESS,
    abi: JUDGE_STAKING_ABI,
    functionName: "viewMyStakes",
    args: [],
    account: address,
  }) as { data: userStake[] };

  // Token decimals
  const { data: decimals } = useReadContract({
    address: JUDGE_TOKEN_ADDRESS,
    abi: JUDGE_TOKEN_ABI,
    functionName: "decimals",
  });

  // Batch read: pending rewards for each stake
  const { data: rewardsData } = useReadContracts({
    contracts:
      myStakes?.map((stake) => ({
        address: JUDGE_STAKING_ADDRESS as `0x${string}`,
        abi: JUDGE_STAKING_ABI,
        functionName: "viewMyPendingRewards",
        args: [stake.id],
      })) ?? [],
  });

  // Map stake.id -> pending reward value
  const rewardsMap = useMemo(() => {
    const map: Record<string, bigint> = {};
    if (rewardsData && myStakes) {
      rewardsData.forEach((res, i) => {
        if (res.status === "success") {
          map[myStakes[i].id.toString()] = res.result as bigint;
        }
      });
    }
    return map;
  }, [rewardsData, myStakes]);

  const getWithdrawDate = (lockupDays: bigint) => {
    const ms = Number(lockupDays) * 24 * 60 * 60 * 1000;
    return new Date(Date.now() + ms).toLocaleDateString();
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
        {/* Button to open modal */}
        <button
          onClick={() => setIsOpen(true)}
          className="px-6 py-3 bg-cyan-700 
                     hover:bg-cyan-500 
                     dark:bg-yellow-500 dark:hover:bg-yellow-400 
                     text-white rounded-full text-xl"
        >
          View Stakes
        </button>
      </div>
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-2xl shadow-lg relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-white mb-4">My Stakes</h2>

            <div className="space-y-4">
              {myStakes?.map((stake) => (
                <details
                  key={stake.id.toString()}
                  className="bg-gray-800 rounded-xl p-4 text-sm group"
                >
                  <summary className="cursor-pointer text-white font-semibold">
                    Stake ID: {stake.id.toString()}
                  </summary>
                  <div className="mt-3 space-y-2 text-gray-300">
                    <p>
                      <span className="font-semibold">Amount Staked:</span>{" "}
                      {decimals
                        ? formatUnits(stake.amountStaked, Number(decimals))
                        : stake.amountStaked.toString()}{" "}
                      JUDGE
                    </p>
                    <p>
                      <span className="font-semibold">Pending Rewards:</span>{" "}
                      {rewardsMap[stake.id.toString()]
                        ? formatUnits(
                            rewardsMap[stake.id.toString()],
                            Number(decimals ?? 18)
                          )
                        : "0"}{" "}
                      JUDGE
                    </p>
                    <p>
                      <span className="font-semibold">Withdrawable From:</span>{" "}
                      {getWithdrawDate(stake.lockUpPeriod)}
                    </p>
                    <button
                      disabled
                      className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 disabled:opacity-60"
                    >
                      Withdraw (coming soon)
                    </button>
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
