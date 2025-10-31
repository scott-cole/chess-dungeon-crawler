"use client";

import { Stage, Layer, Rect } from "react-konva";
import { useGameStore } from "@/store/useGameStore";
import { useEffect, useMemo } from "react";
import { getValidMoves } from "@/utils/chessMoves";

export default function GameBoard() {
  const {
    board,
    initBoard,
    playerPieces,
    activePieceIndex,
    selectPlayerPiece,
    moveActivePieceTo,
  } = useGameStore();

  const tileSize = 48;

  useEffect(() => {
    initBoard(8);
  }, [initBoard]);

  // Get currently active piece
  const activePiece = activePieceIndex !== null ? playerPieces[activePieceIndex] : null;

  const validMoves = useMemo(() => {
    if (!board.length || !activePiece) return [];
    return getValidMoves(activePiece.pieceType, activePiece.position, board);
  }, [activePiece, board]);

  if (!board.length) return null;

  return (
    <Stage width={board[0].length * tileSize} height={board.length * tileSize}>
      <Layer>
        {board.flat().map((tile) => {
          const [tx, ty] = tile.position;
          const isValidMove = validMoves.some(([vx, vy]) => vx === tx && vy === ty);

          let fill = (tx + ty) % 2 === 0 ? "#444" : "#999"; // default floor
          if (tile.type === "player") {
            // Check if this tile has an actual player piece
            const pieceHere = playerPieces.find(
              (p) => p.position[0] === tx && p.position[1] === ty
            );
            if (pieceHere) fill = "#4ADE80";
          } else if (tile.type === "enemy") fill = "#F87171";
          else if (tile.type === "loot") fill = "#FBBF24";
          else if (tile.type === "wall") fill = "#1E293B";

          return (
            <Rect
              key={`${tx}-${ty}`}
              x={tx * tileSize}
              y={ty * tileSize}
              width={tileSize}
              height={tileSize}
              fill={fill}
              stroke={isValidMove ? "#3B82F6" : undefined}
              strokeWidth={isValidMove ? 4 : 0}
              onClick={() => {
                const pieceHereIndex = playerPieces.findIndex(
                  (p) => p.position[0] === tx && p.position[1] === ty
                );

                // If clicked on a player piece, select it
                if (pieceHereIndex !== -1) {
                  selectPlayerPiece(pieceHereIndex);
                  return;
                }

                // If clicked on a valid move, move the active piece
                if (isValidMove) moveActivePieceTo(tx, ty);
              }}
            />
          );
        })}
      </Layer>
    </Stage>
  );
}




