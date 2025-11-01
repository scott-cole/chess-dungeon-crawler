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
    <div className="hud-panel w-72 h-full p-4 flex flex-col justify-between bg-black border-4 border-yellow-400 text-white font-mono">
      <div className="flex justify-between text-sm mb-4">
        <span>LEVEL: {level}</span>
        <span className="text-yellow-400 text-sm">COINS: {coins}</span>
      </div>

      <div className="flex flex-col gap-4">
        {playerPieces.map((piece, i) => {
          const healthPercentage = (piece.health / piece.maxHealth) * 100;
          return (
            <div
              key={i}
              className={`flex flex-col pt-3  ${activePieceIndex === i ? "border-yellow-400" : "border-gray-500"
                } cursor-pointer hover:border-yellow-500 transition-all`}
              onClick={() => useGameStore.getState().selectPlayerPiece(i)}
            >
              <span className="text-lg">{piece.pieceType.toUpperCase()}</span>
              <div className="w-full h-3 bg-gray-800 border border-gray-600 mt-2 rounded-sm">
                <div
                  className="h-3 rounded-sm"
                  style={{
                    width: `${healthPercentage}%`,
                    backgroundColor: healthPercentage > 50 ? "#00FF00" : "#FF0000",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 text-lg">
        MOVES {moveCount}/{maxMoves}
      </div>

      {message && <div className="text-yellow-300 text-sm mt-4">{message}</div>}

      {(status === "lost" || status === "shop") && (
        <button
          className="mt-6 w-full text-lg bg-yellow-500 hover:bg-yellow-600 rounded-md py-2 text-black font-bold transition-all"
          onClick={() => useGameStore.getState().restartLevel()}
        >
          {status === "lost" ? "RETRY" : "CONTINUE"}
        </button>
      )}
    </div>
  );
}
