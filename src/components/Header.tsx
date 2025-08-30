import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ThemeToggleButton } from "./ThemeToggleButton.tsx";

export function Header() {
  return (
    <header className="flex justify-between items-center pt-4 pb-4 pl-4 pr-9 bg-gradient-to-r from-purple-800 to-yellow-400 dark:bg-gradient-to-r dark:from-gray-950 dark:via-gray-800 dark:to-gray-800 text-white shadow-md border border-gray-200 dark:border-white/15">
      <h1 className="text-3xl font-bold ml-5">⚖️ JudgeStaking</h1>
      <div className="flex justify-between items-center p-3">
        <ThemeToggleButton />
        <ConnectButton />
      </div>
    </header>
  );
}
