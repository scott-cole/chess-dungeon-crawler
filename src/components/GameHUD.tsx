"use client";

import { useGameStore } from "@/store/useGameStore";

export default function GameHUD() {
  const {
    playerPieces,
    playerInventory,
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
    <div className="hud-panel w-72 h-full p-4 flex flex-col justify-between bg-black border-4 border-gray-400 text-white font-mono">
      <div className="flex justify-between text-sm mb-4">
        <span>LEVEL: {level}</span>
        <span className="text-sm">COINS: {coins}</span>
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
              <div className="flex items-center mt-2">
                <span className="text-sm">HP: </span>
                <div className="w-full h-3 bg-gray-800 rounded-sm">
                  <div
                    className="h-3 rounded-sm"
                    style={{
                      width: `${healthPercentage}%`,
                      backgroundColor: healthPercentage > 50 ? "#00FF00" : "#FF0000",
                    }}
                  />
                </div>
              </div>
              <div>{JSON.stringify(playerInventory)}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-lg">
        MOVES {moveCount}/{maxMoves}
      </div>

      {message && <div className="text-sm mt-4">{message}</div>}

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
