import { Header } from "./components/Header.tsx";
import { Deposit } from "./components/Deposit.tsx";
import { Dashboard } from "./components/Dashboard.tsx";
import { Footer } from "./components/Footer.tsx";

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gradient-to-b dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
        <Header />

        <main className="flex-grow p-6 space-y-6 items-center font-bold text-gray-900 dark:text-gray-800">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Deposit />
            <div className="bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100 dark:bg-gradient-to-l dark:from-gray-950 dark:via-gray-800 dark:to-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-white/10">
              <h2 className="flex justify-center item-start text-2xl font-bold mb-4 bg-gradient-to-r from-purple-700 to-amber-500 bg-clip-text text-transparent">
                DASHBOARD
              </h2>
              <div className="rounded-2xl bg-purple-200 dark:bg-gray-100 p-6 border-none">
                <Dashboard />
              </div>
            </div>
          </section>
        </main>
        <footer className="mt-auto w-full border-t border-gray-200 dark:border-white/10 bg-white dark:bg-gradient-to-r dark:from-gray-950 dark:via-gray-800 dark:to-gray-800 pt-6 pb-6 pl-9 pr-9 ">
          <Footer />
        </footer>
      </div>
    </>
  );
}

export default App;
