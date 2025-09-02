import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import {
  JUDGE_TOKEN_ADDRESS,
  JUDGE_TOKEN_ABI,
  JUDGE_STAKING_ADDRESS,
  JUDGE_STAKING_ABI,
} from "../config/contracts";

export function DepositForm() {
  const { address } = useAccount();
  const { data: balance, isLoading: loadingBalance } = useReadContract({
    address: JUDGE_TOKEN_ADDRESS,
    abi: JUDGE_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: decimals } = useReadContract({
    address: JUDGE_TOKEN_ADDRESS,
    abi: JUDGE_TOKEN_ABI,
    functionName: "decimals",
  });

  const { writeContractAsync } = useWriteContract();

  const [stakeAmount, setStakeAmount] = useState("");
  const [lockUpPeriod, setLockUpPeriod] = useState(0);
  const [stakeWeight, setStakeWeight] = useState(0);

  useEffect(() => {
    const amount = Number(stakeAmount);
    const days = Number(lockUpPeriod);
    if (amount > 0 && days > 0) {
      setStakeWeight((amount * days) / 360);
    } else {
      setStakeWeight(0);
    }
  }, [stakeAmount, lockUpPeriod]);

  const handleMax = () => {
    if (balance != null && decimals != null) {
      const formattedBal =
        Math.floor(
          Number(formatUnits(balance as bigint, Number(decimals))) * 100
        ) / 100;
      setStakeAmount(formattedBal.toString());
    }
  };

  const handleDeposit = async () => {
    if (!stakeAmount || !lockUpPeriod) return;

    try {
      const parsedAmount = parseUnits(stakeAmount, Number(decimals));
      await writeContractAsync({
        address: JUDGE_STAKING_ADDRESS,
        abi: JUDGE_STAKING_ABI,
        functionName: "deposit",
        args: [parsedAmount, BigInt(lockUpPeriod)],
        account: address,
      });
      alert("Deposit Successful✅");
    } catch (err) {
      console.error(err);
      alert("Deposit Failed❌");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-10">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Deposit Judge
      </h2>

      {/* AMOUNT INPUT */}
      <div className="w-full max-w-md">
        <label className="block text-gray-800 dark:text-gray-300 mb-2">
          Amount
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full p-3 rounded-xl bg-cyan-700 dark:bg-gray-800 text-yellow-400 placeholder-yellow-400 "
          />
          <button
            onClick={handleMax}
            className="px-4 py-2 bg-cyan-700 text-white rounded-xl hover:bg-cyan-600"
          >
            Max
          </button>
        </div>
        <p className="text-sm text-gray-800 dark:text-gray-400 mt-1">
          Balance:{" "}
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

      {/* LOCKUP INPUT */}
      <div className="w-full max-w-md">
        <label className="block text-gray-800 dark:text-gray-300 mb-2">
          Lockup Period (days)
        </label>
        <input
          type="number"
          min="0"
          max="360"
          value={lockUpPeriod}
          onChange={(e) => setLockUpPeriod(Number(e.target.value))}
          className="w-full p-3 rounded-xl bg-cyan-700 dark:bg-gray-800 text-yellow-400 mb-3"
        />
        <input
          type="range"
          min="0"
          max="360"
          value={lockUpPeriod}
          onChange={(e) => setLockUpPeriod(Number(e.target.value))}
          className="w-full accent-cyan-500"
        />
        <p className="text-sm text-gray-800 dark:text-gray-400 mt-1">
          {lockUpPeriod} days
        </p>
      </div>

      {/* STAKE WEIGHT */}
      <div className="flex flex-row gap-2 w-full max-w-md text-cyan-800 dark:text-yellow-400">
        <label className="block text-gray-800 dark:text-gray-300 mb-2">
          Stake Weight:
        </label>
        {stakeWeight.toFixed(2)}
      </div>

      {/* DEPOSIT BUTTON */}
      <button
        onClick={handleDeposit}
        className="px-6 py-3 bg-cyan-700 text-white rounded-2xl hover:bg-cyan-600 shadow-md"
      >
        Deposit
      </button>
    </div>
  );
}
