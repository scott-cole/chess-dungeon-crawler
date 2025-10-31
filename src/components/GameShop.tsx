"use client";

import { useGameStore, PieceType } from "@/store/useGameStore";

const PIECE_COSTS: Record<Exclude<PieceType, "pawn">, number> = {
  knight: 5,
  rook: 8,
  bishop: 6,
  queen: 12,
  king: 15,
};

export default function GameShop() {
  const { status, coins, buyPiece, startNextLevel, message } = useGameStore();

  if (status !== "shop") return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center text-white p-4">
      <h2 className="text-2xl mb-4">Shop</h2>
      <p className="mb-2">Coins: {coins}</p>
      {message && <p className="mb-4">{message}</p>}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(PIECE_COSTS).map(([piece, cost]) => (
          <button
            key={piece}
            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
            onClick={() => buyPiece(piece as Exclude<PieceType, "pawn">, cost)}
          >
            Buy {piece} ({cost} coins)
          </button>
        ))}
      </div>
      <button
        className="mt-6 bg-blue-500 px-6 py-3 rounded hover:bg-blue-600"
        onClick={startNextLevel}
      >
        Next Level
      </button>
    </div>
  );
}
