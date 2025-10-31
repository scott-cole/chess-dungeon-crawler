import { create } from "zustand";

export type TileType = "floor" | "player" | "wall" | "enemy" | "loot";

export type PieceType = "pawn" | "rook" | "bishop" | "knight" | "queen" | "king";

export interface Tile {
  type: TileType;
  position: [number, number];
}

interface Player {
  pieceType: PieceType;
  health: number;
  maxHealth: number;
}

interface GameState {
  board: Tile[][];
  playerPos: [number, number];
  player: Player;
  level: number;
  status: "menu" | "playing" | "won" | "lost";
  moveCount: number;
  initBoard: (size?: number) => void;
  movePlayerTo: (nx: number, ny: number) => void;
}

function inBounds(x: number, y: number, size: number) {
  return x >= 0 && x < size && y >= 0 && y < size;
}

export const useGameStore = create<GameState>((set, get) => ({
  board: [],
  playerPos: [0, 0],
  player: { pieceType: "knight", health: 10, maxHealth: 10 },
  level: 1,
  status: "menu",
  moveCount: 0,

  initBoard: (size = 8) => {
    const board: Tile[][] = Array.from({ length: size }, (_, y) =>
      Array.from({ length: size }, (_, x) => ({
        type: "floor" as const,
        position: [x, y] as [number, number],
      }))
    );

    // Place player at 0,0
    board[0][0].type = "player";

    // Optional: spawn some enemies and loot
    board[2][3].type = "enemy";
    board[5][4].type = "loot";

    set({
      board,
      playerPos: [0, 0],
      player: { pieceType: "knight", health: 10, maxHealth: 10 },
      status: "playing",
      moveCount: 0,
    });
  },

  movePlayerTo: (nx, ny) => {
    const { board, playerPos, moveCount, player } = get();
    const [x, y] = playerPos;
    const size = board.length;

    // Calculate valid moves for knight as example
    const validMoves: [number, number][] = [];
    if (player.pieceType === "knight") {
      const offsets = [
        [2, 1],
        [1, 2],
        [-1, 2],
        [-2, 1],
        [-2, -1],
        [-1, -2],
        [1, -2],
        [2, -1],
      ];
      offsets.forEach(([dx, dy]) => {
        const tx = x + dx;
        const ty = y + dy;
        if (inBounds(tx, ty, size) && board[ty][tx].type !== "wall") {
          validMoves.push([tx, ty]);
        }
      });
    }

    // Check if the target is valid
    const isValid = validMoves.some(([vx, vy]) => vx === nx && vy === ny);
    if (!isValid) return;

    const target = board[ny][nx];

    switch (target.type) {
      case "floor":
        break;
      case "enemy":
        // capture enemy
        board[ny][nx].type = "floor";
        set({ player: { ...player, health: player.health - 1 } }); // simple damage
        break;
      case "loot":
        board[ny][nx].type = "floor";
        set({ player: { ...player, health: Math.min(player.health + 2, player.maxHealth) } });
        break;
    }

    // Move player
    board[y][x].type = "floor";
    board[ny][nx].type = "player";

    set({
      board,
      playerPos: [nx, ny],
      moveCount: moveCount + 1,
    });
  },
}));


