function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100">
        <h1 className="text-4xl font-bold text-purple-600 mt-6">
          ⚖️ Judge Staking
        </h1>
        <p className="mt-2 text-lg text-gray-700">
          Welcome! Connect your wallet to begin staking.
        </p>
        <button className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          Connect Wallet
        </button>
      </div>
    </>
  );
}

export default App;
