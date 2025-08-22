import { useTheme } from "./hooks/useTheme.ts";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

function App() {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <div className="min-h-screen bg-gray-200 dark:bg-gray-800">
        <header className="flex justify-between items-center p-4 bg-purple-800 text-white shadow-md">
          <h1 className="text-3xl font-bold">⚖️ JudgeStaking</h1>
          <div className="flex justify-between items-center p-3">
            <button
              onClick={toggleTheme}
              className="mr-4 px-1 py-1 rounded-none bg-purple-800 text-2xl text-black dark:bg-purple-800 dark:text-white hover:opacity-80"
            >
              {theme === "light" ? "🌙" : "🌤"}
            </button>
            <ConnectButton />
          </div>
        </header>

        <main className="p-6 flex flex-col items-center text-gray-800 dark:text-gray-200">
          <h2 className="text-2xl font-bold mb-1 ">
            {isConnected
              ? "Stake JUDGE to Earn JUDGE"
              : "Connect Wallet To Begin"}
          </h2>

          <div className="mt-6">
            <button
              className="px-6 py-3 rounded-2xl mb-2 font-semibold text-white bg-purple-600 hover:bg-purple-500"
              onClick={() => {
                if (!isConnected) {
                  openConnectModal?.();
                } else {
                  alert(
                    "Deposit JUDGE(We will wire this to the contract soon)"
                  );
                }
              }}
            >
              {isConnected ? "Deposit JUDGE" : "Connect Wallet"}
            </button>
          </div>
          {isConnected && (
            <p className="mt-4 break-all">
              Connected: <span className="font-mono">{address}</span>
            </p>
          )}
        </main>
      </div>
    </>
  );
}

export default App;
