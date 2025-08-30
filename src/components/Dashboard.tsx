import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import JudgeTokenABI from "../abi/JudgeToken.json";

const judgeTokenAddress = "0x167043A312D6C3B8c4B5b741225173E65ff45D9a";

export function Dashboard() {
  const { address } = useAccount();

  const { data: name } = useReadContract({
    address: judgeTokenAddress,
    abi: JudgeTokenABI,
    functionName: "name",
  });

  const { data: symbol } = useReadContract({
    address: judgeTokenAddress,
    abi: JudgeTokenABI,
    functionName: "symbol",
  });

  const { data: decimals } = useReadContract({
    address: judgeTokenAddress,
    abi: JudgeTokenABI,
    functionName: "decimals",
  });

  const { data: balance } = useReadContract({
    address: judgeTokenAddress,
    abi: JudgeTokenABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: totalSupply } = useReadContract({
    address: judgeTokenAddress,
    abi: JudgeTokenABI,
    functionName: "totalSupply",
  });

  const formattedBal =
    balance && totalSupply && decimals != null
      ? formatUnits(balance as bigint, Number(decimals))
      : "0";

  const formattedTotalSupply =
    balance && totalSupply && decimals != null
      ? formatUnits(totalSupply as bigint, Number(decimals))
      : "0";
  return (
    <div className="flex flex-col gap-6 h-full">
      <div
        className="flex-1 rounded-2xl shadow-md p-6 
                  bg-white dark:bg-gradient-to-l dark:from-gray-950 dark:via-gray-800 dark:to-gray-800 
                  flex flex-col items-center justify-center text-center"
      >
        <div className="flex flex-row items-center justify-center divide-x divide-dotted divide-gray-400">
          <div className="flex-1 flex justify-center items-center pr-14">
            <h2 className="text-2xl font-bold">Token Info</h2>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center pl-14">
            <p className="mb-1"> {name?.toString() || "Loading..."}</p>
            <p className="mb-1">
              <span className="text-gray-900 dark:text-gray-100">Symbol:</span>{" "}
              {symbol?.toString() || "Loading..."}
            </p>
            <p>
              <span className="text-gray-900 dark:text-gray-100">
                Total Supply:
              </span>{" "}
              {formattedTotalSupply}
              {symbol?.toString()}
            </p>
          </div>
        </div>
      </div>
      {address && (
        <div
          className="flex-[0.5] rounded-2xl shadow-md p-6 
                  bg-white dark:bg-gradient-to-l dark:from-gray-950 dark:via-gray-800 dark:to-gray-800
                  flex flex-col items-center justify-center text-center"
        >
          <p>
            <span className="text-gray-100">My Wallet Balance:</span>{" "}
            {formattedBal} {symbol?.toString() || ""}
          </p>
        </div>
      )}
    </div>
  );
}
