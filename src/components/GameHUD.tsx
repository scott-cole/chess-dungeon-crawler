"use client";

import { useGameStore } from "@/store/useGameStore";

export default function GameHUD() {
  const {
    playerPieces,
    activePieceIndex,
    moveCount,
    maxMoves,
    level,
    status,
    coins,
    message,
  } = useGameStore();

  if (status === "menu") return null;

  const activePiece = activePieceIndex !== null ? playerPieces[activePieceIndex] : null;

  return (
    <div className="w-full p-4 bg-gray-800 text-white flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div>
          <span className="font-bold">Level:</span> {level}
        </div>
        <div>
          <span className="font-bold">Coins:</span> {coins}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {playerPieces.map((piece, i) => {
          const healthPercentage = (piece.health / piece.maxHealth) * 100;
          return (
            <div
              key={i}
              className={`flex items-center gap-2 cursor-pointer ${activePieceIndex === i ? "bg-gray-700" : ""
                }`}
              onClick={() => useGameStore.getState().selectPlayerPiece(i)}
            >
              <div>{piece.pieceType}</div>
              <div className="w-24 bg-gray-600 h-2 rounded overflow-hidden">
                <div
                  className="h-2 bg-green-500"
                  style={{ width: `${healthPercentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <span className="font-bold">Moves:</span> {moveCount} / {maxMoves}
      </div>

      {message && <div className="mt-2 p-1 bg-gray-700 rounded">{message}</div>}

      {(status === "lost" || status === "shop") && (
        <button
          className="mt-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          onClick={() => useGameStore.getState().restartLevel()}
        >
          {status === "lost" ? "Restart Level" : "Continue"}
        </button>
      )}
    </div>
  );
}
