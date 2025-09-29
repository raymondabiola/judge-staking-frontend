import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ThemeToggleButton } from "./ThemeToggleButton.tsx";

export function Header() {
  return (
    <header className="flex justify-between items-center pt-4 pb-4 pl-4 pr-9 bg-gradient-to-r from-cyan-800 via-cyan-600 to-cyan-400 dark:bg-gradient-to-r dark:from-gray-950 dark:via-gray-800 dark:to-gray-800 text-white shadow-md border border-gray-200 dark:border-white/15">
      <h1 className="text-base sm:text-2xl md:text-3xl font-bold ml-5">
        ⚖️ JUDGESTAKING
      </h1>
      <div className="flex justify-between items-center p-3 text-xs md:text-base">
        <ThemeToggleButton />
        <ConnectButton />
      </div>
    </header>
  );
}
