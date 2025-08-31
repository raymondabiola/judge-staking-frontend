import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export function Deposit() {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  return (
    <div
      className="h-full flex flex-col bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100 
                    dark:bg-gradient-to-r dark:from-gray-950 dark:via-gray-800 dark:to-gray-800 
                    rounded-2xl pl-6 pr-6 pb-24 shadow-md border border-gray-200 dark:border-white/10"
    >
      <h2 className="flex justify-center item-center text-center text-2xl font-bold mt-20 mb-4 text-gray-800">
        {isConnected ? "Stake JUDGE to Earn JUDGE" : "Connect Wallet To Begin"}
      </h2>
      <div
        className="flex-1 flex flex-col justify-center items-center rounded-2xl 
                      bg-gradient-to-r from-cyan-100 via-cyan-50 to-cyan-100 
                      dark:bg-none bg-gray-100 p-6 border-none"
      >
        <button
          className="px-6 py-3 rounded-2xl font-semibold bg-cyan-700 
                     hover:bg-cyan-500 
                     dark:bg-yellow-500 dark:hover:bg-yellow-400 
                     text-white"
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
