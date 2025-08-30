import {
  JUDGE_TOKEN_ADDRESS,
  JUDGE_TOKEN_ABI,
  JUDGE_STAKING_ADDRESS,
  JUDGE_STAKING_ABI,
} from "../config/contracts";
import { useReadContract } from "wagmi";
import { formatUnits } from "viem";

export function StatsBar() {
  const { data: totalSupply } = useReadContract({
    address: JUDGE_TOKEN_ADDRESS,
    abi: JUDGE_TOKEN_ABI,
    functionName: "totalSupply",
  });

  const { data: totalStaked } = useReadContract({
    address: JUDGE_STAKING_ADDRESS,
    abi: JUDGE_STAKING_ABI,
    functionName: "totalStaked",
  });

  const { data: totalStakeWeight } = useReadContract({
    address: JUDGE_STAKING_ADDRESS,
    abi: JUDGE_STAKING_ABI,
    functionName: "totalStakeWeight",
  });

  const { data: totalPenalties } = useReadContract({
    address: JUDGE_STAKING_ADDRESS,
    abi: JUDGE_STAKING_ABI,
    functionName: "totalPenalties",
  });

  const { data: APR } = useReadContract({
    address: JUDGE_STAKING_ADDRESS,
    abi: JUDGE_STAKING_ABI,
    functionName: "getCurrentAPR",
  });

  const { data: decimals } = useReadContract({
    address: JUDGE_TOKEN_ADDRESS,
    abi: JUDGE_TOKEN_ABI,
    functionName: "decimals",
  });

  return (
    <div className="w-full bg-gradient-to-r from-purple-800 to-amber-500 dark:from-gray-950 dark:via-gray-800 dark:to-gray-900 text-white py-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
        <div>
          <h3 className="text-sm uppercase tracking-wide text-gray-200">
            Total Supply
          </h3>
          <p className="text-xl font-bold">
            {totalSupply != null && decimals != null
              ? `${Number(
                  formatUnits(totalSupply as bigint, Number(decimals))
                ).toFixed(2)}`
              : "…"}
          </p>
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-wide text-gray-200">
            Total Staked
          </h3>
          <p className="text-xl font-bold">
            {totalStaked != null && decimals != null
              ? `${Number(
                  formatUnits(totalStaked as bigint, Number(decimals))
                ).toFixed(2)}`
              : "…"}
          </p>
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-wide text-gray-200">
            Pool APR
          </h3>
          <p className="text-xl font-bold">
            {APR != null
              ? `${Number(formatUnits(APR as bigint, 16)).toFixed(2)}%`
              : "…"}
          </p>
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-wide text-gray-200">
            Total Stake Weight
          </h3>
          <p className="text-xl font-bold">
            {totalStakeWeight != null && decimals != null
              ? `${Number(
                  formatUnits(totalStakeWeight as bigint, Number(decimals))
                ).toFixed(2)}`
              : "…"}
          </p>
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-wide text-gray-200">
            Total Penalties
          </h3>
          <p className="text-xl font-bold">
            {totalPenalties != null && decimals != null
              ? `${Number(
                  formatUnits(totalPenalties as bigint, Number(decimals))
                ).toFixed(2)}`
              : "…"}
          </p>
        </div>
      </div>
    </div>
  );
}
