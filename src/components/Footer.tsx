import { useAccount } from "wagmi";

export function Footer() {
  const { address } = useAccount();

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-800 dark:text-gray-200">
      <div className="flex items-center gap-2">
        <span className="font-mono rounded-lg bg-purple-200 dark:bg-purple-800/40 text-xs break-all">
          JudgeStaking dApp
        </span>
        <span>© {new Date().getFullYear()} All rights reserved.</span>
      </div>

      {address ? (
        <div className="flex items-center gap-2">
          <span className="text-gray-600 dark:text-gray-400">Connected:</span>
          <span className="px-3 py-1 rounded-lg bg-purple-200 dark:bg-purple-800/40 font-mono text-xs break-all">
            {address}
          </span>
        </div>
      ) : (
        <p className="italic text-gray-500 dark:text-gray-400">Not connected</p>
      )}
    </div>
  );
}
