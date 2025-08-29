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

  const formattedBal =
    balance && decimals != null
      ? formatUnits(balance as bigint, Number(decimals))
      : "0";

  return (
    <div className="flex flex-col gap-6 h-full">
      <div
        className="flex-1 rounded-2xl shadow-md p-6 
                  bg-white dark:bg-gray-900 
                  flex flex-col items-center justify-center text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Token Info</h2>
        <p className="mb-0.5">Name: {name?.toString() || "Loading..."}</p>
        <p className="mb-0.5">Symbol: {symbol?.toString() || "Loading..."}</p>
        <p>Decimals: {decimals?.toString() || "Loading..."}</p>
      </div>
      {address && (
        <div
          className="flex-[0.5] rounded-2xl shadow-md p-6 
                  bg-gradient-to-r from-purple-700 to-amber-500 
                  flex flex-col items-center justify-center text-center text-white"
        >
          <p>
            My Wallet Balance: {formattedBal} {symbol?.toString() || ""}
          </p>
        </div>
      )}
    </div>
  );
}
