import { create } from "zustand";
import { getValidMoves } from "@/utils/chessMoves";

export type TileType = "floor" | "player" | "wall" | "enemy" | "loot";
export type PieceType = "pawn" | "rook" | "bishop" | "knight" | "queen" | "king";

export interface Tile {
  type: TileType;
  position: [number, number];
  pieceType?: PieceType; // for enemies
  hp?: number; // for enemies
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
  startNextLevel: () => void;
  restartLevel: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  board: [],
  playerPieces: [],
  activePieceIndex: null,
  level: 1,
  status: "menu",
  moveCount: 0,
  maxMoves: 20,
  coins: 0,
  message: "",
  levelCompleted: false,

  setMessage: (msg: string) => set({ message: msg }),

  initBoard: (size = 8) => {
    const board: Tile[][] = Array.from({ length: size }, (_, y) =>
      Array.from({ length: size }, (_, x) => ({ type: "floor", position: [x, y] as [number, number] }))
    );

    const randCoord = (): [number, number] => [Math.floor(Math.random() * size), Math.floor(Math.random() * size)];

    // walls
    const wallCount = Math.floor(size * size * 0.15);
    for (let i = 0; i < wallCount; i++) {
      const [x, y] = randCoord();
      if (board[y][x].type === "floor") board[y][x].type = "wall";
    }

    // enemies
    const enemyCount = Math.floor(size * size * 0.1);
    for (let i = 0; i < enemyCount; i++) {
      const [x, y] = randCoord();
      if (board[y][x].type !== "floor") continue;
      board[y][x].type = "enemy";
      board[y][x].pieceType = "pawn";
      board[y][x].hp = 1;
    }

    // loot
    const lootCount = Math.floor(size * size * 0.05);
    for (let i = 0; i < lootCount; i++) {
      const [x, y] = randCoord();
      if (board[y][x].type !== "floor") continue;
      board[y][x].type = "loot";
    }

    // place all existing player pieces on the board

    const updatedPieces: PlayerPiece[] = get().playerPieces.length
      ? get().playerPieces.map(p => {
        let nx = p.position[0];
        let ny = p.position[1];
        let placed = false;
        while (!placed) {
          nx = Math.floor(Math.random() * size);
          ny = Math.floor(Math.random() * size);
          if (board[ny][nx].type === "floor") placed = true;
        }
        board[ny][nx].type = "player";
        return { ...p, position: [nx, ny] } as PlayerPiece; // <- cast here
      })
      : [
        {
          pieceType: "knight", // explicitly allowed
          health: 10,
          maxHealth: 10,
          position: [0, 0],
        } as PlayerPiece,
      ];


    // mark board for new pieces
    updatedPieces.forEach(p => (board[p.position[1]][p.position[0]].type = "player"));

    set({
      board,
      playerPieces: updatedPieces,
      activePieceIndex: null,
      moveCount: 0,
      maxMoves: 5 + get().level * 5,
      status: "playing",
      levelCompleted: false,
      message: "",
    });
  },

  selectPlayerPiece: index => {
    const { playerPieces, status } = get();
    if (status !== "playing") return;
    if (index < 0 || index >= playerPieces.length) return;
    set({ activePieceIndex: index });
  },

  moveActivePieceTo: (nx, ny) => {
    const { activePieceIndex, playerPieces, board, coins, moveCount, maxMoves, status } = get();
    if (status !== "playing" || activePieceIndex === null) return;

    const piece = playerPieces[activePieceIndex];
    const validMoves = getValidMoves(piece.pieceType, piece.position, board);
    if (!validMoves.some(([vx, vy]) => vx === nx && vy === ny)) return;

    const [x, y] = piece.position;
    const target = board[ny][nx];
    const newPlayerPieces = [...playerPieces];

    switch (target.type) {
      case "floor":
        get().setMessage("");
        break;
      case "enemy":
        board[ny][nx].type = "floor";
        newPlayerPieces[activePieceIndex].health -= 1;
        set({ coins: coins + 1 });
        get().setMessage("You killed an enemy! -1 HP, +1 coin");
        break;
      case "loot":
        board[ny][nx].type = "floor";
        newPlayerPieces[activePieceIndex].health = Math.min(
          newPlayerPieces[activePieceIndex].health + 2,
          newPlayerPieces[activePieceIndex].maxHealth
        );
        set({ coins: coins + 2 });
        get().setMessage("You picked up loot! +2 HP, +2 coins");
        break;
    }

    board[y][x].type = "floor";
    board[ny][nx].type = "player";
    newPlayerPieces[activePieceIndex].position = [nx, ny];

    const newMoveCount = moveCount + 1;
    let newStatus: GameState["status"] = "playing";
    let levelCompleted = false;

    if (newMoveCount >= maxMoves) {
      newStatus = "lost";
      get().setMessage("Out of moves! Game Over");
    }

    const enemiesLeft = board.flat().some(tile => tile.type === "enemy");
    if (!enemiesLeft) {
      newStatus = "shop";
      levelCompleted = true;
      get().setMessage("Level complete! Visit the shop to upgrade.");
    }

    set({
      board,
      playerPieces: newPlayerPieces,
      moveCount: newMoveCount,
      status: newStatus,
      levelCompleted,
      activePieceIndex: null,
    });
  },

  buyPiece: (piece, cost) => {
    const { coins, board, playerPieces } = get();
    if (coins < cost) {
      get().setMessage("Not enough coins!");
      return;
    }

    const size = board.length;
    let placed = false;
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
          placed = true;
          break;
        }
      }
      if (placed) break;
    }

    if (!placed) get().setMessage("No space to place new piece!");
  },

  startNextLevel: () => {
    set({ level: get().level + 1, status: "playing", levelCompleted: false });
    get().initBoard();
  },

  restartLevel: () => {
    set({
      playerPieces: [
        {
          pieceType: "knight",
          health: 10,
          maxHealth: 10,
          position: [0, 0],
        },
      ],
      activePieceIndex: null,
      moveCount: 0,
      status: "playing",
      message: "Level restarted",
      coins: 0,
      levelCompleted: false,
    });
    get().initBoard();
  },
}));
