"use client";

import { useGameStore } from "@/store/useGameStore";

export default function ShopScreen() {
  const { coins, buyPiece, startNextLevel, message, buyItem } = useGameStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  text-gray-900">
      <h1 className="text-3xl text-gray-400 font-bold mb-6">🏰 Level Complete!</h1>
      <p className="mb-4 text-gray-400 text-lg">You have <span className="font-semibold">{coins}</span> coins</p>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => buyPiece("rook", 5)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Buy Rook (5 coins)
        </button>
        <button
          onClick={() => buyPiece("bishop", 5)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Buy Bishop (5 coins)
        </button>
        <button
          onClick={() => buyPiece("queen", 10)}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Buy Queen (10 coins)
        </button>
        <button
          onClick={() => buyItem("health", 5)}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-purple-700"
        >
          Buy Health Potion (5 coins)
        </button>
      </div>
      <button
        onClick={startNextLevel}
        className="px-6 py-3 bg-black text-white text-lg rounded hover:bg-gray-800"
      >
        Start Next Level
      </button>
      {message && <p className="mt-6 text-lg text-yellow-800">{message}</p>}
    </div>
  );
}

