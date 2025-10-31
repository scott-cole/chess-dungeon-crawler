"use client";

import { useGameStore } from "@/store/useGameStore";

export default function GameOverScreen() {
  const { restartLevel, setMessage } = useGameStore();

  const restart = () => {
    setMessage("Restarting from Level 1...");
    restartLevel();
  };

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <h2 className="text-3xl font-bold text-red-400">Game Over</h2>
      <p className="text-gray-300">You ran out of moves!</p>
      <button
        onClick={restart}
        className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold"
      >
        Restart Game
      </button>
    </div>
  );
}

