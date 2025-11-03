"use client";

import { Stage, Layer, Rect, Group, Image as KonvaImage } from "react-konva";
import { useGameStore } from "@/store/useGameStore";
import { useEffect, useMemo, useState } from "react";
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

  const tileSize = 64;
  const boardBorder = 4;

  const [images, setImages] = useState<Record<string, HTMLImageElement>>({});


  useEffect(() => {
    const pieceImages: Record<string, string> = {
      white_pawn: "/white_pawn.png",
      black_pawn: "/black_pawn.png",
      white_knight: "/white_knight.png",
      black_knight: "/black_knight.png",
      white_rook: "/white_rook.png",
      black_rook: "/black_rook.png",
      white_bishop: "/white_bishop.png",
      black_bishop: "/black_bishop.png",
      white_queen: "/white_queen.png",
      black_queen: "/black_queen.png",
      white_king: "/white_king.png",
      black_king: "/black_king.png",
      health: "/health_pot.png",
    };

    const loadImages = async () => {
      const loadedImages: Record<string, HTMLImageElement> = {};

      for (const [key, src] of Object.entries(pieceImages)) {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loadedImages[key] = img;
          if (Object.keys(loadedImages).length === Object.keys(pieceImages).length) {
            setImages(loadedImages);
          }
        };
      }
    };

    loadImages();
  }, []);

  useEffect(() => {
    if (board.length === 0) initBoard(8);
  }, [board.length, initBoard]);

  const validMoves = useMemo(() => {
    if (!board.length || activePieceIndex === null || !playerPieces[activePieceIndex]) return [];
    const piece = playerPieces[activePieceIndex];
    return getValidMoves(piece.pieceType, piece.position, board);
  }, [activePieceIndex, playerPieces, board]);

  if (!board.length || !Object.keys(images).length) return <div>Loading...</div>;

  const boardDisabled = status !== "playing";

  return (
    <div className={`relative ${boardDisabled ? "opacity-50 pointer-events-none" : ""}`}>
      <Stage
        width={board[0].length * tileSize + boardBorder * 2}
        height={board.length * tileSize + boardBorder * 2}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            width={board[0].length * tileSize + boardBorder * 2}
            height={board.length * tileSize + boardBorder * 2}
            fill="#99a1af"
          />

          {board.flat().map((tile) => {
            const [tx, ty] = tile.position;
            const isValidMove = validMoves.some(([vx, vy]) => vx === tx && vy === ty);

            const fill = (tx + ty) % 2 === 0 ? "#444" : "#999";

            let pieceImage: HTMLImageElement | null = null;

            if (tile.type === "enemy") {
              pieceImage = images["black_pawn"];
            } else if (tile.type === "health") {
              pieceImage = images["health"];
            } else if (tile.type === "wall") {
            } else if (tile.type === "player") {
              const player = playerPieces.find((p) => p.position[0] === tx && p.position[1] === ty);
              if (player) {
                pieceImage = images[`white_${player.pieceType}`];
              }
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
                <Rect
                  x={tx * tileSize + boardBorder}
                  y={ty * tileSize + boardBorder}
                  width={tileSize}
                  height={tileSize}
                  fill={fill}
                  stroke={isActivePiece ? "#FFD700" : isValidMove ? "#3B82F6" : "#000"}
                  strokeWidth={isActivePiece || isValidMove ? 2 : 1}
                />

                {pieceImage && (
                  <KonvaImage
                    image={pieceImage}
                    width={tileSize}
                    height={tileSize}
                    x={tx * tileSize + boardBorder + tileSize / 2}
                    y={ty * tileSize + boardBorder + tileSize / 2}
                    offsetX={tileSize / 2}
                    offsetY={tileSize / 2}
                    alt="Chess piece"
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
