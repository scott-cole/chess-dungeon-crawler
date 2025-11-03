"use client";
import { useGameStore } from "@/store/useGameStore";
import Image from "next/image";

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

  const itemImages: Record<string, string> = {
    health: "/health_pot.png",
  };

  if (status === "menu") return null;

  return (
    <div className="hud-panel w-72 h-full p-4 flex flex-col justify-between bg-black border-4 border-gray-400 text-white font-mono">
      <div className="flex justify-between text-sm">
        <span>LEVEL: {level}</span>
        <span>COINS: {coins}</span>
      </div>

      <div className="mb-2 text-lg">
        MOVES {moveCount}/{maxMoves}
      </div>

      <div className="flex flex-col gap-4">
        <span className="text-lg text-yellow-400">PIECES</span>
        {playerPieces.map((piece, i) => {
          const healthPercentage = (piece.health / piece.maxHealth) * 100;
          return (
            <div
              key={i}
              className={`flex flex-col p-3 border-2 ${activePieceIndex === i ? "border-yellow-400" : "border-gray-500"
                } cursor-pointer hover:border-yellow-500 transition-all`}
              onClick={() => useGameStore.getState().selectPlayerPiece(i)}
            >
              <span>{piece.pieceType.toUpperCase()}</span>
              <div className="flex items-center mt-2">
                <span className="text-sm mr-2">HP:</span>
                <div className="w-full h-3 bg-gray-800 rounded-sm">
                  <div
                    className="h-3 rounded-sm"
                    style={{
                      width: `${healthPercentage}%`,
                      backgroundColor:
                        healthPercentage > 50 ? "#00FF00" : "#FF0000",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}

        <span className="text-lg text-yellow-400">INVENTORY</span>
        <div className="flex flex-wrap gap-2">
          {playerInventory.length > 0 ? (
            playerInventory.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 cursor-pointer hover:scale-110 transition-transform"
                onClick={() => useGameStore.getState().useItem(index)}
              >
                <Image
                  src={itemImages[item.itemType]}
                  alt={item.itemType}
                  width={40}
                  height={40}
                />
              </div>
            ))
          ) : (
            <span className="text-sm text-gray-400">Empty</span>
          )}
        </div>
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
