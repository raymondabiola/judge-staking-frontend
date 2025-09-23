import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import {
  JUDGE_TOKEN_ADDRESS,
  JUDGE_TOKEN_ABI,
  JUDGE_STAKING_ADDRESS,
  JUDGE_STAKING_ABI,
} from "../config/contracts.ts";

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

export function Dashboard() {
  const { address } = useAccount();

  const { data: symbol } = useReadContract({
    address: JUDGE_TOKEN_ADDRESS,
    abi: JUDGE_TOKEN_ABI,
    functionName: "symbol",
  });

  const { data: decimals } = useReadContract({
    address: JUDGE_TOKEN_ADDRESS,
    abi: JUDGE_TOKEN_ABI,
    functionName: "decimals",
  });

  const { data: balance } = useReadContract({
    address: JUDGE_TOKEN_ADDRESS,
    abi: JUDGE_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: myStakes } = useReadContract({
    address: JUDGE_STAKING_ADDRESS,
    abi: JUDGE_STAKING_ABI,
    functionName: "viewMyStakes",
    args: [],
    account: address,
  }) as { data: userStake[] };

  const myStakesNumber = myStakes?.length ?? 0;

  return (
    <div className="flex flex-col gap-6 h-full py-10 my-6">
      <div
        className="flex flex-row rounded-2xl shadow-md pt-6 pb-6 px-2 
             bg-cyan-700 dark:bg-gradient-to-l dark:from-gray-950 dark:via-gray-800 dark:to-gray-800
             text-center divide-x divide-dotted divide-gray-400 text-xs sm:text-sm md:text-lg"
      >
        <div className="flex-1 flex justify-center items-center">
          <h3 className="text-white uppercase">My Wallet Balance</h3>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <p className="text-yellow-400">
            {balance != null && decimals != null
              ? `${Number(
                  formatUnits(balance as bigint, Number(decimals))
                ).toFixed(2)}
            ${symbol?.toString() ?? ""}`
              : "0"}
          </p>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <h3 className="text-white uppercase">My Stakes Number</h3>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <p className="text-yellow-400">{myStakesNumber}</p>
        </div>
      </div>
    </div>
  );
}
