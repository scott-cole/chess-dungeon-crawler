//TODO: split this out into smaller stores for better dev ex

import { create } from "zustand";
import { getValidMoves } from "@/utils/chessMoves";

export type TileType = "floor" | "player" | "wall" | "enemy" | "health";
export type ItemType = "health" | "wealth";
export type PieceType = "pawn" | "rook" | "bishop" | "knight" | "queen" | "king";

export interface Tile {
  type: TileType;
  position: [number, number];
  pieceType?: PieceType;
  hp?: number;
}

//TODO: think of potion types and possible attributes
export interface Items {
  itemType: ItemType;
  health?: number;
  coins?: number;
}

export interface PlayerPiece {
  pieceType: Exclude<PieceType, "pawn">;
  health: number;
  maxHealth: number;
  position: [number, number];
}

interface GameState {
  board: Tile[][];
  playerPieces: PlayerPiece[];
  playerInventory: Items[],
  activePieceIndex: number | null;
  level: number;
  status: "menu" | "playing" | "won" | "lost" | "shop";
  moveCount: number;
  maxMoves: number;
  coins: number;
  message: string;
  levelCompleted: boolean;
  initBoard: (size?: number) => void;
  selectPlayerPiece: (index: number) => void;
  moveActivePieceTo: (nx: number, ny: number) => void;
  setMessage: (msg: string) => void;
  buyPiece: (piece: Exclude<PieceType, "pawn">, cost: number) => void;
  buyItem: (potion: ItemType, cost: number) => void;
  startNextLevel: () => void;
  restartLevel: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  board: [],
  playerPieces: [],
  playerInventory: [],
  activePieceIndex: null,
  level: 1,
  status: "menu",
  moveCount: 0,
  maxMoves: 20,
  coins: 0,
  message: "",
  levelCompleted: false,

  setMessage: (msg) => set({ message: msg }),

  initBoard: (size = 8) => {
    const level = get().level;
    const existingPieces = get().playerPieces;

    const board: Tile[][] = Array.from({ length: size }, (_, y) =>
      Array.from({ length: size }, (_, x) => ({ type: "floor", position: [x, y] as [number, number] }))
    );

    const randCoord = (): [number, number] => [
      Math.floor(Math.random() * size),
      Math.floor(Math.random() * size),
    ];

    for (let i = 0; i < Math.floor(size * size * 0.15); i++) {
      const [x, y] = randCoord();
      if (board[y][x].type === "floor") board[y][x].type = "wall";
    }

    for (let i = 0; i < Math.floor(size * size * 0.1); i++) {
      const [x, y] = randCoord();
      if (board[y][x].type === "floor") {
        board[y][x].type = "enemy";
        board[y][x].pieceType = "pawn";
        board[y][x].hp = 1;
      }
    }

    for (let i = 0; i < Math.floor(size * size * 0.05); i++) {
      const [x, y] = randCoord();
      if (board[y][x].type === "floor") board[y][x].type = "health";
    }

    const pieces: PlayerPiece[] =
      existingPieces.length > 0
        ? existingPieces.map((p) => {
          let nx = 0,
            ny = 0,
            placed = false;
          while (!placed) {
            nx = Math.floor(Math.random() * size);
            ny = Math.floor(Math.random() * size);
            if (board[ny][nx].type === "floor") {
              board[ny][nx].type = "player";
              placed = true;
            }
          }
          return { ...p, position: [nx, ny] };
        })
        : [
          {
            pieceType: "knight",
            health: 10,
            maxHealth: 10,
            position: [0, 0],
          },
        ];

    pieces.forEach((p) => (board[p.position[1]][p.position[0]].type = "player"));

    set({
      board,
      playerPieces: pieces,
      activePieceIndex: null,
      moveCount: 0,
      maxMoves: 15 + level * 5,
      status: "playing",
      levelCompleted: false,
      message: "",
    });
  },

  selectPlayerPiece: (index) => {
    const { status } = get();
    if (status !== "playing") return;
    set({ activePieceIndex: index });
  },

  moveActivePieceTo: (nx, ny) => {
    const { activePieceIndex, playerPieces, board, coins, moveCount, maxMoves } = get();
    if (activePieceIndex === null) return;

    const piece = playerPieces[activePieceIndex];
    const validMoves = getValidMoves(piece.pieceType, piece.position, board);
    if (!validMoves.some(([vx, vy]) => vx === nx && vy === ny)) return;

    const [x, y] = piece.position;
    const target = board[ny][nx];
    const newPieces = [...playerPieces];

    switch (target.type) {
      case "enemy":
        board[ny][nx].type = "floor";
        newPieces[activePieceIndex].health -= 1;
        set({ coins: coins + 1 });
        get().setMessage("Enemy defeated! -1 HP, +1 coin");
        break;
      case "health":
        board[ny][nx].type = "floor";
        newPieces[activePieceIndex].health = Math.min(
          newPieces[activePieceIndex].health + 2,
          newPieces[activePieceIndex].maxHealth
        );
        set({ coins: coins + 2 });
        get().setMessage("You found loot! +2 HP, +2 coins");
        break;
    }

    board[y][x].type = "floor";
    board[ny][nx].type = "player";
    newPieces[activePieceIndex].position = [nx, ny];

    const newMoveCount = moveCount + 1;
    let status: GameState["status"] = "playing";
    let levelCompleted = false;

    if (newMoveCount >= maxMoves) {
      status = "lost";
      get().setMessage("Out of moves! Game Over.");
    }

    const enemiesLeft = board.flat().some((t) => t.type === "enemy");
    if (!enemiesLeft) {
      status = "shop";
      levelCompleted = true;
      get().setMessage("Level complete! Visit the shop.");
    }

    // if piece has 0 health remove from play
    const playerHealth = newPieces[activePieceIndex].health;
    if (playerHealth < 1) {
      newPieces.splice(activePieceIndex, 1);
    }

    set({
      board,
      playerPieces: newPieces,
      moveCount: newMoveCount,
      status,
      levelCompleted,
      activePieceIndex: null,
    });
  },

  //TODO: buy potion, maybe add to an inventory
  buyItem: (item, cost) => {
    const { coins, playerInventory } = get();
    if (coins < cost) {
      get().setMessage("No dollar my guy!");
    }
    const newItem: Items = { itemType: item };
    if (newItem.itemType === "health") {
      set({
        coins: coins - cost,
        playerInventory: [...playerInventory, newItem],
      });
      get().setMessage(`You bought a ${item} item`)
      return;
    }
  },

  buyPiece: (piece, cost) => {
    const { coins, board, playerPieces } = get();
    if (coins < cost) {
      get().setMessage("Not enough coins!");
      return;
    }

    const size = board.length;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (board[y][x].type === "floor") {
          const newPiece: PlayerPiece = { pieceType: piece, health: 10, maxHealth: 10, position: [x, y] };
          board[y][x].type = "player";
          set({
            coins: coins - cost,
            playerPieces: [...playerPieces, newPiece],
          });
          get().setMessage(`You bought a ${piece}!`);
          return;
        }
      }
    }
    get().setMessage("No space to place new piece!");
  },

  startNextLevel: () => {
    set({ level: get().level + 1, status: "playing" });
    get().initBoard();
  },

  restartLevel: () => {
    set({
      level: 1,
      coins: 0,
      playerPieces: [
        {
          pieceType: "knight",
          health: 10,
          maxHealth: 10,
          position: [0, 0],
        },
      ],
    });
    get().initBoard();
  },
}));
