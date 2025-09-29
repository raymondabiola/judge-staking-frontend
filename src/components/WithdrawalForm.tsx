import { useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  usePublicClient,
} from "wagmi";
import { formatUnits, parseUnits } from "viem";
import {
  JUDGE_TOKEN_ADDRESS,
  JUDGE_TOKEN_ABI,
  JUDGE_STAKING_ADDRESS,
  JUDGE_STAKING_ABI,
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

type WithdrawalFormProps = {
  stake: userStake;
  stakeIndex: number;
  decimals: number;
};

export function WithdrawalForm({
  stake,
  stakeIndex,
  decimals,
}: WithdrawalFormProps) {
  const { address } = useAccount();
  const { data: balance, isLoading: loadingBalance } = useReadContract({
    address: JUDGE_TOKEN_ADDRESS,
    abi: JUDGE_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const [stakeAmountWithdrawn, setStakeAmountWithdrawn] = useState("");
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [fadedButton, setFadedButton] = useState(false);

  const handleMax = async () => {
    const formattedStakedBalance =
      Math.floor(
        Number(formatUnits(stake.amountStaked as bigint, Number(decimals))) *
          100
      ) / 100;
    setStakeAmountWithdrawn(formattedStakedBalance.toString());
  };

  const handleWithdraw = async () => {
    try {
      const parsedAmount = parseUnits(stakeAmountWithdrawn, decimals);
      setLoadingMessage("Withdrawal in progress...");
      setFadedButton(true);
      const txHash = await writeContractAsync({
        address: JUDGE_STAKING_ADDRESS,
        abi: JUDGE_STAKING_ABI,
        functionName: "withdraw",
        args: [parsedAmount, stakeIndex],
        account: address,
      });

      const receipt = await publicClient!.waitForTransactionReceipt({
        hash: txHash,
      });
      if (receipt.status === "success") {
        alert("Withdrawal Successful✅");
      } else {
        alert("Withdrawal Failed❌ (reverted on-chain");
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
    <div className="flex flex-col items-center gap-6 py-10">
      {loadingMessage && (
        <p className="text-cyan-700 dark:text-yellow-400 font-semibold">
          {loadingMessage}
        </p>
      )}

      <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
        Withdraw Judge
      </h2>

      <p className="text-sm md:text-base font-semibold text-gray-700 dark:text-gray-400">
        Stake Balance:{" "}
        <span className="dark:text-yellow-400">
          {Number(formatUnits(stake.amountStaked, decimals)).toFixed(2)} JUDGE
        </span>
      </p>

      {/* AMOUNT INPUT */}
      <div className="w-80 md:w-full max-w-md">
        <label className="text-sm md:text-base block text-gray-800 dark:text-gray-300 mb-2">
          Amount
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            max={
              Math.floor(
                Number(formatUnits(stake.amountStaked, decimals)) * 100
              ) / 100
            }
            value={stakeAmountWithdrawn}
            onChange={(e) => setStakeAmountWithdrawn(e.target.value)}
            placeholder="Enter amount"
            className="w-60 md:w-full px-4 py-2 rounded-xl bg-cyan-700 dark:bg-gray-800 text-yellow-400 text-sm md:text-base placeholder-yellow-400 "
          />
          <button
            onClick={() => handleMax()}
            className="px-4 py-2 bg-cyan-700 font-semibold text-white text-sm md:text-base rounded-xl hover:bg-transparent hover:border hover:border-cyan-700 hover:text-cyan-700 dark:hover:border-white dark:hover:text-white"
          >
            Max
          </button>
        </div>
        <p className="text-xs md:text-sm text-gray-800 dark:text-gray-400 mt-1">
          Wallet Balance:{" "}
          {loadingBalance
            ? "Loading..."
            : balance && decimals
            ? Number(formatUnits(balance as bigint, Number(decimals))).toFixed(
                2
              )
            : "0"}{" "}
          JUDGE
        </p>
      </div>

      {!fadedButton ? (
        <button
          onClick={() => handleWithdraw()}
          className="px-4 py-2 bg-cyan-700 text-white text-sm md:text-base rounded-2xl hover:bg-cyan-600 shadow-md hover:bg-transparent hover:border hover:border-cyan-700 hover:text-cyan-700 dark:hover:border-white dark:hover:text-white"
        >
          Withdraw
        </button>
      ) : (
        <button className="px-6 py-3 bg-cyan-700 font-semibold text-white rounded-2xl shadow-md opacity-50 cursor-not-allowed">
          Withdraw
        </button>
      )}
    </div>
  );
}
