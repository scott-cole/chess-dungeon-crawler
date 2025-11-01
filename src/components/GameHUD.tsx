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

  return (
    <div className="hud-panel w-72 h-full p-4 flex flex-col justify-between bg-hudBg border-2 border-accent text-green-400">

      {/* Top section: Level and Coins */}
      <div className="flex justify-between text-lg">
        <span>LVL {level}</span>
        <span>💰 {coins}</span>
      </div>

      {/* Player pieces */}
      <div className="flex flex-col gap-3 mt-4">
        {playerPieces.map((piece, i) => {
          const healthPercentage = (piece.health / piece.maxHealth) * 100;
          return (
            <div
              key={i}
              className={`flex flex-col p-2 border-2 ${activePieceIndex === i ? "border-accent" : "border-gray-700"} cursor-pointer`}
              onClick={() => useGameStore.getState().selectPlayerPiece(i)}
            >
              <span className="text-lg">{piece.pieceType.toUpperCase()}</span>
              <div className="w-full h-4 bg-gray-900 border border-gray-700 mt-1">
                <div
                  className="h-4 bg-green-500"
                  style={{ width: `${healthPercentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Moves */}
      <div className="border-t-2 border-accent pt-2 text-lg">
        MOVES {moveCount}/{maxMoves}
      </div>

      {/* Message */}
      {message && <div className="text-yellow-300 text-lg mt-2">{message}</div>}

      {/* Retry / Continue */}
      {(status === "lost" || status === "shop") && (
        <button
          className="mt-4 w-full text-lg"
          onClick={() => useGameStore.getState().restartLevel()}
        >
          {status === "lost" ? "RETRY" : "CONTINUE"}
        </button>
      )}
    </div>
  );
}
