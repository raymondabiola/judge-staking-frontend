import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

function App() {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  return (
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
        <header className="flex justify-between items-center p-4 bg-purple-600 text-white shadow-md">
          <h1 className="text-3xl font-bold">⚖️ Judge.Staking</h1>
          <ConnectButton />
        </header>

        <main className="p-6 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            {isConnected
              ? "Stake JUDGE to Earn JUDGE"
              : "Welcome! Connect Wallet"}
          </h2>

          <div className="mt-6">
            <button
              className="px-6 py-3 rounded-lg font-semibold text-white bg-purple-600 hover:bg-yellow-500"
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
            <p className="mt-4 text-gray-700 break-all">
              Connected: <span className="font-mono">{address}</span>
            </p>
          )}
        </main>
      </div>
    </>
  );
}

export default App;
