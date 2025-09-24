import { useTheme } from "../hooks/useTheme.ts";

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative mr-4 w-12 sm:w-16 h-6 sm:h-8 bg-gray-200 dark:bg-gray-800 border dark:border-white/20 rounded-full flex items-center px-1 transition-colors duration-300 hover:scale-110"
    >
      <span className="text-yellow-400 text-xs sm:text-lg">🌤</span>

      {/* Toggle arm */}
      <span
        className={`absolute w-4 sm:w-6 h-4 sm:h-6 bg-yellow-400 dark:bg-gray-200 rounded-full shadow-md transform transition-transform duration-300 ${
          theme === "dark" ? "translate-x-6 sm:translate-x-8" : "translate-x-0"
        }`}
      />

      <span className="ml-auto text-gray-800 dark:text-gray-200 text-xs sm:text-lg">
        🌙
      </span>
    </button>
  );
}
