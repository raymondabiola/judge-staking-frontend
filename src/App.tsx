import { ThemeToggleButton } from "./components/ThemeToggleButton.tsx";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { TokenInfo } from "./components/TokenInfo.tsx";

function App() {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <header className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-800 to-yellow-400 text-white shadow-md">
          <h1 className="text-3xl font-bold">⚖️ JudgeStaking</h1>
          <div className="flex justify-between items-center p-3">
            <ThemeToggleButton />
            <ConnectButton />
          </div>
        </header>

        <main className="p-6 space-y-6 items-center font-bold text-gray-900 dark:text-gray-800">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white justify-center dark:bg-gray-900 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-white/10">
              <h2 className="flex justify-center item-center text-center text-2xl font-bold mt-20 mb-4 bg-gradient-to-r from-purple-700 to-amber-500 bg-clip-text text-transparent">
                {isConnected
                  ? "Stake JUDGE to Earn JUDGE"
                  : "Connect Wallet To Begin"}
              </h2>
              <div className="rounded-2xl bg-purple-200 p-6 border-none">
                <button
                  className="flex justify-center px-6 py-3 rounded-2xl m-5 font-semibold bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white mx-auto"
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
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-white/10">
              <h2 className="flex justify-center item-start text-2xl font-bold mb-4 bg-gradient-to-r from-purple-700 to-amber-500 bg-clip-text text-transparent">
                DASHBOARD
              </h2>
              <div className="rounded-2xl bg-purple-200 p-6 border-none">
                <TokenInfo />
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white justify-center dark:bg-gray-900 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-white/10">
              <h2 className="flex justify-center item-center text-center text-2xl font-bold mt-20 mb-4 bg-gradient-to-r from-purple-700 to-amber-500 bg-clip-text text-transparent">
                {isConnected
                  ? "Stake JUDGE to Earn JUDGE"
                  : "Connect Wallet To Begin"}
              </h2>
              <div className="rounded-2xl bg-purple-200 p-6 border-none">
                <button
                  className="flex justify-center px-6 py-3 rounded-2xl m-5 font-semibold bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white mx-auto"
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
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-white/10">
              <h2 className="flex justify-center item-start text-2xl font-bold mb-4 bg-gradient-to-r from-purple-700 to-amber-500 bg-clip-text text-transparent">
                DASHBOARD
              </h2>
              <div className="rounded-2xl bg-purple-200 p-6 border-none">
                <TokenInfo />
              </div>
            </div>
          </section>
        </main>
        <footer className="w-full border-t border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-800 dark:text-gray-200">
            <div className="flex items-center gap-2">
              <span className="font-bold bg-gradient-to-r from-purple-700 to-amber-500 bg-clip-text text-transparent">
                JudgeStaking dApp
              </span>
              <span>© {new Date().getFullYear()} All rights reserved.</span>
            </div>

            {isConnected ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-400">
                  Connected:
                </span>
                <span className="px-3 py-1 rounded-lg bg-purple-200 dark:bg-purple-800/40 font-mono text-xs break-all">
                  {address}
                </span>
              </div>
            ) : (
              <p className="italic text-gray-500 dark:text-gray-400">
                Not connected
              </p>
            )}
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
