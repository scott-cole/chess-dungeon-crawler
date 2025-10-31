"use client";

import { Stage, Layer, Rect } from "react-konva";
import { useGameStore } from "@/store/useGameStore";
import { useEffect, useMemo } from "react";
import { getValidMoves } from "@/utils/chessMoves";

export default function GameBoard() {
  const { board, initBoard, movePlayerTo, player, playerPos } = useGameStore();
  const tileSize = 48;

  // initialize the board once
  useEffect(() => {
    initBoard(8);
  }, [initBoard]);

  // compute valid moves for the current piece
  const validMoves = useMemo(() => {
    if (!board.length) return [];
    return getValidMoves(player.pieceType, playerPos, board);
  }, [player.pieceType, playerPos, board]);

  if (!board.length) return null;

  return (
    <Stage
      width={board[0].length * tileSize}
      height={board.length * tileSize}
      className="border-2 border-gray-700"
    >
      <Layer>
        {board.flat().map((tile) => {
          const isValidMove = validMoves.some(
            ([vx, vy]) => vx === tile.position[0] && vy === tile.position[1]
          );

          return (
            <Rect
              key={`${tile.position[0]}-${tile.position[1]}`}
              x={tile.position[0] * tileSize}
              y={tile.position[1] * tileSize}
              width={tileSize}
              height={tileSize}
              fill={
                tile.type === "player"
                  ? "#4ADE80" // green for player
                  : tile.type === "enemy"
                    ? "#F87171" // red for enemy
                    : tile.type === "loot"
                      ? "#FBBF24" // yellow for loot
                      : tile.type === "wall"
                        ? "#1E293B" // dark gray for wall
                        : (tile.position[0] + tile.position[1]) % 2 === 0
                          ? "#444" // dark square
                          : "#999" // light square
              }
              stroke={isValidMove ? "#3B82F6" : undefined} // highlight valid moves
              strokeWidth={isValidMove ? 4 : 0}
              onClick={() => {
                if (isValidMove) movePlayerTo(tile.position[0], tile.position[1]);
              }}
            />
          );
        })}
      </Layer>
    </Stage>
  );
}

