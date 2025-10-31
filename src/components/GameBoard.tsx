
"use client";

import { Stage, Layer, Rect, Text, Group } from "react-konva";
import { useGameStore } from "@/store/useGameStore";
import { useEffect, useMemo } from "react";
import { getValidMoves } from "@/utils/chessMoves";

export default function GameBoard() {
  const {
    board,
    initBoard,
    moveActivePieceTo,
    selectPlayerPiece,
    playerPieces,
    activePieceIndex,
    status,
  } = useGameStore();

  const tileSize = 48; // small pixel-perfect size
  const boardBorder = 4;

  // initialize board
  useEffect(() => {
    if (board.length === 0) initBoard(8);
  }, [board.length, initBoard]);

  // calculate valid moves
  const validMoves = useMemo(() => {
    if (!board.length || activePieceIndex === null || !playerPieces[activePieceIndex]) return [];
    const piece = playerPieces[activePieceIndex];
    return getValidMoves(piece.pieceType, piece.position, board);
  }, [activePieceIndex, playerPieces, board]);

  if (!board.length) return <div>Loading...</div>;

  const boardDisabled = status !== "playing";

  const icons = {
    knight: "♞",
    rook: "♜",
    bishop: "♝",
    queen: "♛",
    king: "♚",
    enemy: "💀",
    loot: "💰",
    wall: "🧱",
  };

  return (
    <div className={`relative ${boardDisabled ? "opacity-50 pointer-events-none" : ""}`}>
      <Stage
        width={board[0].length * tileSize + boardBorder * 2}
        height={board.length * tileSize + boardBorder * 2}
      >
        <Layer>
          {/* Board border */}
          <Rect
            x={0}
            y={0}
            width={board[0].length * tileSize + boardBorder * 2}
            height={board.length * tileSize + boardBorder * 2}
            fill="#000"
          />

          {/* Tiles and pieces */}
          {board.flat().map((tile) => {
            const [tx, ty] = tile.position;
            const isValidMove = validMoves.some(([vx, vy]) => vx === tx && vy === ty);

            // Background tiles
            const fill = (tx + ty) % 2 === 0 ? "#444" : "#999";

            // Determine icon
            let iconText = "";
            if (tile.type === "enemy") iconText = icons.enemy;
            else if (tile.type === "loot") iconText = icons.loot;
            else if (tile.type === "wall") iconText = icons.wall;
            else if (tile.type === "player") {
              const player = playerPieces.find((p) => p.position[0] === tx && p.position[1] === ty);
              iconText = player ? icons[player.pieceType] : icons.knight;
            }

            const isActivePiece =
              activePieceIndex !== null &&
              playerPieces[activePieceIndex]?.position[0] === tx &&
              playerPieces[activePieceIndex]?.position[1] === ty;

            return (
              <Group
                key={`${tx}-${ty}`}
                onClick={() => {
                  if (boardDisabled) return;

                  const pieceIndex = playerPieces.findIndex(
                    (p) => p.position[0] === tx && p.position[1] === ty
                  );

                  if (pieceIndex !== -1) {
                    selectPlayerPiece(pieceIndex);
                    return;
                  }

                  if (isValidMove) moveActivePieceTo(tx, ty);
                }}
              >
                {/* Tile */}
                <Rect
                  x={tx * tileSize + boardBorder}
                  y={ty * tileSize + boardBorder}
                  width={tileSize}
                  height={tileSize}
                  fill={fill}
                  stroke={isActivePiece ? "#FFD700" : isValidMove ? "#3B82F6" : "#000"}
                  strokeWidth={isActivePiece || isValidMove ? 2 : 1}
                />

                {/* Piece / Icon */}
                {iconText && (
                  <Text
                    text={iconText}
                    fontSize={tileSize * 0.7}
                    width={tileSize}
                    height={tileSize}
                    x={tx * tileSize + boardBorder}
                    y={ty * tileSize + boardBorder}
                    align="center"
                    verticalAlign="middle"
                  />
                )}
              </Group>
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}

