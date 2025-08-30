import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export function Deposit() {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  return (
    <div className="col-span-1 md:col-span-2bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100 dark:bg-gradient-to-r dark:from-gray-950 dark:via-gray-800 dark:to-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-white/10">
      <h2 className="flex justify-center item-center text-center text-2xl font-bold mt-20 mb-4 bg-gradient-to-r from-purple-700 to-amber-500 bg-clip-text text-transparent">
        {isConnected ? "Stake JUDGE to Earn JUDGE" : "Connect Wallet To Begin"}
      </h2>
      <div className="rounded-2xl bg-purple-200 dark:bg-gray-100 p-6 border-none">
        <button
          className="flex justify-center px-6 py-3 rounded-2xl m-5 font-semibold bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 dark:bg-none dark:bg-amber-500 dark:hover:bg-gradient-to-r dark:hover:from-purple-800 dark:hover:to-amber-400 text-white mx-auto"
          onClick={() => {
            if (!isConnected) {
              openConnectModal?.();
            } else {
              alert("Deposit JUDGE(We will wire this to the contract soon)");
            }
          }}
        >
          {isConnected ? "Deposit JUDGE" : "Connect Wallet"}
        </button>
      </div>
    </div>
  );
}
