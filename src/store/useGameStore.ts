import { create } from "zustand";

interface GameState {
  level: number;
  status: "menu" | "playing" | "won" | "lost";
  moveCount: number;
  startGame: () => void;
  endGame: (status: GameState["status"]) => void;
  incrementMoves: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  level: 1,
  status: "menu",
  moveCount: 0,
  startGame: () => set({ status: "playing", moveCount: 0 }),
  endGame: (status) => set({ status }),
  incrementMoves: () => set((state) => ({ moveCount: state.moveCount + 1 })),
}));

