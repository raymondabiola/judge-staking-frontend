import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header.tsx";
import { DepositLauncher } from "./components/DepositLauncher.tsx";
import { Dashboard } from "./components/Dashboard.tsx";
import { StatsBar } from "./components/StatsBar.tsx";
import { Footer } from "./components/Footer.tsx";
import { DepositForm } from "./components/DepositForm.tsx";
import { useState } from "react";
import { useAccount } from "wagmi";

function App() {
  const { address } = useAccount();
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const HomeLayout = (
    <>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gradient-to-b dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
        <Header />

        <main className="flex-grow p-6 space-y-6 items-center font-bold text-gray-900 dark:text-gray-800">
          {address ? (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              <DepositLauncher onOpenDeposit={() => setIsDepositOpen(true)} />
              <div
                className="bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100 
                  dark:bg-gradient-to-l dark:from-gray-950 dark:via-gray-800 dark:to-gray-800 
                  rounded-2xl p-6 shadow-md border border-gray-200 dark:border-white/10"
              >
                <h2 className="flex justify-center item-start text-2xl font-bold mb-4 text-gray-800">
                  DASHBOARD
                </h2>
                <div
                  className="flex-1 rounded-2xl bg-gradient-to-l from-cyan-100 via-cyan-50 to-cyan-100 
                    dark:bg-none bg-white p-6 border-none"
                >
                  <Dashboard />
                </div>
              </div>
            </section>
          ) : (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <DepositLauncher onOpenDeposit={() => setIsDepositOpen(true)} />
              </div>
            </section>
          )}
          <StatsBar />
        </main>
        <footer className="mt-auto w-full border-t border-gray-200 dark:border-white/10 bg-white dark:bg-gradient-to-r dark:from-gray-950 dark:via-gray-800 dark:to-gray-800 pt-6 pb-6 pl-9 pr-9 ">
          <Footer />
        </footer>

        {/* Deposit Modal */}
        {isDepositOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
            <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-lg shadow-lg">
              <button
                onClick={() => setIsDepositOpen(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300"
              >
                ✕
              </button>
              <DepositForm />
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={HomeLayout} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
