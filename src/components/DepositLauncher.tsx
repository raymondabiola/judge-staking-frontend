import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract } from "wagmi";
import {
  JUDGE_STAKING_ADDRESS,
  JUDGE_STAKING_ABI,
} from "../config/contracts.ts";
import { Stakes } from "./Stakes.tsx";
import { formatUnits } from "viem";

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

export function DepositLauncher({
  onOpenDeposit,
}: {
  onOpenDeposit: () => void;
}) {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  const { data: myStakes } = useReadContract({
    address: JUDGE_STAKING_ADDRESS,
    abi: JUDGE_STAKING_ABI,
    functionName: "viewMyStakes",
    args: [],
    account: address,
  }) as { data: userStake[] };

  const myStakesNumber = myStakes?.length;

  const { data: APR } = useReadContract({
    address: JUDGE_STAKING_ADDRESS,
    abi: JUDGE_STAKING_ABI,
    functionName: "getCurrentAPR",
  });

  return (
    <div
      className="h-full flex flex-col bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100 
                    dark:bg-gradient-to-r dark:from-gray-950 dark:via-gray-800 dark:to-gray-800 
                    rounded-2xl pl-6 pr-6 pb-10 pt-2 shadow-md border border-gray-200 dark:border-white/10"
    >
      <h2 className="flex justify-center item-center text-center text-base sm:text-lg md:text-xl font-bold mt-4 mb-2 text-gray-800">
        {isConnected ? (
          <>
            STAKE AND EARN
            <span className="mx-2 text-xl font-bold text-red-400 dark:text-yellow-400">
              {APR != null
                ? `${Math.round(Number(formatUnits(APR as bigint, 16)))}%`
                : "…"}
            </span>
            IN JUDGE REWARDS
          </>
        ) : (
          "Connect Wallet To Begin Staking"
        )}
      </h2>
      <div
        className="flex-1 flex flex-col justify-center items-center rounded-2xl 
                      bg-gradient-to-r from-cyan-100 via-cyan-50 to-cyan-100 
                      dark:bg-none bg-white p-6 border-none "
      >
        <button
          className="rounded-full px-4 py-2 rounded-2xl bg-cyan-700 
                     hover:bg-cyan-500 
                     dark:bg-yellow-500 dark:hover:bg-yellow-400 
                     text-white text-xs sm:text-sm md:text-lg"
          onClick={() => {
            if (!isConnected) {
              openConnectModal?.();
            } else {
              onOpenDeposit();
            }
          }}
        >
          {isConnected ? "DEPOSIT" : "Connect Wallet"}
        </button>
      </div>

      {myStakesNumber > 0 && <Stakes />}
    </div>
  );
}
