"use client";

import { useGameStore } from "@/store/useGameStore";

export default function StartMenu() {
  const { initBoard, status } = useGameStore();

  if (status !== "menu") return null;

  return (
    <div className="font-[var(--font-sans)] fixed inset-0 bg-black flex flex-col items-center justify-center text-center text-yellow-400 p-4">
      <h1 className="text-3xl md:text-5xl text-gray-400 mb-6">
        CHESS DUNGEON
      </h1>

      <p className="text-sm md:text-base text-gray-400 mb-10">
        A pixel roguelike chess adventure
      </p>

      <button
        onClick={() => initBoard(8)}
        className="px-6 py-3 text-sm md:text-base"
      >
        START GAME
      </button>

      <div className="absolute bottom-6 text-gray-400 text-[8px]">
        © 2025 Bareknuckle indie game
      </div>
    </div>
  );
}
