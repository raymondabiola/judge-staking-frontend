import { useState } from "react";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");

  const handleConnect = () => {
    if (!isConnected) {
      setUserAddress("0x1234567890abcdef1234");
      setIsConnected(true);
    } else {
      setIsConnected(false);
      setUserAddress("");
    }
  };

  const truncateAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
        <header className="flex justify-between items-center p-4 bg-purple-600 text-white shadow-md">
          <h1 className="text-3xl font-bold">⚖️ Judge Staking</h1>
          <button
            className="px-4 py-2 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-200"
            onClick={handleConnect}
          >
            {isConnected ? truncateAddress(userAddress) : "Connect Wallet"}
          </button>
        </header>
        <main className="p-6 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            {isConnected
              ? "Stake JUDGE to Earn JUDGE"
              : "Welcome! Connect Wallet"}
          </h2>
          <button
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-yellow-500"
            onClick={handleConnect}
          >
            {isConnected ? "Deposit JUDGE" : "Connect Wallet"}
          </button>
        </main>
      </div>
    </>
  );
}

export default App;
